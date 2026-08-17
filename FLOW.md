# App Flow — updated as features are added

This file explains **how data moves through the app** for each feature, so you
can trace a request end-to-end instead of just reading isolated files.

---

## Overall architecture (applies to every feature)

```
[React component]  --fetch()-->  [Express route]  --Mongoose-->  [MongoDB]
       ^                                                              |
       |------------------- JSON response <---------------------------
```

1. A React component calls a function from `src/api.js`.
2. That function does a `fetch()` to the Express backend (`localhost:5000`).
3. Express matches the URL + HTTP method to a route file (`routes/`).
4. The route uses a Mongoose **model** (`models/`) to read/write MongoDB.
5. Express sends the result back as JSON.
6. React updates its state with `setX(...)`, which re-renders the UI.

Every feature you add will follow this same 6-step shape. Once you understand
it for Complaints below, you understand the pattern for the whole app.

---

## Feature 1: Complaint Tracking ✅ (built)

**Goal:** students raise complaints about their room/hostel; status is tracked
until resolved.

### Data shape (`backend/models/Complaint.js`)
Each complaint document has: `studentName`, `roomNumber`, `category`,
`description`, `status` (Pending / In Progress / Resolved), plus automatic
`createdAt` / `updatedAt` timestamps.

### API endpoints (`backend/routes/complaints.js`)
| Method | Path                 | Purpose                        |
|--------|----------------------|---------------------------------|
| GET    | `/api/complaints`    | fetch all complaints (newest first) |
| POST   | `/api/complaints`    | create a new complaint          |
| PUT    | `/api/complaints/:id`| update status                   |
| DELETE | `/api/complaints/:id`| remove a complaint              |

### Frontend flow
1. `App.jsx` loads on mount → calls `getComplaints()` → fills `complaints` state.
2. `ComplaintForm.jsx` collects input → calls the `onAdd` prop (passed from
   `App.jsx`) → which calls `createComplaint()` → new complaint is prepended
   to state (no full page refetch needed).
3. `ComplaintList.jsx` renders each complaint as a card, color-coded by
   status. Changing the dropdown calls `onStatusChange` → `updateComplaintStatus()`.
   Clicking Delete calls `onDelete` → `deleteComplaint()`.

### Why it's structured this way
- `api.js` centralizes every network call so components never hardcode URLs.
- `App.jsx` is the only component that holds state — `ComplaintForm` and
  `ComplaintList` are "dumb" (they just display data and report events
  upward via props). This is the most common React pattern and worth
  getting comfortable with before adding more features.

---

## Feature 2: Daily Room-Cleaning Log (not built yet)

Planned flow (will be filled in once we build it):
- New model `CleaningLog` — one entry per room per day.
- Student marks "cleaned ✅" or "not cleaned ❌" for their room, once per day.
- Admin view aggregates logs to see which rooms are being skipped.

## Feature 3: Authentication (not built yet)
_TBD — will document JWT/session flow here once added._

## Feature 4: Admin Dashboard ✅ (built)

**Goal:** give a warden/admin a quick overview instead of scrolling a raw list —
total complaints, breakdown by status/category, and recent activity.

### Backend: aggregation, not just fetching
`GET /api/complaints/stats/summary` (in `routes/complaints.js`) uses
Mongoose's `.aggregate()` to let MongoDB do the counting server-side,
rather than pulling every document to Node and counting in JavaScript.
It returns:
```json
{
  "total": 12,
  "statusCounts": { "Pending": 5, "In Progress": 3, "Resolved": 4 },
  "categoryCounts": { "Wifi": 4, "Plumbing": 2, ... },
  "recent": [ /* last 5 complaints */ ]
}
```

**Route ordering gotcha worth remembering:** `/stats/summary` is declared
*before* `/:id` in the routes file. Express matches routes top-to-bottom, and
`/:id` would otherwise treat the literal word "stats" as an ID and swallow
the request. Any time you add a route with a fixed path alongside a route
with a `:param`, put the fixed one first.

### Frontend: `Dashboard.jsx`
A self-contained component that fetches its own data (`getStats()` in
`api.js`) on mount, rather than receiving it as props from `App.jsx`. It
renders:
- 4 stat cards (total / pending / in progress / resolved)
- a horizontal bar breakdown by status (plain divs sized by %, no chart
  library needed)
- category pills with counts
- a recent-activity feed (last 5 complaints)

### Navigation
`App.jsx` now has a simple tab switcher (`activeTab` state: `"dashboard"` or
`"complaints"`) — no `react-router` needed for just two views. Switching to
the Dashboard tab re-mounts `Dashboard.jsx`, which re-fetches stats, so
numbers stay fresh after you add/update complaints.

---

## UI System: Dark Glassmorphic Theme ✅ (built)

The whole app was restyled in `App.css` around one reusable pattern: a dark
gradient background + `.glass-card` (semi-transparent background,
`backdrop-filter: blur()`, soft border) used for every card — stat cards,
panels, the form, complaint cards.

Key CSS ideas if you want to extend it:
- Colors are defined once as CSS variables in `:root` (`--accent-violet`,
  `--accent-cyan`, etc.) — change a variable once, it updates everywhere.
- The background uses **layered radial gradients**, not a flat color —
  flat backgrounds make `backdrop-filter: blur()` look muddy instead of
  "glassy".
- Status colors (amber/blue/green for Pending/In Progress/Resolved) are
  applied consistently across complaint cards, dashboard bars, and the
  activity feed dots — one status = one color everywhere in the app.

---

### Changelog
- **v2**: Added admin dashboard (`/api/complaints/stats/summary` +
  `Dashboard.jsx`), tab navigation in `App.jsx`, full dark glassmorphic
  restyle of `App.css`.
- **v1**: Initial complaint tracking module (CRUD + basic light-theme UI).

### How this file will grow
Every time we add or change a feature, this file gets a new dated changelog
entry so you can see not just the current state but *how* the app evolved —
useful for explaining your project in an interview.
