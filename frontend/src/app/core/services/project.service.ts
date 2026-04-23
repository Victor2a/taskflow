import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, CreateProjectRequest } from '../models/project.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(data: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, data);
  }

  updateProject(id: number, data: Partial<CreateProjectRequest>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, data);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMembers(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${id}/members`);
  }

  addMember(id: number, email: string): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/${id}/members`, { email });
  }

  removeMember(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/members/${userId}`);
  }
}
