# 🎓 UniFlow — University Management System (UMS)

UniFlow is a full-featured University Management System built with modern web technologies, featuring a responsive, dashboard-aligned UI (deep indigo/purple theme) and a Node.js + Express backend with JWT authentication and SQLite storage.

---

## ✨ Features

- **Modern & Responsive UI**: Clean dashboard aesthetic with custom color palette (Indigo `#4F46E5`, Deep Purple `#2D1B69`, Light Background `#F7F8FC`).
- **Authentication & Role-Based Access Control**:
  - Sign in as **Student**, **Faculty**, or **Administrator**.
  - Interactive role switching tabs with pre-loaded mock credentials.
  - Secure account registration (Signup) with role selection.
  - Password visibility toggle and form validation.
  - Dual-mode support: Seamlessly works with the Express API backend, with automated fallback to `localStorage` for offline / static hosting.
- **Academic Dashboard**:
  - Semester overview and schedules.
  - Course listings and credits.
  - Attendance tracking and visual progress indicators.
  - Upcoming exams and notification center.
  - Fee status overview.
- **RESTful API Backend**:
  - Express.js server with JSON REST endpoints.
  - JWT token-based authentication with bcrypt password hashing.
  - SQLite database (`better-sqlite3`) pre-seeded with sample courses, users, and enrollments.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Custom Properties & Flex/Grid), Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (via `better-sqlite3` with WAL mode)
- **Security**: `bcryptjs` (password hashing), `jsonwebtoken` (JWT authentication), `cors`

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/abhisheksingh-181/UNIVERSITY_MANAGEMENT_SYSTEM.git
cd UNIVERSITY_MANAGEMENT_SYSTEM
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Start the Application
```bash
# Start backend server + static frontend
npm start

# Or run with auto-reload
npm run dev
```

Visit **`http://localhost:5500`** in your browser.

---

## 🔑 Default Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Student** | `abhishek@uniflow.edu` | `password` |
| **Faculty** | `sharma@uniflow.edu` | `password` |
| **Admin** | `admin@uniflow.edu` | `password` |

You can also click **"Create an account"** on the login page to register new users with customized roles.

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/signup` — Register new user (`name`, `email`, `password`, `role`)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get authenticated user details

### Academic & Dashboard
- `GET /api/stats` — Role-specific dashboard statistics
- `GET /api/courses` — Course catalog & enrollment records
- `POST /api/courses` — Create new course (Admin/Faculty)
- `POST /api/enroll` — Enroll student in course (Admin)
- `GET /api/exams` — Upcoming and past exams
- `GET /api/fees` — Student fee balance and history
- `GET /api/attendance` — Course attendance percentages
- `GET /api/announcements` — Campus announcements
- `GET /api/users` — User management (Admin only)

---

## 📂 Project Structure

```
├── public/                 # Static frontend assets
│   ├── index.html          # Login & Signup page
│   ├── style.css           # Modern theme styling
│   ├── script.js           # Auth & view interactions
│   ├── dashboard.html      # Main academic dashboard
│   ├── dashboard.css
│   ├── dashboard.js
│   ├── courses.html        # Courses view
│   ├── courses.css
│   ├── student-profile.html# Student profile
│   └── student-profile.css
├── routes/
│   ├── auth.js             # Authentication routes (login/signup)
│   └── api.js              # Academic & dashboard API endpoints
├── middleware/
│   └── auth.js             # JWT verification & RBAC middleware
├── database/
│   └── db.js               # SQLite database setup and seed data
├── server.js               # Express application entry point
├── package.json
└── README.md
```

---

## 📄 License
MIT License.
