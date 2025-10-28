## AfriGrowth AI – Developer Onboarding Guide

Welcome to AfriGrowth AI. This guide will help you clone, configure, and run the app locally in under 30 minutes.

### Prerequisites

- Node.js >= 18
- npm >= 8
- Docker >= 24 and Docker Compose
- Git
- Optional (native dev without Docker): MongoDB 7.x

Verify versions:

```bash
node -v
npm -v
docker --version
docker compose version
```

### Repository Setup

```bash
git clone <your-repo-url>
cd afrigrowth-ai

# Install dependencies (root, frontend, backend)
npm run install:all

# Create logs/uploads dirs for backend (if not present)
mkdir -p backend/logs backend/uploads
```

### Environment Variables

Create a `.env` at the repo root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/afrigrowth-ai

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Hugging Face
HUGGINGFACE_API_KEY=your_huggingface_api_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# Cloudinary (optional for media)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Notes:
- Docker Compose provides its own Mongo connection string to the backend container; for local non-Docker runs, use `MONGODB_URI` above.
- Keep API keys secure; do not commit `.env`.

### Running with Docker (recommended)

This starts MongoDB, Redis, backend, frontend, and Nginx reverse proxy.

```bash
docker compose up -d --build
```

Services and ports:
- Frontend: http://localhost:3000
- Backend API (via Nginx): https://localhost/api (proxy to backend)
- Backend direct (if needed): http://localhost:3001
- MongoDB: localhost:27017
- Redis: localhost:6379
- Health check: https://localhost/health

To view logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

Shutdown:

```bash
docker compose down
```

### Running Locally (without Docker)

Run MongoDB locally or with Docker only for DB:

```bash
# Start only MongoDB via Docker
docker compose up -d mongodb redis

# Or start mongod locally (if installed)
```

Start dev servers with hot reload:

```bash
npm run dev
# runs both frontend and backend concurrently
```

Individual apps:

```bash
npm run dev:frontend   # Next.js on :3000
npm run dev:backend    # Express on :3001
```

### How the Apps Connect

- Frontend defaults to `NEXT_PUBLIC_API_URL=http://localhost:3001` (set in docker-compose for containers; for local dev, ensure requests point to the backend port 3001).
- Nginx (in Docker) proxies `https://localhost/api` → backend and `https://localhost/` → frontend.

### Common Ports

- 3000: Next.js frontend
- 3001: Express backend
- 27017: MongoDB
- 6379: Redis
- 80/443: Nginx

### Troubleshooting

- Mongo connection error:
  - Ensure Mongo is running: `docker compose ps` or `mongo --eval 'db.runCommand({ ping: 1 })'`
  - Verify `MONGODB_URI` matches your environment (Docker vs local).
- CORS errors in browser:
  - Backend `cors` allows `FRONTEND_URL` (default `http://localhost:3000`). Set `FRONTEND_URL` in `.env` if different.
- OpenAI/HF API errors:
  - Check keys in `.env` and container env. Restart after updating: `docker compose up -d --build`.
- Ports already in use:
  - Stop conflicting processes or change ports in `.env` and `docker-compose.yml`.
- SSL warnings at https://localhost:
  - Nginx uses local cert placeholders; accept the self-signed cert in dev, or access services directly on :3000/:3001.

---

## Project Structure

```
afrigrowth-ai/
├── frontend/              # Next.js 14 app (TypeScript, Tailwind)
│   └── src/
│       ├── app/           # App Router, pages, layout
│       ├── components/    # UI components
│       ├── hooks/         # React hooks
│       ├── lib/           # Client utilities
│       └── types/         # Shared types
├── backend/               # Express API (TypeScript)
│   └── src/
│       ├── controllers/   # Route controllers (auth, content, audio, analytics)
│       ├── middleware/    # Auth, errors, not-found
│       ├── models/        # Mongoose models (User)
│       ├── routes/        # Express routers
│       ├── services/      # OpenAI, Hugging Face integrations
│       └── utils/         # DB connection, logger
├── docs/                  # Architecture & API docs
├── nginx/                 # Reverse proxy config
├── scripts/               # Setup and Mongo init
└── docker-compose.yml
```

---

