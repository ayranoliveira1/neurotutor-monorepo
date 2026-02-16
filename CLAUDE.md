# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Style

- No semicolons, single quotes, trailing commas (es5), 2-space indent (see `.prettierrc`)
- Language: **pt-BR** throughout (UI labels, error messages, route names)

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Development (all apps)
pnpm dev

# Build (all apps)
pnpm build

# Lint & Format
pnpm lint
pnpm lint:fix
pnpm format

# Type check
pnpm type-check

# Testing
pnpm test                    # Run all tests
pnpm test:watch              # Watch mode
pnpm test:cov                # Coverage report

# Run tests for a specific app
pnpm --filter @apps/api test
pnpm --filter @apps/web test

# Run a single test file
pnpm --filter @apps/api test -- src/core/either.spec.ts
pnpm --filter @apps/web test -- src/components/layout/__tests__/user-dropdown.spec.tsx

# Prisma (API)
pnpm --filter @apps/api prisma:generate   # Generate client
pnpm --filter @apps/api prisma:migrate    # Run migrations
pnpm --filter @apps/api prisma:studio     # Open Prisma Studio

# Clean build artifacts
pnpm clean
```

## Project Structure

**Turborepo monorepo** with **pnpm workspaces**.

### Apps
- `apps/api` — NestJS 11 backend, PostgreSQL (Prisma 7), Better-Auth, Assaas payments
- `apps/web` — Next.js 16 frontend, React 19, Tailwind v4, shadcn/ui (new-york style)

### Packages
- `packages/types` — Shared TypeScript types and Zod schemas
- `packages/ui` — Shared React UI components
- `packages/utils` — Shared utilities (`formatCurrency`, `formatDate`, `formatDateTime`, `sleep`)
- `tooling/*` — Shared configs (ESLint, TypeScript, Tailwind)

### Path Aliases
- API: `@/*` → `./src/*`, `@test/*` → `./test/*`
- Web: `@/*` → `./src/*`

## API Architecture (DDD/Clean Architecture)

```
apps/api/src/
├── core/              # Either monad, base Entity, UniqueEntityID, errors
├── domain/
│   ├── application/
│   │   ├── repositories/    # Abstract repository interfaces
│   │   ├── use-cases/       # Business logic (account, admin, payment, subscription)
│   │   ├── cryptography/    # HashGenerator, HashComparer, Encrypter interfaces
│   │   ├── providers/       # AuthProvider, MailProvider, PaymentProvider interfaces
│   │   └── storage/         # Uploader interface
│   └── entreprise/
│       └── entities/        # Domain entities (User, Plan, Subscription, Checkout)
└── infra/
    ├── http/
    │   ├── controllers/     # NestJS controllers (organized by domain)
    │   ├── presenters/      # Entity → HTTP response mappers
    │   ├── guards/          # AuthGuard, RolesGuard
    │   ├── decorators/      # @Public, @PublicSubscription, @CurrentUser, @Roles
    │   └── webhooks/        # Assaas payment webhooks
    ├── database/prisma/
    │   ├── repositories/    # Prisma implementations of domain repositories
    │   └── mappers/         # Prisma ↔ Domain entity mappers
    ├── auth/                # Better-Auth config with customSession plugin
    ├── cryptography/        # Bcrypt implementation
    ├── payment/assaas/      # Assaas payment provider implementation
    └── env/                 # Zod-validated environment config
```

### Key Patterns

**Either Monad**: All use cases return `Either<Error, Success>`. Check with `.isLeft()` / `.isRight()`, access `.value`.

**Repository Pattern**: Abstract classes in `domain/application/repositories/`, Prisma implementations in `infra/database/prisma/repositories/`, with mappers converting between domain entities and Prisma models.

**Presenters**: Static `toHTTP()` methods that convert domain entities to API response format. Used in controllers.

**NestJS Modules**: Feature modules (`account.module.ts`, `admin.module.ts`) wire controllers to use cases. Global modules (`DatabaseModule`, `CryptographyModule`, `PaymentModule`) provide infrastructure.

**Auth Decorators**:
- `@Public()` — Skip auth guard entirely
- `@PublicSubscription()` — Require auth but allow inactive subscription
- `@CurrentUser()` — Extract authenticated user from request
- `@Roles(...)` — Require specific roles (Admin, Student, Teacher)

**Auth Guard Flow**: Validates `session_token` cookie via Better-Auth → checks subscription status (unless `@PublicSubscription`) → auto-deactivates expired subscriptions → injects user into request.

**Rate Limiting**: Global `ThrottlerModule` configured at 300 requests per 60 seconds.

### Testing (API)

Uses **fakes and in-memory repositories** instead of mocks. Located in `apps/api/test/`:
- `test/repositories/` — `InMemoryUsersRepository`, `InMemorySubscriptionsRepository`, etc.
- `test/cryptography/` — `FakeHasher`, `FakeEncrypter`
- `test/providers/` — `FakeAuthProvider`, `FakePaymentProvider`, `FakeMailProvider`
- `test/factories/` — `MakeUser()`, `MakePlan()`, `MakeSubscription()`, `MakeCheckout()` (uses faker)

## Frontend Architecture (Next.js App Router)

```
apps/web/src/
├── app/
│   ├── (auth)/           # Public: /login, /register
│   ├── (private)/        # Protected: requires session_token
│   │   └── (subscription-guard)/  # Shows modal if subscription inactive
│   └── api/auth/         # API route for session cleanup
├── actions/auth/         # Server actions: sign-in, sign-up, sign-out, get-current-user
├── components/
│   ├── ui/               # shadcn/ui components (Badge, Avatar, DropdownMenu, etc.)
│   ├── auth/             # Login/register forms, auth branding panel
│   └── layout/           # Sidebar, AppHeader, UserDropdown, ThemeToggle, MobileSidebar
├── lib/
│   ├── api.ts            # HTTP client that forwards cookies to backend
│   └── safe-action.ts    # next-safe-action config with Zod
├── providers/            # ThemeProvider (next-themes), QueryProvider (TanStack Query)
├── schemas/              # Zod validation schemas for forms
└── config/               # Navigation config
```

### Key Patterns

**Auth Flow**: Middleware (`src/proxy.ts`) checks `session_token` cookie for route protection. Private layout calls `getCurrentUser()` server action which fetches `/accounts/me` from API. Returns full user object with subscription data.

**Server Actions**: Located in `actions/auth/`. Use `next-safe-action` with Zod schemas for type-safe validation.

**API Client** (`lib/api.ts`): Forwards all cookies (including `session_token`) to backend. Handles `set-cookie` headers from responses.

**Component Testing**: Vitest + Testing Library + happy-dom. Tests in `__tests__/` subdirectories. Use `vi.mock()` for Next.js modules (`next/link`, `next/navigation`).

## Prisma

Schema at `apps/api/prisma/schema.prisma`, generated client output to `apps/api/src/infra/generated/prisma`. After schema changes, run `prisma:generate` then `prisma:migrate`.

## Environment Variables

### API (`apps/api/.env`)
- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — Server port (default: 3001)
- `ASSAAS_API_KEY` — Payment provider API key
- `ASSAAS_WEBHOOK_TOKEN` — Webhook validation token
- `SUCCESS_REDIRECT_URL` / `CANCEL_REDIRECT_URL` — Checkout redirects

### Web (`apps/web/.env`)
- `API_URL` — Backend URL (default: `http://localhost:3001`)

### Infrastructure
- Docker Compose runs PostgreSQL 16 on port 5432 (user: `docker`, password: `docker`, db: `estuda`)
- Node.js >= 22 required
- PM2 deployment config in `ecosystem.config.cjs` (API on default port, Web on port 4222)
