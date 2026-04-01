# Finance Dashboard System with Role-Based Access Control

## Project Overview
This project is a backend API for a finance dashboard system that supports authentication, role-based access control, financial record management, and dashboard analytics.

It is designed for a backend developer assessment with a focus on clean architecture, production-minded structure, and secure API design.

## Key Features
- JWT-based authentication with secure password hashing
- Role-based access control for `ADMIN`, `ANALYST`, and `VIEWER`
- Financial record CRUD with filtering, pagination, sorting, and soft delete
- Dashboard APIs for summary, category breakdown, trends, and recent activity
- Centralized validation, error handling, rate limiting, and basic logging
- Audit logs for financial record changes

## Tech Stack
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Sequelize
- Authentication: JWT
- Validation: Zod
- Security: Helmet, bcryptjs, express-rate-limit

## Architecture
The codebase follows a layered architecture:

`Controller -> Service -> Repository`

- Controllers handle HTTP concerns only
- Services contain business rules and access-control decisions
- Repositories isolate database queries and persistence logic

This structure keeps the code modular, testable, and easier to extend without coupling route handlers directly to database operations.

## System Design Thought
The system is designed with scalability in mind, ensuring:
- Clear separation of concerns
- Role-based access enforcement at middleware level
- Database-level aggregation to reduce server load

## Features
### Authentication and Roles
- User registration and login with JWT
- Token contains user identity and role
- Roles:
  - `ADMIN`: full access
  - `ANALYST`: record management + analytics
  - `VIEWER`: read-only access

### Financial Records
- Create, read, update, and soft delete records
- Pagination with `page` and `limit`
- Filtering by `type`, `category`, and date range
- Sorting by `date` or `amount`
- Owner-based modification rules for non-admin users
- Audit logs track all financial record changes to ensure traceability and accountability.

### Dashboard APIs
- Summary totals for income, expense, and net balance
- Category-wise totals separated by income and expense
- Daily or monthly trends
- Recent transaction activity
- Dashboard APIs use Redis caching with short TTL to improve performance and reduce database load.

### Security and Validation
- Password hashing with `bcryptjs`
- Request validation with `Zod`
- Centralized error handling
- Rate limiting for auth and API routes
- Sensitive fields excluded from API responses
- Sensitive data such as passwords are hashed and never exposed in API responses.

## API Endpoints
Base URL: `/api/v1`

### Health
- `GET /health`

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Users
- `GET /users`
- `PATCH /users/:id/role`
- `PATCH /users/:id/status`

### Financial Records
- `GET /records`
- `POST /records`
- `PUT /records/:id`
- `DELETE /records/:id`

### Dashboard
- `GET /dashboard/summary`
- `GET /dashboard/categories`
- `GET /dashboard/trends`
- `GET /dashboard/recent`

## Setup Instructions
1. Clone the repository.
```bash
git clone <your-repo-url>
cd finance-dashboard-backend
```

2. Install dependencies.
```bash
npm install
```

3. Create your environment file.
```bash
copy .env.example .env
```

4. Update `.env` with your local database and JWT settings.

5. Start the server.
```bash
npm run dev
```

## Environment Variables
```env
PORT=5000
DB_URL=postgres://postgres:password@localhost:5432/finance_dashboard
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=1d
```

## Assumptions
- Public registration creates users with the `VIEWER` role by default
- Non-admin users can only access their own financial records
- `VIEWER` users are read-only
- `ANALYST` users can manage records and access analytics
- Soft-deleted records are excluded from standard reads and dashboard calculations

## Design Decisions
### Why Layered Architecture
It separates transport logic, business logic, and persistence logic. This keeps controllers thin, avoids query duplication, and makes future testing and refactoring easier.

### Why PostgreSQL
The system needs structured relational data, filtering, indexing, and efficient aggregation queries for dashboard analytics. PostgreSQL is a strong fit for these requirements.

### Why DB-Level Aggregation
All dashboard calculations are performed at the database level using aggregation queries to improve performance and avoid unnecessary memory usage in the application layer.

### Index Strategy
Indexes are applied on `userId`, `date`, `type`, `category`, and `notes` fields to optimize filtering, search, and aggregation queries.

### Why JWT
JWT keeps authentication stateless, simple to scale, and easy to integrate with role-based authorization checks in middleware.

### Trade-offs
- Sequelize `sync()` is convenient for local setup, but migrations would be preferred for production change management
- Rate limiting is in-memory, which is fine for a single-node assessment but should move to a shared store in distributed deployments
- Analytics are DB-driven for correctness and performance, but heavy workloads may later benefit from caching or pre-aggregation

## API Response Format
### Success
```json
{
  "success": true,
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Error message"
}
```

## Sample Requests and Responses
### Register
`POST /api/v1/auth/register`

```json
{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "SecurePass123"
}
```

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Alice Doe",
      "email": "alice@example.com",
      "role": "VIEWER",
      "isActive": true,
      "createdAt": "2026-04-01T10:00:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

### Create Financial Record
`POST /api/v1/records`

```json
{
  "amount": 2500,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01T00:00:00.000Z",
  "notes": "Monthly salary"
}
```

### Dashboard Summary
`GET /api/v1/dashboard/summary`

```json
{
  "totalIncome": 50000,
  "totalExpense": 30000,
  "netBalance": 20000
}
```

## Postman Collection Structure
- Auth
  - Register
  - Login
- Users
  - Get Users
  - Update User Role
  - Update User Status
- Records
  - Create Record
  - Get Records
  - Update Record
  - Delete Record
- Dashboard
  - Summary
  - Categories
  - Trends
  - Recent Activity

## Future Improvements
- Add Redis for rate-limit storage and response caching
- Introduce database migrations with Sequelize CLI
- Add refresh tokens and token revocation strategy
- Add unit and integration test coverage
- Add advanced analytics and scheduled reporting
- Evolve toward service decomposition if the domain grows further
