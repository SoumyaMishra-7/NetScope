# NetScope - Network Diagnostic Dashboard

NetScope is a lightweight full-stack web application that performs real-time domain connectivity diagnostics. Users enter a domain name (for example, `example.com`), and the app returns DNS resolution, open/closed ports, HTTP reachability, latency, and a calculated connectivity score.

## Features

- FastAPI backend with clean REST endpoint: `GET /analyze?domain=`
- Real DNS resolution using `socket.gethostbyname()`
- TCP port scanning for `80`, `443`, `22`, and `8080`
- HTTP HEAD check using `requests`
- Latency measurement using socket timing
- Connectivity score engine (0-100) with verdict labels
- Modern responsive dark UI using HTML, CSS, and vanilla JavaScript
- CORS enabled for frontend-backend integration
- Beginner-friendly code with clear function separation

## Project Structure

```text
NetScope/
+-- backend/
¦   +-- main.py
¦   +-- requirements.txt
+-- frontend/
¦   +-- index.html
¦   +-- styles.css
¦   +-- script.js
+-- README.md
```

## Installation

### 1. Clone and open project

```bash
git clone <your-repo-url>
cd NetScope
```

### 2. Setup backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

## Run Locally

### 1. Start backend (FastAPI)

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at `http://127.0.0.1:8000/docs`

### 2. Start frontend

You can serve the `frontend` folder using any static server.

Example with Python:

```bash
cd frontend
python -m http.server 5500
```

Open `http://127.0.0.1:5500`

## Connectivity Score Logic

- DNS success: `+40`
- Port `443` open: `+25`
- Port `80` open: `+15`
- HTTP success: `+20`
- Low latency bonus: `+10` (if latency < 120 ms)
- Final score is capped at `100`

Verdict:

- `75-100`: Healthy
- `40-74`: Partial / Slow
- `<40`: Not Reachable

## Deployment

### Backend on Render

1. Push repository to GitHub.
2. On Render, create a **Web Service** from the repo.
3. Root directory: `backend`
4. Build command:
   - `pip install -r requirements.txt`
5. Start command:
   - `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy and copy backend URL.

### Frontend on Vercel

1. Create a new Vercel project from the same repo.
2. Set root directory to `frontend`.
3. Deploy as static site.
4. Update `frontend/script.js` `API_BASE` to your Render backend URL.
5. Redeploy frontend.

## Resume-Ready Description

Built **NetScope**, a full-stack network diagnostic dashboard using **FastAPI, Python socket programming, and vanilla JavaScript**. Implemented DNS lookup, TCP port scanning, HTTP health checks, latency measurement, and a weighted connectivity scoring engine to classify endpoint health in real time.

## 30-Second Interview Explanation

"NetScope is a networking-focused full-stack project where users enter a domain and get structured diagnostics instantly. On the backend, I used FastAPI and Python sockets to perform real DNS resolution, multi-port TCP checks, latency measurement, and HTTP reachability. Then I combined those signals into a weighted score and verdict for quick health interpretation. On the frontend, I built a responsive dark dashboard with vanilla JavaScript and dynamic rendering, and prepared deployment using Render and Vercel."
