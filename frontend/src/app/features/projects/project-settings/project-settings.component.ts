import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Project } from '../../../core/models/project.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-project-settings',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, FormsModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatListModule
  ],
  templateUrl: './project-settings.component.html',
  styles: [`
    .settings-container { max-width: 720px; margin: 32px auto; padding: 0 24px; }
    .back-link { display:flex;align-items:center;gap:4px;color:var(--text-secondary);text-decoration:none;font-size:0.85rem;margin-bottom:24px; }
    .back-link:hover { color:var(--text-primary); }
    mat-card { background: var(--bg-surface) !important; border: 1px solid var(--border) !important; margin-bottom: 24px; }
    mat-card-header { padding-bottom: 8px; }
    mat-form-field { width: 100%; }
    .color-row { display:flex;gap:8px;flex-wrap:wrap;margin-top:8px; }
    .color-dot { width:28px;height:28px;border-radius:50%;cursor:pointer;outline-offset:2px; }
    .member-item { display:flex;align-items:center;gap:12px;padding:8px 0; }
    .avatar { width:36px;height:36px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;flex-shrink:0; }
    .member-info { flex:1; }
    .member-name { font-weight:500;font-size:0.9rem; }
    .member-email { color:var(--text-secondary);font-size:0.78rem; }
    .owner-badge { font-size:0.7rem;background:rgba(99,102,241,0.2);color:var(--primary);padding:2px 8px;border-radius:12px; }
    .danger-zone { border-color: rgba(239,68,68,0.3) !important; }
    .danger-zone mat-card-title { color: var(--warn); }
  `]
})
export class ProjectSettingsComponent implements OnInit {
  project: Project | null = null;
  projectId!: number;
  loading = true;
  addMemberEmail = '';

  colors = ['#6366f1','#06b6d4','#f59e0b','#22c55e','#ef4444','#8b5cf6','#ec4899','#f97316'];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    color: ['#6366f1'],
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private projectService: ProjectService,
    public authService: AuthService,
    private notif: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.getProject(this.projectId).subscribe({
      next: (p) => {
        this.project = p;
        this.form.patchValue({ name: p.name, description: p.description ?? '', color: p.color });
        this.loading = false;
      },
      error: () => { this.notif.error('Projet introuvable'); this.router.navigate(['/dashboard']); }
    });
  }

  get isOwner(): boolean {
    return this.project?.owner.id === this.authService.currentUser?.id;
  }

  save(): void {
    if (this.form.invalid) return;
    const { name, description, color } = this.form.value;
    this.projectService.updateProject(this.projectId, { name: name!, description: description ?? '', color: color! }).subscribe({
      next: (p) => { this.project = p; this.notif.success('Projet mis à jour'); },
      error: () => this.notif.error('Erreur lors de la mise à jour')
    });
  }

  addMember(): void {
    if (!this.addMemberEmail.trim()) return;
    this.projectService.addMember(this.projectId, this.addMemberEmail.trim()).subscribe({
      next: (p) => { this.project = p; this.addMemberEmail = ''; this.notif.success('Membre ajouté'); },
      error: (err) => this.notif.error(err.error?.message ?? 'Utilisateur introuvable')
    });
  }

  removeMember(user: User): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Retirer le membre', message: `Retirer ${user.username} du projet ?`, confirmLabel: 'Retirer' }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.projectService.removeMember(this.projectId, user.id).subscribe({
        next: () => {
          if (this.project) this.project.members = this.project.members.filter(m => m.id !== user.id);
          this.notif.success('Membre retiré');
        },
        error: () => this.notif.error('Erreur lors de la suppression')
      });
    });
  }

  deleteProject(): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Supprimer le projet', message: `Supprimer "${this.project?.name}" et toutes ses tâches ? Cette action est irréversible.` }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.projectService.deleteProject(this.projectId).subscribe({
        next: () => { this.notif.success('Projet supprimé'); this.router.navigate(['/dashboard']); },
        error: () => this.notif.error('Erreur lors de la suppression')
      });
    });
  }

  getInitials(username: string): string { return username.slice(0, 2).toUpperCase(); }
}
