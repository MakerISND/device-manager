import { Injectable, signal } from '@angular/core';

export interface UserProfile {
    email?: string;
    department: string;
    role: 'user' | 'admin';
    createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    user = signal<any | null>(null);
    profile = signal<UserProfile | null>(null);
    authLoading = signal(true);

    constructor() {
        if (localStorage.getItem('app_pwd_auth') === 'true') {
            this.user.set({ uid: 'admin-user-id' });
            this.profile.set({
                department: 'IT',
                role: 'admin',
                createdAt: Date.now()
            });
        }
        setTimeout(() => this.authLoading.set(false), 500);
    }

    async loginWithPassword(pwd: string) {
        if (pwd === '543210') {
            localStorage.setItem('app_pwd_auth', 'true');
            this.user.set({ uid: 'admin-user-id' });
            this.profile.set({ department: 'IT', role: 'admin', createdAt: Date.now() });
            return true;
        }
        return false;
    }
    
    async logout() {
        localStorage.removeItem('app_pwd_auth');
        this.user.set(null);
        this.profile.set(null);
        window.location.reload();
    }
}

