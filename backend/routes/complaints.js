// This file defines all the URL "endpoints" related to complaints.
// Each route = one thing the frontend can ask the server to do.
// This is the REST API pattern: verb (GET/POST/PUT/DELETE) + path = one action.

import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// GET /api/complaints/stats/summary  -> aggregated numbers for the dashboard
// IMPORTANT: this route is defined BEFORE the "/:id" routes further down.
// Express matches routes top-to-bottom, and "/stats/summary" would otherwise
// get swallowed by "/:id" (which would treat "stats" as an :id). Order matters.
router.get("/stats/summary", async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    // aggregate() lets MongoDB do the counting for us instead of pulling
    // every document into Node and counting in JS — much faster at scale.
    const byStatus = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const byCategory = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Turn MongoDB's array-of-{_id, count} shape into a plain object like
    // { Pending: 3, "In Progress": 1, Resolved: 5 } — easier to use in React.
    const statusCounts = { Pending: 0, "In Progress": 0, Resolved: 0 };
    byStatus.forEach((s) => (statusCounts[s._id] = s.count));

    const categoryCounts = {};
    byCategory.forEach((c) => (categoryCounts[c._id] = c.count));

    // Last 5 complaints, most recent first — for a "recent activity" list
    const recent = await Complaint.find().sort({ createdAt: -1 }).limit(5);

    res.json({ total, statusCounts, categoryCounts, recent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/complaints  -> fetch ALL complaints (newest first)
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/complaints  -> create a new complaint
router.post("/", async (req, res) => {
  try {
    // req.body holds the JSON the React app sends us.
    const newComplaint = new Complaint(req.body);
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint); // 201 = "Created"
  } catch (error) {
    // 400 = "Bad Request" — usually means required fields were missing
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/complaints/:id  -> update a complaint's status
router.put("/:id", async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return the UPDATED doc, not the old one
    );
    if (!updated) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/complaints/:id  -> remove a complaint
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Complaint.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json({ message: "Complaint deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
