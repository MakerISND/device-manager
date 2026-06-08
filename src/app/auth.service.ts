import { Injectable, signal } from '@angular/core';
import { signInAnonymously, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';

export interface UserProfile {
    email?: string;
    department: string;
    role: 'user' | 'admin';
    createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    user = signal<FirebaseUser | null>(null);
    profile = signal<UserProfile | null>(null);
    authLoading = signal(true);

    constructor() {
        onAuthStateChanged(auth, async (u) => {
            if (u && localStorage.getItem('app_pwd_auth') === 'true') {
                this.user.set(u);
                this.profile.set({
                    department: 'IT',
                    role: 'admin',
                    createdAt: Date.now()
                });
            } else {
                this.user.set(null);
                this.profile.set(null);
            }
            this.authLoading.set(false);
        });
        
        setTimeout(() => this.authLoading.set(false), 2000);
    }

    async loginWithPassword(pwd: string) {
        if (pwd === '543210') {
            await signInAnonymously(auth);
            localStorage.setItem('app_pwd_auth', 'true');
            // Optimistically set to skip wait
            const currentUser = auth.currentUser;
            if (currentUser) {
                this.user.set(currentUser);
                this.profile.set({ department: 'IT', role: 'admin', createdAt: Date.now() });
            }
            return true;
        }
        return false;
    }
    
    async logout() {
        localStorage.removeItem('app_pwd_auth');
        await signOut(auth);
        window.location.reload();
    }
}

