package com.taskflow;

import com.taskflow.model.*;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail("demo@taskflow.com")) {
            return;
        }

        log.info("Initializing demo data...");

        User demo = userRepository.save(User.builder()
            .username("demo")
            .email("demo@taskflow.com")
            .password(passwordEncoder.encode("Demo1234!"))
            .build());

        User alice = userRepository.save(User.builder()
            .username("alice")
            .email("alice@taskflow.com")
            .password(passwordEncoder.encode("Alice1234!"))
            .build());

        createEcommerceProject(demo, alice);
        createMobileProject(demo, alice);
        createMicroservicesProject(demo);

        log.info("Demo data initialized successfully.");
    }

    private void createEcommerceProject(User demo, User alice) {
        Project project = projectRepository.save(Project.builder()
            .name("Refonte site e-commerce")
            .description("Modernisation complète de la plateforme de vente en ligne")
            .color("#6366f1")
            .owner(demo)
            .members(List.of(demo, alice))
            .build());

        saveTask(project, "Analyser les besoins UX", null, TaskStatus.DONE, TaskPriority.HIGH, alice, null, 1);
        saveTask(project, "Créer les wireframes", "Maquettes pour les pages clés", TaskStatus.DONE, TaskPriority.MEDIUM, alice, null, 2);
        saveTask(project, "Intégrer Stripe", "Paiement par carte bancaire et Apple Pay", TaskStatus.IN_PROGRESS, TaskPriority.URGENT, demo, LocalDate.now().plusDays(5), 1);
        saveTask(project, "Optimiser le tunnel de conversion", null, TaskStatus.IN_PROGRESS, TaskPriority.HIGH, alice, LocalDate.now().plusDays(10), 2);
        saveTask(project, "Review code PR #42", "Validation de la refonte du panier", TaskStatus.IN_REVIEW, TaskPriority.HIGH, demo, LocalDate.now().plusDays(2), 1);
        saveTask(project, "Tests de charge", "Valider les perfs sous 1000 utilisateurs simultanés", TaskStatus.IN_REVIEW, TaskPriority.MEDIUM, alice, LocalDate.now().plusDays(7), 2);
        saveTask(project, "Configurer CDN Cloudflare", null, TaskStatus.TODO, TaskPriority.MEDIUM, demo, LocalDate.now().plusDays(15), 1);
        saveTask(project, "Rédiger documentation API", null, TaskStatus.TODO, TaskPriority.LOW, null, LocalDate.now().plusDays(20), 2);
    }

    private void createMobileProject(User demo, User alice) {
        Project project = projectRepository.save(Project.builder()
            .name("App mobile React Native")
            .description("Application mobile cross-platform iOS et Android")
            .color("#06b6d4")
            .owner(demo)
            .members(List.of(demo, alice))
            .build());

        saveTask(project, "Setup projet React Native", "Expo + TypeScript", TaskStatus.DONE, TaskPriority.HIGH, demo, null, 1);
        saveTask(project, "Authentification biométrique", "Face ID & Touch ID", TaskStatus.IN_PROGRESS, TaskPriority.HIGH, alice, LocalDate.now().plusDays(8), 1);
        saveTask(project, "Intégration notifications push", "Firebase Cloud Messaging", TaskStatus.IN_REVIEW, TaskPriority.MEDIUM, demo, LocalDate.now().plusDays(3), 1);
        saveTask(project, "Design système de navigation", "Bottom tabs + Stack Navigator", TaskStatus.TODO, TaskPriority.MEDIUM, alice, LocalDate.now().plusDays(12), 1);
        saveTask(project, "Tests sur émulateurs iOS/Android", null, TaskStatus.TODO, TaskPriority.HIGH, demo, LocalDate.now().plusDays(18), 2);
        saveTask(project, "Soumission App Store", null, TaskStatus.TODO, TaskPriority.URGENT, null, LocalDate.now().plusDays(30), 3);
    }

    private void createMicroservicesProject(User demo) {
        Project project = projectRepository.save(Project.builder()
            .name("API microservices")
            .description("Migration de l'architecture monolithique vers des microservices")
            .color("#f59e0b")
            .owner(demo)
            .members(List.of(demo))
            .build());

        saveTask(project, "Configurer JWT Gateway", "API Gateway Kong avec authentification JWT", TaskStatus.DONE, TaskPriority.URGENT, demo, null, 1);
        saveTask(project, "Service utilisateurs", "CRUD + gestion des rôles", TaskStatus.IN_PROGRESS, TaskPriority.HIGH, demo, LocalDate.now().plusDays(6), 1);
        saveTask(project, "Mise en place Kafka", "Event streaming inter-services", TaskStatus.IN_REVIEW, TaskPriority.HIGH, demo, LocalDate.now().plusDays(4), 1);
        saveTask(project, "Docker Compose production", "Orchestration des 8 services", TaskStatus.TODO, TaskPriority.MEDIUM, demo, LocalDate.now().plusDays(14), 1);
        saveTask(project, "Monitoring Grafana + Prometheus", null, TaskStatus.TODO, TaskPriority.MEDIUM, null, LocalDate.now().plusDays(21), 2);
    }

    private void saveTask(Project project, String title, String description,
                           TaskStatus status, TaskPriority priority, User assignee,
                           LocalDate dueDate, int position) {
        taskRepository.save(Task.builder()
            .title(title)
            .description(description)
            .status(status)
            .priority(priority)
            .project(project)
            .assignee(assignee)
            .dueDate(dueDate)
            .position(position)
            .build());
    }
}
