// A Mongoose "Schema" defines the SHAPE of a document stored in MongoDB.
// Think of it like a table structure in SQL, but flexible.
// A "Model" is what lets us actually create/read/update/delete documents
// that follow this shape.

import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true, // removes accidental leading/trailing spaces
    },
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Electrical", "Plumbing", "Cleanliness", "Wifi", "Furniture", "Other"],
      default: "Other",
    },
    description: {
      type: String,
      required: [true, "Please describe the complaint"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields to every document
    timestamps: true,
  }
);

// mongoose.model(name, schema) registers this schema as a model called
// "Complaint". Mongoose will automatically create/use a MongoDB collection
// named "complaints" (lowercased + pluralized) for it.
const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
