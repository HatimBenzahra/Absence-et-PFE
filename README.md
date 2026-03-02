# ISTY PFE & Attendance Management Platform

A comprehensive web platform for managing end-of-study projects (PFE) and tracking student attendance at ISTY engineering school. Built with a Spring Boot backend and Angular frontend, it covers the full PFE lifecycle alongside a QR code-based attendance system.

---

## Features

- **Multi-role access** (Student, Teacher, Secretary, Admin, PFE Coordinator) secured with JWT and role-based access control
- **PFE lifecycle management**: subject proposals, student applications, supervisor assignments, and defense scheduling
- **QR code attendance tracking**: generate and scan QR codes to record session attendance in real time
- **Absence justification workflow**: students submit justifications, staff validate or reject them
- **Schedule management**: view and manage the weekly timetable (emploi du temps) per class and teacher
- **Statistical dashboards**: attendance rates, PFE progress, and absence trends visualized with Chart.js
- **User management panel**: admin-level CRUD for accounts, roles, and departments
- **Export functionality**: download attendance reports and PFE data

---

## Tech Stack

**Backend**
- Java 17, Spring Boot 3.2.5
- Spring Security with JWT (JJWT)
- Spring Data JPA
- Swagger / OpenAPI 3

**Frontend**
- Angular 21, TypeScript
- Angular Material
- Chart.js
- angularx-qrcode

**Database**
- MySQL 8.0

**Infrastructure**
- Docker, Docker Compose
- Nginx (reverse proxy for the frontend)

---

## Architecture

The backend follows a clean layered architecture:

```
Controller  ->  Service  ->  Repository  ->  Entity
```

- **DTOs** are used at every API boundary to decouple the persistence model from the API contract.
- A dedicated **exception handling layer** (`@ControllerAdvice`) returns consistent error responses across all endpoints.
- **Spring Security filter chain** intercepts requests, validates JWT tokens, and enforces role-based permissions before reaching any controller.

---

## Project Structure

```
Absence-et-PFE/
├── backend/          # Spring Boot application
│   ├── src/
│   └── pom.xml
├── frontend/         # Angular application
│   ├── src/
│   └── package.json
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Docker and Docker Compose installed

### Run with Docker Compose

```bash
git clone https://github.com/HatimBenzahra/Absence-et-PFE.git
cd Absence-et-PFE
docker-compose up --build
```

The application will be available at:

- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### Default Ports

| Service   | Port |
|-----------|------|
| Frontend  | 4200 |
| Backend   | 8080 |
| MySQL     | 3306 |

---

## API Documentation

Once the backend is running, the full API reference is available at:

```
http://localhost:8080/swagger-ui.html
```

---

## License

This project was developed as a final-year engineering project (PFE) at ISTY.
