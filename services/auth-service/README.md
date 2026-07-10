# Auth Service

An enterprise-grade **Authentication & Authorization microservice** built with **FastAPI** for the **Enterprise Voice AI Platform (VoxForge)**. This service is responsible for user authentication, JWT-based authorization, refresh token management, and secure access to all other platform microservices.

---

## Features

* User Registration
* User Login
* JWT Access Token Authentication
* Database-backed Refresh Tokens
* Refresh Token Rotation
* Secure Logout
* Password Hashing (bcrypt)
* Role-based User Registration
* Protected Route Support
* Repository Pattern
* Service Layer Architecture
* Structured Logging
* Request & Response Validation
* Health-ready Architecture

---

## Tech Stack

* Python 3.12+
* FastAPI
* SQLAlchemy 2.0
* PostgreSQL
* Pydantic
* JWT (python-jose)
* Passlib (bcrypt)
* Uvicorn

---

## Project Structure

```text
auth-service
│
├── app
│   ├── api
│   │   └── routes
│   │       └── auth.py
│   │
│   ├── core
│   │   ├── config.py
│   │   └── security.py
│   │
│   ├── db
│   │   ├── base.py
│   │   ├── session.py
│   │   └── __init__.py
│   │
│   ├── models
│   │   ├── user.py
│   │   ├── role.py
│   │   └── refresh_token.py
│   │
│   ├── repositories
│   │   ├── user_repository.py
│   │   ├── role_repository.py
│   │   └── refresh_token_repository.py
│   │
│   ├── schemas
│   │   └── auth_schema.py
│   │
│   ├── services
│   │   └── auth_service.py
│   │
│   └── main.py
│
├── requirements.txt
├── .env
└── README.md
```

---

## Folder Responsibilities

| Folder | Responsibility |
|---------|----------------|
| **api** | Defines REST API endpoints and request routing. |
| **core** | Contains application configuration and security utilities such as JWT creation and password hashing. |
| **db** | Database configuration, SQLAlchemy Base class, and session management. |
| **models** | SQLAlchemy ORM models representing database tables. |
| **repositories** | Handles database operations and isolates persistence logic. |
| **schemas** | Pydantic request and response models for validation. |
| **services** | Implements business logic independent of API routes. |

---

## Architecture

```text
                Client
                   │
                   ▼
          FastAPI Routes
                   │
                   ▼
            Auth Service
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
 User Repository      Role Repository
        │                     │
        └──────────┬──────────┘
                   ▼
            PostgreSQL
                   ▲
                   │
      Refresh Token Repository
                   │
                   ▼
            JWT Security
```

---

## Authentication Flow

```text
User Login
     │
     ▼
Verify Credentials
     │
     ▼
Generate Access Token
     │
     ▼
Generate Refresh Token
     │
     ▼
Store Refresh Token
     │
     ▼
Return Token Pair
```

---

## Refresh Token Rotation

```text
Client
   │
Old Refresh Token
   │
   ▼
Validate Token
   │
   ▼
Revoke Old Token
   │
   ▼
Generate New Access Token
   │
   ▼
Generate New Refresh Token
   │
   ▼
Store New Refresh Token
   │
   ▼
Return New Token Pair
```

---

## API Endpoints

### Register User

```http
POST /auth/register
```

Creates a new user with the default **USER** role.

---

### Login

```http
POST /auth/login
```

Authenticates a user and returns an Access Token and Refresh Token.

---

### Refresh Token

```http
POST /auth/refresh
```

Validates the refresh token, revokes the previous token, and issues a new token pair.

---

### Logout

```http
POST /auth/logout
```

Revokes the provided refresh token and logs the user out securely.

---

### Get Current User

```http
GET /auth/me
```

Returns details of the currently authenticated user.

---

## Request Example

### Login

```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

---

## Response Example

```json
{
  "access_token": "<jwt-access-token>",
  "refresh_token": "<jwt-refresh-token>",
  "token_type": "bearer"
}
```

---

## Current Capabilities

* JWT Authentication
* Secure Password Hashing
* Refresh Token Rotation
* Database-backed Refresh Tokens
* Repository Pattern
* Service Layer Architecture
* Structured Logging
* Pydantic Validation
* PostgreSQL Integration

---

## Planned Enhancements

* Email Verification
* Forgot Password
* Password Reset
* Role-Based Authorization (RBAC)
* Multi-Factor Authentication (MFA)
* OAuth2 (Google, GitHub)
* Redis Session Caching
* Rate Limiting
* Docker & Docker Compose
* Kubernetes Deployment
* Prometheus Metrics
* CI/CD Pipeline
* Unit & Integration Tests

---

## Role in the Enterprise Voice AI Platform

The **Auth Service** serves as the authentication gateway for all platform services.

```text
                Auth Service
                     │
 ┌───────────┬────────┼───────────┬───────────┐
 ▼           ▼        ▼           ▼           ▼
User     Conversation  LLM     Knowledge     STT/TTS
Service      Service  Orchestrator Service   Services
```

All protected services validate JWT access tokens issued by the Auth Service before processing requests.

---

## License

This project is part of the **Enterprise Voice AI Platform (VoxForge)** and is intended for learning, experimentation, and demonstrating enterprise-grade backend architecture using FastAPI, PostgreSQL, JWT authentication, and microservices.