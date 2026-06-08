import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-zinc-50 font-sans">
      <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-sm border border-zinc-100">
        <div class="text-center">
          <div class="w-16 h-16 bg-zinc-900 text-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
             <span class="material-icons text-3xl">devices</span>
          </div>
          <h2 class="text-2xl font-bold tracking-tight text-zinc-900">IT Asset Manager</h2>
          <p class="mt-2 text-sm text-zinc-500">Sign in to manage departmental assets</p>
        </div>
        <div class="mt-8 space-y-6">
          <button (click)="auth.loginWithGoogle()" class="w-full flex items-center justify-center gap-3 py-3 px-4 border border-zinc-200 rounded-xl shadow-sm text-sm font-medium text-zinc-900 bg-white hover:bg-zinc-50 focus:outline-none transition-colors">
            <img src="https://www.google.com/favicon.ico" class="w-5 h-5" alt="Google" referrerpolicy="no-referrer">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  `
})
export class Login { auth = inject(AuthService); }
