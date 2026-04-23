import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styles: [`
    mat-toolbar {
      background: var(--bg-surface) !important;
      border-bottom: 1px solid var(--border);
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
    }
    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary);
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .spacer { flex: 1; }
    .user-btn { color: var(--text-secondary) !important; }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}
}
