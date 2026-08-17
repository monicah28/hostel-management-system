// This is the entry point of the backend. Run it with: npm run dev
// What it does, in order:
// 1. Load environment variables from .env
// 2. Connect to MongoDB
// 3. Set up middleware (cors, json parsing)
// 4. Mount routes
// 5. Start listening for requests

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import complaintRoutes from "./routes/complaints.js";

dotenv.config(); // reads .env into process.env

connectDB(); // connect to MongoDB before we start accepting requests

const app = express();

// --- Middleware ---
// cors() lets your React app (running on a different port, e.g. 5173)
// make requests to this server (running on port 5000). Without this,
// the browser blocks the request for security reasons.
app.use(cors());

// express.json() lets us read JSON sent in a request body (req.body)
app.use(express.json());

// --- Routes ---
// Any request starting with /api/complaints gets handled by complaintRoutes
app.use("/api/complaints", complaintRoutes);

// Simple health-check route to confirm the server is alive
app.get("/", (req, res) => {
  res.send("Hostel Management API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
