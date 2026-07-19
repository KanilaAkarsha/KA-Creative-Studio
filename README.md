# KA Creative Studio

A production-ready React + Express conversion of the KA Creative Studio single-page
website. The original HTML/CSS/JS design is preserved pixel-for-pixel — colors,
spacing, typography, animations, and responsiveness are unchanged. The markup was
restructured into reusable, typed React components, and a real backend now powers
the contact form.

## Project Structure

```
ka-creative-studio/
├── frontend/          React 19 + Vite + TypeScript + Tailwind CSS
└── backend/           Node.js + Express + MongoDB + Mongoose + JWT
```

## Tech Stack

**Frontend:** React 19, Vite, TypeScript, Tailwind CSS, React Router DOM, Axios,
React Hook Form, Zod, Framer Motion, Lucide React, TanStack Query, Recharts,
Google Sign-In (`@react-oauth/google`)

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, Stripe,
Google Auth Library

## Getting Started

### 1. Backend

```bash
cd backend
cp .env .env   # then fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev             # starts on http://localhost:5000
```

Requires a running MongoDB instance (local or Atlas) at the URI you set in `.env`.

### 2. Seed sample data (products + an admin account)

```bash
cd backend
npm run seed
```

This creates the four shop products and one admin account so you have
something to log into the **Admin Dashboard** with, and something for
customers to purchase from the **Shop** section. It prints the admin
email/password to the console — change that password after your first login.

You can override the generated admin credentials by setting `ADMIN_EMAIL`,
`ADMIN_PASSWORD`, and `ADMIN_NAME` in `.env` before running the seed script.

### 3. Payments (Stripe)

Checkout is handled by **Stripe Checkout** (Stripe's hosted payment page —
card data never touches your server).

