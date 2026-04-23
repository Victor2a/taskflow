import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task, TaskPriority } from '../../../core/models/task.model';
import { PriorityColorPipe } from '../../../shared/pipes/priority-color.pipe';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule, MatTooltipModule, PriorityColorPipe],
  templateUrl: './task-card.component.html',
  styles: [`
    .task-card {
      background: var(--bg-elevated) !important;
      border: 1px solid var(--border) !important;
      border-radius: 8px !important;
      padding: 12px !important;
      cursor: pointer;
      transition: box-shadow 0.15s, transform 0.15s;
      margin-bottom: 8px;
    }
    .task-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important; transform: translateY(-1px); }
    .task-title { font-size: 0.9rem; font-weight: 500; margin-bottom: 8px; line-height: 1.4; }
    .task-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .priority-badge {
      font-size: 0.7rem; font-weight: 600; padding: 2px 8px;
      border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .avatar {
      width: 24px; height: 24px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.65rem; font-weight: 700; flex-shrink: 0;
      background: var(--primary); color: white;
    }
    .due-date {
      font-size: 0.72rem; display: flex; align-items: center; gap: 3px;
    }
    .due-date mat-icon { font-size: 13px; width: 13px; height: 13px; }
    .overdue { color: var(--warn); }
    .urgent-pulse { animation: pulse 1.5s ease-in-out infinite; }
  `]
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() cardClick = new EventEmitter<Task>();

  get priorityLabel(): string {
    const map: Record<TaskPriority, string> = { LOW: 'Basse', MEDIUM: 'Moyenne', HIGH: 'Haute', URGENT: 'Urgent' };
    return map[this.task.priority];
  }

  get initials(): string {
    if (!this.task.assignee) return '';
    return this.task.assignee.username.slice(0, 2).toUpperCase();
  }

  get isOverdue(): boolean {
    if (!this.task.dueDate || this.task.status === 'DONE') return false;
    return new Date(this.task.dueDate) < new Date();
  }

  get formattedDate(): string {
    if (!this.task.dueDate) return '';
    const d = new Date(this.task.dueDate);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }
}
