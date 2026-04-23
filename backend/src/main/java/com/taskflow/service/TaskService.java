package com.taskflow.service;

import com.taskflow.dto.request.CreateTaskRequest;
import com.taskflow.dto.request.UpdateTaskRequest;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.model.*;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;

    @Transactional(readOnly = true)
    public List<TaskResponse> getProjectTasks(Long projectId, User user) {
        getProjectWithAccess(projectId, user);
        return taskRepository.findByProjectIdOrderByStatusAscPositionAsc(projectId)
            .stream().map(TaskResponse::from).collect(Collectors.toList());
    }

    public TaskResponse createTask(Long projectId, CreateTaskRequest request, User user) {
        Project project = getProjectWithAccess(projectId, user);

        TaskStatus status = request.getStatus() != null ? request.getStatus() : TaskStatus.TODO;
        Integer maxPos = taskRepository.findMaxPositionByProjectIdAndStatus(projectId, status);

        Task task = Task.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .status(status)
            .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
            .project(project)
            .dueDate(request.getDueDate())
            .position(maxPos + 1)
            .build();

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }

        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse updateTask(Long projectId, Long taskId, UpdateTaskRequest request, User user) {
        getProjectWithAccess(projectId, user);
        Task task = findTaskInProject(taskId, projectId);

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getPosition() != null) task.setPosition(request.getPosition());

        if (request.getAssigneeId() != null) {
            if (request.getAssigneeId() == -1L) {
                task.setAssignee(null);
            } else {
                User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
                task.setAssignee(assignee);
            }
        }

        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse updateTaskStatus(Long projectId, Long taskId, UpdateTaskRequest request, User user) {
        getProjectWithAccess(projectId, user);
        Task task = findTaskInProject(taskId, projectId);

        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPosition() != null) task.setPosition(request.getPosition());

        return TaskResponse.from(taskRepository.save(task));
    }

    public void deleteTask(Long projectId, Long taskId, User user) {
        getProjectWithAccess(projectId, user);
        Task task = findTaskInProject(taskId, projectId);
        taskRepository.delete(task);
    }

    private Project getProjectWithAccess(Long projectId, User user) {
        Project project = projectService.findById(projectId);
        boolean hasAccess = project.getOwner().getId().equals(user.getId()) ||
            project.getMembers().stream().anyMatch(m -> m.getId().equals(user.getId()));
        if (!hasAccess) {
            throw new UnauthorizedException("Access denied to project");
        }
        return project;
    }

    private Task findTaskInProject(Long taskId, Long projectId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
        if (!task.getProject().getId().equals(projectId)) {
            throw new UnauthorizedException("Task does not belong to this project");
        }
        return task;
    }
}
