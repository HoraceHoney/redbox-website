# The Red Box - Complete Localhost Web Application & Admin Console

Welcome to **The Red Box** official web application package! This standalone package contains:
1. **The Modernized Customer Website** (`http://localhost:8080/`)
2. **The Localhost Admin Console** (`http://localhost:8080/admin.html` or `http://localhost:8080/admin/`)
3. **Verified Offline Datasets** (`branches.json` with 53 outlets, `menu.json` with 271 dishes)
4. **Comprehensive Technical Audit Report** (`.docx` Word Document)

---

## 🚀 Quick Start (One-Click Launch)

### On Windows:
- Double-click **`start_server.bat`**  
*(Or right-click **`start_server.ps1`** and choose **Run with PowerShell**)*  
The server will start at `http://localhost:8080` and open your default browser automatically.

### On macOS / Linux:
```bash
chmod +x start_server.sh
./start_server.sh
```

### With Python directly:
```bash
python server.py
# or
python3 server.py
```

### With Node.js / NPM:
```bash
npm start
# or
node server.js
```

---

## 🌐 URLs Available on Localhost

Once the server is running, you can access:
* 🏠 **Customer Homepage:** `http://localhost:8080/`
* 🥢 **Full Food Menu (271 Dishes):** `http://localhost:8080/menu.html`
* 📍 **57 Outlets Hub:** `http://localhost:8080/outlets.html`
* 📦 **Packaging Engineering:** `http://localhost:8080/thebox.html`
* 📖 **Brand Story & Heritage:** `http://localhost:8080/story.html`
* 🎉 **Catering Budget Calculator:** `http://localhost:8080/catering.html`
* 💼 **Franchise ROI Models:** `http://localhost:8080/franchise.html`
* 🛡️ **Admin Console (Full Localhost Backoffice):** `http://localhost:8080/admin.html` *(or `http://localhost:8080/admin/`)*

---

## 🛡️ Admin Console Features (Included on Localhost)

The included Admin Console (`admin.html`) gives you full offline and live operational control:
* **Dashboard Overview:** Real-time KPI counters (53 Outlets, 271 Dishes, 13 Table Bookings, 10 Enquiries).
* **Outlets & Branches Management:** Search and filter all 53 live branches across 17 regional hubs; Add, Edit, or Delete branches with coordinate tracking.
* **Menu Catalog Management:** Search 271 dishes across 28 categories; filter by dietary type (Veg / Non-Veg); Add, Edit, or Delete dishes.
* **Table Bookings & Diners:** Review 13 customer table bookings with status toggle (New / Confirmed).
* **Customer Enquiries CRM:** Review customer leads, subject classification, and timestamps.
* **Franchise Pipeline:** Review partner investor profiles, investment budgets, and target city requests.
* **Corporate Catering Requests:** Review party headcounts, calculated budgets, and toggle approvals.
* **Careers & Job Openings:** Review job openings and applicant tallies.
* **Website Settings:** Edit headquarters address, phone, email, operating hours, and maintenance mode toggle.
* **Audit Trail:** Chronological security logs of administrative changes.
* **Remote Sync Button:** One-click button to sync live data with the remote Render API (`redbox-admin-backend.onrender.com/api`).

---

## 📁 Package Contents & Structure

```
redbox/
├── index.html            # Main Customer Homepage
├── menu.html             # Full 271-Dish Catalog (28 Categories, Veg/Non-Veg Filters)
├── outlets.html          # 57 Outlets Hub (17 Regional Clusters across South India)
├── thebox.html           # Iconic Packaging & 45-min Heat Retention Engineering
├── story.html            # Brand Journey (2015 to 2026 Expansion Timeline)
├── catering.html         # Party & Corporate Catering Budget Calculator (Live Submission)
├── franchise.html        # Unit & Master Franchise ROI Models (Live Submission)
├── admin.html            # Full Localhost Admin Console SPA
├── admin/
│   └── index.html        # Direct /admin/ directory entry
├── app.js                # Resilient API Engine (4s Render Fallback, Modals, Drawer, Toasts)
├── styles.css            # Custom Typography, Dragon Watermark & Ivory Card Elevation
├── assets/
│   └── images/           # High-resolution logos, banners, dish photos, dragon watermarks
├── data/
│   ├── branches.json     # 53 Live Verified Branch Records (Fallback Cache)
│   └── menu.json         # 271 Catalog Dishes across 28 Categories (Fallback Cache)
├── server.py             # Python 3 Localhost Server with CORS & Admin URL routing
├── server.js             # Node.js Zero-Dependency Localhost Server
├── start_server.bat      # Windows One-Click Batch Launcher
├── start_server.ps1      # Windows PowerShell Launcher
├── start_server.sh       # macOS / Linux Shell Launcher
├── package.json          # Node.js NPM Configuration
├── RedBox_Admin_and_Website_Comprehensive_Audit_Report.docx # Complete Word Audit Report (4.45MB)
└── README.md             # Instructions & Documentation
```
