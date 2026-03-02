# Architecture Documentation - Task Management System

This document outlines the architectural design, directory structure, and technical workflow of the Task Management System .

---

## 1. System Overview
The Task Management System is a full-stack application designed for high scalability and clear separation of concerns. It follows a **Client-Server Architecture** where the frontend and backend communicate via a RESTful API.
---

## 2. Directory Structure

### Root Structure
```text
task-management/
├── backend/            # Express API & Business Logic
├── frontend/           # React Client Application
├── docker-compose.yml  # Container Orchestration
├── README.md           # Setup Instructions
└── ARCHITECTURE.md     # System Design (This File)
```

### Backend Structure 
```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── test/
├── .env.example
├── Dockerfile
├── package.json
├── seed.js
└── server.js
```

### Frontend Structure 

frontend/
├── src/
│   ├── modals/
│   ├── pages/
│   ├── routes/
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── Dockerfile
├── package.json


## 3. Database Schema Design

### user schema 
```
Fields :

id 

email (unique)

password (hashed)

createdAt

updatedAt
```

Security Notes:

Passwords are hashed using bcrypt.

Email uniqueness enforced at schema level.

---
### Task Schema
```
Fields:
id

title (required)

description

priority (Low / Medium / High)

status (To Do / In Progress / Done)

dueDate

userId (ObjectId reference to User)

createdAt

updatedAt
```
Relationship: One-to-Many: One User → Many Tasks


## 4. Authentication Flow
JWT-based authentication is implemented.

Registration Flow :

User submits registration data.

Backend validates input.

Password is hashed using bcrypt.

User is stored in database.

User is asked for login
----------------

Login Flow

User submits credentials.

Backend verifies email.

Password is compared using bcrypt.

JWT token is generated and returned.
---------------

Protected Routes Flow

Token is sent in the Authorization header.

Middleware verifies the token.

If valid, user ID is attached to the request.

Controllers use this ID to fetch user-specific data.
----------------

This ensures:

Stateless authentication

Horizontal scalability

Secure user isolation
