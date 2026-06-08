import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { AssetService, Asset } from './asset.service';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import * as xlsx from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, DragDropModule, DatePipe, DecimalPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
})
export class Dashboard {
  auth = inject(AuthService);
  assetService = inject(AssetService);
  viewMode = signal<'board' | 'table' | 'dashboard'>('board');
  showAddModal = signal(false);
  
  assetForm = new FormGroup({
    assetNumber: new FormControl('', Validators.required),
    type: new FormControl('Computer', Validators.required),
    brand: new FormControl(''),
    model: new FormControl(''),
    serialNumber: new FormControl(''),
    acquiringNo: new FormControl(''),
    year: new FormControl(new Date().getFullYear() + 543),
    department: new FormControl(''),
    subgroup: new FormControl(''),
    assignedUser: new FormControl(''),
    status: new FormControl('Available', Validators.required)
  });

  assets = computed(() => this.assetService.assets());
  
  columns = computed(() => {
    const all = this.assets();
    return [
      { id: 'Available', title: 'Available', colorStr: 'bg-emerald-500', items: all.filter(a => a.status === 'Available') },
      { id: 'In Use', title: 'In Use', colorStr: 'bg-blue-500', items: all.filter(a => a.status === 'In Use') },
      { id: 'Maintenance', title: 'Maintenance', colorStr: 'bg-yellow-500', items: all.filter(a => a.status === 'Maintenance') },
      { id: 'Broken', title: 'Broken / Replace', colorStr: 'bg-red-500', items: all.filter(a => a.status === 'Broken') }
    ];
  });
  
  maintenanceAlerts = computed(() => this.assets().filter(a => a.status === 'Maintenance' || a.status === 'Broken'));
  countStatus(status: string) { return this.assets().filter(a => a.status === status).length; }

  async drop(event: CdkDragDrop<Asset[]>, dropPointColId: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      await this.assetService.updateAsset(item.id, { 
        status: dropPointColId as any,
        lastMaintenanceDate: dropPointColId === 'Maintenance' ? Date.now() : item.lastMaintenanceDate 
      });
    }
  }
  
  async deleteAsset(id: string) { if (confirm('Delete this asset?')) { await this.assetService.deleteAsset(id); } }

  openAddModal() {
      this.assetForm.reset({ type: 'Computer', year: new Date().getFullYear() + 543, status: 'Available', department: this.auth.profile()?.department || '' });
      this.showAddModal.set(true);
  }

  async saveAsset() {
      if (this.assetForm.valid) { await this.assetService.addAsset(this.assetForm.value as any); this.showAddModal.set(false); }
  }
  
  async seed() { if(confirm('Insert sample data?')) { await this.assetService.seedData(); } }
  async markMaintenanceDone(item: Asset) { await this.assetService.updateAsset(item.id, { status: 'Available' }); }

  exportExcel() {
    const data = this.assets().map(a => ({ 'Acquiring No.': a.acquiringNo, 'Asset Number': a.assetNumber, 'Type': a.type, 'Brand': a.brand, 'Model': a.model, 'Serial Number': a.serialNumber, 'Year': a.year, 'Department': a.department, 'Subgroup': a.subgroup, 'Assigned To': a.assignedUser, 'Status': a.status }));
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Assets');
    xlsx.writeFile(workbook, 'IT_Assets_Report.xlsx');
  }

  exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text('IT Assets Report', 14, 22);
    doc.setFontSize(11); doc.setTextColor(100); doc.text('Overview of all departmental assets', 14, 30);
    const tableData = this.assets().map(a => [ a.assetNumber, a.type, `${a.brand} ${a.model}`, a.serialNumber, `${a.department} ${a.subgroup ? '/ ' + a.subgroup : ''}`, a.status ]);
    autoTable(doc, { startY: 36, head: [['Asset No.', 'Type', 'Model', 'Serial No.', 'Department', 'Status']], body: tableData, theme: 'grid', headStyles: { fillColor: [39, 39, 42] } });
    doc.save('IT_Assets_Report.pdf');
  }
}
