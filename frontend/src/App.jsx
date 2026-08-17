import { useEffect, useState } from "react";
import ComplaintForm from "./components/ComplaintForm.jsx";
import ComplaintList from "./components/ComplaintList.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { getComplaints, createComplaint, updateComplaintStatus, deleteComplaint } from "./api.js";

// App.jsx is the "smart" parent component. It owns the data (state)
// and the functions that talk to the backend, then passes both down
// to the "dumb" child components (Form, List) as props.

function App() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Simple tab switcher — no react-router needed for just 2 views.
  // "dashboard" | "complaints"
  const [activeTab, setActiveTab] = useState("dashboard");

  // useEffect with an empty dependency array [] runs ONCE, right after
  // the component first renders — perfect for "load initial data".
  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await getComplaints();
      setComplaints(data);
      setError(null);
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (newComplaint) => {
    const saved = await createComplaint(newComplaint);
    // Instead of re-fetching everything, just add the new one to state.
    // This makes the UI feel instant.
    setComplaints((prev) => [saved, ...prev]);
  };

  const handleStatusChange = async (id, status) => {
    const updated = await updateComplaintStatus(id, status);
    setComplaints((prev) => prev.map((c) => (c._id === id ? updated : c)));
  };

  const handleDelete = async (id) => {
    await deleteComplaint(id);
    setComplaints((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="app">
      <header>
        <h1>🏠 Hostel Management System</h1>
        <p>Admin dashboard &amp; complaint tracking</p>

        <nav className="tab-nav">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={activeTab === "complaints" ? "active" : ""}
            onClick={() => setActiveTab("complaints")}
          >
            Complaints
          </button>
        </nav>
      </header>

      {error && <p className="error-banner">{error}</p>}

      <main>
        {activeTab === "dashboard" && <Dashboard />}

        {activeTab === "complaints" && (
          <>
            <ComplaintForm onAdd={handleAdd} />
            {loading ? (
              <p className="loading-text">Loading complaints...</p>
            ) : (
              <ComplaintList
                complaints={complaints}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
