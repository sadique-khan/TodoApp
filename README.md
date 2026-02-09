# Task Management App

A production-ready full-stack application featuring secure authentication, real-time collaboration, robust error management, and maintainable notification logic. Built with **Node.js/Express + Prisma ORM** for the backend and **React + TypeScript + Tailwind + React Query** for the frontend.

---



##  Setup Instructions

### Backend (BE)
1. Clone the repository:
    ```bash
    git clone https://github.com/sadique-khan/TodoApp.git
    cd backend
    npm install
    DATABASE_URL=postgresql://user:password@localhost:5432/taskdb
    JWT_SECRET=your_jwt_secret
    REFRESH_TOKEN_SECRET=your_refresh_secret
    npx prisma migrate dev
    npm run dev

### Frontend (FE)
    cd ../frontend
    npm install
    VITE_API_URL=http://localhost:3000/api/
    npm run dev




API Contract documentation

Base URL,http://localhost:3000/api
Content-Type,application/json
Authentication,JWT via Cookies (HttpOnly) & requireAuth Middleware

USER ROUTES 
POST,/register,Create a new user account,
POST,/login,Authenticate user and set cookies,
POST,/refresh,Refresh expired access tokens,
POST,/logout,Clear session cookies

TASK ROUTES

 Create Task,POST /tasks,
 List Tasks,GET /tasks,
 Update Task,PATCH /tasks/:id
 Delete Task,DELETE /tasks/:id



DATABASE

PostgreSQL for a ToDo App

Strong relational integrity, scalable, advanced queries, ORM support



WEBSOCKETS

 The system uses WebSockets for instant updates. Clients should join specific rooms to receive notifications.

Rooms
tasks: General room for global task updates.

user:{userId}: Private room for user-specific notifications (e.g., assignments).

Event Name,Room,Payload Example
notify,tasks,"{ ""type"": ""TASK_CREATED"", ""message"": ""..."", ""task"": { ... } }"
notify,tasks,"{ ""type"": ""TASK_UPDATED"", ""message"": ""..."", ""task"": { ... } }"
notify,tasks,"{ ""type"": ""TASK_DELETED"", ""message"": ""..."", ""taskId"": ""id"" }"
notify,user:{id},"{ ""type"": ""TASK_ASSIGNED"", ""message"": ""..."", ""task"": { ""id"", ""title"" } }"



