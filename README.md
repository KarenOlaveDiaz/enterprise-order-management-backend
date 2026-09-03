# OrderFlow — Enterprise Order Management API

Backend REST API for **OrderFlow**, a full-stack enterprise order management application built as a professional software engineering portfolio project.

The API demonstrates a production-oriented backend architecture using NestJS, PostgreSQL and Prisma, including JWT authentication, role-based access control, request validation, security middleware, automated testing, containerization, continuous integration and cloud deployment.

## Live API

**Base URL:**

```text
https://orderflow-backend-5nsn.onrender.com/api
```

**Swagger / OpenAPI Documentation:**

```text
https://orderflow-backend-5nsn.onrender.com/api/docs
```

> The API is hosted on Render's free tier. If the service has been inactive, the first request may take a short time while the backend starts.

---

## Features

### Authentication

- JWT-based authentication
- Login endpoint
- Protected API routes
- Authenticated user profile
- Password validation
- Role information embedded in authenticated user context

### Authorization

Role-Based Access Control (RBAC) is implemented using:

- Custom `@Roles()` decorator
- `RolesGuard`
- JWT authentication guard
- `ADMIN` and `DEMO` roles

Permissions are enforced by the backend independently from frontend restrictions.

| Operation | ADMIN | DEMO |
|---|:---:|:---:|
| Login | ✅ | ✅ |
| View profile | ✅ | ✅ |
| View orders | ✅ | ✅ |
| View order | ✅ | ✅ |
| Create order | ✅ | ❌ |
| Update order status | ✅ | ❌ |
| Delete order | ✅ | ❌ |

This means a DEMO user cannot bypass the frontend and perform administrative operations directly against the API.

### Order Management

The API supports:

- Retrieve all orders
- Retrieve an individual order
- Create orders
- Update order status
- Delete orders
- PostgreSQL persistence
- DTO validation
- Protected write operations

### Security

The backend includes:

- JWT authentication
- Role-based authorization
- DTO validation
- Request payload whitelisting
- Rejection of unexpected properties
- CORS configuration
- Helmet security headers
- API rate limiting
- Environment-based secrets
- Protected administrative operations

---

## Architecture

```text
┌──────────────────────────────┐
│       React Frontend         │
│                              │
│ React + TypeScript + Vite    │
└───────────────┬──────────────┘
                │
                │ HTTPS / REST
                ▼
┌──────────────────────────────┐
│          NestJS API          │
│                              │
│ Controllers                  │
│ DTO Validation               │
│ Authentication               │
│ RBAC Authorization           │
│ Business Logic               │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│      Repository Layer        │
│                              │
│ Prisma Orders Repository     │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│          Prisma ORM          │
└───────────────┬──────────────┘
                │
                │ TLS
                ▼
┌──────────────────────────────┐
│      Neon PostgreSQL         │
└──────────────────────────────┘
```

---

## Tech Stack

### Backend

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Neon

### Authentication & Security

- JWT
- Passport
- NestJS Guards
- Role-Based Access Control
- Helmet
- CORS
- Rate Limiting
- class-validator
- class-transformer

### API Documentation

- Swagger
- OpenAPI

### Testing

- Jest
- Supertest
- NestJS Testing Utilities
- Unit Tests
- End-to-End Tests

### Infrastructure & DevOps

- Docker
- GitHub Actions
- Render
- Git
- GitHub

---

## Project Structure

The backend follows a modular NestJS architecture.

```text
src/
├── auth/
│   ├── decorators/
│   ├── enums/
│   ├── guards/
│   ├── interfaces/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
│
├── orders/
│   ├── dto/
│   ├── repositories/
│   ├── orders.controller.ts
│   ├── orders.module.ts
│   └── orders.service.ts
│
├── generated/
│   └── prisma/
│
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts

prisma/
├── schema.prisma
└── migrations/

test/
├── app.e2e-spec.ts
├── auth.e2e-spec.ts
├── roles.e2e-spec.ts
└── jest-e2e.json
```

This structure separates authentication, authorization, order management, persistence and infrastructure responsibilities.

---

## API Endpoints

All application routes use the global `/api` prefix.

### Health

```http
GET /api/health
```

Checks API availability.

---

## Authentication Endpoints

### Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "demo@orderflow.dev",
  "password": "Demo123!"
}
```

Example response:

```json
{
  "accessToken": "<jwt>"
}
```

### Authenticated Profile

```http
GET /api/auth/profile
```

Requires:

```http
Authorization: Bearer <access_token>
```

---

## Order Endpoints

### Retrieve Orders

```http
GET /api/orders
```

**Access:** `ADMIN`, `DEMO`

---

### Retrieve Order

```http
GET /api/orders/:id
```

**Access:** `ADMIN`, `DEMO`

---

### Create Order

```http
POST /api/orders
```

**Access:** `ADMIN`

Example payload:

```json
{
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com",
  "product": "Business Laptop",
  "quantity": 2
}
```

---

### Update Order Status

```http
PATCH /api/orders/:id/status
```

**Access:** `ADMIN`

Example payload:

```json
{
  "status": "completed"
}
```

---

### Delete Order

```http
DELETE /api/orders/:id
```

**Access:** `ADMIN`

---

## Authentication Flow

```text
Client
  │
  │ POST /api/auth/login
  │ email + password
  ▼
AuthController
  │
  ▼
AuthService
  │
  │ validates credentials
  ▼
JWT Service
  │
  │ signs token
  ▼
Access Token
  │
  ▼
Client
  │
  │ Authorization:
  │ Bearer <token>
  ▼
JwtAuthGuard
  │
  ▼
Protected Endpoint
```

---

## Authorization Flow

Authentication and authorization are treated as separate responsibilities.

```text
HTTP Request
     │
     ▼
JwtAuthGuard
     │
     │ Is the user authenticated?
     ▼
RolesGuard
     │
     │ Does the user have
     │ the required role?
     ▼
Controller
     │
     ▼
Service
```

For example:

```text
DEMO
  │
  ├── GET /orders ───────────► 200 OK
  │
  └── POST /orders ──────────► 403 Forbidden


ADMIN
  │
  ├── GET /orders ───────────► 200 OK
  │
  └── POST /orders ──────────► 201 Created
```

This authorization is enforced server-side and does not depend on the frontend hiding administrative controls.

---

## Validation

NestJS uses a global `ValidationPipe`:

```typescript
new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});
```

This provides:

- DTO-based request validation
- Automatic payload transformation
- Removal/rejection of unexpected input
- Consistent request contracts

---

## Persistence

Order data is persisted in PostgreSQL.

```text
OrdersService
      │
      ▼
OrdersRepository
      │
      ▼
Prisma
      │
      ▼
PostgreSQL
```

The production database is hosted using Neon PostgreSQL.

Prisma provides:

- Database schema management
- Generated type-safe database client
- Database migrations
- Repository persistence

---

## Environment Variables

Create a local `.env` file:

```env
DATABASE_URL=<postgresql-connection-string>
DIRECT_URL=<postgresql-direct-connection-string>
JWT_SECRET=<your-secret>
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Important

Never commit real production credentials or secrets.

The repository should contain only an example environment configuration such as:

```text
.env.example
```

Production secrets are configured directly in the deployment platform.

---

## Local Development

### Requirements

Install:

- Node.js
- npm
- Git
- PostgreSQL-compatible database

Docker is optional.

### Clone Repository

```bash
git clone https://github.com/KarenOlaveDiaz/enterprise-order-management-backend.git

cd enterprise-order-management-backend
```

### Install Dependencies

```bash
npm ci
```

### Configure Environment

Create:

```text
.env
```

Configure the required environment variables described above.

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Database Migrations

```bash
npx prisma migrate deploy
```

### Start Development Server

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000/api
```

Swagger:

```text
http://localhost:3000/api/docs
```

---

## Testing

The backend contains automated tests at multiple levels.

### Unit Tests

Unit tests validate isolated application behavior such as guards and services.

Example:

```text
src/auth/guards/roles.guard.spec.ts
```

### End-to-End Tests

E2E tests validate complete HTTP request flows through the NestJS application.

Examples include:

```text
test/app.e2e-spec.ts
test/auth.e2e-spec.ts
test/roles.e2e-spec.ts
```

Authorization tests verify scenarios such as:

```text
DEMO → GET orders       → Allowed
DEMO → POST order       → Forbidden
DEMO → PATCH status     → Forbidden
DEMO → DELETE order     → Forbidden

ADMIN → POST order      → Allowed
```

This verifies authorization at the API boundary rather than relying exclusively on unit-level behavior.

---

## Running Tests

### Unit Tests

```bash
npm run test
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:cov
```

---

## Code Quality

Run ESLint:

```bash
npm run lint
```

Build the application:

```bash
npm run build
```

Before integrating a feature, the project can be validated locally with:

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

---

## Swagger / OpenAPI

Interactive API documentation is generated using Swagger.

Production:

```text
https://orderflow-backend-5nsn.onrender.com/api/docs
```

Swagger can be used to:

- Explore available endpoints
- Inspect DTO schemas
- Test API requests
- Authenticate using Bearer JWT
- Inspect HTTP responses

---

## Docker

The backend includes a multi-stage Docker build.

Conceptually:

```text
Node Alpine
     │
     ▼
