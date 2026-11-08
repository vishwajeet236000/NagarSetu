# 🏙️ NagarSetu – Delhi Civic Issue Reporting Platform

**Connecting Citizens. Improving Communities.**

NagarSetu is an independent civic-tech platform designed to help citizens report, track, and monitor local civic issues in Delhi through a centralized digital interface.

The platform aims to make civic issue reporting more accessible, transparent, and organized.

> **Disclaimer:** NagarSetu is an independent project and is not affiliated with, endorsed by, or officially integrated with the Delhi Government or any government authority.

---

## ✨ Key Features

### 👤 Citizen Features
- Secure user registration and login.
- Submit civic complaints with descriptions and photographs.
- Track complaint status and history.
- Explore reported issues on an interactive Delhi map.
- View nearby complaints and apply filters.
- Vote on complaints and check potential duplicates.
- Receive notifications and email updates.
- Hindi and English language support.
- Dark mode support.

### 🛡️ Admin & Staff Features
- Dedicated admin dashboard.
- View and manage reported complaints.
- Update complaint status and priority.
- Assign complaints to staff members.
- Add remarks and resolution photographs.
- Manage users and staff roles.
- View analytics and department-wise statistics.
- Export complaint data as CSV.
- Review inappropriate-content reports.

### 📊 Transparency
- Public transparency dashboard.
- Complaint status tracking.
- Complaint history and resolution visibility.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT |
| Charts | Recharts |
| Maps | Interactive Delhi map |
| Image Storage | Local uploads / Cloudinary |
| Deployment | Vercel, Render, MongoDB Atlas |

---

## 📁 Project Structure

```text
NagarSetu/
│
├── client/          # React + Vite frontend
│
├── server/          # Express backend
│
├── README.md
└── .gitignore
```

---

## ⚙️ Getting Started

Follow these steps to run NagarSetu locally.

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB local instance or MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/vishwajeet236000/NagarSetu.git

cd NagarSetu
```

### 2. Configure the Backend

Open a terminal:

```bash
cd server
npm install
```

Create your environment file:

```bash
copy .env.example .env
```

Configure the required environment variables in `server/.env`, including:

- `MONGO_URI`
- `JWT_SECRET`

Configure other variables according to `.env.example`.

Seed the database if required:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

### 3. Start the Frontend

Open a **second terminal**:

```bash
cd client
npm install
npm run dev
```

Open the application:

**http://localhost:5173**

---

## 🚀 Deployment

NagarSetu can be deployed using the following services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Image Storage | Cloudinary (optional) |

### Backend – Render

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Configure environment variables using `.env.example`.
- Set `CLIENT_URL` to your deployed frontend URL.

### Frontend – Vercel

- Root directory: `client`
- Connect your GitHub repository.
- Configure the required API proxy rewrites in `vercel.json`.
- Point `/api/*` and `/uploads/*` to your deployed Render backend.

### Health Check

```text
GET /api/health
```

**Important:** Render's ephemeral filesystem does not guarantee permanent storage for uploaded files. Use Cloudinary or another persistent storage service for production image uploads.

---

## 🔌 API Overview

The backend provides REST API functionality for:

| Module | Functionality |
|---|---|
| Authentication | Register, login, logout, current user |
| Complaints | Create, read, update, delete |
| Complaint History | Track status changes |
| Voting | Vote and unvote |
| Duplicate Detection | Check nearby duplicate complaints |
| Dashboard | Statistics and analytics |
| Notifications | User notifications |
| Administration | Manage complaints, assignments and users |

**Access Control:** Complaint status updates and assignments require admin or staff privileges.

---

## 🌐 Additional Capabilities

- Password reset functionality.
- Optional SMTP-based email notifications.
- Hindi translation across major application sections.
- Responsive dashboards.
- Complaint priority management.
- Public transparency reporting.

Email notifications require SMTP configuration. Without SMTP credentials, emails are skipped and, outside production, notification details are printed in the server console.

To promote a staff member, update the user's `role` field to `staff` in MongoDB.

---

## 🔐 Security Notes

- Never commit `.env` files or private credentials.
- Use strong JWT secrets and database credentials.
- Configure production environment variables securely.
- Restrict administrative operations using role-based access control.

---

## 🎯 Project Vision

NagarSetu aims to provide a structured digital space where citizens can report civic problems, follow their progress, and access public complaint information.

**Building a more connected and accountable community through technology.**

---

## 👨‍💻 Developer

Developed as an independent full-stack civic-tech project.

**GitHub:** [@vishwajeet236000](https://github.com/vishwajeet236000)

**Repository:** [NagarSetu](https://github.com/vishwajeet236000/NagarSetu)

---

*Made with ❤️ and technology for better communities.*