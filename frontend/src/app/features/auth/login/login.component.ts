import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatCardModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-main);
      padding: 24px;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      background: var(--bg-surface) !important;
      border: 1px solid var(--border) !important;
      border-radius: 12px !important;
      padding: 8px;
    }
    .logo { font-size: 2rem; font-weight: 800; color: var(--primary); text-align: center; margin-bottom: 4px; }
    .subtitle { text-align: center; color: var(--text-secondary); margin-bottom: 24px; font-size: 0.9rem; }
    mat-form-field { width: 100%; }
    .submit-btn { width: 100%; margin-top: 8px; height: 44px; }
    .footer { text-align: center; margin-top: 16px; color: var(--text-secondary); font-size: 0.85rem; }
    .footer a { color: var(--primary); text-decoration: none; }
    .demo-hint {
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.3);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 20px;
      font-size: 0.82rem;
      color: var(--text-secondary);
    }
    .demo-hint strong { color: var(--primary); }
  `]
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notif: NotificationService,
    private router: Router
  ) {}

  fillDemo(): void {
    this.form.setValue({ email: 'demo@taskflow.com', password: 'Demo1234!' });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;
    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.notif.success('Connexion réussie !');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.notif.error(err.error?.message ?? 'Email ou mot de passe incorrect');
        this.loading = false;
      }
    });
  }
}
