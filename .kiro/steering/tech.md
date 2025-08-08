# Technology Stack

## Core Framework
- **Next.js 15.3.1** with App Router architecture
- **React 19.1.0** with TypeScript
- **Bun** as package manager and runtime

## Database & ORM
- **PostgreSQL** with vector extension for embeddings
- **Prisma** ORM with custom client generation path (`app/generated/client`)
- Database migrations and schema management via Prisma

## Authentication & Security
- **NextAuth.js v5** (beta) with Prisma adapter
- **bcryptjs** for password hashing
- Route-based middleware protection for authenticated routes

## AI & ML Integration
- **Google Generative AI** (@google/generative-ai, @google/genai)
- **LangChain** ecosystem (@langchain/core, @langchain/community, @langchain/ollama)
- **Ollama** for local LLM integration
- Vector embeddings stored in PostgreSQL

## UI Framework
- **Tailwind CSS v4** with CSS variables
- **shadcn/ui** component library (New York style)
- **Radix UI** primitives for accessible components
- **Lucide React** for icons
- **Framer Motion** for animations

## State Management & Data Fetching
- **TanStack React Query** for server state management
- **React Hook Form** with Zod validation
- **Axios** for HTTP requests

## Development Tools
- **TypeScript** with strict mode
- **Turbopack** for fast development builds
- Path aliases configured (`@/*` maps to root)

## Common Commands

### Development
```bash
bun dev          # Start development server with Turbopack
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
```

### Database
```bash
bunx prisma generate    # Generate Prisma client (runs on postinstall)
bunx prisma migrate dev # Run database migrations
bunx prisma studio      # Open Prisma Studio
```

### Package Management
```bash
bun install             # Install dependencies
bun add <package>       # Add new dependency
bun add -d <package>    # Add dev dependency
```

## Environment Configuration
- Development and production configs split (`next.config.dev.ts`, `next.config.prod.ts`)
- Environment variables managed via `.env` file
- Database URL and API keys configured through environment variables