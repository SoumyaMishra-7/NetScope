# NetScope X - Real-Time Network Analytics Dashboard

NetScope X is a modern cybersecurity SaaS dashboard built with React, Vite, Tailwind CSS, React Router, Axios, Recharts, Framer Motion, Lucide React, FastAPI, and PostgreSQL-ready SQL artifacts. The app focuses on frontend engineering quality: reusable components, protected routes, real-time simulated analytics, upload workflows, searchable packet tables, and responsive admin layouts.

## Features

- Premium dark cybersecurity dashboard with responsive sidebar navigation.
- Protected login flow with fake local authentication.
- Realtime latency chart updated every 2 seconds.
- Dashboard cards for active devices, health, packet loss, connections, latency, and threat detection.
- Recharts line, area, bar, and pie visualizations.
- Advanced packet table with debounced search, filters, sorting, pagination, and status pills.
- Dynamic packet route: `/packet/:id`.
- Drag-and-drop `.txt` and `.json` log upload workflow with progress and analytics summary.
- Axios API service layer with graceful mock-data fallback.
- FastAPI endpoints for `/packets`, `/packets/{id}`, `/analytics`, `/devices`, `/logs`, and `/analyze`.
- PostgreSQL schema, seed data, joins, filters, sorting, and analytics SQL queries.

## Project Structure

```text
NetScope/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── sql/
│       ├── schema.sql
│       ├── seed.sql
│       └── queries.sql
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/
│       ├── data/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── styles/
│       └── utils/
└── README.md
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Run Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

FastAPI docs are available at `http://127.0.0.1:8000/docs`.

## Environment

The frontend defaults to `http://127.0.0.1:8000` for API calls. Override with:

```bash
VITE_API_BASE_URL=https://your-api.example.com
```

If the backend is unavailable, the frontend uses realistic mock API responses from `src/data/mockData.js`.

## PostgreSQL

Create and seed a local database:

```bash
psql -d netscope_x -f backend/sql/schema.sql
psql -d netscope_x -f backend/sql/seed.sql
```

Useful production-style queries are in `backend/sql/queries.sql`, including packet filtering, latency sorting, protocol analytics, threat summaries, log rollups, and device health joins.

## Deployment Notes

- Frontend: deploy `frontend` to Vercel, Netlify, or any static host with `npm run build`.
- Backend: deploy `backend` to Render, Railway, Fly.io, or any ASGI host.
- Database: use managed PostgreSQL and run files from `backend/sql`.
- Set `VITE_API_BASE_URL` in the frontend deployment environment.

## Resume Summary

Built NetScope X, a production-style cybersecurity analytics dashboard using React, Vite, Tailwind CSS, Recharts, Framer Motion, Axios, FastAPI, and PostgreSQL-ready SQL. Implemented protected routes, reusable component architecture, real-time simulated telemetry, advanced packet search/filter workflows, dynamic packet inspection, log upload analytics, mock API fallback, and database schema/query artifacts.
