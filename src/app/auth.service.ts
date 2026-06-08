import { Injectable, signal } from '@angular/core';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../main';
import firebaseConfig from '../../firebase-applet-config.json';

const auth = getAuth(app);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface UserProfile {
    email: string;
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
            this.user.set(u);
            if (u) {
                const userRef = doc(db, 'users', u.uid);
                const userDoc = await getDoc(userRef);
                if (!userDoc.exists()) {
                    const newProfile = {
                        email: u.email!,
                        department: 'IT',
                        role: 'user',
                        createdAt: Date.now()
                    };
                    await setDoc(userRef, newProfile);
                    this.profile.set(newProfile as UserProfile);
                } else {
                    this.profile.set(userDoc.data() as UserProfile);
                }
            } else {
                this.profile.set(null);
            }
            this.authLoading.set(false);
        });
    }

    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    }
    
    async logout() {
        await signOut(auth);
    }
}
