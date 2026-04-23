package com.taskflow.service;

import com.taskflow.dto.request.AddMemberRequest;
import com.taskflow.dto.request.CreateProjectRequest;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.model.Project;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ProjectResponse> getUserProjects(User user) {
        return projectRepository.findAllByOwnerOrMember(user)
            .stream().map(ProjectResponse::from).collect(Collectors.toList());
    }

    public ProjectResponse createProject(CreateProjectRequest request, User owner) {
        Project project = Project.builder()
            .name(request.getName())
            .description(request.getDescription())
            .color(request.getColor() != null ? request.getColor() : "#6366f1")
            .owner(owner)
            .build();
        project.getMembers().add(owner);
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(Long id, User user) {
        Project project = getProjectAndCheckAccess(id, user);
        return ProjectResponse.from(project);
    }

    public ProjectResponse updateProject(Long id, CreateProjectRequest request, User user) {
        Project project = getProjectAndCheckAccess(id, user);
        if (request.getName() != null) project.setName(request.getName());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getColor() != null) project.setColor(request.getColor());
        return ProjectResponse.from(projectRepository.save(project));
    }

    public void deleteProject(Long id, User user) {
        Project project = findById(id);
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only the owner can delete this project");
        }
        projectRepository.delete(project);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getMembers(Long id, User user) {
        Project project = getProjectAndCheckAccess(id, user);
        return project.getMembers().stream().map(UserResponse::from).collect(Collectors.toList());
    }

    public ProjectResponse addMember(Long id, AddMemberRequest request, User requester) {
        Project project = findById(id);
        if (!project.getOwner().getId().equals(requester.getId())) {
            throw new UnauthorizedException("Only the owner can add members");
        }
        User newMember = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));
        if (!project.getMembers().contains(newMember)) {
            project.getMembers().add(newMember);
        }
        return ProjectResponse.from(projectRepository.save(project));
    }

    public void removeMember(Long id, Long userId, User requester) {
        Project project = findById(id);
        if (!project.getOwner().getId().equals(requester.getId())) {
            throw new UnauthorizedException("Only the owner can remove members");
        }
        if (userId.equals(project.getOwner().getId())) {
            throw new IllegalArgumentException("Cannot remove the project owner");
        }
        project.getMembers().removeIf(m -> m.getId().equals(userId));
        projectRepository.save(project);
    }

    private Project getProjectAndCheckAccess(Long id, User user) {
        Project project = findById(id);
        boolean hasAccess = project.getOwner().getId().equals(user.getId()) ||
            project.getMembers().stream().anyMatch(m -> m.getId().equals(user.getId()));
        if (!hasAccess) {
            throw new UnauthorizedException("Access denied to project");
        }
        return project;
    }

    public Project findById(Long id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }
}
