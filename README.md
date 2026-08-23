# HoloCard

Interactive AR Digital Business Card SaaS Platform. Create digital business cards with 3D viewers, augmented reality, QR sharing, analytics, and AI-powered content.

**Live:** [https://holocard-fawn.vercel.app](https://holocard-fawn.vercel.app)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (base-nova) |
| Database | PostgreSQL (Neon) + Prisma 7 |
| Auth | NextAuth v5 (Credentials + Google OAuth) |
| 3D/AR | Three.js + React Three Fiber + Drei |
| Charts | Recharts |
| Storage | Supabase Storage / MinIO (S3-compatible) |
| AI | Ollama (llama3.2) with template fallback |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 11+
- Neon PostgreSQL database (free tier works)
- Supabase project (free tier) for file storage

### 1. Clone and install

```bash
git clone https://github.com/usmanashfaq1916/holocard.git
cd holocard
pnpm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description | How to get |
|----------|-------------|------------|
| `DATABASE_URL` | PostgreSQL connection string | [Neon](https://neon.tech) → Connection string |
| `AUTH_SECRET` | NextAuth secret | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App base URL | `http://localhost:3000` for dev |
| `SUPABASE_URL` | Supabase project URL | [Supabase](https://supabase.com) → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Same location as above |

Optional:

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `OLLAMA_BASE_URL` | Local AI bio generator (default: `http://localhost:11434`) |
| `STORAGE_DRIVER` | `supabase` (default) or `minio` |
| `MINIO_ENDPOINT` | MinIO server URL |
| `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` | MinIO credentials |
| `MINIO_BUCKET` | MinIO bucket name |
| `NEXT_PUBLIC_BASE_URL` | Public URL for QR codes |

### 3. Database setup

```bash
pnpm prisma db push
pnpm prisma generate
pnpm db:seed
```

### 4. Run dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo account:** `usman@demo.com` / `demo1234`

## Architecture

```
holocard/
├── app/                    # Next.js App Router
│   ├── api/                # API routes (28 endpoints)
│   │   ├── auth/           # NextAuth + register + password reset
│   │   ├── cards/          # Card CRUD, buttons, social links, reorder
│   │   ├── media/          # Media list + delete
│   │   ├── upload/         # File upload (Supabase/MinIO)
│   │   ├── analytics/      # Event tracking + stats
│   │   ├── ai/             # AI bio generation
│   │   ├── admin/          # Admin panel API
│   │   └── ...
│   ├── dashboard/          # Authenticated dashboard (11 pages)
│   ├── card/[slug]/        # Public card view
│   ├── ar/[cardId]/        # 3D/AR viewer
│   └── (marketing)/        # Landing, features, pricing, etc.
├── components/             # React components
│   ├── cards/              # CardEditor, PublicCard, QRGenerator, ShareButtons
│   ├── ar/                 # ARModelViewer (Three.js)
│   ├── dashboard/          # Shell, Sidebar, Topbar
│   └── ui/                 # shadcn/ui components (15)
├── lib/                    # Utilities
│   ├── auth/               # NextAuth config
│   ├── storage/            # Storage abstraction (Supabase/MinIO)
│   ├── validation.ts       # Zod schemas
│   ├── plans.ts            # Plan definitions
│   ├── sharing.ts          # Web Share API + vCard
│   └── rate-limit.ts       # In-memory rate limiter
├── prisma/                 # Database schema + seed
└── tests/                  # Vitest test files
```

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| POST | `/api/auth/reset-password` | No | Reset password with token |
| GET/POST | `/api/cards` | Yes | List/create cards |
| GET/PATCH/DELETE | `/api/cards/[id]` | Yes* | Card CRUD (*GET is public) |
| POST | `/api/cards/[id]` | Yes | Duplicate card |
| PATCH | `/api/cards/reorder` | Yes | Reorder cards |
| POST | `/api/cards/[cardId]/buttons` | Yes | Add button |
| GET | `/api/cards/[cardId]/buttons` | No | List buttons |
| POST | `/api/upload` | Yes | Upload file |
| GET/DELETE | `/api/media` | Yes | List/delete media |
| GET | `/api/media/[id]/signed-url` | Yes | Get signed URL |
| POST | `/api/analytics` | No | Track event |
| GET | `/api/analytics/stats` | Yes | Analytics data |
| GET | `/api/dashboard/stats` | Yes | Dashboard overview |
| GET | `/api/qr/[slug]` | No | Generate QR code |
| POST | `/api/ai/generate-bio` | Yes | AI bio generation |
| GET | `/api/templates` | No | List templates |
| GET | `/api/admin` | Admin | Admin stats |
| PATCH | `/api/admin/users/[id]` | Admin | Update user plan |

## Database Models

13 models: User, Account, Session, VerificationToken, PasswordResetToken, Card, CardButton, Contact, SocialLink, Media, ARAsset, Template, AnalyticsEvent, Subscription, Notification

## Storage

Pluggable storage via `STORAGE_DRIVER` env var:

- **Supabase** (default): Uses Supabase Storage with `holocard-uploads` bucket
- **MinIO**: S3-compatible, run locally with Docker:

```bash
docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"
```

## Testing

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
```

32 tests covering: plans, rate limiting, storage providers, sharing, validation, utilities.

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

Ensure `vercel.json` contains `{"framework":"nextjs"}`.

### Environment Variables for Production

Set these in Vercel dashboard:

```
DATABASE_URL=postgresql://...
AUTH_SECRET=...
NEXT_PUBLIC_BASE_URL=https://holocard-fawn.vercel.app
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## License

Private project.
