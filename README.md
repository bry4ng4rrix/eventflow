<p align="center">
<img src="https://github.com/madjeek-web/eventflow/raw/main/EventFlow_logo_png_mini.png" alt="EventFlow logo png image" width="65%" height="65%">
</p>

# EventFlow

### Open-Source Community Event Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security: JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-green)](https://jwt.io/)
[![Code Style: JSDoc](https://img.shields.io/badge/Docs-JSDoc-orange)](https://jsdoc.app/)
[![Status: Stable](https://img.shields.io/badge/Status-Stable-brightgreen)]()

---

EventFlow is a full-stack web application for creating, browsing, and managing community events. Built with Next.js 16, React 19, and a file-based JSON data layer, it covers the full lifecycle of an event : creation, discovery, registration, and administration. The project is production-hardened with JWT authentication, bcrypt password hashing, Zod input validation, rate limiting, and secure HTTP-only session cookies.

---

## Live Demo

A static preview of the interface is available on GitHub Pages.

[https://madjeek-web.github.io/eventflow-demo-standalone.html](https://madjeek-web.github.io/eventflow-demo-standalone.html)

> The demo runs with seed data and resets on each deployment. It illustrates the UI and navigation flow, not live data persistence.

Buy EventFlow: Info / Prices
Contact us directly by email :
encrypt-free.74.mq2fl@aleeeas.com

---

## Table of Contents

- [Why EventFlow ?](#why-eventflow-)
- [Live Demo](#live-demo)
- [Features](#features)
- [Security Overview](#security-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)
- [Author](#author)

---

## Why EventFlow ?

Most event platforms are either too heavy (full SaaS, database required, complex deployment) or too bare-bones (no auth, no validation, no error handling). EventFlow sits in the middle : it is a real, working platform with proper security practices, yet it remains lightweight enough to run with a single `npm install` and zero external services.

It is a genuine reference for anyone who wants to understand how a modern Next.js application is architected from routing to authentication to state management, reading code that is explicit, commented, and consistent.

---

## Features

| Feature | Description |
|---|---|
| Event listing | Browse all upcoming events with filters by category, keyword, and date range |
| Event detail | Full event page with description, location, date, available seats, and registration button |
| Event creation | Authenticated users can create new events with all metadata |
| Registration | One-click registration per user per event, with duplicate prevention |
| User authentication | Secure login with bcrypt-hashed passwords and JWT stored in HTTP-only cookies |
| User management | Create, view, and edit user profiles |
| Contact form | Validated contact form persisted to a local JSON store |
| Category system | Events are tagged with categories, enabling filtered discovery |
| Legal pages | Mentions légales page included |
| Auto-generated API docs | JSDoc-generated documentation for every route and hook |
| Responsive design | Mobile-first layout using Tailwind CSS v4 and shadcn/ui components |

---

## Security Overview

Security is treated as a first-class concern, not an afterthought. Each layer of the stack has a specific protection mechanism.

| Layer | Mechanism |
|---|---|
| Passwords | Hashed with bcrypt (cost factor 12) before storage, never stored or returned in plain text |
| Session tokens | JWT signed with a server-side secret, stored in HTTP-only, Secure, SameSite=Strict cookies, inaccessible to JavaScript |
| Route protection | Next.js Middleware enforces authentication on all protected routes before rendering |
| Input validation | All API route bodies are validated with Zod schemas before processing |
| Rate limiting | Login endpoint is rate-limited to 10 attempts per 15-minute window per IP |
| Error messages | API errors never expose internal paths, stack traces, or data structure details |
| Data sanitization | All user-provided strings are trimmed and length-capped before persistence |
| CSRF mitigation | Cookie SameSite=Strict policy prevents cross-site request forgery |

> The data layer uses JSON files for portability. For production deployments handling real user data, migrating to PostgreSQL or another persistent database is strongly recommended. See [docs/architecture.md](docs/architecture.md) for a migration guide.

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16 |
| UI Library | React | 19 |
| Styling | Tailwind CSS | 4 |
| Component primitives | Radix UI via shadcn/ui | Latest |
| Authentication | JSON Web Tokens (jsonwebtoken) | Latest |
| Password hashing | bcryptjs | Latest |
| Input validation | Zod | Latest |
| Unique identifiers | uuid v4 | 13 |
| Date utilities | date-fns | 4 |
| Icons | lucide-react | Latest |
| Toast notifications | Sonner | Latest |
| API documentation | JSDoc | 4 |
| Linting | ESLint with Next.js config | 9 |

---

## Project Structure

```
eventflow/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                   # Lint and build checks on every push
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/
│   ├── architecture.md              # In-depth architecture and design decisions
│   └── api.md                       # Full REST API reference
│
├── public/
│   └── events/                      # Static event images
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── categories/          # GET all, GET/PATCH/DELETE by id
│   │   │   ├── contact/             # POST contact form
│   │   │   ├── events/              # GET all, POST new, GET/PATCH/DELETE by id
│   │   │   ├── inscriptions/        # GET all, POST new, DELETE by id
│   │   │   ├── login/               # POST authenticate
│   │   │   ├── logout/              # POST clear session cookie
│   │   │   └── users/               # GET all, POST new, GET/PATCH/DELETE by id
│   │   ├── contact/                 # Contact page
│   │   ├── events/                  # Events listing, detail, and creation pages
│   │   ├── login/                   # Login page
│   │   ├── mentions-legales/        # Legal notice page
│   │   ├── users/                   # User profile pages
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── providers.jsx            # Root context providers wrapper
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui primitive components
│   │   ├── EventCard.jsx
│   │   ├── EventLine.jsx
│   │   ├── Footer.jsx
│   │   └── Header.jsx
│   │
│   ├── contexts/
│   │   ├── CategoriesContext.jsx
│   │   ├── EventsContext.jsx
│   │   ├── InscriptionsContext.jsx
│   │   ├── LoginContext.jsx
│   │   └── UsersContext.jsx
│   │
│   ├── data/                        # JSON data files (development/demo persistence)
│   │   ├── categories.json
│   │   ├── contacts.json
│   │   ├── events.json
│   │   ├── inscriptions.json
│   │   └── users.json
│   │
│   ├── hooks/
│   │   ├── useCategory.jsx
│   │   ├── useEvent.jsx
│   │   ├── useInscription.jsx
│   │   ├── useLogin.jsx
│   │   └── useUser.jsx
│   │
│   └── lib/
│       ├── auth.js                  # JWT sign, verify, cookie helpers
│       ├── rateLimit.js             # In-memory rate limiter for login
│       └── utils.js                 # Tailwind class merge utility
│
├── middleware.js                     # Next.js route protection middleware
├── .env.example                      # Environment variable template
├── .gitignore
├── components.json                   # shadcn/ui config
├── eslint.config.mjs
├── jsdoc.config.json
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── SECURITY.md
```

---

## Getting Started

### Prerequisites

Before starting, make sure you have the following installed on your machine.

- Node.js 20 or higher ([download](https://nodejs.org))
- npm 10 or higher (included with Node.js)
- Git ([download](https://git-scm.com))

You can check your installed versions with :

```bash
node --version
npm --version
git --version
```

### Step 1 : Clone the repository

```bash
git clone https://github.com/madjeek-web/eventflow.git
cd eventflow
```

### Step 2 : Install dependencies

```bash
npm install
```

This installs all packages listed in `package.json`, including Next.js, React, Tailwind CSS, bcryptjs, jsonwebtoken, Zod, and all UI components.

### Step 3 : Configure environment variables

Copy the example file and fill in your values.

```bash
cp .env.example .env.local
```

Open `.env.local` in a text editor and set at minimum the `JWT_SECRET` variable. See the [Environment Variables](#environment-variables) section for a full description of each variable.

### Step 4 : Seed the user passwords (first run only)

The included seed data uses plain-text passwords. Run the hashing script once to convert them to bcrypt hashes before starting the server.

```bash
node scripts/hash-passwords.js
```

This script reads `src/data/users.json`, hashes every `password` field in-place, and writes the updated file back. It is safe to run multiple times (it detects already-hashed passwords and skips them).

### Step 5 : Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The application is ready.

### Step 6 : Log in with a seed account

| Email | Password |
|---|---|
| gaelle.dupont-belamour@gmail.com | 123456 |
| jean-christophe.becherel@gmail.com | 123456 |

---

## Environment Variables

All secrets and configuration values are stored in environment variables, never hardcoded. The `.env.example` file documents every variable used by the application.

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | Yes | Secret key used to sign and verify JWT tokens. Use a random string of at least 64 characters |
| `JWT_EXPIRES_IN` | No | Token expiry duration. Default : `7d` |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window in milliseconds. Default : `900000` (15 minutes) |
| `RATE_LIMIT_MAX` | No | Maximum login attempts per window per IP. Default : `10` |
| `NODE_ENV` | No | Set to `production` when deploying. Enables secure cookie flags |

To generate a strong `JWT_SECRET` value, run this in your terminal :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## API Reference

Full API documentation is available in [docs/api.md](docs/api.md).

A summary of available endpoints follows.

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/login` | No | Authenticate and receive a session cookie |
| POST | `/api/logout` | No | Clear the session cookie |
| GET | `/api/events` | No | List all events |
| POST | `/api/events` | Yes | Create a new event |
| GET | `/api/events/:id` | No | Get a single event |
| PATCH | `/api/events/:id` | Yes | Update an event |
| DELETE | `/api/events/:id` | Yes | Delete an event |
| GET | `/api/inscriptions` | Yes | List all registrations |
| POST | `/api/inscriptions` | Yes | Register for an event |
| DELETE | `/api/inscriptions/:id` | Yes | Cancel a registration |
| GET | `/api/users` | Yes | List all users |
| POST | `/api/users` | No | Create a new user account |
| GET | `/api/users/:id` | Yes | Get a user profile |
| PATCH | `/api/users/:id` | Yes | Update a user profile |
| DELETE | `/api/users/:id` | Yes | Delete a user account |
| GET | `/api/categories` | No | List all categories |
| POST | `/api/contact` | No | Submit the contact form |

---

## Architecture

EventFlow uses the Next.js App Router with a clear separation between the presentation layer (React components), the state layer (Context + custom hooks), and the data layer (API routes + JSON files).

For a detailed explanation of each architectural decision, including the Context pattern, the custom hook hierarchy, the middleware flow, and the reasoning behind the JSON data layer, see [docs/architecture.md](docs/architecture.md).

### State management pattern

State is managed with React Context. There is one context per data domain (Events, Users, Inscriptions, Categories, Login). Each context handles its own fetching, caching, and mutation logic. Components never call `fetch` directly : they use the custom hooks exposed by each context.

```
Page component
    └── uses useEventsFiltered() hook
            └── reads from EventsContext
                    └── fetches from /api/events on mount
```

### Data flow on mutation

When a user creates an event, the flow is :

```
EventForm (component)
    -> addEvent() from useEvents() hook
        -> POST /api/events
            -> Zod validation
            -> auth check (JWT from cookie)
            -> read events.json
            -> append new event with uuid
            -> write events.json
            -> return 201 with new event
        -> EventsContext updates local state
    -> UI re-renders with new event in list
```

---

## Data Model

### Event

```json
{
    "id": "uuid-v4",
    "title": "string",
    "category": "number (category id)",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "location": "string",
    "description": "string",
    "maxParticipants": "number",
    "image": "string (public path)"
}
```

### User

```json
{
    "id": "uuid-v4",
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "password": "string (bcrypt hash)"
}
```

### Inscription

```json
{
    "id": "uuid-v4",
    "user": "user id",
    "event": "event id"
}
```

### Category

```json
{
    "id": "number",
    "name": "string",
    "color": "string (hex)"
}
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Development server | `npm run dev` | Starts Next.js on port 3000 with hot reload |
| Production build | `npm run build` | Compiles the application for production |
| Production server | `npm run start` | Serves the production build |
| Linter | `npm run lint` | Runs ESLint on all source files |
| API docs | `npm run docs` | Generates JSDoc HTML documentation in `docs/` |
| Hash passwords | `node scripts/hash-passwords.js` | Converts plain-text seed passwords to bcrypt hashes |

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for the process : how to open issues, how to fork and branch, code style expectations, and how to submit a pull request.

---

## FAQ

**Q : Can I use this project in production right now ?**

The authentication, validation, and security layers are production-grade. The main limitation is the JSON file data layer : it does not scale under concurrent writes and is not suitable for multi-instance deployments. For a real production workload, replace the `fs.readFile` / `fs.writeFile` calls in each API route with a database client. The architecture is designed so that this swap does not require changes anywhere else.

**Q : Why JSON files instead of a database ?**

It removes all external dependencies. Anyone can clone this repository and start the server in under two minutes without installing PostgreSQL, MySQL, or MongoDB. The API routes are structured so that the data access layer is isolated : migrating to a database only requires changing the read/write calls inside the API routes.

**Q : How does authentication work ?**

When a user logs in, the API verifies their password with bcrypt, then generates a signed JWT and sets it as an HTTP-only cookie. On every subsequent request to a protected route, the Next.js middleware reads that cookie, verifies the JWT signature and expiry, and either allows the request or redirects to the login page. The token never touches client-side JavaScript.

**Q : What is the difference between a Context and a hook in this project ?**

A Context holds the shared state and the logic to read from and write to the API. A custom hook is a thin, named interface that components use to access that state. For example, `EventsContext` contains the `events` array and the `addEvent` function. The `useEvents()` hook simply calls `useContext(EventsContext)`. The `useEvent(id)` hook goes one step further and memoizes the lookup of a single event from that array.

**Q : I see `useMemo` in the hooks. Why is it used ?**

`useMemo` caches the result of a computation and only recalculates when its declared dependencies change. In `useEventsFiltered`, the filter pipeline runs only when `events`, `categoryFilter`, `searchFilter`, or `includePastEvent` change. Without `useMemo`, the entire filter pipeline would run on every render of any parent component, even when the data had not changed.

**Q : Can I add a new category ?**

Yes. Open `src/data/categories.json` and add an object with a unique `id`, a `name`, and a `color` value. The application reads categories dynamically on every request, so no code change is needed.

**Q : How do I generate the API documentation ?**

Run `npm run docs`. This executes JSDoc with the configuration in `jsdoc.config.json` and outputs HTML files to the `docs/` folder. Open `docs/index.html` in a browser to browse the documentation.

**Q : The seed events have dates in the past. Is that a bug ?**

No. Some seed events intentionally have past dates to allow testing the date filter feature. The event list by default hides past events. Toggle the "Include past events" option to see them.

**Q : How do I run this on a server (e.g. a VPS) ?**

Build the application with `npm run build`, then start it with `npm run start`. For a more robust deployment, use a process manager like PM2 to keep the server running after terminal disconnect. Set `NODE_ENV=production` in your environment to enable secure cookie flags.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full history of changes.

---

## Security Policy

To report a security vulnerability, please read [SECURITY.md](SECURITY.md) before opening a public issue.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for the full text.

---

## Author

Fabien Conéjéro  
February 2026  
[https://github.com/madjeek-web](https://github.com/madjeek-web)
