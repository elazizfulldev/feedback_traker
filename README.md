# FeedbackOS — Client Feedback Tracker

A full-stack Micro SaaS for collecting, organizing, and analyzing client feedback across multiple channels. Built with clean architecture, role-based access control, and production-ready security practices.

**Stack:** Laravel 13 + Sanctum | React 18 + Vite | TailwindCSS | Chart.js | MySQL | Docker

---

## The Problem

Small businesses and freelancers receive client feedback from WhatsApp, email, phone, and web — but have no centralized way to track it. Existing tools like Canny ($79+/mo) and UserVoice ($999+/mo) are built for enterprise. Small teams need something simpler.

## The Solution

FeedbackOS lets you collect feedback from any channel, see analytics at a glance, and manage your team with role-based access — all in a clean dashboard with light and dark mode support.

---

## Features

**Authentication and Roles**
- Token-based auth with Laravel Sanctum
- Two roles: Admin (full access) and Owner (limited access)
- Role-based sidebar — owners only see Dashboard, Feedback, Add Feedback, and Profile
- Admins see everything: Users management, Add Admin, owner filter, and CSV export
- Secure session handling with automatic token refresh

**User Management (Admin only)**
- Full CRUD: create, edit, and delete user accounts
- Assign roles: Admin or Owner with visual role selector
- User list with avatars, role badges, and join dates
- Safety: admins cannot delete their own account
- Edit password optional on update (leave empty to keep current)

**Feedback Management**
- Collect client info: first name, last name, email, phone, WhatsApp
- Rating system (1-5 stars) with source tracking
- Sources: WhatsApp, Email, Website, Phone, Other
- Full CRUD with server-side pagination
- Validation: at least one contact method required

**Analytics Dashboard**
- 5 stat cards: Total, Positive (4-5 stars), Negative (1-2 stars), Neutral (3 stars), Average Rating
- Doughnut chart: feedback distribution by source
- Bar chart: rating distribution (1 to 5 stars)
- Line chart: monthly trend over 6 months
- Admin view: sees all feedback across all owners with dropdown filter
- Owner view: sees only their own data
- Recent feedback feed with client avatars

**Data Export (Admin only)**
- Export all feedback or filtered by owner as CSV
- Includes: owner info, client info, rating, comment, source, date
- One-click download from dashboard

**Profile Management**
- Edit name and email
- Change password with confirmation
- Avatar upload with image preview
- Role badge display (Admin / Owner)

**UI/UX**
- Light and dark mode with toggle in sidebar (persists in localStorage)
- Dark glassmorphism design with custom color system
- Full light mode support: cards, inputs, hovers, charts, scrollbars
- Responsive: mobile sidebar with overlay, adaptive grids
- Toast notification system (success, error, info)
- Smooth animations (fade-in, slide-up)
- Custom fonts: Plus Jakarta Sans, Playfair Display, JetBrains Mono

**Docker Support**
- Full Docker Compose setup: MySQL + Laravel + React/Nginx
- One command to start: `docker compose up -d --build`
- Auto-migration and seeding on first boot
- Nginx reverse proxy: API and frontend on single port

---

## Tech Stack

**Backend**

| Technology | Purpose |
|------------|---------|
| PHP 8.3 | Server language |
| Laravel 13 | API framework |
| Laravel Sanctum | Token-based authentication |
| MySQL 8 | Database |
| Eloquent ORM | Database queries and relationships |
| Form Requests | Input validation (4 request classes) |
| Policies | Authorization (owner-only access) |
| Middleware | Admin role protection |

**Frontend**

| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite 5 | Build tool and dev server |
| TailwindCSS 3.4 | Utility-first CSS framework |
| React Router 6 | Client-side routing with guards |
| Axios | HTTP client with interceptors |
| Chart.js + react-chartjs-2 | Dashboard charts |
| Lucide React | Professional SVG icon library |

