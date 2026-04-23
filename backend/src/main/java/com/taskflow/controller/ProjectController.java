package com.taskflow.controller;

import com.taskflow.dto.request.AddMemberRequest;
import com.taskflow.dto.request.CreateProjectRequest;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.model.User;
import com.taskflow.service.ProjectService;
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
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getUserProjects(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(projectService.getUserProjects(user));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
        @Valid @RequestBody CreateProjectRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request, user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(projectService.getProject(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
        @PathVariable Long id,
        @Valid @RequestBody CreateProjectRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(projectService.updateProject(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        projectService.deleteProject(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<UserResponse>> getMembers(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(projectService.getMembers(id, user));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<ProjectResponse> addMember(
        @PathVariable Long id,
        @Valid @RequestBody AddMemberRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(projectService.addMember(id, request, user));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<Void> removeMember(
        @PathVariable Long id,
        @PathVariable Long userId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        projectService.removeMember(id, userId, user);
        return ResponseEntity.noContent().build();
    }
}
