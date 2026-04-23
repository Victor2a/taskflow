package com.taskflow.repository;

import com.taskflow.model.Project;
import com.taskflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p WHERE p.owner = :user OR :user MEMBER OF p.members")
    List<Project> findAllByOwnerOrMember(@Param("user") User user);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Project p WHERE p.id = :projectId AND (p.owner = :user OR :user MEMBER OF p.members)")
    boolean isUserMemberOrOwner(@Param("projectId") Long projectId, @Param("user") User user);
}