**DevOps**

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Reverse proxy + static file serving |

---

## Architecture

┌──────────────────────────────────────────────┐
│                   Frontend                    │
│          React 18 + Vite + TailwindCSS        │
│   Axios interceptors + React Router + Charts  │
├──────────────────────────────────────────────┤
│              Nginx (Docker only)              │
│     Serves React + Proxies /api → Laravel     │
├──────────────────────────────────────────────┤
│                 REST API (JSON)                │
├──────────────────────────────────────────────┤
│                   Backend                     │
│          Laravel 13 + Sanctum Auth            │
│  Form Requests + Policies + Admin Middleware   │
├──────────────────────────────────────────────┤
│                  Database                     │
│           MySQL 8 (InnoDB, utf8mb4)           │
│       Migrations + Seeders + Factories        │
└──────────────────────────────────────────────┘

---

## Role-Based Access

| Feature | Admin | Owner |
|---------|-------|-------|
| Dashboard (own data) | Yes | Yes |
| Dashboard (all owners + filter) | Yes | No |
| Feedback CRUD | Yes | Yes (own only) |
| Add Feedback | Yes | Yes |
| Users Management | Yes | No |
| Add Admin | Yes | No |
| CSV Export | Yes | No |
| Profile | Yes | Yes |
| Light/Dark Mode | Yes | Yes |

---

## API Endpoints

**Auth (Public)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register | Create account (default role: owner) |
| POST | /api/login | Authenticate and get token |

**Auth (Protected)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/logout | Revoke current token |
| GET | /api/user | Get authenticated user with role |

**Feedback (Protected)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/feedback | List feedback (admin: all/filtered, owner: own) |
| POST | /api/feedback | Create feedback |
| PUT | /api/feedback/{id} | Update feedback (owner only) |
| DELETE | /api/feedback/{id} | Delete feedback (owner only) |
| GET | /api/feedback/stats | Dashboard analytics (admin: filterable by owner) |
| GET | /api/feedback/export | Export CSV (admin only, filterable by owner) |

**Profile (Protected)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/profile | Get profile info |
| PUT | /api/profile | Update name, email, or password |
| POST | /api/profile/avatar | Upload profile picture |

**Users (Admin only)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users with pagination |
| POST | /api/users | Create user with role |
| PUT | /api/users/{id} | Update user (password optional) |
| DELETE | /api/users/{id} | Delete user (cannot delete self) |

---

## Database Schema

**users**

| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Auto-increment |
| name | varchar(255) | |
| email | varchar(255) | Unique |
| password | varchar(255) | Bcrypt hashed |
| role | enum(admin, owner) | Default: owner |
| avatar | varchar(255) | Nullable, filename |
| timestamps | | created_at, updated_at |

**feedback**

| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Auto-increment |
| user_id | FK → users | Cascade on delete |
| first_name | varchar(255) | Client first name |
| last_name | varchar(255) | Client last name |
| email | varchar(255) | Nullable |
| phone | varchar(20) | Nullable |
| whatsapp | varchar(20) | Nullable |
| rating | tinyint | 1 to 5 |
| comment | text | Max 2000 chars |
| source | enum | whatsapp, email, website, phone, other |
| timestamps | | Indexed: (user_id, created_at) |

---

## Project Structure

