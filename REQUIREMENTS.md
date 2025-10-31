# IPRD ERP System - Requirements

You are an expert React developer. Build a complete, production-grade MVP for a government project called **IPRD ERP System**, as per the detailed Scope of Work and Video Library Upload Structure.

## 🔹 PURPOSE

A web-based centralized content management and digital archive system for government departments (IPRD).  
It must allow uploading, managing, searching, tagging, and sharing of official content (videos, photos, documents, and reports) with role-based access, hybrid storage access, and audit trails.

## 🔹 STACK & CONFIG

- React + TailwindCSS
- React Router DOM
- react-player for videos
- LocalStorage + mock JSON data (no real backend)
- Hostinger hosting compatible (npm run build → public_html)
- Simple `.htaccess` SPA routing support

---

## 📁 PROJECT STRUCTURE

```
iprd-erp/
│
├── public/
│ ├── logo.png
│ ├── favicon.ico
│ └── sample-videos/
│
├── src/
│ ├── assets/
│ │ └── icons, banners
│ ├── components/
│ │ ├── Navbar.jsx
│ │ ├── Sidebar.jsx
│ │ ├── DashboardCard.jsx
│ │ ├── VideoPlayer.jsx
│ │ ├── TagForm.jsx
│ │ ├── TagList.jsx
│ │ ├── RoleGuard.jsx
│ │ ├── SearchFilters.jsx
│ │ └── ComingSoon.jsx
│ │
│ ├── data/
│ │ └── mockData.json
│ │
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Dashboard.jsx
│ │ ├── MasterSettings.jsx
│ │ ├── AddContent.jsx
│ │ ├── SearchContent.jsx
│ │ ├── ShareContent.jsx
│ │ ├── VideoLibrary.jsx
│ │ ├── Reports.jsx
│ │ ├── AuditLogs.jsx
│ │ ├── HelpCenter.jsx
│ │ ├── Settings.jsx
│ │ └── NotFound.jsx
│ │
│ ├── App.jsx
│ ├── index.js
│ └── styles.css
│
└── package.json
```

---

## ⚙️ FUNCTIONAL REQUIREMENTS

### 1️⃣ Authentication & RBAC

- Roles: Super Admin, Department Admin, District Officer, Block Officer, Staff, Viewer.
- Simple login page (dropdown to select role).
- Redirect user to Dashboard.
- RoleGuard component to restrict page access.
  - Viewer → can view Search page only.
  - Officer → can upload, search, share.
  - Admin → full access.

---

### 2️⃣ Dashboard Module

- 4 main cards:
  - Total Uploads
  - Total Searches
  - Total Shares
  - Cloud vs Local Data ratio
- "Top Tags Used" section (from mock JSON)
- "Recent Uploads" table
- "Full Analytics → Coming Soon" button

---

### 3️⃣ Master Settings Module

- Tabs for Departments, Districts, Blocks, Roles.
- Tables + Add/Edit button placeholders.
- "Advanced Mapping – Coming Soon" banner.

---

### 4️⃣ Add Content Module

- Upload any file (video, image, doc, pdf).
- Metadata form fields:
  - Content Name
  - Department
  - Person Tag
  - District / Block
  - Content Type (Video / Photo / Report / Document)
  - Remarks
- On upload → success message + save metadata to localStorage/mockData.json.
- If content type = "Video" → redirect to **VideoLibrary** for tagging.

---

### 5️⃣ Video Library Module

**Three Phases from "Video Library Uploading Structure.pdf":**

#### Phase I – Raw File Upload

- Show table of uploaded raw videos (status = "Raw")
- Button: "Send to Editing" → moves to Phase II

#### Phase II – Editor Processing

- VideoPlayer (react-player)
- TagForm below player:
  - Start Time (auto from video)
  - End Time
  - Tag Type (Best Practice, Innovation, Achievement, Success Story, Testimonial, CM Byte, Other)
  - Remarks
  - "Add Tag" → append to TagList
- Show TagList below with start, end, tagType, remarks.
- Dummy progress indicator (4 tags added ✅)

#### Phase III – Output Uploads

- List of final edited videos (status = "Final")
- "View Clip" and "Share Clip" buttons
- When Share clicked → show modal:
  - Select Tag → alert(`Shared ${start}-${end} successfully`)
- "Bulk Upload – Coming Soon" button

---

### 6️⃣ Search Module

