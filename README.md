# Hans Peter Online Shop

A full-stack e-commerce web application built with Next.js, PostgreSQL and Prisma ORM. The project started as a school project and now serves as a reference implementation for building a complete shop system with a relational database layer modeled in Prisma.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Database | PostgreSQL with Prisma 7 as ORM |
| Realtime | Socket.IO (customer support chat) |
| Auth | Session-based authentication, bcryptjs password hashing, JWT |
| Validation | Zod, React Hook Form |
| Email | Nodemailer with Gmail API |
| DevOps | Docker, Docker Compose |

## Features

### Storefront

- Product catalog with categories, subcategories and brands
- Product detail pages with image gallery, technical details and reviews
- Full-text product search
- Shopping cart and wishlists
- Checkout with address management, payment and shipping method selection
- Order history and order tracking in the user account

### Administration

- Admin dashboard for product, category and brand management
- Order management with status, payment status and tracking number
- Customer support chat with realtime updates via Socket.IO

### Database Layer (Prisma)

- 17 models covering users, addresses, products, categories, brands, cart, wishlists, orders, reviews, support chats and admin sessions
- Relational modeling with one-to-many, many-to-many and self-referencing relations
- Composite primary keys, unique constraints and indexes for query performance
- Versioned schema migrations in `prisma/migrations`
- Idempotent seed scripts for users, products and orders, including generated demo data via Faker and product images via Unsplash/Pexels

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A PostgreSQL database (or Docker for the compose setup)

### Setup

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/NiklasTech/hans-peter-online-shop.git
cd hans-peter-online-shop
npm install
```

2. Create a `.env` file based on `example.env` and set your database connection:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/HansPeter?schema=public"
```

3. Apply the migrations and seed the database:

```bash
npm run db:migrate:deploy
npm run db:seed:all
```

4. Start the development server:

```bash
npm run dev
```

The application runs on [http://localhost:3000](http://localhost:3000). It uses a custom server (`server.ts`) that combines Next.js with the Socket.IO websocket server.

### Docker

A production setup with the app and a PostgreSQL container is available via Docker Compose:

```bash
docker compose up
```

See `Dockerfile.example`, `server-compose-example.yaml` and `docker-entrypoint.sh` for the reference deployment configuration.

## Project Structure

```
app/            Next.js App Router pages, layouts and API routes
  api/          REST endpoints (auth, products, cart, orders, chat, admin, ...)
  admin/        Admin dashboard pages
components/     React components and shadcn/ui building blocks
hooks/          Custom React hooks
lib/            Shared server utilities (Prisma client, auth, validation, sockets)
prisma/         Prisma schema, migrations and seed scripts
scripts/        Database backup and restore scripts
doc/            Architecture and feature documentation
public/         Static assets
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with Socket.IO |
| `npm run build` | Create a production build |
| `npm run db:migrate:deploy` | Apply migrations to the database |
| `npm run db:migrate:dev` | Create and apply a new migration in development |
| `npm run db:seed:all` | Seed users, products and orders |
| `npm run db:reset` | Clear the database and reseed everything |
| `npm run db:backup` / `db:restore` | Backup or restore the database |

## Documentation

Additional documentation lives in the `doc/` directory, including:

- [Prisma guide](doc/PRISMA-GUIDE.md)
- [Database setup with Prisma 7](doc/PRISMA7-DB-SETUP.md)
- [Seeding documentation](prisma/SEEDING.md)
- [Admin product management](doc/ADMIN-PRODUCT-MANAGEMENT.md)
- [Email setup](EMAIL_SETUP.md)
