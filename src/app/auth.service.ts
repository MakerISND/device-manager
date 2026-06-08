import { Injectable, signal } from '@angular/core';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface UserProfile { uid: string; email: string; department: string; role: 'user' | 'admin'; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null);
  profile = signal<UserProfile | null>(null);
  authLoading = signal(true);
  
  constructor() {
    if (typeof window !== 'undefined') {
      onAuthStateChanged(auth, async (u) => {
        this.user.set(u);
        if (u) {
          const docRef = doc(db, 'users', u.uid);
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              this.profile.set(docSnap.data() as UserProfile);
            } else {
              const defaultProfile: UserProfile = { uid: u.uid, email: u.email || '', department: 'กก.', role: 'admin' };
              await setDoc(docRef, defaultProfile);
              this.profile.set(defaultProfile);
            }
          } catch (error) { console.error("Error fetching user profile", error); }
        } else {
          this.profile.set(null);
        }
        this.authLoading.set(false);
      });
    }
  }

  async loginWithGoogle() { return signInWithPopup(auth, new GoogleAuthProvider()); }
  async logout() { await signOut(auth); }
}
