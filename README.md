# IPRD ERP System

## Enterprise-Grade Government Content Management Platform

A complete, production-grade MVP web-based centralized content management and digital archive system for government departments (IPRD). This system allows uploading, managing, searching, tagging, and sharing of official content (videos, photos, documents, and reports) with role-based access, hybrid storage access, and audit trails.

---

## ⚠️ Important Notice

**This project is proprietary and confidential.**
This is the exclusive intellectual property of mrbuddhu. **This project should not be copied, distributed, reproduced, or used in any form without explicit written permission.** All rights reserved.

---

## 🌟 Features

### Core Functionality
- ✅ **Role-Based Access Control (RBAC)** - 6 roles: Super Admin, Department Admin, District Officer, Block Officer, Staff, Viewer
- ✅ **Content Management** - Upload videos, photos, documents, reports with comprehensive metadata
- ✅ **Video Library** - 3-phase workflow: Raw → Editor Processing → Output Uploads
- ✅ **Advanced Search & Filters** - Real-time debounced search with multiple filter options
- ✅ **Content Sharing** - Share full files or video clips with timestamp ranges
- ✅ **Audit Logs** - Complete audit trail of all user actions
- ✅ **Reports & Analytics** - Charts, graphs, and export functionality (CSV/JSON)
- ✅ **Master Settings** - CRUD operations for Departments, Districts, Blocks, Roles
- ✅ **Toast Notifications** - Professional notifications replacing alerts
- ✅ **Loading States** - Skeleton loaders and spinners for better UX
- ✅ **Mobile Responsive** - Fully responsive design with collapsible sidebar

### Technical Features
- **File Format Support**: Videos (MP4, AVI, MOV, etc.), Images (JPG, PNG, GIF, etc.), Documents (PDF, DOC, XLS, etc.), Archives (ZIP, RAR, etc.)
- **ZIP File Viewer**: View and extract contents from ZIP archives
- **Video Tagging**: Tag specific time ranges with categories (Best Practice, Innovation, Achievement, etc.)
- **Clip Sharing**: Share specific portions of videos with timestamps
- **Hybrid Access Control**: Simulated cloud vs local network access
- **Hindi/English Toggle**: Full bilingual support
- **Background Logo Watermark**: Professional faded repeating logo pattern

## 🚀 Tech Stack

- **React 18** - Frontend framework
- **React Router DOM** - Routing
- **TailwindCSS** - Styling
- **react-player** - Video playback
- **react-hot-toast** - Notifications
- **recharts** - Charts and graphs
- **jszip** - ZIP file handling
- **LocalStorage** - Data persistence (no backend required)

## 📁 Project Structure

```
iprd-erp/
├── public/
│   ├── bihar-logo-red.png
│   ├── favicon.ico
│   └── .htaccess
├── src/
│   ├── components/
│   │   ├── BackgroundLogo.jsx
│   │   ├── ComingSoon.jsx
│   │   ├── DashboardCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── RoleGuard.jsx
│   │   ├── SearchFilters.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SkeletonCard.jsx
│   │   ├── SkeletonTable.jsx
│   │   ├── TagForm.jsx
│   │   ├── TagList.jsx
│   │   ├── Toast.jsx
│   │   ├── VideoPlayer.jsx
│   │   └── ZipViewer.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── LanguageContext.jsx
│   ├── data/
│   │   ├── mockData.json
│   │   └── translations.json
│   ├── pages/
│   │   ├── AddContent.jsx
│   │   ├── AuditLogs.jsx
│   │   ├── Dashboard.jsx
│   │   ├── HelpCenter.jsx
│   │   ├── Login.jsx
│   │   ├── MasterSettings.jsx
│   │   ├── NotFound.jsx
│   │   ├── Reports.jsx
│   │   ├── SearchContent.jsx
│   │   ├── Settings.jsx
│   │   ├── ShareContent.jsx
│   │   └── VideoLibrary.jsx
│   ├── utils/
│   │   ├── auditLog.js
│   │   ├── debounce.js
│   │   ├── fileFormats.js
│   │   └── translations.js
│   ├── App.jsx
│   ├── index.js
│   └── styles.css
└── package.json
```

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrbuddhu/iprd-erp.git
   cd iprd-erp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📋 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🌐 Deployment

The application is configured for Hostinger hosting:

1. Build the project: `npm run build`
2. Upload the `build` folder contents to `public_html` on Hostinger
3. The `.htaccess` file handles SPA routing

## 👥 User Roles

- **Super Admin** - Full access to all features
- **Department Admin** - Manage departments, view reports, full content access
- **District Officer** - Upload, search, share content
- **Block Officer** - Upload, search, share content
- **Staff** - Upload, search, share content
- **Viewer** - Search and view content only

## 📝 Key Modules

1. **Dashboard** - Statistics, recent uploads, top tags
2. **Master Settings** - Manage Departments, Districts, Blocks, Roles
3. **Add Content** - Upload files with metadata
4. **Library** - View all content types with filtering
5. **Search Content** - Advanced search with filters
6. **Share Content** - Share files or video clips
7. **Reports** - Analytics, charts, export functionality
8. **Audit Logs** - Track all user actions
9. **Settings** - Change password, manage preferences
10. **Help Center** - Support and documentation

## 🔐 Features in Detail

### Content Upload
- Support for multiple file formats
- Automatic metadata extraction (duration, dimensions, file size)
- File size validation (100MB limit)
- Comprehensive form validation

### Video Library
- 3-phase workflow: Raw → Editing → Final
- Video tagging with timestamps
- Clip extraction and sharing
- Duration and metadata display

### Search & Filter
- Real-time debounced search
- Filter by department, district, block, content type, tags, date range
- Search across titles, departments, person tags, and tags

### Reports
- Pie charts (Uploads by Department)
- Line charts (Uploads by Month)
- Bar charts (Content by Type)
- Date range filtering
- CSV/JSON export

## 🌍 Internationalization

- Hindi/English language toggle
- Complete translations for all UI elements
- Persistent language preference

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Hamburger menu for navigation
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🔄 Coming Soon Features

- Advanced Mapping features
- Bulk Upload functionality
- Full Analytics Dashboard expansion
- Enhanced Audit Log viewer
- User Guide documentation

## 🤝 Contributing

This is a government project. For contributions or queries, please contact the project maintainer.

## 📄 License & Confidentiality

This project and all associated materials are confidential and proprietary.
© 2026 mrbuddhu. All Rights Reserved.

No part of this project may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of mrbuddhu.

## 👨‍💻 Developed By

SanganakHQ - Innovation & Growth Boutique

---

**Note**: This system uses localStorage for data persistence. For production deployment with a backend, data should be migrated to a proper database.

---

**This is a high-value enterprise project with an estimated development cost exceeding $40,000 USD.**