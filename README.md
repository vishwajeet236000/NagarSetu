# NagarSetu
Citizen platform to report and track civic issues in Delhi. React + Vite + Tailwind, Express, MongoDB. Independent platform, no claimed government integration.

## Run locally (Node 18+, MongoDB running)
```
cd server && cp .env.example .env   # set JWT_SECRET and MONGO_URI
npm install && npm run seed && npm run dev
cd ../client && npm install && npm run dev      # http://localhost:5173
```
Cloudinary is optional: without keys, images are saved in `server/uploads` (use Cloudinary in production, since Render's disk is ephemeral).

## Deploy
Server on Render (build `npm install`, start `npm start`, env vars from `.env.example`, `CLIENT_URL` = your Vercel URL). Database on MongoDB Atlas. Client on Vercel (root `client`); add a rewrite of `/api/*` and `/uploads/*` to your Render URL in `vercel.json`. Health check: `GET /api/health`.

## API
Implemented: auth (register/login/logout/me), complaints (CRUD, history, status, vote/unvote, duplicate check within 100 m), dashboard stats/analytics, notifications, admin (complaints, assign, users). Status changes and assignment require admin/staff.

## Added in v2
Citizen dashboard, admin dashboard (Recharts, status/department/remarks/resolution photos, user list, CSV export), notification bell, Delhi map with filters and nearby list, password reset, email notifications (set SMTP_* in `.env`; without them emails are skipped and, outside production, printed to the server console), Hindi/English toggle (navigation and home hero only), dark mode.
To promote a staff member: set `role` to `staff` on the user in MongoDB.

## Added in v3
Report-inappropriate flow (citizens report; admins dismiss or reject), admin priority editing, public transparency dashboard (`/transparency`), and Hindi translation across navigation, forms, dashboards and status labels. Category names in dropdowns stay in English.
