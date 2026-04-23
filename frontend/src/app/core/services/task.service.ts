import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/projects/${projectId}/tasks`);
  }

  createTask(projectId: number, data: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/projects/${projectId}/tasks`, data);
  }

  updateTask(projectId: number, taskId: number, data: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}`, data);
  }

  updateTaskStatus(projectId: number, taskId: number, data: UpdateTaskRequest): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}/status`, data);
  }

  deleteTask(projectId: number, taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}`);
  }
}
