// Displays the list of complaints and lets the warden/admin change
// status or delete an entry. Again — this component just renders and
// forwards clicks upward via props; it doesn't talk to the API directly.

function ComplaintList({ complaints, onStatusChange, onDelete }) {
  if (complaints.length === 0) {
    return <p className="empty-state">No complaints yet.</p>;
  }

  return (
    <div className="complaint-list">
      <h2>All Complaints</h2>
      {complaints.map((c) => (
        <div key={c._id} className={`complaint-card status-${c.status.replace(" ", "-").toLowerCase()}`}>
          <div className="complaint-header">
            <strong>{c.studentName}</strong> — Room {c.roomNumber}
            <span className="category-tag">{c.category}</span>
          </div>
          <p>{c.description}</p>
          <div className="complaint-footer">
            <select
              value={c.status}
              onChange={(e) => onStatusChange(c._id, e.target.value)}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <button onClick={() => onDelete(c._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ComplaintList;
