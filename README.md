# Backend API with Neon PostgreSQL

A well-structured Nuxt 3 backend API application with PostgreSQL integration using Neon database.

## 🏗️ Architecture

### Project Structure

```
server/
├── api/                    # API routes
│   ├── users.ts           # User CRUD operations
│   ├── users/
│   │   ├── [id].ts        # Individual user operations
│   │   └── search.ts      # User search endpoint
│   ├── db-info.ts         # Database information
│   └── migrate.ts         # Database migrations
├── services/              # Business logic layer
│   └── userService.ts     # User business operations
├── utils/                 # Utility functions
│   ├── database.ts        # Database connection pool
│   ├── validation.ts      # Input validation
│   └── errorHandler.ts    # Error handling utilities
└── types/                 # TypeScript type definitions
    └── index.ts           # Shared interfaces and types
```

### Key Features

#### 🔌 Database Layer

- **Connection Pooling**: Singleton pattern with connection pool management
- **Transaction Support**: Built-in transaction handling for complex operations
- **SSL Configuration**: Properly configured for Neon database requirements

#### 📝 Service Layer

- **Business Logic Separation**: Clean separation between API routes and business logic
- **Reusable Methods**: Modular service methods for user operations
- **Email Validation**: Built-in email uniqueness checking

#### 🛡️ Validation & Error Handling

- **Input Validation**: Comprehensive validation for all user inputs
- **PostgreSQL Error Mapping**: Automatic handling of database constraint violations
- **Consistent API Responses**: Standardized response format across all endpoints

#### 🚀 Migration System

- **Schema Management**: Built-in migration system for database schema changes
- **Version Control**: Track executed migrations to prevent duplicates

## 🔧 API Endpoints

### Users API

#### `GET /api/users`

Get all users with optional pagination and sorting.

**Query Parameters:**

- `limit` (optional): Number of users to return
- `offset` (optional): Number of users to skip
- `orderBy` (optional): Field to sort by (default: `created_at`)
- `orderDirection` (optional): Sort direction `ASC` or `DESC` (default: `DESC`)

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [...],
    "total": 10
  }
}
```

#### `POST /api/users`

Create a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

#### `GET /api/users/{id}`

Get a specific user by ID.

#### `PUT /api/users/{id}`

Update a user by ID.

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "age": 25
}
```

#### `DELETE /api/users?id={id}`

Delete a user by ID.

#### `GET /api/users/search?search={term}`

Search users by name or email.

### Database Management

#### `GET /api/db-info`

Get database information and connection status.

#### `POST /api/migrate`

Run pending database migrations.

## 🚀 Usage Examples

### Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "age": 30}'
```

### Get All Users

```bash
curl http://localhost:3000/api/users
```

### Search Users

```bash
curl "http://localhost:3000/api/users/search?search=john"
```

### Run Migrations

```bash
curl -X POST http://localhost:3000/api/migrate
```

## 🔧 Environment Setup

Create a `.env` file with your Neon database connection string:

```env
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

## 📦 Dependencies

- `pg` - PostgreSQL client for Node.js
- `@types/pg` - TypeScript definitions for pg
- `@types/node` - TypeScript definitions for Node.js

## 🏆 Best Practices Implemented

### Database

- ✅ Connection pooling for performance
- ✅ Parameterized queries to prevent SQL injection
- ✅ Transaction support for data consistency
- ✅ Proper connection cleanup

### API Design

- ✅ RESTful endpoint structure
- ✅ Consistent error responses
- ✅ Input validation and sanitization
- ✅ Proper HTTP status codes

### Code Architecture

- ✅ Separation of concerns (routes, services, utilities)
- ✅ TypeScript for type safety
- ✅ Reusable components and utilities
- ✅ Error handling at all levels

### Security

- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Proper error message sanitization
- ✅ Email uniqueness validation

## 🔄 Development Workflow

