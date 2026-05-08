# Docker Setup — FeedbackOS

## Quick Start (3 commands)

```bash
# 1. Copy environment file
cp .env.docker .env

# 2. Generate Laravel app key (run once)
# Option A: If you have PHP locally
php -r "echo 'APP_KEY=base64:' . base64_encode(random_bytes(32)) . PHP_EOL;"
# Copy the output and paste it in .env

# Option B: If you DON'T have PHP locally
# Leave APP_KEY empty — the container will generate it automatically

# 3. Build and start everything
docker compose up -d --build
```

Wait ~30 seconds for the database to initialize and migrations to run.

Open http://localhost:3000

**Demo:** demo@example.com / password (role: admin)

## What's Running

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| MySQL 8 | feedbackos-db | 3306 | Database |
| Laravel 13 | feedbackos-api | 8000 | REST API |
| React + Nginx | feedbackos-frontend | 3000 | Frontend |

## File Structure

```
feedback_traker/
├── docker-compose.yml          ← Orchestrates all services
├── .env.docker                 ← Template for environment variables
├── .env                        ← Your actual env (gitignored)
├── backend/
│   ├── Dockerfile              ← PHP 8.3 + Composer + Laravel
│   ├── docker-entrypoint.sh    ← Auto-migrate + seed on first boot
│   └── .dockerignore
└── frontend/
    ├── Dockerfile              ← Node build + Nginx serve
    ├── nginx.conf              ← SPA routing + API proxy
    └── .dockerignore
```

## How It Works

```
Browser → :3000 (Nginx)
  ├── /            → React SPA (index.html)
  ├── /feedback    → React SPA (index.html)
  ├── /api/*       → Proxy to Laravel :8000
  └── /storage/*   → Proxy to Laravel :8000 (avatars)
```

Nginx serves the React build and proxies all `/api/` requests to the Laravel container. No CORS issues because everything goes through port 3000.

## Common Commands

```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f
docker compose logs -f api      # Laravel only
docker compose logs -f frontend # Nginx only
docker compose logs -f db       # MySQL only

# Rebuild after code changes
docker compose up -d --build

# Reset everything (database included)
docker compose down -v
docker compose up -d --build

# Run artisan commands
docker compose exec api php artisan migrate:fresh --seed
docker compose exec api php artisan tinker

# Enter a container shell
docker compose exec api bash
docker compose exec db mysql -u feedbackos -psecret feedback_tracker
```

## First Run Checklist

On first `docker compose up -d --build`:

1. MySQL starts and creates the database
2. Laravel waits for MySQL to be ready (healthcheck)
3. Laravel runs `php artisan migrate` automatically
4. Laravel runs `php artisan db:seed` (creates demo admin + 30 feedbacks)
5. Laravel caches config and routes
6. React is built and served by Nginx
7. Nginx proxies `/api/*` to Laravel

## Troubleshooting

**"Connection refused" on login:**
```bash
docker compose logs api
# Check if Laravel is running. If "Waiting for database...", wait 30s.
```

**"Table not found" errors:**
```bash
docker compose exec api php artisan migrate:fresh --seed
```

**Avatar upload not working:**
```bash
docker compose exec api php artisan storage:link
# Or check that api_storage volume is mounted
```

**Want to reset everything:**
```bash
docker compose down -v    # -v removes volumes (database data)
docker compose up -d --build
```

## Production Notes

For production deployment, change these in `.env`:

```env
APP_KEY=base64:GENERATE_A_REAL_KEY
DB_PASSWORD=a_strong_password_here
```

And in `docker-compose.yml`, remove:
```yaml
ports:
  - "3306:3306"   # Don't expose MySQL to the world
  - "8000:8000"   # Don't expose API directly (goes through Nginx)
```
