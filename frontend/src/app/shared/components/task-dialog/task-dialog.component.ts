import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskStatus, TaskPriority } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';

export interface TaskDialogData {
  task?: Task;
  projectId: number;
  members: User[];
  defaultStatus?: TaskStatus;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule,
    MatNativeDateModule, MatAutocompleteModule, MatIconModule
  ],
  templateUrl: './task-dialog.component.html',
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    mat-form-field { width: 100%; }
    .full-width { grid-column: 1 / -1; }
    .delete-btn { margin-right: auto; }
  `]
})
export class TaskDialogComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;

  priorities: { value: TaskPriority; label: string }[] = [
    { value: 'LOW', label: 'Basse' },
    { value: 'MEDIUM', label: 'Moyenne' },
    { value: 'HIGH', label: 'Haute' },
    { value: 'URGENT', label: 'Urgente' },
  ];

  statuses: { value: TaskStatus; label: string }[] = [
    { value: 'TODO', label: 'À faire' },
    { value: 'IN_PROGRESS', label: 'En cours' },
    { value: 'IN_REVIEW', label: 'En revue' },
    { value: 'DONE', label: 'Terminé' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data.task;
    const task = this.data.task;

    this.form = this.fb.group({
      title: [task?.title ?? '', [Validators.required, Validators.maxLength(200)]],
      description: [task?.description ?? ''],
      status: [task?.status ?? this.data.defaultStatus ?? 'TODO'],
      priority: [task?.priority ?? 'MEDIUM'],
      assigneeId: [task?.assignee?.id ?? null],
      dueDate: [task?.dueDate ? new Date(task.dueDate) : null],
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.dialogRef.close({
      action: 'save',
      data: {
        ...value,
        dueDate: value.dueDate ? this.formatDate(value.dueDate) : null,
      }
    });
  }

  delete(): void {
    this.dialogRef.close({ action: 'delete' });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
