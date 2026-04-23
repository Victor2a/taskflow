import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../../core/models/task.model';

@Pipe({ name: 'priorityColor', standalone: true })
export class PriorityColorPipe implements PipeTransform {
  transform(priority: TaskPriority): string {
    const map: Record<TaskPriority, string> = {
      LOW: 'var(--priority-low)',
      MEDIUM: 'var(--priority-medium)',
      HIGH: 'var(--priority-high)',
      URGENT: 'var(--priority-urgent)',
    };
    return map[priority] ?? 'var(--priority-low)';
  }
}
