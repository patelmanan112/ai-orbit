# AI Orbit — AI Companies Module

A full-stack, production-ready **AI Companies** discovery module built as part of the AI Orbit internship assignment.

> Discover, explore, and filter the companies shaping the future of artificial intelligence.

---

## Live Demo

🔗 **[Coming soon — deployed on Vercel]**

---

## Features

- **Listing Page** — Grid & list view toggle, debounced search, category filter, pagination (12 per page)
- **Detail Page** — Full company profile with description, tech stack, categories, social links, and contextual "Related Companies"
- **Logo Fallback** — Smart logo loading with first-letter fallback if image fails
- **Dark Design** — Premium dark UI matching AI Orbit's aesthetic
- **60 Curated Companies** — OpenAI, Anthropic, NVIDIA, Mistral, Waymo, and more — all with logos, links, and metadata
- **REST API** — `/api/companies` with search, filter, sort, and pagination support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon) via Prisma ORM |
| Deployment | Vercel |

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/patelmanan112/ai-orbit.git
cd ai-orbit
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

> Get these from [Neon](https://neon.tech) — create a free project and copy the connection strings.

### 3. Initialize the database

```bash
npx prisma migrate dev --name init
```

### 4. Seed the companies data

```bash
npx tsx prisma/seedCustom.ts
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment on Vercel

### Step 1 — Create a Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up (free)
2. Create a new project
3. Go to **Dashboard → Connection Details**
4. Copy both:
   - **Connection string** (pooled) → this is your `DATABASE_URL`
   - **Connection string** (direct / non-pooled) → this is your `DIRECT_URL`

### Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo: `patelmanan112/ai-orbit`
3. Add Environment Variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon pooled connection string |
| `DIRECT_URL` | Your Neon direct connection string |

4. Click **Deploy**

### Step 3 — Run migrations on Neon

After deploying, run this locally with your Neon `DATABASE_URL` set in `.env`:

```bash
npx prisma migrate deploy
npx tsx prisma/seedCustom.ts
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Redirects to /companies
│   ├── layout.tsx                # Root layout with nav
│   ├── globals.css
│   ├── companies/
│   │   ├── page.tsx              # Listing page
│   │   └── [slug]/
│   │       └── page.tsx          # Detail page
│   └── api/
│       └── companies/
│           ├── route.ts          # GET (list) + POST
│           └── [id]/
│               └── route.ts      # GET + PATCH + DELETE
├── components/
│   └── companies/
│       ├── CompanyCard.tsx       # Card with overlay link pattern
│       └── CompanyLogo.tsx       # Logo with onError fallback
└── lib/
    └── db.ts                     # Prisma singleton client

prisma/
├── schema.prisma                 # AiCompany model
└── seedCustom.ts                 # 60 curated AI companies
```

---

## API Reference

### `GET /api/companies`

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search name, description, industry |
| `category` | string | Filter by category |
| `industry` | string | Filter by industry |
| `sort` | string | `featured` \| `newest` \| `a-z` \| `z-a` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 12) |

**Response:**
```json
{
  "companies": [...],
  "pagination": {
    "total": 60,
    "page": 1,
    "limit": 12,
    "totalPages": 5
  }
}
```

---

## Assignment Context

Built for the **AI Orbit Full Stack Internship Assignment**.

**Module:** AI Companies  
**Scope:** Listing page, detail page, REST API, data seeding  
**Design:** Dark, premium, minimal — consistent with AI Orbit's brand

---

*Built by Manan Patel*
