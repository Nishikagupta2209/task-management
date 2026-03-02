#  Task Management System

A full-stack Task Management Web Application built with the MERN stack, featuring JWT authentication, real-time updates, Kanban board management, filtering, sorting, Docker support, CI and API documentation.

---

#  Project Overview

This application allows users to securely register, authenticate, and manage tasks with advanced features including:

- Kanban-style drag-and-drop board
- Real-time collaborative updates
- Filtering and sorting
- Dashboard analytics
- Dockerized setup
- CI pipeline
- Swagger API documentation

---

# Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt
- Socket.io
- Swagger
- Jest + Supertest

## Frontend
- React (Vite)
- React Router
- Context API
- Axios
- react-beautiful-dnd
- Socket.io Client

## DevOps
- Docker & Docker Compose
- GitHub Actions 

---

# Run with Docker (Recommended)

### Quick Start

```bash
git clone https://github.com/Nishikagupta2209/task-management.git
cd task-management
docker-compose up --build
```

### Seed demo data (Optional)
docker-compose exec backend npm run seed

you should see -  
Connected to database
Database seeded successfully!
Demo Login:
Email: demo@example.com
Password: password123


### Access Application

Frontend:
```
http://localhost:5173/task/login or http://localhost:5173/task/register
```

Backend runs on:
```
http://localhost:5000
```

Swagger Docs:
```
http://localhost:5000/api-docs
```

No `.env` file required when running via Docker.

---

# Manual Setup (Without Docker)

## Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRES_IN=10d

# CORS
CLIENT_URL=http://localhost:5173
```

Create `backend/.env.test`

```env
JWT_SECRET=testsecret
```

Run backend:

```bash
npm run dev
```

Backend runs on:
```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173/task/login or http://localhost:5173/task/register
```

---

#  Authentication Features

• User registration with email and password (with validation)  
• User login with JWT-based authentication  
• Protected routes — only authenticated users can access task features  
• Logout functionality that clears session/token  

---

#  Task Management (CRUD)

• Create a new task with:
  - Title (required)
  - Description (optional)
  - Priority (Low / Medium / High)
  - Due Date
  - Status (To Do / In Progress / Done)

• View all tasks belonging to the logged-in user  
• Filter tasks by:
  - Status
  - Priority  

• Sort tasks by:
  - Due Date  
  - Creation Date  

• Update an existing task (all fields editable)  
• Delete a task with confirmation prompt  

---

# Dashboard Features

• Summary view displaying:
  - Total tasks
  - Tasks grouped by status
  - Overdue task count  

• Visual indicators for priority levels (color-coded badges)  

---

# Advanced Features

• Real-time updates via WebSockets (Socket.io)  
• Drag-and-drop Kanban board (react-beautiful-dnd)  
• Dark mode toggle  
• Unit & integration tests (Jest, React Testing Library, Supertest)  
• CI pipeline (GitHub Actions)  
• Dockerized setup with docker-compose  
• API documentation via Swagger 

---

#  API Endpoints

Base URL:
```
http://localhost:5000/api
```

## Authentication

POST `/api/auth/register`  
POST `/api/auth/login`

## Tasks (Protected)

GET `/api/tasks`  
GET `/api/tasks/:id`  
GET `/api/tasks/summary` 
POST `/api/tasks`  
PUT `/api/tasks/:id`  
DELETE `/api/tasks/:id`

Swagger Docs:
```
/api-docs
```

---

#  Testing

Backend:
```bash
npm test
```
