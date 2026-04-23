package com.taskflow.dto.response;

import com.taskflow.model.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private String color;
    private UserResponse owner;
    private List<UserResponse> members;
    private int taskCount;
    private int completedTaskCount;
    private LocalDateTime createdAt;

    public static ProjectResponse from(Project project) {
        long completedCount = project.getTasks().stream()
            .filter(t -> t.getStatus().name().equals("DONE"))
            .count();

        return ProjectResponse.builder()
            .id(project.getId())
            .name(project.getName())
            .description(project.getDescription())
            .color(project.getColor())
            .owner(UserResponse.from(project.getOwner()))
            .members(project.getMembers().stream().map(UserResponse::from).collect(Collectors.toList()))
            .taskCount(project.getTasks().size())
            .completedTaskCount((int) completedCount)
            .createdAt(project.getCreatedAt())
            .build();
    }
}