- SearchFilters component:
  - Department, District, Block, Person Tag, Content Type, Tag Type, Year Range
- Display cards for results (title, department, tags, source).
- If `source == "local"`, show alert: "This file is viewable only within office network."
- On click → open modal with preview and metadata.

---

### 7️⃣ Share Module

- Form fields:
  - Department
  - Person Name
  - File Name / ID
  - Email
  - Mobile
  - Remarks
- On submit → success message "File shared successfully."
- Below → dummy table of past shares (from mockData.json)

---

### 8️⃣ Reports Module

- Charts (can be static placeholders):
  - Pie Chart: Uploads by Department
  - Line Chart: Uploads by Month
- Use Recharts or simple "Coming Soon" component.

---

### 9️⃣ Audit Logs Module

- Table columns: User, Action, File, Date, IP.
- 5 dummy rows from mockData.json.
- "View Full Logs → Coming Soon" button.

---

### 🔟 Settings Module

- Change password form (dummy)
- Manage Departments / Keys (Coming Soon)

---

### 11️⃣ Help Center Module

- "User Guide Coming Soon"
- Support email placeholder: support@sanganakhq.com

---

### 12️⃣ NotFound Page

Standard 404 page with "Go Back to Dashboard" button.

---

## 🔐 HYBRID ACCESS CONTROL SIMULATION

- Add `const isGovtNetwork = window.location.hostname.includes("gov");`
- If false → alert: "This content can only be accessed within office network."

---

## 📦 MOCK DATA SAMPLE

`/src/data/mockData.json`

```json
{
  "departments": ["IPRD", "Education", "Tourism", "Health"],
  "districts": ["Patna", "Nalanda", "Gaya"],
  "roles": ["Super Admin", "Dept Admin", "District Officer", "Block Officer", "Staff", "Viewer"],
  "videos": [
    {
      "id": 1,
      "title": "CM Patna Visit",
      "department": "IPRD",
      "district": "Patna",
      "tags": [
        {"start":"00:10:00","end":"00:11:30","type":"CM Byte","remarks":"Speech Section"},
        {"start":"00:20:00","end":"00:25:00","type":"Innovation","remarks":"Project Launch"}
      ],
      "source": "cloud"
    },
    {
      "id": 2,
      "title": "District Achievement Report",
      "department": "Education",
      "district": "Nalanda",
      "tags": [],
      "source": "local"
    }
  ],
  "shares": [
    {"to":"raj@bihar.gov.in","file":"CM Patna Visit","tag":"CM Byte","date":"2025-10-31"}
  ]
}
```

## 🎨 DESIGN SYSTEM

- **Font**: Inter or Roboto

- **Colors**:
  - Primary Blue: #003399
  - Background: #f8fafc
  - Text: #111827
  - Accent: #1e3a8a

- Rounded-xl buttons, minimal shadows.

- Government aesthetic: clean, trustworthy, not flashy.

- Footer: "Developed by SanganakHQ – Digital Innovation Partner, 2025"

---

## 🧭 ROUTES SUMMARY

| Route | Page | Access |
|-------|------|--------|
| /login | Login | Public |
| /dashboard | Dashboard | All roles |
| /master-settings | MasterSettings | Admin only |
| /add-content | AddContent | Officer + Admin |
| /video-library | VideoLibrary | Officer + Admin |
| /search | SearchContent | All roles |
| /share | ShareContent | Officer + Admin |
| /reports | Reports | Admin only |
| /audit-logs | AuditLogs | Admin only |
| /settings | Settings | Admin only |
| /help | HelpCenter | All |
| * | NotFound | All |

---

## 🧱 COMPONENT BEHAVIOR NOTES

- **VideoPlayer.jsx**: Integrate react-player, show current time in UI.

- **TagForm.jsx**: Start/End time fields; auto-fill from player time; Save tags to array.

- **TagList.jsx**: List tags; allow delete; show tag type & remarks.

- **RoleGuard.jsx**: Restrict route rendering by role.

- **ComingSoon.jsx**: Reusable placeholder with message + icon.

- **Navbar/Sidebar**: Highlight active module.

- **DashboardCard.jsx**: Reusable small stat card.

---

## 🧠 FINAL REQUIREMENT

Make sure every module mentioned in both PDFs appears as a route or section,
even if not 100% functional, mark it with Coming Soon.
The system should look complete and scalable, not half-built.
