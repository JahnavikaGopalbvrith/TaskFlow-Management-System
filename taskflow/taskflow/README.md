# TaskFlow — Full-Stack Task Management System

A production-ready Task Manager with JWT auth, analytics, dark mode, and responsive design.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts, react-hot-toast |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Styling | Pure CSS with CSS Variables (dark mode) |

---

## Project Structure

```
taskflow/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Login, signup, getMe
│   │   ├── taskController.js      # CRUD + toggle + filters
│   │   └── analyticsController.js # Aggregation analytics
│   ├── middleware/
│   │   ├── auth.js               # JWT protect + RBAC authorize
│   │   ├── errorHandler.js       # Global error middleware
│   │   └── validate.js           # express-validator rules
│   ├── models/
│   │   ├── User.js               # User schema + bcrypt hooks
│   │   └── Task.js               # Task schema + indexes
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── analytics.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/index.html
    └── src/
        ├── context/
        │   ├── AuthContext.js    # Auth state + API calls
        │   └── ThemeContext.js   # Dark/light mode
        ├── components/
        │   ├── Layout.js         # Sidebar + Topbar wrapper
        │   ├── Sidebar.js        # Navigation sidebar
        │   ├── TaskCard.js       # Individual task row
        │   └── TaskModal.js      # Create/Edit task form
        ├── pages/
        │   ├── Login.js
        │   ├── Signup.js
        │   ├── Tasks.js          # Main task list with filters
        │   └── Analytics.js      # Charts & stats dashboard
        ├── styles/global.css
        ├── utils/api.js          # Axios instance
        └── App.js
```

---

## Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### 1. Clone & Setup Backend

```bash
cd taskflow/backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 2. Setup Frontend

```bash
cd taskflow/frontend
npm install
npm start
# App runs on http://localhost:3000
```

### 3. MongoDB Setup (Local)

```bash
# Install MongoDB and start it
mongod --dbpath /data/db
# The app will auto-create the 'taskflow' database
```

### Using MongoDB Atlas (Cloud)
1. Create a free cluster at mongodb.com/atlas
2. Get connection string and set `MONGODB_URI` in `.env`

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Register user |
| POST | /api/auth/login | No | Login user |
| GET | /api/auth/me | Yes | Get current user |

### Tasks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/tasks | Yes | Get all (paginated, filtered) |
| POST | /api/tasks | Yes | Create task |
| GET | /api/tasks/:id | Yes | Get single task |
| PUT | /api/tasks/:id | Yes | Update task |
| DELETE | /api/tasks/:id | Yes | Delete task |
| PATCH | /api/tasks/:id/toggle | Yes | Toggle done/todo |

#### Task Query Parameters
- `search` — full-text search on title/description
- `status` — `Todo` | `In Progress` | `Done`
- `priority` — `Low` | `Medium` | `High`
- `page` — page number (default: 1)
- `limit` — per page (default: 10, max: 50)
- `sortBy` — `createdAt` | `dueDate` | `priority` | `title`
- `sortOrder` — `asc` | `desc`

### Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/analytics | Yes | Full analytics summary |

---

## Features

### ✅ Core
- [x] User signup & login with JWT
- [x] Create, read, update, delete tasks
- [x] Mark task as complete (toggle)
- [x] Task fields: title, description, status, priority, due date

### 🔍 Filtering & Search
- [x] Search by title/description
- [x] Filter by status
- [x] Filter by priority
- [x] Sort by date / priority

### 📊 Analytics
- [x] Total / completed / pending / in-progress / overdue counts
- [x] Completion percentage ring chart
- [x] Status breakdown (pie chart + progress bars)
- [x] Priority breakdown (bar chart)
- [x] Completion activity — last 7 days (bar chart)
- [x] Recently added tasks list

### 🎨 UI/UX
- [x] Clean, minimal design with Syne + DM Sans fonts
- [x] Full dark mode with OS detection
- [x] Responsive (mobile-first sidebar)
- [x] Loading & error states
- [x] Toast notifications
- [x] Pagination with ellipsis
- [x] Overdue & soon-due date highlighting

### ⚙️ Technical
- [x] JWT authentication with interceptors
- [x] Global error middleware
- [x] MongoDB indexes for optimized queries
- [x] Input validation (express-validator + client-side)
- [x] Role-based access control (user/admin)
- [x] Debounced search
- [x] Automatic completedAt timestamp

---

## Environment Variables

```env
# backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

```env
# frontend/.env (optional)
REACT_APP_API_URL=http://localhost:5000/api
```