backend/
├── app/Http/Controllers/Api/
│   ├── AuthController.php             # Login, register, logout
│   ├── FeedbackController.php         # CRUD + stats + CSV export
│   ├── ProfileController.php          # Profile update + avatar
│   └── UserController.php             # User CRUD (admin only)
├── app/Http/Middleware/
│   └── EnsureIsAdmin.php              # Admin-only route guard
├── app/Http/Requests/                 # 4 validation classes
├── app/Models/
│   ├── User.php                       # HasApiTokens, isAdmin(), isOwner()
│   └── Feedback.php                   # Scopes, constants, accessor
├── app/Policies/
│   └── FeedbackPolicy.php            # Owner-only authorization
├── database/migrations/               # users, feedback, tokens, role+avatar
├── database/factories/                # UserFactory, FeedbackFactory
├── database/seeders/                  # Demo admin + 30 entries
├── routes/api.php                     # All API routes
├── bootstrap/app.php                  # Route + middleware config
├── Dockerfile                         # PHP 8.3 container
└── docker-entrypoint.sh               # Auto-migrate + seed
frontend/
├── src/services/api.js                # Axios + auth/feedback/profile/users APIs
├── src/contexts/
│   ├── AuthContext.jsx                # Token + user state
│   └── ToastContext.jsx               # Notifications
├── src/components/
│   ├── Layout.jsx                     # Role-based sidebar + theme toggle
│   └── ThemeToggle.jsx                # Light/dark mode switch
└── src/pages/
├── LoginPage.jsx                  # Login with branding
├── DashboardPage.jsx              # Stats + charts + owner filter + export
├── FeedbackPage.jsx               # List + pagination
├── FeedbackFormPage.jsx           # Create/edit form
├── UsersPage.jsx                  # User list (admin only)
├── UserFormPage.jsx               # Create/edit user with role selector
├── AddAdminPage.jsx               # Quick admin creation
└── ProfilePage.jsx                # Edit info + avatar
├── Dockerfile                         # Node build + Nginx serve
├── nginx.conf                         # SPA routing + API proxy
├── docker-compose.yml                 # MySQL + Laravel + React
└── .env.docker                        # Docker environment template


---

## Security

| Practice | Implementation |
|----------|---------------|
| Password hashing | Bcrypt via Hash::make() with hashed cast |
| Input validation | 4 dedicated Form Request classes |
| Authorization | FeedbackPolicy — users access only their own data |
| Role-based access | EnsureIsAdmin middleware on admin routes |
| Token auth | Sanctum auth:sanctum on all protected routes |
| CORS | Restricted to frontend origin only |
| Data exposure | $hidden on User model (password, remember_token) |
| Avatar security | Validated: image only, max 2MB, jpg/png/webp |
| Self-delete protection | Admin cannot delete their own account |
| 401 handling | Axios interceptor auto-redirects to login |

---

## Quick Start

**Option 1 — Docker (recommended)**

```bash
git clone https://github.com/elazizfulldev/feedback_traker.git
cd feedback_traker
cp .env.docker .env
docker compose up -d --build
```

Open http://localhost:3000

**Option 2 — Manual**

Prerequisites: PHP 8.3+, Composer, Node.js 20+, MySQL 8

```bash
git clone https://github.com/elazizfulldev/feedback_traker.git
cd feedback_traker

# Database
mysql -u root -p -e "CREATE DATABASE feedback_tracker;"

# Backend
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan storage:link
php artisan migrate --seed
php artisan serve

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

**Demo:** demo@example.com / password (role: admin)

---

## What I Learned

- Designing a secure REST API with separation of concerns
- Implementing role-based access control with middleware and policies
- Building token-based authentication with Laravel Sanctum
- Creating reusable React components with Context API
- Setting up Axios interceptors for centralized auth handling
- Handling file uploads securely with validation
- Building responsive layouts with TailwindCSS
- Creating analytics dashboards with Chart.js
- Implementing light/dark mode with CSS overrides and localStorage
- Containerizing a full-stack app with Docker Compose
- Building admin tools: user management, data filtering, CSV export
- Writing clean, maintainable code following production patterns

---

## Future Improvements

- Embeddable JavaScript widget for client websites
- Sentiment analysis on feedback comments
- Slack/Discord notifications on new feedback
- Public feedback board with voting
- Excel export alongside CSV
- Multi-language support

---

## Author

**ElAziz Med-Amine** — Full-Stack Developer

[GitHub](https://github.com/elazizfulldev)

---

## License

MIT
