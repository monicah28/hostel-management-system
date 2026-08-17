# Hostel Management System

A web app for managing hostel operations, built as a resume/portfolio project.

## Tech Stack

| Layer     | Technology                          | Why |
|-----------|--------------------------------------|-----|
| Frontend  | React (Vite) + plain CSS             | Fast dev experience and a component-based UI without extra tooling overhead |
| Backend   | Node.js + Express                    | Lightweight, widely-used framework for building REST APIs |
| Database  | MongoDB (via Mongoose)               | Flexible schema that maps naturally onto JS objects, good fit for evolving app data |

This combination is called the **MERN stack** (MongoDB, Express, React, Node).

## Features

- [x] Complaint tracking (raise, view, update status, delete)
- [x] Admin dashboard (stats, status/category breakdown, recent activity)
- [x] Dark glassmorphic UI theme
- [ ] Daily room-cleaning log (students confirm/report room cleaned)
- [ ] Student authentication (login/signup)
- [ ] Filtering & search

(Checkboxes get updated as features are built — see `FLOW.md` for how each one works internally.)

## Project Structure

```
hostel-management/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/                # Mongoose schemas (data shape)
│   ├── routes/                # API endpoints
│   ├── server.js              # Entry point
│   └── .env.example           # Copy to .env and fill in your Mongo URI
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI pieces
│   │   ├── App.jsx            # Main component — owns state, talks to API
│   │   ├── api.js             # All backend calls, in one place
│   │   └── App.css
│   └── index.html
├── README.md
└── FLOW.md
```

## How to Run It

### 1. Set up MongoDB
You need a MongoDB connection string. Easiest option: create a free cluster at
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — it takes about 5 minutes
and gives you a connection URI.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# open .env and paste your MongoDB URI
npm run dev
```
Server runs at `http://localhost:5000`.

### 3. Frontend
Open a **second terminal**:
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173` (Vite will tell you the exact port).

### 4. Try it
Open the frontend URL in your browser, submit a complaint, and watch it appear
in the list. Check your MongoDB Atlas dashboard — you'll see the document saved
there too.

## Learning Notes

- The backend and frontend are two **separate** Node projects, each with their
  own `package.json` and `node_modules`. They only "talk" to each other over
  HTTP (`fetch` calls from React to Express).
- Every file has comments explaining *why* it's written that way, not just what
  it does — read through them once before changing anything.
- If something breaks, check the terminal running the backend first — most
  errors show up there (e.g. wrong Mongo URI, missing field).
