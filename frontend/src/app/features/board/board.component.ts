import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { NotificationService } from '../../core/services/notification.service';
import { Task, TaskStatus, KanbanColumn } from '../../core/models/task.model';
import { Project } from '../../core/models/project.model';
import { BoardColumnComponent } from './board-column/board-column.component';
import { TaskDialogComponent, TaskDialogData } from '../../shared/components/task-dialog/task-dialog.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule, BoardColumnComponent
  ],
  templateUrl: './board.component.html',
  styles: [`
    .board-container { display: flex; flex-direction: column; height: calc(100vh - 64px); overflow: hidden; }
    .board-header {
      padding: 20px 24px 16px;
      display: flex; align-items: center; gap: 12px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-surface);
    }
    .board-header h1 { font-size: 1.3rem; font-weight: 700; }
    .color-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .breadcrumb { font-size: 0.82rem; color: var(--text-secondary); }
    .breadcrumb a { color: var(--primary); text-decoration: none; }
    .spacer { flex: 1; }
    .columns-wrapper {
      display: flex; gap: 16px; padding: 20px 24px;
      overflow-x: auto; flex: 1; align-items: flex-start;
    }
    .loading-overlay {
      display: flex; align-items: center; justify-content: center;
      flex: 1; color: var(--text-secondary);
    }
    .skeleton-col { width: 300px; height: 400px; border-radius: 12px; flex-shrink: 0; }
  `]
})
export class BoardComponent implements OnInit {
  project: Project | null = null;
  columns: KanbanColumn[] = [
    { status: 'TODO',        label: 'À faire',    color: 'var(--status-todo)',       tasks: [] },
    { status: 'IN_PROGRESS', label: 'En cours',   color: 'var(--status-inprogress)', tasks: [] },
    { status: 'IN_REVIEW',   label: 'En revue',   color: 'var(--status-inreview)',   tasks: [] },
    { status: 'DONE',        label: 'Terminé',    color: 'var(--status-done)',       tasks: [] },
  ];
  loading = true;
  projectId!: number;

  get connectedLists(): string[] {
    return this.columns.map(c => `list-${c.status}`);
  }

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
    private notif: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBoard();
  }

  loadBoard(): void {
    this.loading = true;
    this.projectService.getProject(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.loadTasks();
      },
      error: () => { this.notif.error('Projet introuvable'); this.loading = false; }
    });
  }

  loadTasks(): void {
    this.taskService.getTasks(this.projectId).subscribe({
      next: (tasks) => {
        this.columns.forEach(col => col.tasks = []);
        tasks.forEach(task => {
          const col = this.columns.find(c => c.status === task.status);
          if (col) col.tasks.push(task);
        });
        this.columns.forEach(col => col.tasks.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)));
        this.loading = false;
      },
      error: () => { this.notif.error('Erreur de chargement des tâches'); this.loading = false; }
    });
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    const task: Task = event.item.data;
    const targetCol = this.columns.find(c => `list-${c.status}` === event.container.id);
    if (!targetCol) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    const newStatus = targetCol.status;
    const newPosition = event.currentIndex + 1;

    this.taskService.updateTaskStatus(this.projectId, task.id, { status: newStatus, position: newPosition }).subscribe({
      error: () => { this.notif.error('Erreur lors du déplacement'); this.loadTasks(); }
    });
  }

  openTaskDialog(task?: Task, defaultStatus?: TaskStatus): void {
    const members = this.project?.members ?? [];
    const data: TaskDialogData = { task, projectId: this.projectId, members, defaultStatus };

    this.dialog.open(TaskDialogComponent, { width: '560px', data }).afterClosed().subscribe(result => {
      if (!result) return;
      if (result.action === 'save') {
        if (task) {
          this.taskService.updateTask(this.projectId, task.id, result.data).subscribe({
            next: () => { this.notif.success('Tâche mise à jour'); this.loadTasks(); },
            error: () => this.notif.error('Erreur lors de la mise à jour')
          });
        } else {
          this.taskService.createTask(this.projectId, result.data).subscribe({
            next: () => { this.notif.success('Tâche créée !'); this.loadTasks(); },
            error: () => this.notif.error('Erreur lors de la création')
          });
        }
      } else if (result.action === 'delete' && task) {
        this.taskService.deleteTask(this.projectId, task.id).subscribe({
          next: () => { this.notif.success('Tâche supprimée'); this.loadTasks(); },
          error: () => this.notif.error('Erreur lors de la suppression')
        });
      }
    });
  }

  get skeletons() { return Array(4); }
}
