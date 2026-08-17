// Central place for all backend calls. Instead of writing fetch() with
// the full URL in every component, we write it once here and import it.
// This also makes it easy to change the backend URL in one place later
// (e.g. when you deploy).

const BASE_URL = "http://localhost:5000/api/complaints";

export async function getStats() {
  const res = await fetch(`${BASE_URL}/stats/summary`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function getComplaints() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch complaints");
  return res.json();
}

export async function createComplaint(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create complaint");
  return res.json();
}

export async function updateComplaintStatus(id, status) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update complaint");
  return res.json();
}

export async function deleteComplaint(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete complaint");
  return res.json();
}
