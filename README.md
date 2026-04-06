# Finance Dashboard System with Role-Based Access Control

## Project Summary

A production-ready finance dashboard backend with advanced features including authentication, role-based access control, caching, audit logging, background jobs, and scalable data processing.

The system is designed for performance, reliability, and real-world usage.

## Overall Impact

- Improved system performance and scalability through caching and streaming
- Enhanced security with JWT revocation and RBAC
- Added reliability via fail-safe mechanisms and background jobs
- Enabled real-world usability with CSV import/export and budgets

## Tech Stack

Node.js, Express, PostgreSQL, Redis, Sequelize, JWT, Docker, React

## Engineering Focus

This project focuses on building a scalable, secure, and production-ready backend system rather than just implementing features.

## Live API
Base URL: https://zoryvn-finance-dashboard.onrender.com

Swagger Docs:
https://zoryvn-finance-dashboard.onrender.com/api/v1/docs

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
- Bulk import/export from and to CSV
- Set transactions as recurring (daily, weekly, monthly) using automated CRON jobs
- Pagination with `page` and `limit`
- Filtering by `type`, `category`, and date range
- Sorting by `date` or `amount`
- Owner-based modification rules for non-admin users
- Audit logs capture state data `before` and `after` modifications to ensure full traceability.

### Budgets
- Establish monthly limits per record category
- Automatic dashboard calculation comparing live expenditures to budget maximums

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

## Health Check
GET /api/v1/health

Response:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

## Deployment Architecture
- Backend hosted on Render
- PostgreSQL hosted on Neon
- Redis hosted on Upstash

The system uses environment-based configuration and secure connections (SSL/TLS).

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

### Reliability Considerations
- Redis is optional with graceful fallback to database
- Application continues to function even if cache is unavailable
- Proper error handling prevents system crashes

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
- Add monitoring and logging for production observability (e.g., Datadog, Prometheus)
- Introduce database migrations with Sequelize CLI
- Evolve toward frontend Next.js/SSR separation if the domain grows further
