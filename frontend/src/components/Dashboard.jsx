import { useEffect, useState } from "react";
import { getStats } from "../api.js";

// Standalone component: fetches its own data on mount rather than
// receiving it via props from App.jsx. Either approach is valid in React —
// this one keeps App.jsx simpler since the dashboard doesn't need to
// share state with the complaints list.

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading-text">Loading dashboard...</p>;
  if (!stats) return <p className="error-banner">Could not load stats.</p>;

  const { total, statusCounts, categoryCounts, recent } = stats;

  // Used to size the bars in the status breakdown — avoid dividing by 0
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));

  return (
    <div className="dashboard">
      {/* Top row: big glass stat cards */}
      <div className="stat-grid">
        <div className="glass-card stat-card">
          <span className="stat-label">Total Complaints</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="glass-card stat-card accent-amber">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{statusCounts.Pending}</span>
        </div>
        <div className="glass-card stat-card accent-blue">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{statusCounts["In Progress"]}</span>
        </div>
        <div className="glass-card stat-card accent-green">
          <span className="stat-label">Resolved</span>
          <span className="stat-value">{statusCounts.Resolved}</span>
        </div>
      </div>

      <div className="dashboard-row">
        {/* Status breakdown as simple horizontal bars — no chart library
            needed, just divs with a width % driven by data. */}
        <div className="glass-card panel">
          <h3>Status Breakdown</h3>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div className="bar-row" key={status}>
              <span className="bar-label">{status}</span>
              <div className="bar-track">
                <div
                  className={`bar-fill status-${status.replace(" ", "-").toLowerCase()}`}
                  style={{ width: `${(count / maxStatusCount) * 100}%` }}
                />
              </div>
              <span className="bar-count">{count}</span>
            </div>
          ))}
        </div>

        {/* Category tags with counts */}
        <div className="glass-card panel">
          <h3>By Category</h3>
          <div className="category-grid">
            {Object.entries(categoryCounts).length === 0 && (
              <p className="empty-state">No data yet.</p>
            )}
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div className="category-pill" key={cat}>
                <span>{cat}</span>
                <span className="pill-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity feed */}
      <div className="glass-card panel">
        <h3>Recent Activity</h3>
        {recent.length === 0 && <p className="empty-state">Nothing yet.</p>}
        {recent.map((c) => (
          <div className="activity-row" key={c._id}>
            <span className={`status-dot status-${c.status.replace(" ", "-").toLowerCase()}`} />
            <span>
              <strong>{c.studentName}</strong> (Room {c.roomNumber}) — {c.category}
            </span>
            <span className="activity-status">{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