1. **Add new features**: Create service methods first, then API routes
2. **Database changes**: Use the migration system for schema updates
3. **Validation**: Add validation rules in `ValidationService`
4. **Error handling**: Errors are automatically handled by `ErrorHandler`

This architecture provides a solid foundation for building scalable backend APIs with proper separation of concerns, type safety, and robust error handling.

# 🚀 Nuxt 3 Users API with PostgreSQL

A full-stack Vue.js/Nuxt 3 application with PostgreSQL backend for user management.

## 📁 Project Structure

```
backend-api/
├── 📁 server/              # Backend API routes and services
│   ├── 📁 api/             # API endpoints (/api/users, /api/migrate, etc.)
│   ├── 📁 services/        # Business logic (UserService)
│   ├── 📁 utils/           # Database connection, validation, error handling
│   └── 📁 types/           # Backend TypeScript interfaces
├── 📁 pages/               # Nuxt pages (index.vue - main dashboard)
├── 📁 components/          # Vue components (UserCard, UserForm, etc.)
├── 📁 composables/         # Vue composables (useUsersApi)
├── 📁 types/               # Frontend TypeScript interfaces
└── 📄 nuxt.config.ts       # Nuxt configuration
```

## 🎯 Features

### ✅ Backend API

- **CRUD Operations**: Create, Read, Update, Delete users
- **Search**: Search users by name or email
- **Phone Updates**: Update user phone numbers
- **Migrations**: Database schema management
- **Validation**: Input validation and error handling
- **Connection Pooling**: Optimized PostgreSQL connections

### ✅ Frontend Dashboard

- **Reactive UI**: Vue.js reactive data binding
- **Real-time Search**: Search as you type
- **Pagination**: Navigate through users
- **Modal Workflows**: Create/edit users in modals
- **Responsive Design**: Mobile-friendly interface
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Create `.env` file with your Neon PostgreSQL connection:

```env
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Visit Dashboard

Open `http://localhost:3000` to see the Vue.js dashboard!

## 📡 API Endpoints

| Method   | Endpoint            | Description                   |
| -------- | ------------------- | ----------------------------- |
| `GET`    | `/api/users`        | Get all users with pagination |
| `POST`   | `/api/users`        | Create new user               |
| `GET`    | `/api/users/:id`    | Get user by ID                |
| `PUT`    | `/api/users/:id`    | Update user                   |
| `DELETE` | `/api/users/:id`    | Delete user                   |
| `GET`    | `/api/users/search` | Search users                  |
| `POST`   | `/api/migrate`      | Run database migrations       |
| `GET`    | `/api/db-info`      | Get database connection info  |

## 💡 Usage Examples

### Update Phone Number

```bash
curl -X PUT http://localhost:3000/api/users/2
  -H "Content-Type: application/json"
  -d '{"phone": "+91-8090908320"}'
```

### Search Users

```bash
curl "http://localhost:3000/api/users/search?search=john"
```

### Create User

```bash
curl -X POST http://localhost:3000/api/users
  -H "Content-Type: application/json"
  -d '{"name": "John Doe", "email": "john@example.com", "age": 30}'
```

## 🎨 Vue.js Features

- **Composables**: Reusable logic with `useUsersApi()`
- **Reactive State**: Automatic UI updates
- **Component System**: Modular, reusable components
- **Transitions**: Smooth animations
- **TypeScript**: Full type safety
- **SSR Ready**: Server-side rendering with Nuxt

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3, Nuxt 3, TypeScript
- **Backend**: Nuxt API routes, Node.js
- **Database**: PostgreSQL (Neon)
- **Styling**: CSS with scoped styles
- **Validation**: Custom validation service

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎉 Ready to Use!

Your Vue.js dashboard is ready with full CRUD operations, search functionality, and a beautiful responsive interface. The clean architecture separates concerns between API logic, UI components, and business logic for easy maintenance and scalability.

Visit `http://localhost:3000` to start managing users! 🚀
