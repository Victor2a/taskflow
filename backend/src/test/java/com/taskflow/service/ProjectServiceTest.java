package com.taskflow.service;

import com.taskflow.dto.request.CreateProjectRequest;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.model.Project;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock private ProjectRepository projectRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private ProjectService projectService;

    private User owner;
    private User otherUser;

    @BeforeEach
    void setUp() {
        owner = User.builder().id(1L).username("owner").email("owner@test.com").build();
        otherUser = User.builder().id(2L).username("other").email("other@test.com").build();
    }

    @Test
    void createProject_shouldSetOwnerAndColor() {
        CreateProjectRequest request = new CreateProjectRequest();
        request.setName("Test Project");
        request.setColor("#ff0000");

        Project saved = Project.builder().id(1L).name("Test Project")
            .color("#ff0000").owner(owner).members(new ArrayList<>(List.of(owner)))
            .tasks(new ArrayList<>()).build();

        when(projectRepository.save(any(Project.class))).thenReturn(saved);

        ProjectResponse response = projectService.createProject(request, owner);

        assertThat(response.getName()).isEqualTo("Test Project");
        assertThat(response.getOwner().getEmail()).isEqualTo("owner@test.com");
    }

    @Test
    void deleteProject_shouldThrow_whenNotOwner() {
        Project project = Project.builder().id(1L).name("Project")
            .owner(owner).members(new ArrayList<>()).tasks(new ArrayList<>()).build();

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        assertThatThrownBy(() -> projectService.deleteProject(1L, otherUser))
            .isInstanceOf(UnauthorizedException.class);

        verify(projectRepository, never()).delete(any());
    }

    @Test
    void deleteProject_shouldSucceed_whenOwner() {
        Project project = Project.builder().id(1L).name("Project")
            .owner(owner).members(new ArrayList<>()).tasks(new ArrayList<>()).build();

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        projectService.deleteProject(1L, owner);

        verify(projectRepository).delete(project);
    }
}
