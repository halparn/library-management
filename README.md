# Library Management System

A modern web application for managing library books and members, built with React, Node.js, and PostgreSQL.

## Features

- Browse and search books
- Manage library members
- Borrow and return books
- Rate borrowed books
- Search functionality
- Lazy loading
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm

## Project Structure

```
library-management/
├── api/           # Backend Node.js application
│   ├── prisma/    # Database schema
│   └── src/       # API source code
└── ui/            # Frontend React application
```

## Setup Instructions

### 1. Database Setup

1. Make sure PostgreSQL is running
2. Run the ddl.sql script to create database, tables and initial data:
```bash
psql -d postgres -f ddl.sql
```

### 2. Install Dependencies

From the root directory, install all dependencies (api and ui):
```bash
npm run install:all
```

### 3. Environment Setup

Update DATABASE_URL in the .env file in the api directory:

```bash
echo "DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/library_db\"" > api/.env
```

### 4. Start the Application

Start both frontend and backend concurrently:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Available Scripts

### Root Directory
- `npm run install:all` - Install dependencies for all packages
- `npm start` - Start both frontend and backend (same as npm run dev)
- `npm run dev` - Start both applications in development mode
- `npm run start:frontend` - Start only the frontend
- `npm run start:backend` - Start only the backend
- `npm run build` - Build both frontend and backend

### Backend (api/)
- `npm run start:dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Frontend (ui/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Endpoints

### Users
- GET `/users` - List all users
- GET `/users/:id` - Get user details
- POST `/users/:userId/borrow/:bookId` - Borrow a book
- POST `/users/:userId/return/:bookId` - Return a book

### Books
- GET `/books` - List all books
- GET `/books/:id` - Get book details

## Technologies Used

### Frontend
- React
- Redux Toolkit (RTK Query)
- Semantic UI React
- SCSS
- TypeScript

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma
- TypeScript

## Development

### Building for Production
```bash
# Build backend
cd api
npm run build

# Build frontend
cd ui
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details