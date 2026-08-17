// This file's ONLY job: connect to MongoDB and tell us if it worked.
// Keeping it separate from server.js keeps server.js clean and focused
// on routes/middleware — a pattern you'll see in almost every real backend.

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // mongoose.connect returns a promise, so we await it.
    // MONGO_URI comes from your .env file (never hardcode secrets in code).
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process if DB connection fails — no point running a server
    // that can't reach its database.
    process.exit(1);
  }
};

export default connectDB;
