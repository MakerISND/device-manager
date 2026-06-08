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
        <p class="mt-2 text-sm text-zinc-600">Please enter the password to sign in</p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-zinc-200">
          <div class="space-y-6">
            <div>
              <label for="password" class="block text-sm font-medium text-zinc-700">Password</label>
              <div class="mt-1 relative">
                <input id="password" [(ngModel)]="password" type="password" (keyup.enter)="login()" class="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm transition-colors" placeholder="Enter password">
              </div>
              @if (errorMsg()) {
                  <p class="mt-2 text-sm text-red-600">{{errorMsg()}}</p>
              }
            </div>
            
            <button (click)="login()" [disabled]="loading()" class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 transition-all gap-2">
               @if (loading()) {
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing in...
               } @else {
                  Sign in
               }
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Login {
  auth = inject(AuthService);
  loading = signal(false);
  password = signal('');
  errorMsg = signal('');

  async login() {
    this.errorMsg.set('');
    if (!this.password()) return;
    
    try {
       this.loading.set(true);
       const success = await this.auth.loginWithPassword(this.password());
       if (!success) {
           this.errorMsg.set('Incorrect password.');
       }
    } catch (e) {
       console.error(e);
       this.errorMsg.set('Login failed.');
    } finally {
       this.loading.set(false);
    }
  }
}

