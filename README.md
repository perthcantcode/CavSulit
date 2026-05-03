# 🛍️ CavSulit — CVSU Campus Marketplace
**ITEC Group 3 · Cavite State University**

> *"The campus is your market. CavSulit is your store."*
<!--
---

## 📁 Folder Structure

```
CavSulit/
├── backend/                  ← Node.js + Express API
│   ├── config/
│   │   └── db.config.js      ← MySQL connection
│   ├── middleware/
│   │   ├── auth.js           ← JWT token guard
│   │   └── upload.js         ← Image upload (Multer)
│   ├── models/
│   │   └── index.js          ← All database tables
│   ├── routes/
│   │   ├── auth.routes.js    ← Register / Login
│   │   ├── shop.routes.js    ← Shop CRUD + filters
│   │   ├── product.routes.js ← Product management
│   │   ├── review.routes.js  ← Ratings & reviews
│   │   ├── message.routes.js ← Messaging
│   │   ├── wishlist.routes.js← Save / unsave shops
│   │   ├── preorder.routes.js← Pre-order system
│   │   └── analytics.routes.js← Shop analytics
│   ├── uploads/              ← Uploaded images (auto-created)
│   ├── .env                  ← Environment variables ⚠️
│   ├── package.json
│   └── server.js             ← App entry point
│
└── frontend/                 ← React + TypeScript + Tailwind
    ├── src/
    │   ├── components/
    │   │   ├── Layout.tsx    ← Navbar + Footer
    │   │   └── ShopCard.tsx  ← Reusable shop card
    │   ├── context/
    │   │   └── AuthContext.tsx← Login state
    │   ├── pages/
    │   │   ├── Landing.tsx   ← Home page
    │   │   ├── Browse.tsx    ← Browse + filter shops
    │   │   ├── ShopDetails.tsx← Shop view + reviews + preorder
    │   │   ├── PostShop.tsx  ← Create shop form
    │   │   ├── MyShop.tsx    ← Seller dashboard + analytics
    │   │   ├── Messages.tsx  ← Chat + preorder
    │   │   ├── Wishlist.tsx  ← Saved shops
    │   │   ├── VerifiedBadge.tsx← Badge system
    │   │   └── Auth.tsx      ← Login + Register
    │   ├── utils/
    │   │   ├── api.ts        ← Axios instance
    │   │   └── helpers.ts    ← Constants + utilities
    │   ├── App.tsx           ← Router
    │   ├── index.tsx         ← Entry point
    │   └── index.css         ← Tailwind + fonts
    ├── tailwind.config.js
    ├── vite.config.ts
    └── package.json
```
*/
---

## 🗄️ DATABASE SETUP (Step-by-step)

### Step 1 — Install MySQL
Download and install **MySQL Community Server** from:
https://dev.mysql.com/downloads/mysql/

During install, set a root password. **Remember this password!**

### Step 2 — Create the Database
Open **MySQL Workbench** or your terminal and run:

```sql
CREATE DATABASE cavsulit_db;
```

That's it! The tables are **created automatically** when you start the backend server for the first time. You do NOT need to run any SQL scripts.

### Step 3 — Configure your .env file
Open `backend/.env` and fill in your details:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_NAME=cavsulit_db
DB_USER=root
DB_PASS=yourpassword        ← Change this to your MySQL password

JWT_SECRET=cavsulit_super_secret_key_2026
JWT_EXPIRES_IN=7d
```

### Database Tables (auto-created)

| Table       | What it stores                                      |
|-------------|-----------------------------------------------------|
| users       | All accounts — students, sellers, instructors       |
| shops       | Shop listings with location, category, college      |
| products    | Items inside each shop with prices                  |
| reviews     | Star ratings and comments left by buyers            |
| messages    | Chat messages between buyers and sellers            |
| preorders   | Pre-order requests sent through Messages            |
| wishlists   | Saved shops per user                                |
| analytics   | View and click tracking per shop                    |

---

## 🚀 HOW TO RUN LOCALLY

### Requirements
- Node.js v18+ → https://nodejs.org
- MySQL 8.0+   → https://dev.mysql.com/downloads/mysql/

---

### 1. Start the Backend

```bash
# Open a terminal and go to the backend folder
cd CavSulit/backend

# Install dependencies
npm install

# Start the server
npm run dev
```

You should see:
```
✅ MySQL connected
✅ Database synced
✅ Server on http://localhost:5000
```

---

### 2. Start the Frontend

```bash
# Open a SECOND terminal and go to the frontend folder
cd CavSulit/frontend

