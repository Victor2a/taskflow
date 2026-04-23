import { User } from './user.model';

export interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  owner: User;
  members: User[];
  taskCount: number;
  completedTaskCount: number;
  createdAt?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  color?: string;
}
