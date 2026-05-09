<div align="center">

# FeedbackOS

### Client Feedback Tracker SaaS

A modern full-stack platform for collecting, managing, and analyzing client feedback across multiple channels.

<br/>

<img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=22&duration=3000&color=8B5CF6&center=true&vCenter=true&width=700&lines=Laravel+13+%2B+React+18+Architecture;Secure+Role-Based+Dashboard;Dockerized+Micro+SaaS;Production-Ready+Full-Stack+Application" />

<br/>

<p>
<img src="https://img.shields.io/badge/Laravel-13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<p>
<img src="https://img.shields.io/github/stars/elazizfulldev/feedback_traker?style=social" />
<img src="https://img.shields.io/github/forks/elazizfulldev/feedback_traker?style=social" />
</p>

</div>

---

# Overview

FeedbackOS is a full-stack Micro SaaS built for freelancers and small businesses who need a centralized way to manage client feedback.

Instead of losing feedback across WhatsApp, email, phone calls, and websites, FeedbackOS organizes everything into one secure analytics dashboard with role-based access control.

---

# Features

## Authentication & Authorization

- Laravel Sanctum authentication
- Token-based API security
- Role-based access control
- Admin and Owner permissions
- Protected routes
- Axios interceptor auth handling

---

## User Management

### Admin Features

- Create users
- Edit users
- Delete users
- Assign roles
- Avatar uploads
- Pagination support
- Self-delete protection

---

## Feedback Management

- Multi-channel feedback collection
- Ratings system (1 → 5 stars)
- CRUD operations
- Source tracking
- Pagination system
- Contact validation rules

### Supported Sources

- WhatsApp
- Email
- Website
- Phone
- Other

---

## Analytics Dashboard

- Total feedback count
- Positive / Negative / Neutral stats
- Average rating calculation
- Doughnut charts
- Bar charts
- Monthly analytics
- Owner filtering
- Recent feedback activity

---

## UI / UX

- Dark mode
- Light mode
- Glassmorphism UI
- Responsive layout
- Animated sidebar
- Toast notifications
- Smooth transitions
- Modern typography

---

## Docker Support

- Multi-container setup
- Laravel container
- React container
- MySQL container
- Nginx reverse proxy
- One-command startup

---

# Tech Stack

## Backend

| Technology | Purpose |
|---|---|
| PHP 8.3 | Backend language |
| Laravel 13 | API framework |
| Sanctum | Authentication |
| MySQL 8 | Database |
| Eloquent ORM | Database relationships |
| Policies | Authorization |
| Middleware | Route protection |

---

## Frontend

| Technology | Purpose |
|---|---|
| React 18 | Frontend library |
| Vite 5 | Build tool |
| TailwindCSS | Styling |
| React Router 6 | Routing |
| Axios | HTTP client |
| Chart.js | Analytics charts |
| Lucide React | Icons |

---

## DevOps

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Reverse proxy |

---

# Architecture

```txt
┌──────────────────────────────────────────────┐
│                   Frontend                   │
│        React 18 + Vite + TailwindCSS         │
├──────────────────────────────────────────────┤
│                    Nginx                     │
│          Reverse Proxy + Static Files        │
├──────────────────────────────────────────────┤
│                 Laravel API                  │
│      Sanctum + Policies + Middleware         │
├──────────────────────────────────────────────┤
│                   MySQL 8                    │
│         Migrations + Seeders + ORM           │
└──────────────────────────────────────────────┘
```

---

# Role-Based Access

| Feature | Admin | Owner |
|---|---|---|
| Dashboard | Yes | Yes |
| Global Analytics | Yes | No |
| Feedback CRUD | Yes | Yes |
| User Management | Yes | No |
| CSV Export | Yes | No |
| Profile Settings | Yes | Yes |

---

# API Endpoints

## Auth

```http
POST   /api/register
POST   /api/login
POST   /api/logout
GET    /api/user
```

---

## Feedback

```http
GET    /api/feedback
POST   /api/feedback
PUT    /api/feedback/{id}
DELETE /api/feedback/{id}

GET    /api/feedback/stats
GET    /api/feedback/export
```

---

## Profile

```http
GET    /api/profile
PUT    /api/profile
POST   /api/profile/avatar
```

---

## Users

```http
GET    /api/users
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

---
# Project Structure

<pre>

feedback_traker/
│
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       ├── AuthController.php
│   │   │   │       ├── FeedbackController.php
│   │   │   │       ├── ProfileController.php
│   │   │   │       └── UserController.php
│   │   │   │
│   │   │   ├── Middleware/
│   │   │   │   └── EnsureIsAdmin.php
│   │   │   │
│   │   │   └── Requests/
│   │   │
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   └── Feedback.php
│   │   │
│   │   └── Policies/
│   │       └── FeedbackPolicy.php
│   │
│   ├── database/
│   │   ├── migrations/
│   │   ├── factories/
│   │   └── seeders/
│   │
│   ├── routes/
│   │   └── api.php
│   │
│   ├── bootstrap/
│   │   └── app.php
│   │
│   ├── Dockerfile
│   └── docker-entrypoint.sh
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── ThemeToggle.jsx
│   │   │
│   │   └── pages/
│   │       ├── LoginPage.jsx
│   │       ├── DashboardPage.jsx
│   │       ├── FeedbackPage.jsx
│   │       ├── FeedbackFormPage.jsx
│   │       ├── UsersPage.jsx
│   │       ├── UserFormPage.jsx
│   │       ├── AddAdminPage.jsx
│   │       └── ProfilePage.jsx
│   │
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
└── .env.docker

</pre>

---

# Security

- Password hashing with bcrypt
- Sanctum protected routes
- Authorization policies
- Middleware protection
- Request validation
- Hidden sensitive fields
- Secure avatar validation
- Owner-only resource access

---

# Quick Start

## Docker Setup

```bash
git clone https://github.com/elazizfulldev/feedback_traker.git

cd feedback_traker

cp .env.docker .env

docker compose up -d --build
```

---

## Manual Setup

### Requirements

- PHP 8.3+
- Composer
- Node.js 20+
- MySQL 8

---

### Backend

```bash
cd backend

cp .env.example .env

composer install

php artisan key:generate

php artisan storage:link

php artisan migrate --seed

php artisan serve
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Demo Credentials

```txt
Email: demo@example.com
Password: password
Role: Admin
```

---

# What I Learned

- REST API architecture
- Role-based authorization
- Sanctum authentication
- Dockerized deployment
- React Context API
- Axios interceptors
- Advanced TailwindCSS layouts
- Dashboard analytics systems
- Secure file upload handling
- Clean architecture patterns

---

# Future Improvements

- AI sentiment analysis
- Public feedback boards
- Slack integrations
- Discord integrations
- Embeddable widgets
- Excel exports
- Multi-language support

---

# Author

## ElAziz Med-Amine

Full-Stack Developer

<p>
<a href="https://github.com/elazizfulldev">
<img src="https://img.shields.io/badge/GitHub-elazizfulldev-181717?style=for-the-badge&logo=github" />
</a>
</p>

---

# License

MIT License

---

<div align="center">

### Star the repository if you like the project.

</div>