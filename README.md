# BanksBuddy 🏦

> A digital-first financial platform bridging borrowers and authorized lending partners across India.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel)](https://banksbuddy.in)

---

## 🏢 Company Profile

|                  |                                                 |
| ---------------- | ----------------------------------------------- |
| **Company**      | BanksBuddy (a product of **Quintox**)           |
| **Industry**     | Fintech / Financial Services Intermediary       |
| **Headquarters** | India (Pan-India operations)                    |
| **Reach**        | 500+ cities · 20,000+ pin codes                 |
| **Network**      | 250+ Lending Partners · 100+ Financial Advisors |
| **Live URL**     | [banksbuddy.in](https://banksbuddy.in)          |
| **Support**      | WhatsApp · Web Consultation Form                |

BanksBuddy is a trusted financial services partner dedicated to empowering individuals and businesses across India with smart, accessible, and tailored financial solutions. Established with a vision to simplify finance for everyone, BanksBuddy bridges the gap between customers and financial opportunities — whether it's loans, insurance, credit improvement, or business financial services.

### 📋 Services at a Glance

| Service                        | Description                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| 🏠 **Home Loan**               | Affordable housing finance to help you own your dream home                           |
| 💼 **Business Loan**           | Flexible funding for startups, expansion, and operations                             |
| 👤 **Personal Loan**           | Quick, hassle-free loans for personal financial needs                                |
| 🎓 **Education Loan**          | Financing tuition, living expenses, and study materials                              |
| 🚗 **Auto Loan**               | Vehicle loans for individuals at competitive rates                                   |
| 🏗️ **Machinery Loan**          | Equipment financing for industrial and manufacturing sectors                         |
| 🏦 **Loan Against Property**   | Unlock the value of your assets at lower interest rates                              |
| 📊 **CIBIL Score Improvement** | End-to-end credit repair across all 4 major bureaus (CIBIL, Equifax, Experian, CRIF) |
| 🛡️ **Insurance Assistance**    | Guidance on selecting and managing the right insurance plans                         |
| 📑 **Tax Services**            | Tax consultation and filing support for individuals and businesses                   |
| 💻 **Website Development**     | Digital transformation solutions for businesses                                      |

## � What is BanksBuddy?

**BanksBuddy** is a comprehensive fintech platform built for individuals and businesses across India who need fast, transparent, and personalized access to financial products. It acts as a **smart intermediary** — connecting customers to the right loan products, insurance plans, and credit services through a network of **250+ lending partners** and **100+ financial advisors**.

### The Problem It Solves

Getting a loan or improving a CIBIL score in India involves navigating opaque processes, inconsistent documentation requirements, and no clear point of contact. Most people either overpay due to lack of information or get rejected without understanding why.

**BanksBuddy fixes this by:**

- Making financial services **accessible, transparent, and guided** through a clean digital interface
- Providing **expert consultation** before commitment — free of charge
- Handling **CIBIL score improvement** end-to-end: from credit report analysis to dispute resolution
- Connecting businesses to the right **loan type and lender** based on their profile
- Offering a **WhatsApp-first support channel** alongside the web platform

### How It Works

```
Customer visits banksbuddy.in
        │
        ├── Browses loan/insurance/CIBIL services
        │         │
        │         └── Selects a service → Views features, documents needed, eligibility
        │
        ├── Books a free consultation (form → Firebase → admin notified)
        │
        ├── For CIBIL: Registers account → Pays via Cashfree → Admin processes report
        │         │
        │         └── Admin dashboard tracks CIBIL requests, notifications, revenue
        │
        └── For loans: Fills consultation form → BanksBuddy team matches with partners
```

---

## 🏗️ Technical Architecture

BanksBuddy is a **monorepo** with a React SPA frontend and a serverless Hono.js API backend, both deployed to **Vercel**.

### Frontend

- **React 19** with functional components and hooks throughout
- **React Router 7** for client-side routing with public/private/admin route guards
- **Framer Motion** for scroll-triggered and entrance animations on every page section
- **`AuthContext`** (React Context + Firebase Auth) provides authentication state app-wide
- **`apiFetch`** utility in `src/lib/` wraps all backend calls with base URL resolution and error handling
- **Recharts** for revenue and analytics charts in the admin dashboard
- **React Slick** carousel for responsive partner showcases and service carousels
- **React Fast Marquee** for the homepage bank logo ticker strip
- **React Helmet Async** for dynamic per-page SEO meta tags

### Backend (API)

- **Hono.js** running as Vercel **Edge Functions** (`api/index.js`) — zero cold start, global CDN
- A single file handles all REST routes using a DRY collection loop for standard CRUD (consultations, reviews, offers, team, careers, partners, CIBIL requests, revenue, notifications)
- **Firebase Realtime Database** accessed directly via REST (`fetch` to `.json` endpoints) with a shared admin secret — no Firebase SDK on the server
- **Cashfree Payment Gateway** integration: order creation → redirect → payment verification → DB status update
- **CORS** configured explicitly for `banksbuddy.in`, `banksbuddy.vercel.app`, and `localhost:5173`
- GNews API proxied server-side to keep the API key hidden from the browser

### Data Flow — CIBIL Payment

```
User clicks "Pay Now"
    → POST /api/payment/create-order
        → Firebase: creates cibil_requests entry (status: pending)
        → Cashfree: creates order, returns payment_session_id
    → Frontend: opens Cashfree checkout
    → User pays → redirected back with order_id + request_id
    → POST /api/payment/verify
        → Cashfree: confirms PAID status
        → Firebase: updates cibil_requests[id].status = "paid"
        → Firebase: updates users[uid].cibilPaid = true
    → Frontend shows "Get a Report" button
```

### Auth & Access Control

- **Firebase Authentication** (Email/Password) manages user sessions
- `AuthContext` exposes `currentUser` globally; components conditionally render based on login state
- `PrivateRoute` — redirects unauthenticated users to `/login`
- `AdminRoute` — additional check for admin role, redirects non-admins

---

## ⚙️ Tech Stack

| Layer           | Technology                                        |
| --------------- | ------------------------------------------------- |
| **Frontend**    | React 19, Vite 7, React Router 7, Framer Motion   |
| **Backend API** | Hono.js (serverless Edge runtime, runs on Vercel) |
| **Database**    | Firebase Realtime Database                        |
| **Auth**        | Firebase Authentication                           |
| **Payments**    | Cashfree Payment Gateway                          |
| **Charts**      | Recharts                                          |
| **Carousel**    | React Slick / Slick Carousel                      |
| **News Feed**   | GNews API                                         |
| **Deployment**  | Vercel                                            |

---

## 📂 Project Structure

```
banksbuddy/
├── api/
│   └── index.js          # Hono.js unified REST API (Edge runtime)
├── public/
│   └── part/             # 84 partner logo images (png, webp, svg, jpg)
├── src/
│   ├── components/       # All UI components and page views
│   ├── context/          # AuthContext (Firebase Auth)
│   ├── lib/              # API fetch helper (apiFetch)
│   ├── Route.jsx         # All app routes
│   └── App.jsx           # Root app component
├── index.html
├── vite.config.js
└── package.json
```

---

## 🌐 Pages & Routes

| Route                    | Component              | Access           |
| ------------------------ | ---------------------- | ---------------- |
| `/`                      | `Hero`                 | Public           |
| `/services`              | `MainServices`         | Public           |
| `/services/:slug`        | `ServicePage`          | Public           |
| `/cibil`                 | `Cibil`                | Public           |
| `/insurance-assistance`  | `Insurance`            | Public           |
| `/insurance/:category`   | `InsuranceSubCategory` | Public           |
| `/cibil-score-check`     | `CibilScoreCheck`      | Public           |
| `/tax-services`          | `ServicePage`          | Public           |
| `/website-development`   | `ServicePage`          | Public           |
| `/emi-calculator`        | `EMI`                  | Public           |
| `/trusted-partner`       | `TrustedPartner`       | Public           |
| `/careers`               | `Careers`              | Public           |
| `/about-us`              | `About`                | Public           |
| `/contact-banksbuddy`    | `ConsulatationForm`    | Public           |
| `/partner-application`   | `PartnerForm`          | Public           |
| `/consultation`          | `ConsulatationForm`    | Public           |
| `/login`                 | `Login`                | Public           |
| `/signup`                | `Signup`               | Public           |
| `/credit-dashboard`      | `Credit`               | 🔒 Auth Required |
| `/admin`                 | `Admin`                | 🔒 Admin Only    |
| `/admin-table`           | `AdminTable`           | Admin            |
| `/admin-reviews`         | `AdminReviews`         | Admin            |
| `/admin-offers`          | `AdminOffers`          | Admin            |
| `/admin-team`            | `AdminTeam`            | Admin            |
| `/admin-policy-reminder` | `AdminPolicyReminder`  | Admin            |
| `/admin-career`          | `AddCareer`            | Admin            |

---

## 🛠️ Services Offered

- **Personal Loan** – Flexible loans for personal financial needs
- **Business Loan** – Funding for startups and growing businesses
- **Home Loan** – Affordable housing finance solutions
- **Education Loan** – Financing for academic needs
- **Machinery Loan** – Equipment financing for industrial sectors
- **Auto Loan** – Vehicle loans for individuals
- **Loan Against Property** – Leverage property assets for credit
- **CIBIL Score Improvement** – Expert credit analysis, dispute resolution, and score enhancement
- **Insurance Assistance** – Help selecting and managing insurance policies
- **Tax Services** – Tax consultation and filing support
- **Website Development** – Digital solutions for businesses

---

## 🔌 Backend API (Hono.js – Edge Runtime)

The API runs at `/api/*` and is deployed as Vercel Edge Functions.

### Core Endpoints

| Method                | Endpoint                     | Description                     |
| --------------------- | ---------------------------- | ------------------------------- |
| `GET`                 | `/api`                       | Health check                    |
| `GET`                 | `/api/stats`                 | Dashboard statistics            |
| `GET/POST/PUT/DELETE` | `/api/consultations`         | Consultation form submissions   |
| `GET/POST/PUT/DELETE` | `/api/reviews`               | Customer reviews                |
| `GET/POST/PUT/DELETE` | `/api/offers`                | Promotional offers              |
| `GET/POST/PUT/DELETE` | `/api/team`                  | Team members                    |
| `GET/POST/PUT/DELETE` | `/api/careers`               | Job listings                    |
| `GET/POST/PUT/DELETE` | `/api/policies`              | Policy reminders                |
| `GET/POST/PUT/DELETE` | `/api/partners`              | Partner applications            |
| `GET/POST/PUT/DELETE` | `/api/cibil-requests`        | CIBIL service requests          |
| `GET/POST/PUT/DELETE` | `/api/cibil-notifications`   | CIBIL notifications             |
| `GET/POST/PUT/DELETE` | `/api/revenue/manual`        | Manual revenue records          |
| `GET`                 | `/api/news`                  | Finance news (GNews API proxy)  |
| `POST`                | `/api/payment/create-order`  | Create Cashfree payment order   |
| `POST`                | `/api/payment/verify`        | Verify payment and mark as paid |
| `GET`                 | `/api/payment/status/:email` | Check user payment status       |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Firebase project with Realtime Database enabled
- Cashfree merchant account (for payments)
- GNews API key (for news feed)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/banksbuddy.git
cd banksbuddy

# Install dependencies
bun install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_DATABASE_URL=
FIREBASE_DATABASE_URL=
FIREBASE_DATABASE_SECRET=

# Cashfree
VITE_CASHFREE_APP_ID=
VITE_CASHFREE_SECRET_KEY=
VITE_CASHFREE_API_ENV=production   # or sandbox

# News
VITE_GNEWS_API_KEY=
GNEWS_API_KEY=

# API
VITE_API_URL=http://localhost:3000
```

### Running Locally

```bash
# Run both frontend (Vite) and backend (Hono) concurrently
bun dev

# Frontend only
bun run dev:frontend

# Backend only
bun run dev:backend
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:3000`.

### Building for Production

```bash
bun run build
```

---

## 🧑‍💼 Admin Dashboard

Protected under `/admin` (admin role required via Firebase Auth custom claims). Features include:

- 📊 Revenue analytics (Cashfree + manual) with Recharts
- 📋 Consultation & CIBIL request management
- ⭐ Review moderation
- 📣 Promotional offer management
- 👥 Team management
- 🔔 CIBIL notification system
- 🗓️ Policy reminder tracking
- 🤝 Partner application management

---

## 🤝 Partner Program

BanksBuddy operates across **500+ cities** and **20,000+ pin codes** across India. Financial institutions, DSAs, and fintechs can apply at `/partner-application` to become a trusted partner.

---

## 📄 License

_BanksBuddy is a product of Quintox. All rights reserved._