## Coding Standards

- Formatting & Linting
  - ESLint: `npm run lint` (frontend/backend)
  - Prettier: follow project defaults (Next.js + TypeScript conventions)
- TypeScript
  - Prefer explicit interfaces for API contracts
  - Avoid `any`; use discriminated unions where helpful
  - Early returns over deep nesting; meaningful variable names
- Error handling
  - Use centralized error middleware; avoid swallowing errors
  - Validate inputs with `express-validator`

Commit messages (Conventional Commits):

```
feat(auth): add JWT expiry config
fix(api): correct CORS origin for local dev
chore(deps): update mongoose to ^8.0.3
docs(onboarding): add troubleshooting for SSL
refactor(user): extract profile updater
test(auth): add login happy-path test
```

---

## Developer Workflow

- Branch naming
  - `feature/<short-name>` e.g. `feature/ai-dashboard`
  - `fix/<short-name>` e.g. `fix/login-bug`
  - `chore/<short-name>` e.g. `chore/update-deps`

- Flow
  1. Create branch from `main`
  2. Commit using Conventional Commits
  3. Open PR with description, screenshots, and test notes
  4. Request review; address feedback; squash & merge

- Testing
  - Backend: `cd backend && npm test`
  - Frontend: `cd frontend && npm test` (placeholder if tests added later)
  - Type checks: `npm run type-check` (frontend)

- Local testing of AI endpoints
  - Obtain `OPENAI_API_KEY` and `HUGGINGFACE_API_KEY`
  - Use REST client (Postman/curl) against `http://localhost:3001` or `https://localhost/api`
  - Examples:

```bash
# Health
curl http://localhost:3001/health

# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Ama","lastName":"Mensah","email":"ama@example.com","password":"Password123!","phoneNumber":"+233241234567","location":{"city":"Accra","region":"Greater Accra"}}'

# Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login -H 'Content-Type: application/json' -d '{"email":"ama@example.com","password":"Password123!"}' | jq -r .token)

# Generate content
curl -X POST http://localhost:3001/api/content/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Write a social post about market day in Accra.","type":"social","language":"en","tone":"friendly"}'
```

---

## Optional: Seed Database (Ghana Demo Data)

The repo includes `/scripts/mongo-init.js` used by Docker to initialize collections and indexes. To seed demo data locally, you can run a quick script or insert via Mongo shell.

Using Docker init (already configured):
- When `docker compose up mongodb` runs, the init script at `./scripts/mongo-init.js` creates collections `users`, `content`, `transcriptions`, and `analytics` with indexes.

Manual insert example:

```bash
mongosh "mongodb://localhost:27017/afrigrowth-ai" --eval '
db.users.insertOne({
  firstName: "Kojo",
  lastName: "Asare",
  email: "kojo@example.com",
  password: "hash_here",
  role: "user",
  isActive: true,
  emailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  subscription: { plan: "starter", status: "trial", startDate: new Date(), usage: { contentGenerations: 0, audioTranscriptions: 0, apiCalls: 0 } },
  preferences: { language: "en", theme: "light", notifications: { email: true, push: true, sms: false } },
  location: { city: "Kumasi", region: "Ashanti", country: "Ghana" }
})'
```

Note: In app flows, passwords are hashed automatically via Mongoose pre-save; for manual inserts, ensure you hash before insert if you need to log in with that user.

---

## Debugging & VS Code

Recommended extensions:
- ESLint
- Prettier
- Docker
- REST Client or Thunder Client

Example launch configs (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend: Nodemon",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev:backend"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    },
    {
      "type": "node-terminal",
      "name": "Frontend: Next dev",
      "command": "npm run dev:frontend"
    }
  ]
}
```

Backend request logging is enabled via `morgan` and `winston` (logs in `backend/logs`).

---

## Deployment Notes (Preview)

- Production compose brings up Nginx with SSL off of `nginx/ssl` paths; use your certs.
- Set `NEXT_PUBLIC_API_URL` for frontend if deployed separately.
- Review rate limiting in `nginx/nginx.conf` and backend `express-rate-limit`.

---

## Contact & Support

- Internal: open a GitHub issue and tag `devx`
- External support: support@afrigrowth.ai