Builder Stage
     │
     ├── Install dependencies
     ├── Generate Prisma Client
     └── Compile NestJS
     │
     ▼
Production Stage
     │
     ├── Production dependencies
     ├── Compiled application
     └── Generated Prisma Client
     │
     ▼
NestJS Container
```

### Build Docker Image

```bash
docker build -t orderflow-backend .
```

### Run Container

```bash
docker run --rm \
  --env-file .env \
  -p 3000:3000 \
  --name orderflow-backend \
  orderflow-backend
```

The API will be available at:

```text
http://localhost:3000/api
```

---

## Continuous Integration

GitHub Actions automatically validates backend changes.

The CI pipeline executes:

```text
Pull Request / Push
        │
        ▼
      npm ci
        │
        ▼
  Prisma Generate
        │
        ▼
      ESLint
        │
        ▼
    Unit Tests
        │
        ▼
     E2E Tests
        │
        ▼
      Build
        │
        ▼
    CI Success
```

Workflow configuration:

```text
.github/workflows/backend-ci.yml
```

Required secrets are stored using GitHub repository secrets instead of being committed to source control.

---

## Deployment

The backend is deployed as a Dockerized Web Service on Render.

Deployment architecture:

```text
GitHub
   │
   │ main updated
   ▼
GitHub Actions
   │
   │ validation successful
   ▼
Render
   │
   │ Docker build
   ▼
OrderFlow Backend
   │
   │ DATABASE_URL
   ▼
Neon PostgreSQL
```

Render automatically deploys changes from the configured production branch.

---

## Production Architecture

```text
                       Internet
                          │
                          ▼
              ┌─────────────────────┐
              │ OrderFlow Frontend  │
              │                     │
              │ React / Render      │
              └──────────┬──────────┘
                         │
                         │ HTTPS / JWT
                         ▼
              ┌─────────────────────┐
              │ OrderFlow Backend   │
              │                     │
              │ NestJS              │
              │ Docker              │
              │ Render              │
              └──────────┬──────────┘
                         │
                         │ Prisma / TLS
                         ▼
              ┌─────────────────────┐
              │ Neon PostgreSQL     │
              │                     │
              │ Persistent Storage  │
              └─────────────────────┘
```

---

## CI/CD Flow

The complete engineering workflow follows:

```text
Feature Branch
      │
      ▼
Development
      │
      ▼
Local Validation
      │
      ▼
Push
      │
      ▼
Pull Request
      │
      ▼
GitHub Actions
      │
      ├── Lint
      ├── Tests
      ├── E2E
      └── Build
      │
      ▼
Merge to main
      │
      ▼
Render Auto Deploy
      │
      ▼
Docker Build
      │
      ▼
Production
```

---

## Frontend

The React frontend is maintained in a separate repository:

```text
https://github.com/KarenOlaveDiaz/enterprise-order-management-frontend
```

### Live Application

```text
https://orderflow-frontend-qlvh.onrender.com
```

The frontend provides:

- Authentication interface
- Protected routes
- Role-aware UI
- Order dashboard
- Order creation
- Status management
- Search and filtering
- Pagination
- Notifications
- Responsive user interface

---

## Demo Account

A read-only account is available for portfolio evaluation:

```text
Email: demo@orderflow.dev
Password: Demo123!
```

The DEMO account can inspect the application while server-side RBAC prevents write operations.

Administrative credentials are intentionally not published.

---

## Engineering Goals

OrderFlow was developed to demonstrate practical backend and full-stack engineering concepts, including:

- Modular NestJS architecture
- REST API design
- Frontend/backend separation
- JWT authentication
- Server-side authorization
- Role-Based Access Control
- DTO validation
- Repository-based persistence
- Relational database integration
- Prisma ORM
- Automated unit testing
- End-to-end API testing
- API documentation
- Security middleware
- Environment and secret management
- Docker containerization
- Continuous integration
- Cloud deployment
- Git feature-branch workflow

The project is designed to demonstrate not only API implementation, but how backend services fit into a complete production-oriented software delivery lifecycle.

---

## Author

**Karen Olave**

Frontend / Full-Stack Software Engineer

This portfolio project demonstrates experience across React, TypeScript, NestJS, PostgreSQL, Prisma, REST APIs, authentication, authorization, automated testing, Docker, CI/CD and cloud deployment.