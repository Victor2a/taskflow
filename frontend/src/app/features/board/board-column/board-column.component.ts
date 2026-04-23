import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task, TaskStatus, KanbanColumn } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, CdkDropList, CdkDrag, TaskCardComponent],
  templateUrl: './board-column.component.html',
  styles: [`
    .column {
      background: var(--bg-surface);
      border-radius: 12px;
      border-top: 3px solid;
      min-width: 280px;
      max-width: 320px;
      flex: 1;
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 160px);
    }
    .column-header {
      padding: 16px 16px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .column-title {
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .task-count {
      background: var(--bg-elevated);
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .add-btn {
      color: var(--text-secondary) !important;
      width: 28px !important;
      height: 28px !important;
      line-height: 28px !important;
    }
    .add-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .task-list {
      padding: 0 12px 12px;
      overflow-y: auto;
      flex: 1;
      min-height: 80px;
    }
    .drop-zone {
      min-height: 60px;
      border-radius: 6px;
      transition: background 0.15s;
    }
    .cdk-drop-list-dragging .drop-zone { background: rgba(99,102,241,0.05); }
    .cdk-drag-placeholder { opacity: 0.4; }
    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0,0,0.2,1); }
    .empty-col { text-align: center; color: var(--text-secondary); font-size: 0.8rem; padding: 16px 0; opacity: 0.6; }
  `]
})
export class BoardColumnComponent {
  @Input() column!: KanbanColumn;
  @Input() connectedLists: string[] = [];
  @Output() taskClick = new EventEmitter<Task>();
  @Output() addTask = new EventEmitter<TaskStatus>();
  @Output() dropped = new EventEmitter<CdkDragDrop<Task[]>>();

  get listId(): string {
    return `list-${this.column.status}`;
  }
}
