import { useState } from "react";

// This component only cares about collecting form input and calling
// the onAdd function it's given via props. It does NOT know how the
// complaint gets saved (that logic lives in App.jsx) — this separation
// is a common React pattern: "dumb" components + a "smart" parent.

function ComplaintForm({ onAdd }) {
  // One piece of state per field. For a small form this is simplest
  // to read; for bigger forms you'd combine into one object.
  const [studentName, setStudentName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    if (!studentName || !roomNumber || !description) return;

    onAdd({ studentName, roomNumber, category, description });

    // reset the form after submitting
    setStudentName("");
    setRoomNumber("");
    setCategory("Issue");
    setDescription("");
  };

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      <h2>Raise a Complaint</h2>

      <input
        type="text"
        placeholder="Your name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Room number"
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="" disabled hidden>Select an issue</option>
        <option>Electrical</option>
        <option>Plumbing</option>
        <option>Cleanliness</option>
        <option>Wifi</option>
        <option>Furniture</option>
        <option>Other</option>
      </select>

      <textarea
        placeholder="Describe the issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Submit Complaint</button>
    </form>
  );
}

export default ComplaintForm;
