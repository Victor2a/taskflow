import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <app-navbar *ngIf="authService.isAuthenticated()"></app-navbar>
    <main [class.with-navbar]="authService.isAuthenticated()">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main { min-height: 100vh; background: var(--bg-main); }
    main.with-navbar { padding-top: 64px; }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
