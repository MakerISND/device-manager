import { Injectable, signal } from '@angular/core';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

export interface Asset { id: string; acquiringNo: string; assetNumber: string; model: string; year: number; brand: string; serialNumber: string; department: string; subgroup: string; assignedUser: string; status: 'Available' | 'In Use' | 'Maintenance' | 'Broken'; type: string; lastMaintenanceDate: number; createdAt: number; updatedAt: number; }

@Injectable({ providedIn: 'root' })
export class AssetService {
  assets = signal<Asset[]>([]);
  loading = signal(true);
  
  constructor() {
    if (typeof window !== 'undefined') {
      onSnapshot(query(collection(db, 'assets')), (snapshot) => {
        const result: Asset[] = [];
        snapshot.forEach(doc => result.push({ id: doc.id, ...doc.data() } as Asset));
        this.assets.set(result);
        this.loading.set(false);
      }, (error) => { console.error("Firestore Error:", error); this.loading.set(false); });
    }
  }

  async addAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) {
    const newRef = doc(collection(db, 'assets'));
    await setDoc(newRef, { ...asset, id: newRef.id, createdAt: Date.now(), updatedAt: Date.now() });
  }

  async updateAsset(id: string, partial: Partial<Asset>) {
    await updateDoc(doc(db, 'assets', id), { ...partial, updatedAt: Date.now() });
  }

  async deleteAsset(id: string) { await deleteDoc(doc(db, 'assets', id)); }
  
  async seedData() {
     const initialData = [
       { acquiringNo: 'สซ.3/2565', assetNumber: 'สมอ.154/2254/65', model: '240 G8', year: 2565, brand: 'HP', serialNumber: '5CG1378NYS', department: 'กก.', subgroup: 'ก.1', assignedUser: 'กิติพงศ์', status: 'In Use', type: 'Notebook', lastMaintenanceDate: Date.now() },
       { acquiringNo: 'สซ.3/2565', assetNumber: 'สมอ.154/2255/65', model: '240 G8', year: 2565, brand: 'HP', serialNumber: '5CG1378P81', department: 'กก.', subgroup: 'ก.1', assignedUser: 'ชัยภัค', status: 'Available', type: 'Notebook', lastMaintenanceDate: Date.now() },
       { acquiringNo: 'สซ.3/2565', assetNumber: 'สมอ.154/2256/65', model: '240 G8', year: 2565, brand: 'HP', serialNumber: '5CG137BGPL', department: 'กก.', subgroup: 'ก.2', assignedUser: 'เกียรติศักดิ์', status: 'Maintenance', type: 'Notebook', lastMaintenanceDate: Date.now() },
       { acquiringNo: 'สซ.3/2565', assetNumber: 'สมอ.154/2257/65', model: '240 G8', year: 2565, brand: 'HP', serialNumber: '5CG137BGGZ', department: 'กก.', subgroup: 'กลุ่ม 3', assignedUser: 'อนรรฆวี', status: 'In Use', type: 'Notebook', lastMaintenanceDate: Date.now() },
       { acquiringNo: 'สซ.3/2565', assetNumber: 'สมอ.154/2258/65', model: '240 G8', year: 2565, brand: 'HP', serialNumber: '5CG137BGFZ', department: 'กก.', subgroup: 'ก.4', assignedUser: 'นวลนภา', status: 'In Use', type: 'Notebook', lastMaintenanceDate: Date.now() },
       { acquiringNo: 'สซ.3/2565', assetNumber: 'สมอ.154/2259/65', model: '240 G8', year: 2565, brand: 'HP', serialNumber: '5CG137BGGN', department: 'กก.', subgroup: 'กลุ่ม 5', assignedUser: 'กลุ่ม 5', status: 'Broken', type: 'Notebook', lastMaintenanceDate: Date.now() },
       { acquiringNo: 'สซ.3/2565', assetNumber: 'สมอ.154/2260/65', model: '240 G8', year: 2565, brand: 'HP', serialNumber: '5CG137BGG5', department: 'กก.', subgroup: 'ก.6', assignedUser: 'ก.6', status: 'In Use', type: 'Notebook', lastMaintenanceDate: Date.now() },
       { acquiringNo: 'สซ.3/2565', assetNumber: 'สมอ.154/2261/65', model: '240 G8', year: 2565, brand: 'HP', serialNumber: '5CG1378NYY', department: 'กก.', subgroup: 'ก.7', assignedUser: 'กิตติยา', status: 'In Use', type: 'Notebook', lastMaintenanceDate: Date.now() }
     ];
     const batch = writeBatch(db);
     for(const item of initialData) {
        const newRef = doc(collection(db, 'assets'));
        batch.set(newRef, { ...item, id: newRef.id, createdAt: Date.now(), updatedAt: Date.now() });
     }
     await batch.commit();
  }
}