1. Create a free [Stripe](https://dashboard.stripe.com/register) account and
   grab your **test mode** secret key (Dashboard → Developers → API keys).
2. Add it to `backend/.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   ```
3. Forward webhook events to your local server with the
   [Stripe CLI](https://docs.stripe.com/stripe-cli):
   ```bash
   stripe login
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```
   This prints a `whsec_...` signing secret — add it to `backend/.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Restart the backend. Clicking "Buy" in the Shop section now redirects to a
   real Stripe Checkout page; on success, Stripe calls the webhook, which
   marks the order `completed` and unlocks the download in `/account`.

Use Stripe's [test card](https://docs.stripe.com/testing) `4242 4242 4242 4242`
with any future expiry date and any CVC to simulate a successful payment. In
production, use your live secret key and register a webhook endpoint in the
Stripe Dashboard pointing at your deployed `/api/payments/webhook` URL.

### 4. Google Sign-In

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials) →
   create an **OAuth 2.0 Client ID** of type "Web application".
2. Add authorized JavaScript origins: `http://localhost:5173` (and your
   production domain later).
3. Copy the generated client ID into **both**:
   - `backend/.env`: `GOOGLE_CLIENT_ID=...`
   - `frontend/.env`: `VITE_GOOGLE_CLIENT_ID=...`
4. Restart both servers. The "or continue with Google" button on `/login` and
   `/register` now works — new Google sign-ins are created as `customer`
   accounts automatically, and an existing email/password account is linked
   the first time someone signs in with the matching Google email.

### 5. Frontend

```bash
cd frontend
cp .env .env    # points at the backend API (defaults to /api via proxy)
npm install
npm run dev              # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so the
frontend and backend can run side by side without CORS configuration during
development.

### 6. Build for production

```bash
cd frontend
npm run build            # outputs static assets to frontend/dist
```

Deploy `frontend/dist` to any static host (Vercel, Netlify, S3 + CloudFront, etc.)
and the `backend/` folder to any Node host (Render, Railway, EC2, etc.), pointing
`VITE_API_URL` at your deployed API URL.

## Accounts, Roles & Dashboards

There are two roles:

- **`customer`** — created via public sign-up at `/register`, or automatically
  on first Google sign-in. Customers can view their purchases/downloads at
  `/account` and submit a review from the Testimonials section.
- **`admin`** — not self-registrable. Created via `npm run seed` (or directly
  in MongoDB, or by promoting an existing user from the Users tab). Admins are
  routed to `/admin`.

Each role can only reach its own dashboard — `/account` requires the
`customer` role and `/admin` requires `admin` (enforced both by the route
guard on the frontend and by `authorize()` middleware on the backend). Once
logged in, the navbar shows a role badge ("Customer" or "Admin") next to a
link to that user's dashboard. Deactivated accounts (see Users tab) are
blocked from logging in or making authenticated requests, even with a
previously issued token.

The **Admin Dashboard** has eight tabs:
- **Analytics** — revenue over the last 30 days, top products by revenue, and
  inquiries by service, backed by MongoDB aggregation and charted with Recharts.
- **Messages** — contact form submissions, with mark read / archive actions.
- **Orders** — every customer order with live payment status.
- **Reviews** — moderation queue for customer-submitted reviews (approve /
  reject / delete). Only `approved` reviews appear in the public Testimonials
  section.
- **Users** — every account, with controls to promote/demote role,
  activate/deactivate, and delete (an admin can't modify or delete their own
  account from here, as a safety rail).
- **Projects** — full CRUD over the portfolio shown in "Featured Works" and
  `/projects`, including a "featured on homepage" toggle and large/normal
  spotlight layout.
- **Services** — full CRUD over the Services section, including the icon and
  accent color shown on each card.
- **Products** — full CRUD over the Shop catalog (the "delete" action
  deactivates a product rather than hard-deleting it, so existing customer
  orders/downloads stay intact).

The public site pulls all of the above from the backend at runtime (Services,
Portfolio/Projects, Shop, Testimonials), falling back to the bundled static
data in `frontend/src/data/` if the API is unreachable — so the site still
renders something reasonable if you're working on the frontend without the
backend running.

The **Shop** section on the homepage is wired to the live `/api/products`
catalog. Clicking the `+` button on a product:
- Prompts login if you're not signed in.
- Redirects to Stripe Checkout if you are. On successful payment you're
  brought back to `/account`, where the order shows as "processing" until the
  webhook confirms it (usually a couple of seconds), then flips to a
  downloadable state.

The **Testimonials** section shows approved reviews and includes a "Write a
Review" button. Logged-out visitors are sent to `/login`; logged-in customers
get a star-rating + comment form. New reviews start as `pending` and only
appear publicly once an admin approves them from the Reviews tab.

## Key Architecture Decisions

- **Component-driven design** — every section of the original single HTML file
  (Hero, Services, Portfolio, Shop, About, Stats, Testimonials, CTA, Contact,
  Navbar, Footer) is its own component under `frontend/src/components`.
- **Data-driven content** — repeated content (services, portfolio items, shop
  products, testimonials, stats, skills) lives in `frontend/src/data` as typed
  arrays, so the same card/section component renders every entry — no duplicated
  markup.
- **Custom hooks replace inline `<script>` logic** — `useReveal` (scroll reveal),
  `useSkillBar` (animated skill bars), `useCounter` (count-up stats),
  `useScrollSpy` (active nav link), and `useScrollPosition` (navbar glass effect /
  back-to-top visibility) reproduce the original vanilla-JS behavior idiomatically
  in React.
- **Theme & toast as context** — `ThemeContext` and `ToastContext` replace the
  original global `document.documentElement.classList` toggling and manual DOM
  toast injection.
- **Contact form** — validated client-side with `react-hook-form` + `zod`,
  submitted with `axios` via a `@tanstack/react-query` mutation, and persisted
  server-side in MongoDB through a rate-limited, validated Express endpoint.
- **All original CSS preserved** — every custom class (`.glass`, `.gradient-text`,
  `.gradient-border`, `.btn-glow`, `.card-hover`, `.portfolio-overlay`,
  `.service-icon`, `.nav-link`, `.mobile-menu`, `.skill-bar-fill`, `.cursor-glow`,
  etc.) lives in `frontend/src/index.css`, unchanged from the source file, and the
  Tailwind config reproduces the original custom theme (colors, fonts, border
  radii, keyframe animations) exactly.

## API Endpoints

| Method | Route                       | Access         | Description                              |
|--------|-----------------------------|----------------|-------------------------------------------|
| POST   | `/api/auth/register`        | Public         | Register a customer account               |
| POST   | `/api/auth/login`           | Public         | Log in and receive a JWT                  |
| POST   | `/api/auth/google`          | Public         | Log in or sign up with a Google ID token  |
| GET    | `/api/auth/me`              | Private        | Get the current authenticated user        |
| POST   | `/api/contact`              | Public         | Submit the contact form                   |
| GET    | `/api/contact`              | Private (admin)| List contact submissions                  |
| PATCH  | `/api/contact/:id`          | Private (admin)| Update a submission's status              |
| GET    | `/api/products`             | Public         | List active shop products                 |
| GET    | `/api/products/:id`         | Public         | Get a single product                      |
| POST   | `/api/products`             | Private (admin)| Create a product                          |
| PUT    | `/api/products/:id`         | Private (admin)| Update a product                          |
| DELETE | `/api/products/:id`         | Private (admin)| Deactivate a product                      |
| POST   | `/api/payments/create-checkout-session` | Private | Start a Stripe Checkout session for a product |
| POST   | `/api/payments/webhook`     | Public (Stripe)| Stripe webhook — confirms/fails payments  |
| GET    | `/api/orders/me`            | Private        | Get the logged-in customer's orders       |
| GET    | `/api/orders/:id/download`  | Private        | Get a download link for a completed order |
| GET    | `/api/orders`               | Private (admin)| List all orders                           |
| GET    | `/api/analytics/overview`   | Private (admin)| Revenue, orders, and contact analytics    |
| GET    | `/api/users`                | Private (admin)| List all users                            |
| PATCH  | `/api/users/:id`            | Private (admin)| Update a user's role / active status      |
| DELETE | `/api/users/:id`            | Private (admin)| Delete a user                             |
| GET    | `/api/projects`             | Public         | List active portfolio projects            |
| POST   | `/api/projects`             | Private (admin)| Create a project                          |
| PUT    | `/api/projects/:id`         | Private (admin)| Update a project                          |
| DELETE | `/api/projects/:id`         | Private (admin)| Delete a project                          |
| GET    | `/api/services`             | Public         | List active services                      |
| GET    | `/api/services/meta`        | Public         | Get allowed icon/color keys for the admin form |
| POST   | `/api/services`             | Private (admin)| Create a service                          |
| PUT    | `/api/services/:id`         | Private (admin)| Update a service                          |
| DELETE | `/api/services/:id`         | Private (admin)| Delete a service                          |
| GET    | `/api/reviews`              | Public         | List approved reviews                     |
| POST   | `/api/reviews`               | Private        | Submit a review (goes to "pending")       |
| GET    | `/api/reviews/all`          | Private (admin)| List all reviews regardless of status     |
| PATCH  | `/api/reviews/:id`          | Private (admin)| Approve / reject a review                 |
| DELETE | `/api/reviews/:id`          | Private (admin)| Delete a review                           |

"Private" routes require an `Authorization: Bearer <token>` header.
