# 🛍️ CavSulit — CVSU Campus Marketplace
### ITEC Group 3 · Cavite State University · 2026

> *"The campus is your market. CavSulit is your store."*
> *"Your hustle deserves to be seen."*
> *"Stop being the campus's best kept secret."*

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Why CavSulit Exists](#why-cavsulit-exists)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Build Process — Phase by Phase](#build-process--phase-by-phase)
6. [Database Setup](#database-setup)
7. [Running Locally](#running-locally)
8. [Deployment](#deployment)
9. [API Endpoints](#api-endpoints)
10. [Features](#features)
11. [Known Bugs & Planned Fixes](#known-bugs--planned-fixes)
12. [Problems Encountered During Development](#problems-encountered-during-development)
13. [Security Layers](#security-layers)
14. [Contributors](#contributors)

---

## Project Overview

CavSulit is a free campus marketplace built for every student, instructor, and member of the CvSU community who has something to offer but nowhere to show it. Behind every hallway and classroom are talented entrepreneurs, freelancers, and small business owners whose potential is simply being held back by the lack of a platform. CavSulit bridges that gap — giving everyone inside CvSU a space to promote their products, services, and hustles while helping the community discover, support, and connect with the local talent already surrounding them. Because growth shouldn't depend on where you stand — it should depend on what you offer. The campus is your market. CavSulit is your store.

**Live URL:** https://cav-sulit.vercel.app

**GitHub Repository:** https://github.com/perthcantcode/CavSulit

---

## Why CavSulit Exists

We find that some students have the potential to grow and bloom but they are just in the wrong place and they don't have the platform to promote their goods, products, and services. CavSulit was built to:

- Help students, instructors, and all CvSU community members promote their business, small business, freelance services, or offers
- Help the community engage and support local products inside CvSU
- Broaden the connection between students in CvSU
- Level up the transaction of businesses in a free and accessible way
- Give small businesses and hustlers a real stage — not just a 24-hour story post

The platform covers the core functions of:

- **Browse** — discover shops by product category or college building
- **Message** — talk directly to sellers inside the app
- **Locate** — see the exact campus stall location on a map
- **Rate** — leave star ratings after buying to help trustworthy sellers grow

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Javascript + React + Typescript |
| Styling | Tailwind CSS + Outfit + Plus Jakarta Sans (Google Fonts) |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | MySQL + Sequelize ORM |
| Authentication | JWT (JSON Web Tokens) + bcryptjs |
| Real-time Messaging | Socket.io |
| Image Storage | Cloudinary (free tier) |
| File Uploads | Multer + multer-storage-cloudinary |
| Backend Hosting | Render.com (free tier) |
| Database Hosting | Railway.app (MySQL cloud) |
| Frontend Hosting | Vercel (free tier) |

---

## Folder Structure

```
CavSulit/
│
├── backend/                          ← Node.js + Express API Server
│   ├── config/
│   │   └── db.config.js              ← MySQL Sequelize connection setup
│   ├── middleware/
│   │   ├── auth.js                   ← JWT token guard (protects routes)
│   │   └── upload.js                 ← Multer + Cloudinary image upload handler
│   ├── models/
│   │   └── index.js                  ← All 8 database table definitions + associations
│   ├── routes/
│   │   ├── auth.routes.js            ← Register, Login, Get/Update profile
│   │   ├── shop.routes.js            ← Browse, Create, Edit, Delete shops
│   │   ├── product.routes.js         ← Add, Edit, Delete products inside shops
│   │   ├── review.routes.js          ← Leave, Get, Delete reviews
│   │   ├── message.routes.js         ← Send and fetch messages
│   │   ├── wishlist.routes.js        ← Save and unsave shops
│   │   ├── preorder.routes.js        ← Submit and manage pre-orders
│   │   └── analytics.routes.js       ← Track and retrieve shop view/click data
│   ├── uploads/                      ← Temporary local uploads (auto-created)
│   ├── .env                          ← Environment variables (never commit this)
│   ├── package.json
│   └── server.js                     ← Express app entry point + Socket.io
│
└── frontend/                         ← React + TypeScript + Tailwind UI
    ├── src/
    │   ├── components/
    │   │   ├── Layout.tsx             ← Navbar + Footer wrapper
    │   │   └── ShopCard.tsx           ← Reusable shop listing card
    │   ├── context/
    │   │   └── AuthContext.tsx        ← Global login/logout state management
    │   ├── pages/
    │   │   ├── Landing.tsx            ← Homepage with hero, features, shop listings
    │   │   ├── Browse.tsx             ← Browse + filter by product type or college
    │   │   ├── ShopDetails.tsx        ← Single shop view + reviews + pre-order
    │   │   ├── PostShop.tsx           ← Create new shop form with photo upload
    │   │   ├── MyShop.tsx             ← Seller dashboard + analytics
    │   │   ├── Messages.tsx           ← Chat inbox + pre-order form in chat
    │   │   ├── Wishlist.tsx           ← Saved shops list
    │   │   ├── VerifiedBadge.tsx      ← CvSU Verified badge info and levels
    │   │   └── Auth.tsx               ← Login + Register pages
    │   ├── utils/
    │   │   ├── api.ts                 ← Axios instance with JWT interceptor
    │   │   └── helpers.ts             ← Constants, badge labels, category icons
    │   ├── App.tsx                    ← Main router with all page routes
    │   ├── index.tsx                  ← React DOM render entry point
    │   └── index.css                  ← Tailwind imports + global styles
    ├── public/
    ├── tailwind.config.js             ← CavSulit green theme + custom colors
    ├── vite.config.ts                 ← Vite config + API proxy to backend
    ├── tsconfig.json
    ├── vercel.json                    ← Vercel routing fix for React Router
    └── package.json
```

---

## Build Process — Phase by Phase

This section documents how CavSulit was built from scratch, phase by phase. This is intended for groupmates who want to understand the technical process of building a full-stack web application.

---

### Phase 1 — Foundation (Project Setup)

**What we did:**
The very first step was setting up the project folder structure and making sure the development environment was ready. This includes installing the tools that the project depends on.

**Tools installed:**
- Node.js v18+ from nodejs.org — required to run JavaScript outside of the browser
- MySQL Community Server — the database that stores all app data
- MySQL Workbench — a visual tool for managing the database
- Git — for version control and uploading code to GitHub
- VS Code — code editor used throughout the project

**Files created in Phase 1:**
- `backend/server.js` — the main entry point for the backend server
- `backend/config/db.config.js` — the file that connects the server to MySQL
- `backend/.env` — stores sensitive information like database passwords and secret keys
- `backend/package.json` — lists all the Node.js packages the backend needs

**How the backend server works:**
The backend is built with Express.js, which is a framework that makes it easy to create API routes. When someone visits a URL like `/api/shops`, Express handles that request, talks to the database, and sends back the data as JSON. The server listens on port 5000 locally and port 8080 or 10000 when deployed.

**What Sequelize does:**
Sequelize is an ORM — Object Relational Mapper. Instead of writing raw SQL queries like `SELECT * FROM users`, we write JavaScript code like `User.findAll()` and Sequelize translates it into SQL automatically. This also protects against SQL injection attacks.

**Key concept — environment variables:**
Sensitive information like database passwords, JWT secrets, and API keys are never written directly in the code. They are stored in a file called `.env` which is excluded from GitHub using `.gitignore`. The code reads these values using `process.env.VARIABLE_NAME`.

---

### Phase 2 — Authentication (Login System)

**What we did:**
Built the entire user account system — registration, login, and session management.

**Files created in Phase 2:**
- `backend/models/index.js` (User model) — defines the users database table
- `backend/routes/auth.routes.js` — handles register, login, and profile endpoints
- `backend/middleware/auth.js` — a guard that checks if a user is logged in before allowing access to protected routes
- `frontend/src/pages/Auth.tsx` — the Register and Login pages
- `frontend/src/context/AuthContext.tsx` — stores the current user's login state globally

**How registration works:**
1. User fills in the form with name, email, password, student ID, department
2. Frontend sends a POST request to `/api/auth/register`
3. Backend checks if the email already exists
4. If the email ends in `@cvsu.edu.ph` AND a student ID is provided, the account automatically gets the CvSU Verified badge
5. The password is hashed using bcrypt — it is never stored as plain text
6. A JWT token is generated and sent back to the frontend
7. The frontend stores the token in localStorage and keeps the user logged in

**How login works:**
1. User enters email and password
2. Backend finds the user by email
3. bcrypt compares the entered password against the stored hash
4. If they match, a new JWT token is issued
5. If not, an error is returned

**What JWT means:**
JWT stands for JSON Web Token. It is a secure string that proves who the user is. Every time the frontend makes a request to a protected route, it includes the JWT in the request header. The backend verifies the token and if it is valid, allows the request to proceed. Tokens expire after 30 days for security.

**What bcrypt means:**
bcrypt is a one-way password hashing function. It takes a plain text password and scrambles it into a long string. This process cannot be reversed. Even the database owner cannot see what the original password was. When a user logs in, bcrypt hashes what they typed and compares it to the stored hash — if they match, login succeeds.

**Badge levels in the system:**

| Badge | Requirement |
|---|---|
| No badge | Registered with any email |
| ★ CvSU Verified | Registered with @cvsu.edu.ph email + student ID |
| ★★ Trusted | 10+ positive reviews (future implementation) |
| ★★★ Top Seller | 50+ transactions (future implementation) |

---

### Phase 3 — Core Feature: Shops (The Heart of CavSulit)

**What we did:**
Built the main feature of the app — creating, browsing, and managing shops.

**Files created in Phase 3:**
- `backend/models/index.js` (Shop + Product models)
- `backend/routes/shop.routes.js` — full CRUD with filters
- `backend/routes/product.routes.js` — add, edit, delete products
- `frontend/src/pages/Browse.tsx` — the browse page with dual filter system
- `frontend/src/pages/PostShop.tsx` — the create shop form
- `frontend/src/pages/MyShop.tsx` — seller dashboard
- `frontend/src/components/ShopCard.tsx` — reusable card component

**Database tables created:**
- `shops` — stores shop listings (name, description, category, college, location, photos)
- `products` — stores individual items inside each shop (name, price, availability)

**How browsing works:**
The browse page sends a GET request to `/api/shops` with optional query parameters:
- `?category=food` — filter by product type
- `?college=CEIT` — filter by college building
- `?search=milk` — search by shop name
- `?sort=popular` — sort by most views
- `?page=2&limit=8` — pagination

**How the dual filter system works:**
The Browse page has two tabs — By Product and By College. Selecting By Product shows category pills like Food, Drinks, Merch, Accessories. Selecting By College shows pills for CEIT, CON, CEMDS, COE, CAS, and other campus locations. Both filters can be used together with the search bar.

**How image uploads work:**
When a seller posts a shop, they can upload up to 5 photos. The photos are sent to the backend using multipart/form-data. The backend uses Multer to handle the upload and then sends the image to Cloudinary — a free cloud image hosting service. Cloudinary returns a permanent URL that is stored in the database. This is why images persist even when the server restarts.

---

### Phase 4 — Shop Detail, Map, Reviews, Pre-Order

**What we did:**
Built the individual shop page that buyers see when they click on a shop card.

**Files created:**
- `frontend/src/pages/ShopDetails.tsx`
- `backend/routes/review.routes.js`
- `backend/routes/preorder.routes.js`

**Features on the shop detail page:**
- Full shop photos and description
- Products with prices
- Star rating display (average of all reviews)
- Seller information card with contact number
- Map location link (opens Google Maps)
- Message Seller button (opens Messages page with that seller pre-selected)
- Pre-Order tab with a form to specify items, pickup time, and location note
- Reviews tab where buyers can leave a star rating and written comment

**How reviews work:**
Each user can only leave one review per shop. After submitting a review, the backend recalculates the average star rating and updates it in real time. The review appears immediately in the list below the rating breakdown.

---

### Phase 5 — Messaging and Pre-Order

**What we did:**
Built the messaging system so buyers and sellers can talk directly inside the app.

**Files created:**
- `backend/routes/message.routes.js`
- `frontend/src/pages/Messages.tsx`
- `backend/server.js` (Socket.io integration)

**How messaging works:**
The Messages page has a two-panel layout — a sidebar with all conversations and a chat area on the right. Messages are sent as POST requests to `/api/messages`. The frontend polls for new messages every 3 seconds to simulate real-time updates. Socket.io is also integrated for true real-time delivery.

**How pre-order in chat works:**
Inside the chat, there is a Pre-Order button in the header. Clicking it opens a form inside the chat where the buyer specifies what they want to order, pickup time, and pickup location. When submitted, it sends a pre-order record to the database and also sends a formatted message to the chat so both parties can see the request.

---

### Phase 6 — Wishlist, Analytics, Badge System

**What we did:**
Added the remaining enhancement features — saving shops, tracking shop performance, and showing badge levels.

**Files created:**
- `backend/routes/wishlist.routes.js`
- `backend/routes/analytics.routes.js`
- `frontend/src/pages/Wishlist.tsx`
- `frontend/src/pages/VerifiedBadge.tsx`

**How wishlist works:**
Every shop card has a heart button. Clicking it sends a POST request to `/api/wishlist/:shopId`. If the shop is not yet saved, it saves it. If it is already saved, it unsaves it (toggle). The Wishlist page shows all saved shops for the current user.

**How analytics works:**
Every time someone visits a shop page, the backend increments the view counter on that shop. The analytics route also groups views by date for the past 7 days to generate the weekly bar chart. Sellers can see total views, total profile clicks, and total messages received for each of their shops.

---

## Database Setup

### Step 1 — Install MySQL

Download MySQL Community Server from mysql.com/downloads and install it with all default settings. Set a root password during installation and write it down.

### Step 2 — Create the database

Open MySQL Workbench, connect to your local instance, and run this in the query area:

```sql
CREATE DATABASE cavsulit_db;
```

### Step 3 — The tables are created automatically

When you start the backend server for the first time, Sequelize reads all the model definitions and creates all 8 tables automatically. You do not need to write any SQL for the tables.

### Tables created automatically

| Table | What it stores |
|---|---|
| users | All registered accounts |
| shops | Shop listings with location, category, college |
| products | Items inside each shop with prices |
| reviews | Star ratings and comments from buyers |
| messages | Chat messages between users |
| preorders | Pre-order requests submitted through chat |
| wishlists | Saved shops per user |
| analytics | View and click events per shop |

---

## Running Locally

### Requirements

- Node.js v18 or higher
- MySQL 8.0 or higher

### Step 1 — Configure the backend

Open `CavSulit/backend/.env` and fill in your MySQL password:

```
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_NAME=cavsulit_db
DB_USER=root
DB_PASS=your_mysql_password_here

JWT_SECRET=cavsulit_super_secret_key_2026
JWT_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Step 2 — Start the backend

Open a terminal and run:

```bash
cd CavSulit/backend
npm install
npm run dev
```

You should see:
```
✅ MySQL connected
✅ Database synced
✅ Server on http://localhost:5000
```

### Step 3 — Start the frontend

Open a second terminal and run:

```bash
cd CavSulit/frontend
npm install
npm run dev
```

Open your browser and go to `http://localhost:5173`

---

## Deployment

The app is deployed across three platforms:

| Component | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://cav-sulit.vercel.app |
| Backend API | Render.com | https://cavsulit-backend.onrender.com |
| MySQL Database | Railway.app | (internal connection) |
| Images | Cloudinary | (cloud storage) |

### Important note about Render free tier

Render's free tier spins down the backend after 15 minutes of inactivity. The first request after inactivity may take 30 to 50 seconds to respond while the server wakes up. This is normal behavior and can be fixed by upgrading to a paid plan or using an uptime monitoring service to ping the server regularly.

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /api/auth/register | Create account | No |
| POST | /api/auth/login | Login, get JWT token | No |
| GET | /api/auth/me | Get current user | Yes |
| PUT | /api/auth/me | Update profile | Yes |
| GET | /api/shops | Browse shops with filters | No |
| GET | /api/shops/mine | Get my shops | Yes |
| GET | /api/shops/:id | Get one shop | No |
| POST | /api/shops | Create a shop | Yes |
| PUT | /api/shops/:id | Edit a shop | Yes |
| DELETE | /api/shops/:id | Delete a shop | Yes |
| POST | /api/products | Add product to shop | Yes |
| PUT | /api/products/:id | Edit product | Yes |
| DELETE | /api/products/:id | Delete product | Yes |
| GET | /api/reviews/:shopId | Get reviews for a shop | No |
| POST | /api/reviews | Leave a review | Yes |
| DELETE | /api/reviews/:id | Delete my review | Yes |
| GET | /api/messages/conversations | My conversation list | Yes |
| GET | /api/messages/:partnerId | Chat with one person | Yes |
| POST | /api/messages | Send a message | Yes |
| GET | /api/wishlist | My saved shops | Yes |
| POST | /api/wishlist/:shopId | Toggle save/unsave | Yes |
| POST | /api/preorders | Submit a pre-order | Yes |
| GET | /api/preorders/mine | My pre-orders as buyer | Yes |
| GET | /api/preorders/shop/:shopId | Pre-orders for my shop | Yes |
| PUT | /api/preorders/:id/status | Confirm or cancel order | Yes |
| POST | /api/analytics/track | Track view or click | No |
| GET | /api/analytics/:shopId | Get shop analytics | Yes |

### Browse filter query parameters

```
GET /api/shops?category=food&college=CEIT&search=milk&sort=popular&page=1&limit=8
```

---

## Features

### Currently working features

- User registration and login with JWT authentication
- CvSU Verified badge auto-assigned on registration with @cvsu.edu.ph email and student ID
- Three badge levels — CvSU Verified, Trusted, Top Seller — with criteria checklist
- Create shop with photos, description, category, college/building, location description
- Browse shops by product category (Food, Drinks, Merch, Accessories, etc.)
- Browse shops by college building (CEIT, CON, CEMDS, COE, CAS, etc.)
- Search shops by name
- Filter by recent or popular
- Shop detail page with products, reviews, pre-order tab, and seller info
- Star rating system with written reviews
- One review per user per shop enforcement
- Direct messaging between buyers and sellers
- Pre-order form embedded inside the chat
- Wishlist — save and unsave shops
- Shop analytics — views, profile clicks, messages, weekly bar chart
- Seller dashboard with manage listings
- View and delete own shops

---

## Known Bugs & Planned Fixes

This section documents all known issues identified during development and testing that are planned for future fixes.

---

### Bug 1 — Landing Page Footer Floating

**Description:** The footer on the landing page has spacing issues where it appears to float above the page content rather than being anchored to the bottom. The `mt-16` margin class on the footer causes inconsistent spacing depending on the amount of content above it.

**Status:** Identified — pending CSS fix

**Planned fix:** Replace `mt-16` on the footer with a flex layout on the page container using `min-h-screen flex flex-col` and `flex-1` on the main content area so the footer always stays at the bottom regardless of content length.

---

### Bug 2 — Messages Page Layout Cut Off

**Description:** The messages page uses `h-[calc(100vh-128px)]` for the chat panel height. On some screen sizes this causes the chat panel to overlap or cut into the footer area. The layout does not account for the footer height properly.

**Status:** Identified — partially fixed, needs refinement

**Planned fix:** Use a CSS grid or flex layout for the entire page layout rather than fixed viewport height calculations so the chat area expands and contracts naturally within the available space.

---

### Bug 3 — Login and Sign Up Authentication Errors

**Description:** There are intermittent issues with the authentication flow. On the live deployed version, registration occasionally returns a generic error message without specifying what went wrong. Login also sometimes fails even with correct credentials on first attempt and works on second attempt.

**Root cause suspected:** The Render free tier backend spins down after inactivity. When a user tries to register or login immediately after the server wakes up, the database connection may not be fully re-established causing the first request to fail. Subsequent requests succeed once the connection is stable.

**Status:** Identified — needs backend connection retry logic

**Planned fix:** Add automatic database reconnection logic in the Sequelize configuration and add a frontend retry mechanism that automatically retries failed authentication requests once before showing an error to the user.

---

### Bug 4 — View Counter Not Unique Per User

**Description:** The shop view counter increments every single time a shop page is loaded — including repeated visits by the same user and even the shop owner. Refreshing the shop page multiple times artificially inflates the view count, making analytics unreliable.

**Status:** Identified — low priority for now

**Planned fix:** Implement session-based or IP-based view deduplication. Store a record of which users or IP addresses have viewed each shop, and only increment the counter if the viewer has not visited that shop in the past 24 hours. For logged-in users, track by user ID. For non-logged-in users, track by IP address.

---

### Bug 5 — Pre-Order Not Appearing in Seller Message Inbox

**Description:** When a buyer submits a pre-order through the Pre-Order tab on the shop detail page, the order is recorded in the database but the corresponding notification message does not reliably appear in the seller's message inbox. The seller may not know a pre-order was submitted unless they manually check the pre-orders section.

**Status:** Identified — needs debugging

**Planned fix:** Ensure that every pre-order submission also triggers a system message from the buyer to the seller that appears in the message inbox. Add a visual indicator in the inbox for pre-order type messages and add a notification badge on the Messages nav link when there are unread messages or pending pre-orders.

---

### Bug 6 — Student ID Is Publicly Visible

**Description:** When a shop owner's profile is shown on a shop detail page, the student ID number is displayed in the seller information card. Student ID numbers are confidential academic information and should not be publicly displayed.

**Status:** Identified — privacy concern

**Planned fix:** Remove student ID from all public-facing API responses. The student ID should only be used internally for badge verification during registration and should never be returned in any API response that is accessible without authentication. Add a toggle in the user profile settings that lets users choose whether to display their student ID, defaulting to hidden.

---

### Bug 7 — No Edit Function for Posted Shops

**Description:** Once a shop is created, there is no way to edit any of the details — name, description, category, location, products, or photos. If a seller makes a typo or needs to update their shop information, they must delete the entire shop and create a new one. Deleting a shop loses all views, reviews, and engagement history.

**Status:** Identified — high priority feature gap

**Planned fix:** Add an Edit button on the My Shop dashboard next to each listing. The edit page should pre-fill all existing shop data and allow the seller to update any field. Photo management should allow adding new photos and removing specific existing ones without deleting all photos. The shop ID, view count, reviews, and analytics should all be preserved after an edit.

---

### Bug 8 — Image Upload Limited to 5 Photos

**Description:** The current shop creation form limits photo uploads to 5 images. This is due to Cloudinary's free tier storage limits and the current implementation. For shops with many products or multiple views of the same item, 5 photos may not be sufficient.

**Status:** Acknowledged — platform limitation

**Planned fix (future):** Upgrade to Cloudinary's paid plan to increase storage and remove the 5-photo limit. Alternatively, implement a product-level photo system where each individual product inside a shop can have its own photo, rather than all photos being attached to the shop level. This would give sellers more flexibility within the same storage constraints.

---

### Bug 9 — Message Volume Limitations

**Description:** The current messaging system loads all messages between two users in a single request. As conversations grow longer over time, this will cause performance issues. There is also no message pagination, no message search, and no way to delete individual messages.

**Status:** Identified — scalability concern

**Planned fix:** Implement message pagination using cursor-based pagination — load the most recent 50 messages first and allow scrolling up to load older messages. Add a message search function within a conversation. Add the ability to delete individual messages. Implement proper real-time updates using Socket.io events rather than polling every 3 seconds.

---

### Bug 10 — Design is Generic and Unfinished

**Description:** The current UI uses a standard Tailwind CSS green theme with basic card and grid layouts. While functional, the design lacks the personality and uniqueness that would make CavSulit feel like a real campus product. There is no custom logo, no branded illustrations, no onboarding flow, and no empty state illustrations.

**Status:** Acknowledged — design phase planned

**Planned improvements:**
- Create a proper logo and brand identity for CavSulit
- Design custom illustrations for empty states (no shops found, no messages, empty wishlist)
- Add micro-animations and transitions for a more polished feel
- Design an onboarding flow that guides new users through the app
- Improve mobile responsiveness — the current layout is not fully optimized for small screens
- Add a dark mode option
- Improve the typography hierarchy for better readability
- Redesign the shop cards to show more information at a glance

---

## Problems Encountered During Development

This section documents the real challenges faced during the development of CavSulit. This is intended to give future developers and groupmates an honest account of what was difficult and how each problem was solved.

---

### Problem 1 — MySQL Access Denied Error

**What happened:** After setting up the backend and running `npm run dev` for the first time, the terminal showed `ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost' (using password: YES)`. This error appeared repeatedly and the server could not start.

**Root cause:** The password in the `.env` file did not match the actual MySQL root password. The original MySQL installation used a complex auto-generated password with special characters including `!` and `#`, and these characters were causing issues when read from the `.env` file.

**Solution:** Opened MySQL Workbench, went to Server → Users and Privileges, selected the root user, and reset the password to a simpler value `cavsulit123`. Then updated the `DB_PASS` value in the `.env` file to match. The server connected successfully after this fix.

**Lesson learned:** Always use a simple password without special characters for local development database credentials. Special characters like `!`, `#`, `@` can sometimes be misinterpreted in `.env` files depending on the shell.

---

### Problem 2 — Database Does Not Exist on Railway

**What happened:** After deploying the backend to Railway, the logs showed `Unknown database 'cavsulit_db'`. The server started and connected to MySQL but could not find the database.

**Root cause:** Railway's MySQL service creates a default database called `railway`, not `cavsulit_db`. The backend was configured to connect to `cavsulit_db` which did not exist in Railway's cloud MySQL.

**Solution:** Updated the `DB_NAME` environment variable in Railway from `cavsulit_db` to `railway`. Since Sequelize uses `sync({ alter: true })` on startup, all tables were automatically created in the `railway` database without needing to run any SQL manually.

**Lesson learned:** Cloud database providers often create their own default database names. Always check the provider's variable names (MYSQLDATABASE in Railway's case) before assuming the database name.

---

### Problem 3 — Railway Backend Crashing After 5 Seconds

**What happened:** The Railway backend deployment would show the three green success messages (MySQL connected, Database synced, Server running) but then immediately crash with `Stopping Container` and `npm error signal SIGTERM` after exactly 5 seconds.

**Root cause:** Railway's free trial credits were running low (showing "3 days or $4.05 left"). Railway was automatically shutting down the container because the free trial was nearly exhausted. This was not a code error.

**Solution:** Migrated the backend from Railway to Render.com, which has a completely free tier with no credit limit. The Railway MySQL database was kept as the database host since it was still running. The Render backend was configured with the Railway MySQL's public URL credentials (MYSQL_PUBLIC_URL) instead of the internal URL (which only works within Railway's own network).

**Lesson learned:** Free hosting tiers have hidden limitations. Railway's trial period expires and can cause unexpected shutdowns that look like code errors. Always read the billing warnings in the hosting dashboard. Render.com is more beginner-friendly for free backend hosting.

---

### Problem 4 — Render Cannot Reach Railway MySQL Internal URL

**What happened:** After setting up the Render backend, the logs showed `getaddrinfo ENOTFOUND mysql.railway.internal`. The backend could not connect to the Railway MySQL database.

**Root cause:** Railway uses two types of MySQL URLs — an internal URL (`mysql.railway.internal`) that only works from within Railway's own network, and a public URL (`MYSQL_PUBLIC_URL`) that works from anywhere on the internet. Since Render is a completely separate platform, it cannot access Railway's internal network.

**Solution:** Went to Railway MySQL service Variables tab, clicked the eye icon on `MYSQL_PUBLIC_URL` to reveal the full connection string, and extracted the host, port, username, and password from it. Updated the Render environment variables to use these public-facing values instead of the internal ones.

**Lesson learned:** When connecting services across different hosting platforms, always use the public endpoint, not the internal or private endpoint. Internal URLs are only accessible within the same hosting provider's network.

---

### Problem 5 — CORS Errors Blocking Registration on Live Site

**What happened:** The live site at `cav-sulit.vercel.app` showed "Registration failed" when trying to create an account. The backend was running fine but rejecting requests from the Vercel frontend.

**Root cause:** CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks requests from one domain to another unless the server explicitly allows it. The backend was configured to only allow requests from `http://localhost:5173` — it was not allowing requests from `https://cav-sulit.vercel.app`.

**Solution:** Updated `backend/server.js` to allow multiple origins in the CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://cav-sulit.vercel.app',
    process.env.CLIENT_URL
  ],
  credentials: true
}));
```

Also updated the `CLIENT_URL` environment variable in Render to the exact Vercel URL.

**Lesson learned:** CORS must be explicitly configured for every domain that will make requests to the backend. During development, `localhost` is fine. In production, every deployed frontend URL must be added to the allowed origins list.

---

### Problem 6 — Vercel 404 Error on Page Refresh

**What happened:** Navigating to `https://cav-sulit.vercel.app/register` directly in the browser showed a 404 NOT_FOUND error from Vercel instead of the register page.

**Root cause:** CavSulit uses React Router for client-side navigation. React Router handles page changes in JavaScript without actually loading new HTML files from the server. Vercel, however, does not know this — when someone navigates directly to `/register`, Vercel looks for a file called `register.html` which does not exist, so it returns 404.

**Solution:** Created a `vercel.json` file in the frontend folder with a rewrite rule that tells Vercel to always serve `index.html` for any URL and let React Router handle the routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Lesson learned:** Single-page applications built with React Router need a catch-all rewrite rule on the hosting platform to work correctly. Without it, only the homepage will load — any direct URL will return 404.

---

### Problem 7 — Images Disappearing After Server Restart

**What happened:** Photos uploaded to shops would display correctly immediately after posting, but would disappear after the Render server restarted. The image paths stored in the database pointed to `/uploads/filename.jpg` which existed on the server's local filesystem, but that filesystem is reset every time the server restarts on Render.

**Root cause:** Render's free tier uses ephemeral storage — the filesystem is temporary and does not persist between deployments or restarts. Any files saved locally on the server are deleted when it stops.

**Solution:** Integrated Cloudinary, a cloud image hosting service. Images are now uploaded directly to Cloudinary instead of being saved locally. Cloudinary returns a permanent URL that is stored in the database. The image lives on Cloudinary's servers permanently and never disappears.

**Changes made:**
- Installed `cloudinary` and `multer-storage-cloudinary` packages in the backend
- Updated `upload.js` middleware to use CloudinaryStorage instead of local disk storage
- Added Cloudinary API credentials to the `.env` file and Render environment variables
- Updated shop routes to store `f.path` (the Cloudinary URL) instead of `/uploads/${f.filename}`

**Lesson learned:** Never rely on local server filesystem storage for user-uploaded content in a production application. Always use a dedicated cloud storage service like Cloudinary, AWS S3, or Firebase Storage.

---

### Problem 8 — No App Logo or Branding

**What happened:** Throughout the development process, the app used a generic shopping bag emoji and placeholder text as its branding. There was no designed logo, no brand color guide, and no consistent visual identity that would make CavSulit recognizable.

**What was done:** The branding name went through many iterations during development. Names considered included: HustleSU, GreenBazaar, CampuSulit, Stallmate, Kalykal, Vendura, Nesto, CVSUnite, StallSU, NegosyCVSU, and many others. The final name CavSulit was chosen because it combines CvSU (Cavite State University) with "sulit" — the Filipino word for value or worth — reflecting the app's core purpose of making campus businesses more accessible and valuable.

**Status:** The logo and full branding identity is planned as a future task. The current design uses the CvSU green color palette (`#1B4332`, `#2D6A4F`, `#40916C`) which aligns with the university's official colors.

---

### Problem 9 — Securing API Keys and Credentials

**What happened:** During development, there were multiple occasions where credentials were almost committed to GitHub — including database passwords, Cloudinary API keys, and JWT secrets.

**What was done:** A `.gitignore` file was set up from the beginning to exclude the `.env` file from all git commits. The `.gitignore` includes:

```
backend/node_modules/
backend/uploads/
backend/.env
frontend/node_modules/
frontend/dist/
frontend/.env
```

All sensitive values are stored as environment variables — locally in `.env` and in production through the hosting platform's environment variable settings (Render's Environment tab and Vercel's Environment Variables settings).

**Lesson learned:** Never hardcode credentials directly in source code. Always use environment variables. Always set up `.gitignore` before the very first `git add .` command to prevent accidental exposure of sensitive information.

---

## Security Layers

| Security Feature | Implementation | Status |
|---|---|---|
| Password hashing | bcryptjs with salt rounds | ✅ Implemented |
| Authentication tokens | JWT with 30-day expiry | ✅ Implemented |
| SQL injection protection | Sequelize ORM (no raw SQL) | ✅ Implemented |
| Credentials hidden from GitHub | .gitignore + environment variables | ✅ Implemented |
| CORS policy | Whitelist of allowed origins | ✅ Implemented |
| HTTPS | Auto-provided by Vercel + Render | ✅ Active in production |
| Input validation | Basic frontend form validation | ⚠️ Needs strengthening |
| Rate limiting | Not yet implemented | ❌ Planned |
| File upload validation | Extension check only | ⚠️ Needs strengthening |
| Student ID privacy | Currently shown publicly | ❌ Bug — planned fix |
| Database backups | Railway automatic backups | ⚠️ Limited on free tier |

---

## Contributors

**ITEC Group 3 — Cavite State University · 2026**

This project was developed as part of the ITEC 50 course requirement. The app was built from concept to deployed product through iterative development, debugging, and problem-solving across multiple sessions.

**Project name history:** HustleSU → GreenBazaar → CampuSulit → NegosyCVSU → CavSulit

**Development timeline:**
- Project conception and naming — multiple iterations
- Database and backend setup — Phase 1 and 2
- Core shop features — Phase 3
- Map, reviews, pre-order — Phase 4
- Messaging — Phase 5
- Wishlist, analytics, badge — Phase 6
- Cloudinary image integration — Phase 7
- Railway + Render + Vercel deployment — Final deployment phase
- Bug identification and documentation — Ongoing

---

*CavSulit — Built by the students, for the students.*
*© 2026 CavSulit · ITEC Group 3 · Cavite State University*
*cavsulit.com*
