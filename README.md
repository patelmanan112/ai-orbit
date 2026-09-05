# AI Orbit - AI Companies Module

A full-stack implementation of the AI Companies module for the AI Orbit ecosystem.

## Features

- **Discover AI Companies**: Browse a curated list of AI companies shaping the future.
- **Search & Filter**: Search by name, description, categories, and technologies.
- **Detailed Profiles**: View in-depth profiles including company focus, technologies, and related companies.
- **Admin Interface**: Add, edit, and delete companies easily through a secure admin dashboard.
- **Responsive Design**: Polished UI that works flawlessly on mobile, tablet, and desktop.
- **Premium Aesthetics**: Dark theme, minimal design consistent with AI Orbit brand guidelines.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database ORM**: Prisma
- **Database**: SQLite (Configured for easy local setup, easily swappable to PostgreSQL)
- **Icons**: Lucide React

## Project Structure

- `/src/app/companies` - Public listing and detail pages
- `/src/app/admin/companies` - Admin management interface
- `/src/app/api/companies` - RESTful API routes
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and database client
- `/prisma` - Database schema and seed data

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Generate Prisma client and push the schema to SQLite:

```bash
npx prisma db push
```

### 3. Seed initial data

Populate the database with sample AI companies:

```bash
npx prisma db seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Documentation

### `GET /api/companies`
Fetches a list of companies. Supports pagination and filtering.
- Query Params:
  - `search`: Search query string
  - `category`: Filter by category
  - `industry`: Filter by industry
  - `location`: Filter by location
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 12)

### `GET /api/companies/:id`
Fetches a single company by its ID or slug.

### `POST /api/companies`
Creates a new company.

### `PATCH /api/companies/:id`
Updates an existing company.

### `DELETE /api/companies/:id`
Deletes a company.

## Production Build

To build the application for production:

```bash
npm run build
npm start
```
