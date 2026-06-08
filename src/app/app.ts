import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AuthService} from './auth.service';
import {Login} from './login';
import {Dashboard} from './dashboard';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [Login, Dashboard],
  template: `
    @if (auth.authLoading()) {
       <div class="min-h-screen flex items-center justify-center bg-zinc-50">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
       </div>
    } @else if (!auth.user()) {
       <app-login></app-login>
    } @else {
       <app-dashboard></app-dashboard>
    }
  `,
  styleUrl: './app.css',
})
export class App {
   auth = inject(AuthService);
}
