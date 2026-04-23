# TaskFlow — Application de gestion de projets

> Application web full-stack de gestion de projets avec tableau Kanban,
> authentification JWT et gestion des équipes.

## ✨ Fonctionnalités
- 🔐 Authentification sécurisée (JWT + Spring Security)
- 📋 Gestion de projets avec membres et permissions
- 🎯 Tableau Kanban avec drag & drop (4 colonnes)
- 🏷️ Priorités, assignations, dates limites sur les tâches
- 👥 Invitation de membres par email
- 🌙 Interface sombre et responsive

## 🛠 Stack technique

| Couche | Technologies |
|--------|-------------|
| Backend | Java 17, Spring Boot 3, Spring Security, JPA/Hibernate |
| Base de données | PostgreSQL 15 |
| Frontend | Angular 17, Angular Material, Angular CDK |
| Authentification | JWT (jjwt 0.12) |
| DevOps | Docker, Docker Compose, Nginx |

## ⚡ Lancer le projet

### Prérequis
- Docker et Docker Compose installés

### Démarrage en une commande
```bash
git clone https://github.com/[username]/taskflow.git
cd taskflow
docker-compose up --build
```

Accès :
- Frontend : http://localhost:4200
- Backend API : http://localhost:8080/api

### Développement local (sans Docker)

**Backend**
```bash
cd backend
# PostgreSQL requis sur le port 5432
./mvnw spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
ng serve
```

## 🏗 Architecture

```
taskflow/
├── backend/               # API REST Spring Boot
│   └── src/main/java/com/taskflow/
│       ├── controller/    # Endpoints REST
│       ├── service/       # Logique métier
│       ├── repository/    # Accès données JPA
│       ├── model/         # Entités JPA
│       ├── dto/           # Objets de transfert
│       └── security/      # JWT + Spring Security
├── frontend/              # Application Angular
│   └── src/app/
│       ├── core/          # Services, guards, interceptors
│       ├── features/      # Modules fonctionnels
│       └── shared/        # Composants réutilisables
└── docker-compose.yml
```

## 🔌 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Utilisateur courant |
| GET | `/api/projects` | Liste des projets |
| POST | `/api/projects` | Créer un projet |
| GET | `/api/projects/:id` | Détail d'un projet |
| PUT | `/api/projects/:id` | Modifier un projet |
| DELETE | `/api/projects/:id` | Supprimer un projet |
| POST | `/api/projects/:id/members` | Ajouter un membre |
| GET | `/api/projects/:id/tasks` | Tâches du projet |
| POST | `/api/projects/:id/tasks` | Créer une tâche |
| PUT | `/api/projects/:id/tasks/:id` | Modifier une tâche |
| PATCH | `/api/projects/:id/tasks/:id/status` | Déplacer (drag & drop) |
| GET | `/api/users/search?q=` | Rechercher des utilisateurs |

## 📄 Licence
MIT