# Install dependencies
npm install

# Start the app
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint                          | What it does                    | Login? |
|--------|-----------------------------------|---------------------------------|--------|
| POST   | /api/auth/register                | Create account                  | No     |
| POST   | /api/auth/login                   | Login, receive token            | No     |
| GET    | /api/auth/me                      | Get my profile                  | Yes    |
| PUT    | /api/auth/me                      | Update my profile               | Yes    |
| GET    | /api/shops                        | Browse shops (with filters)     | No     |
| GET    | /api/shops/mine                   | My posted shops                 | Yes    |
| GET    | /api/shops/:id                    | View one shop                   | No     |
| POST   | /api/shops                        | Create a shop                   | Yes    |
| PUT    | /api/shops/:id                    | Edit my shop                    | Yes    |
| DELETE | /api/shops/:id                    | Delete my shop                  | Yes    |
| POST   | /api/products                     | Add product to shop             | Yes    |
| PUT    | /api/products/:id                 | Edit product                    | Yes    |
| DELETE | /api/products/:id                 | Delete product                  | Yes    |
| GET    | /api/reviews/:shopId              | Get reviews for a shop          | No     |
| POST   | /api/reviews                      | Leave a review                  | Yes    |
| DELETE | /api/reviews/:id                  | Delete my review                | Yes    |
| GET    | /api/messages/conversations       | My conversation list            | Yes    |
| GET    | /api/messages/:partnerId          | Chat with one person            | Yes    |
| POST   | /api/messages                     | Send a message                  | Yes    |
| GET    | /api/wishlist                     | My saved shops                  | Yes    |
| POST   | /api/wishlist/:shopId             | Toggle save/unsave              | Yes    |
| GET    | /api/wishlist/check/:shopId       | Is this shop saved?             | Yes    |
| POST   | /api/preorders                    | Submit a pre-order              | Yes    |
| GET    | /api/preorders/mine               | My pre-orders (buyer)           | Yes    |
| GET    | /api/preorders/shop/:shopId       | Pre-orders for my shop (seller) | Yes    |
| PUT    | /api/preorders/:id/status         | Confirm / cancel order          | Yes    |
| POST   | /api/analytics/track              | Track a view or click           | No     |
| GET    | /api/analytics/:shopId            | Get shop analytics              | Yes    |

### Filter params for Browse:
```
GET /api/shops?category=food&college=CEIT&search=milk&sort=popular&page=1&limit=8
```

---

## 🌐 Uploading to GitHub

### Step 1 — Initialize git in the root folder
```bash
cd CavSulit
git init
```

### Step 2 — Create a .gitignore file in the root
Create a file called `.gitignore` and paste this:
```
# Backend
backend/node_modules/
backend/uploads/
backend/.env

# Frontend
frontend/node_modules/
frontend/dist/
```

### Step 3 — Push to GitHub
```bash
git add .
git commit -m "Initial commit — CavSulit Campus Marketplace"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CavSulit.git
git push -u origin main
```

> ⚠️ Never push `.env` — it contains your database password!
-->
---

## 🧩 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18 + TypeScript + Vite        |
<!--| Styling     | Tailwind CSS + Outfit + Plus Jakarta Sans |-->
| Routing     | React Router v6                     |
| HTTP Client | Axios                               |
| Backend     | Node.js + Express                   |
| Database    | MySQL + Sequelize ORM               |
| Auth        | JWT + bcryptjs                      |
| Real-time   | Socket.io (messaging)               |
<!--| Uploads     | Multer (local /uploads folder)      |-->

---

## 📅 Feature Checklist

| Phase | Feature              | Status |
|-------|----------------------|--------|
| 1     | Server + DB setup    | ✅ Done |
| 2     | Auth (register/login)| ✅ Done |
| 3     | Shop CRUD            | ✅ Done |
| 3     | Browse + Filters     | ✅ Done |
| 4     | Shop Detail + Map    | ✅ Done |
| 5     | Messaging            | ✅ Done |
| 5     | Pre-Order            | ✅ Done |
| 6     | Reviews & Ratings    | ✅ Done |
| 7     | Wishlist             | ✅ Done |
| 7     | Analytics Dashboard  | ✅ Done |
| 7     | CvSU Verified Badge  | ✅ Done |

---

*Built by ITEC Group 3 — Cavite State University 2026*
