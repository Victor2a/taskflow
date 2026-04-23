package com.taskflow.repository;

import com.taskflow.model.Task;
import com.taskflow.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectIdOrderByStatusAscPositionAsc(Long projectId);

    @Query("SELECT COALESCE(MAX(t.position), 0) FROM Task t WHERE t.project.id = :projectId AND t.status = :status")
    Integer findMaxPositionByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") TaskStatus status);
}
