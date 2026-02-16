# Shippy API v1

A RESTful API built with Node.js, Express, and Prisma ORM for managing shipping operations, user authentication, and profile management.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Database:** PostgreSQL (or your database)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator / Zod
- **Dev Tools:** Nodemon, ESLint

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm or yarn package manager
- PostgreSQL (or your preferred database)
- Git

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shippy-api-v1
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000


# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/shippy_db?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Other configurations as needed
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The API will be available at [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
shippy-api-v1/
├── prisma/                       # Prisma ORM configuration
│   ├── migrations/              # Database migration files
│   └── schema.prisma            # Database schema definition
├── src/                         # Source code directory
│   ├── config/                  # Configuration files
│   │   ├── database.ts         # Database connection setup
│   │   └── env.ts              # Environment variables validation
│   ├── controllers/             # Request handlers
│   │   ├── authController.ts   # Authentication logic
│   │   ├── profileController.ts # Profile management logic
│   │   └── shipmentController.ts # Shipment operations logic
│   ├── middleware/              # Express middleware
│   │   ├── authMiddleware.ts   # JWT verification & authorization
│   │   └── errorHandler.ts     # Global error handling
│   ├── routes/                  # API route definitions
│   │   ├── authRoutes.ts       # Auth endpoints
│   │   ├── profileRoutes.ts    # Profile endpoints
│   │   ├── shipmentRoutes.ts   # Shipment endpoints
│   │   ├── userRoutes.ts       # User management endpoints
│   │   └── index.ts            # Route aggregator
│   ├── services/                # Business logic layer
│   │   ├── authService.ts      # Authentication services
│   │   ├── profileService.ts   # Profile services
│   │   └── shipmentService.ts  # Shipment services
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.ts             # Authentication types
│   │   └── shipment.ts         # Shipment types
│   └── index.ts                 # Application entry point
├── .env                         # Environment variables
├── .eslintrc.js                # ESLint configuration
├── nodemon.json                # Nodemon configuration
├── package.json                # Project dependencies
└── tsconfig.json               # TypeScript configuration
```

## 🔑 Key Features

### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/Client)
- Protected routes via middleware

### User Management

- User profile CRUD operations
- User type (Admin/Client) support

### Shipment Management

- Create, read, update, delete shipments
- Track shipment status
- Assign shipments to users
- Filter and search capabilities

## 🏗️ Architecture Pattern

The API follows a layered architecture:

```
Routes → Controllers → Services → Database (Prisma)
         ↓
    Middleware (Auth, Error Handling)
```

### Layer Responsibilities

1. **Routes Layer** (`src/routes/`)
   - Define API endpoints
   - Apply middleware
   - Route requests to controllers

2. **Controllers Layer** (`src/controllers/`)
   - Handle HTTP requests/responses
   - Validate request data
   - Call appropriate services
   - Format responses

3. **Services Layer** (`src/services/`)
   - Contain business logic
   - Interact with database via Prisma
   - Handle data transformations
   - Implement complex operations

4. **Middleware Layer** (`src/middleware/`)
   - Authentication & authorization
   - Error handling
   - Request validation
   - Logging

## 🗄️ Database Schema

The database uses Prisma ORM. Key models include:

- **User:** User accounts with authentication
- **Shipment:** Shipment tracking and details

To view the complete schema:

```bash
npx prisma studio
```

This opens a visual database browser at [http://localhost:5555](http://localhost:5555)

## 🔐 Authentication Flow

1. User registers via `/api/auth/register`
2. Password is hashed and user is stored in database
3. User logs in via `/api/auth/login`
4. Server generates JWT token
5. Client stores token (localStorage/cookies)
6. Client includes token in `Authorization: Bearer <token>` header
7. Protected routes verify token via `authMiddleware`
8. User data is attached to `req.user` for authorized requests

## 🛡️ Middleware

### Authentication Middleware (`authMiddleware.ts`)

Protects routes requiring authentication:

```typescript
// Usage in routes
router.get("/profile", authMiddleware, profileController.getProfile);
```

### Error Handler Middleware (`errorHandler.ts`)

Catches and formats all errors:

```typescript
// Automatically applied to all routes
app.use(errorHandler);
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run start        # Start production server

# Database
npx run prisma:generate              # Generate Prisma Client
npx prisma migrate dev --name init   # Run migrations

# Build
npm run build        # Compile TypeScript to JavaScript
```

## 🧪 Development Guidelines

### File Naming Conventions

- **Controllers:** camelCase with `Controller` suffix (e.g., `authController.ts`)
- **Services:** camelCase with `Service` suffix (e.g., `authService.ts`)
- **Routes:** camelCase with `Routes` suffix (e.g., `authRoutes.ts`)
- **Middleware:** camelCase with `Middleware` suffix (e.g., `authMiddleware.ts`)
- **Types:** camelCase (e.g., `auth.ts`)

### Code Organization

1. **Keep controllers thin:** Move business logic to services
2. **Use services for database operations:** Don't access Prisma directly in controllers
3. **Type everything:** Leverage TypeScript for type safety
4. **Handle errors properly:** Use try-catch and throw meaningful errors
5. **Validate input:** Always validate request data before processing

## 🔧 Environment Variables

| Variable       | Description                  | Required | Default |
| -------------- | ---------------------------- | -------- | ------- |
| `PORT`         | Server port                  | No       | 5000    |
| `DATABASE_URL` | PostgreSQL connection string | Yes      | -       |
| `JWT_SECRET`   | Secret key for JWT           | Yes      | -       |
| `CORS_ORIGIN`  | Allowed CORS origin          | YES      | \*      |

## 🗃️ Database Migrations

### Creating a New Migration

```bash
# After modifying schema.prisma
npx prisma migrate dev --name descriptive_migration_name
```

### Migration History

All migrations are stored in `prisma/migrations/` with timestamps:

- `20260215200859_init` - Initial database setup
- `20260215205541_add_usertype` - Added user type field
- `20260215214634_init` - Schema refinements

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

**Warning:** This will delete all data!

## Troubleshooting

### Common Issues

**Issue:** "Prisma Client not found"

```bash
# Solution
npx prisma generate
```

**Issue:** Database connection errors

```bash
# Solution
# 1. Verify DATABASE_URL in .env
# 2. Ensure PostgreSQL is running
# 3. Check database credentials
```

**Issue:** Migration conflicts

```bash
# Solution
npx prisma migrate resolve --applied <migration_name>
# or
npx prisma migrate reset (development only)
```

**Issue:** Port already in use

```bash
# Solution
# Change PORT in .env or kill process using the port
lsof -ti:5000 | xargs kill -9  # macOS/Linux
```

**Issue:** TypeScript compilation errors

```bash
# Solution
npm run build
# Fix reported errors
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup

1. Set `NODE_ENV=production` in production environment
2. Use strong `JWT_SECRET` (minimum 32 characters)
3. Configure proper `DATABASE_URL` for production database
4. Set up proper CORS origins
