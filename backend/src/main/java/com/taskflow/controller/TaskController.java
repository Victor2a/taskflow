package com.taskflow.controller;

import com.taskflow.dto.request.CreateTaskRequest;
import com.taskflow.dto.request.UpdateTaskRequest;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.model.User;
import com.taskflow.service.TaskService;
import com.taskflow.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(
        @PathVariable Long projectId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(taskService.getProjectTasks(projectId, user));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
        @PathVariable Long projectId,
        @Valid @RequestBody CreateTaskRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(projectId, request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
        @PathVariable Long projectId,
        @PathVariable Long id,
        @Valid @RequestBody UpdateTaskRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(taskService.updateTask(projectId, id, request, user));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
        @PathVariable Long projectId,
        @PathVariable Long id,
        @RequestBody UpdateTaskRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(taskService.updateTaskStatus(projectId, id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
        @PathVariable Long projectId,
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        taskService.deleteTask(projectId, id, user);
        return ResponseEntity.noContent().build();
    }
}
