package com.taskflow.dto.request;

import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateTaskRequest {
    @Size(max = 200)
    private String title;
    @Size(max = 1000)
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private Long assigneeId;
    private LocalDate dueDate;
    private Integer position;
}
