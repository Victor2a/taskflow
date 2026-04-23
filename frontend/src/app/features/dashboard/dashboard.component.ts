import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../core/services/project.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styles: [`
    .dashboard { padding: 32px; max-width: 1280px; margin: 0 auto; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
    .header h1 { font-size: 1.75rem; font-weight: 700; }
    .header p { color: var(--text-secondary); margin-top: 4px; }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .project-card {
      background: var(--bg-surface) !important;
      border: 1px solid var(--border) !important;
      border-radius: 12px !important;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .project-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important; }
    .card-accent { height: 4px; border-radius: 12px 12px 0 0; }
    .card-body { padding: 20px; }
    .project-name { font-size: 1.1rem; font-weight: 600; margin-bottom: 6px; }
    .project-desc { color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 16px; min-height: 36px; }
    .stats { display: flex; gap: 16px; }
    .stat { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--text-secondary); }
    .stat mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .progress-bar { height: 4px; background: var(--border); border-radius: 2px; margin-top: 12px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--status-done); border-radius: 2px; transition: width 0.3s; }
    .new-card {
      background: transparent !important;
      border: 2px dashed var(--border) !important;
      border-radius: 12px !important;
      display: flex; align-items: center; justify-content: center;
      min-height: 160px; cursor: pointer; transition: border-color 0.15s;
    }
    .new-card:hover { border-color: var(--primary) !important; }
    .new-card-inner { text-align: center; color: var(--text-secondary); }
    .new-card-inner mat-icon { font-size: 36px; width: 36px; height: 36px; display: block; margin: 0 auto 8px; }
    .skeleton-card { background: var(--bg-surface); border-radius: 12px; height: 180px; }
    .empty-state { text-align: center; padding: 60px 20px; color: var(--text-secondary); }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; opacity: 0.3; display: block; margin: 0 auto 16px; }
  `]
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  showCreateForm = false;

  createForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    color: ['#6366f1'],
  });

  colors = ['#6366f1', '#06b6d4', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6', '#ec4899', '#f97316'];

  constructor(
    private projectService: ProjectService,
    private notif: NotificationService,
    public authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (projects) => { this.projects = projects; this.loading = false; },
      error: () => { this.notif.error('Erreur lors du chargement des projets'); this.loading = false; }
    });
  }

  getProgress(project: Project): number {
    if (!project.taskCount) return 0;
    return Math.round((project.completedTaskCount / project.taskCount) * 100);
  }

  createProject(): void {
    if (this.createForm.invalid) return;
    const { name, description, color } = this.createForm.value;
    this.projectService.createProject({ name: name!, description: description ?? '', color: color! }).subscribe({
      next: (project) => {
        this.projects.unshift(project);
        this.showCreateForm = false;
        this.createForm.reset({ color: '#6366f1' });
        this.notif.success('Projet créé avec succès !');
      },
      error: (err) => this.notif.error(err.error?.message ?? 'Erreur lors de la création')
    });
  }

  get skeletons() { return Array(6); }
}
