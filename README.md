# FeedbackOS — Client Feedback Tracker

A full-stack Micro SaaS for collecting, organizing, and analyzing client feedback across multiple channels. Built with clean architecture, role-based access control, and production-ready security practices.

**Stack:** Laravel 13 + Sanctum | React 18 + Vite | TailwindCSS | Chart.js | MySQL

---

## The Problem

Small businesses and freelancers receive client feedback from WhatsApp, email, phone, and web — but have no centralized way to track it. Existing tools like Canny ($79+/mo) and UserVoice ($999+/mo) are built for enterprise. Small teams need something simpler.

## The Solution

FeedbackOS lets you collect feedback from any channel, see analytics at a glance, and manage your team with role-based access — all in a clean, dark-themed dashboard.

---

## Features

**Authentication and Roles**
- Token-based auth with Laravel Sanctum
- Two roles: Admin (full access) and Owner (no admin management)
- Role-based sidebar — owners don't see admin-only pages
- Secure session handling with automatic token refresh

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
- Owner filter: each user sees only their own data
- Recent feedback feed with client avatars

**Profile Management**
- Edit name and email
- Change password with confirmation
- Avatar upload with image preview
- Role badge display (Admin / Owner)

**UI/UX**
- Dark glassmorphism design with custom color system
- Responsive: mobile sidebar with overlay, adaptive grids
- Toast notification system (success, error, info)
- Smooth animations (fade-in, slide-up)
- Custom fonts: Plus Jakarta Sans, Playfair Display, JetBrains Mono

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

---

## Architecture

```
┌──────────────────────────────────────────────┐
│                   Frontend                    │
│          React 18 + Vite + TailwindCSS        │
│      Axios interceptors + React Router        │
├──────────────────────────────────────────────┤
│                 REST API (JSON)                │
│               Vite proxy → :8000              │
├──────────────────────────────────────────────┤
│                   Backend                     │
│          Laravel 13 + Sanctum Auth            │
│    Form Requests + Policies + Middleware       │
├──────────────────────────────────────────────┤
│                  Database                     │
│           MySQL 8 (InnoDB, utf8mb4)           │
│       Migrations + Seeders + Factories        │
└──────────────────────────────────────────────┘
```

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

**Feedback (Protected — owner-scoped)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/feedback | List feedback (paginated, own data only) |
| POST | /api/feedback | Create feedback |
| PUT | /api/feedback/{id} | Update feedback (owner only) |
| DELETE | /api/feedback/{id} | Delete feedback (owner only) |
| GET | /api/feedback/stats | Dashboard analytics |

**Profile (Protected)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/profile | Get profile info |
| PUT | /api/profile | Update name, email, or password |
| POST | /api/profile/avatar | Upload profile picture |

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

```
backend/
├── app/Http/Controllers/Api/
│   ├── AuthController.php             # Login, register, logout
│   ├── FeedbackController.php         # CRUD + analytics stats
│   └── ProfileController.php          # Profile update + avatar
├── app/Http/Middleware/
│   └── EnsureIsAdmin.php              # Admin-only route guard
├── app/Http/Requests/                 # 4 validation classes
├── app/Models/
│   ├── User.php                       # HasApiTokens, isAdmin()
│   └── Feedback.php                   # Scopes, constants, accessor
├── app/Policies/
│   └── FeedbackPolicy.php            # Owner-only authorization
├── database/migrations/               # users, feedback, tokens, role+avatar
├── database/factories/                # UserFactory, FeedbackFactory
├── database/seeders/                  # Demo admin + 30 entries
├── routes/api.php                     # All API routes
└── bootstrap/app.php                  # Route + middleware config

frontend/
├── src/services/api.js                # Axios + interceptors
├── src/contexts/
│   ├── AuthContext.jsx                # Token + user state
│   └── ToastContext.jsx               # Notifications
├── src/components/
│   └── Layout.jsx                     # Role-based sidebar
└── src/pages/
    ├── LoginPage.jsx                  # Login with branding
    ├── DashboardPage.jsx              # 5 stats + 3 charts
    ├── FeedbackPage.jsx               # List + pagination
    ├── FeedbackFormPage.jsx           # Create/edit form
    ├── AddAdminPage.jsx               # Admin-only
    └── ProfilePage.jsx                # Edit info + avatar
```

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
| 401 handling | Axios interceptor auto-redirects to login |

---

## Quick Start

**Prerequisites:** PHP 8.3+, Composer, Node.js 20+, MySQL 8

```bash
# Clone
git clone https://github.com/elazizfulldev/feedback_traker.git
cd feedback_traker

# Database
mysql -u root -p -e "CREATE DATABASE feedback_tracker;"

# Backend
cd backend
cp .env.example .env
# Edit .env with your DB credentials
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
- Writing clean, maintainable code following production patterns

---

## Future Improvements

- Embeddable JavaScript widget for client websites
- Sentiment analysis on feedback comments
- Slack/Discord notifications on new feedback
- Public feedback board with voting
- Export feedback to CSV/PDF
- Multi-language support

---

## Author

**ElAziz Med-Amine** — Full-Stack Developer

[GitHub](https://github.com/elazizfulldev)

---

## License

MIT
