import { Injectable, signal, inject } from '@angular/core';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { db } from './firebase';

export interface Asset {
    id: string;
    acquiringNo: string;
    assetNumber: string;
    model: string;
    year: number;
    brand: string;
    serialNumber: string;
    department: string;
    subgroup: string;
    assignedUser: string;
    status: 'Available' | 'In Use' | 'Maintenance' | 'Broken';
    type: 'Computer' | 'Printer' | 'Notebook' | 'Network' | 'Peripheral' | 'Other';
    lastMaintenanceDate: number;
    createdAt: number;
    updatedAt: number;
}

@Injectable({ providedIn: 'root' })
export class AssetService {
    assets = signal<Asset[]>([]);
    auth = inject(AuthService);

    constructor() {
        const q = query(collection(db, 'assets'));
        onSnapshot(q, (snapshot) => {
            const list: Asset[] = [];
            snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() } as Asset));
            this.assets.set(list.sort((a,b) => b.createdAt - a.createdAt));
        }, (error) => {
             console.error('Firestore Error:', error);
        });
    }

    async addAsset(asset: Partial<Asset>) {
        if (!this.auth.user()) return;
        const newRef = doc(collection(db, 'assets'));
        const docData = {
           ...asset,
           id: newRef.id,
           createdAt: Date.now(),
           updatedAt: Date.now(),
           lastMaintenanceDate: Date.now(),
           acquiringNo: asset.acquiringNo || '',
           brand: asset.brand || '',
           model: asset.model || '',
           serialNumber: asset.serialNumber || '',
           department: asset.department || 'IT',
           subgroup: asset.subgroup || '',
           assignedUser: asset.assignedUser || '',
        };
        await setDoc(newRef, docData);
    }

    async updateAsset(id: string, partial: Partial<Asset>) {
        if (!this.auth.user()) return;
        const ref = doc(db, 'assets', id);
        await setDoc(ref, { ...partial, updatedAt: Date.now() }, { merge: true });
    }

    async deleteAsset(id: string) {
        if (!this.auth.user()) return;
        const ref = doc(db, 'assets', id);
        await deleteDoc(ref);
    }
    
    async seedData() {
        if (!this.auth.user()) return;
        const samples: Partial<Asset>[] = [
           { assetNumber: 'PC-2024-001', type: 'Computer', brand: 'Dell', model: 'OptiPlex 7090', serialNumber: 'DL001XYZ', department: 'IT', status: 'In Use', assignedUser: 'John Doe' },
           { assetNumber: 'NB-2024-012', type: 'Notebook', brand: 'Apple', model: 'MacBook Pro 14"', serialNumber: 'MBP14ABC', department: 'Design', status: 'Available', assignedUser: '' },
           { assetNumber: 'PR-2023-005', type: 'Printer', brand: 'HP', model: 'LaserJet Pro', serialNumber: 'HPL005', department: 'HR', status: 'Maintenance', assignedUser: '' },
           { assetNumber: 'NT-2023-002', type: 'Network', brand: 'Cisco', model: 'Catalyst 9200', serialNumber: 'CS9200NW', department: 'IT', status: 'Broken', assignedUser: '' },
           { assetNumber: 'PC-2024-002', type: 'Computer', brand: 'Lenovo', model: 'ThinkStation', serialNumber: 'LN10023', department: 'Engineering', status: 'In Use', assignedUser: 'Jane Smith' }
        ];
        
        for (const s of samples) {
             const newRef = doc(collection(db, 'assets'));
             await setDoc(newRef, {
                 ...s, id: newRef.id,
                 createdAt: Date.now(),
                 updatedAt: Date.now(),
                 lastMaintenanceDate: Date.now(),
                 acquiringNo: `ACQ-${Math.floor(Math.random()*1000)}`,
                 subgroup: '',
                 year: 2024
             });
        }
    }
}
