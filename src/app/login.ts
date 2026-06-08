import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div class="mx-auto w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg mb-6">
           <mat-icon class="text-white text-[28px] w-[28px] h-[28px]">inventory_2</mat-icon>
        </div>
        <h2 class="mt-2 text-3xl font-extrabold text-zinc-900">IT Assets Manager</h2>
        <p class="mt-2 text-sm text-zinc-600">Please sign in with your Google account</p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-zinc-200">
          <button (click)="login()" [disabled]="loading()" class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 transition-all gap-2">
             @if (loading()) {
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Signing in...
             } @else {
                <img src="https://www.google.com/favicon.ico" class="w-4 h-4 bg-white p-0.5 rounded-sm" alt="Google" referrerpolicy="no-referrer" />
                Sign in with Google
             }
          </button>
        </div>
      </div>
    </div>
  `
})
export class Login {
  auth = inject(AuthService);
  loading = signal(false);

  async login() {
    try {
       this.loading.set(true);
       await this.auth.loginWithGoogle();
    } catch (e) {
       console.error(e);
       this.loading.set(false);
    }
  }
}
