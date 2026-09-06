# PARAMPARA AR LITE: Free Cloud Deployment Guide

This guide provides step-by-step instructions to deploy the entire **PARAMPARA AR LITE** living heritage platform **100% free forever** with SSL/HTTPS, automated Git deployments, and zero cloud hosting costs.

---

## Architecture Summary

| Component | Technology | Recommended Free Host | Free Tier Highlights |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + TypeScript | **Vercel** / **Netlify** | Global Edge CDN, automated preview builds, free SSL, 100 GB bandwidth/mo |
| **Backend API** | FastAPI + Python 3.11 + Uvicorn | **Render.com** / **Koyeb** | 750 free compute hours/mo, free SSL, native Python runtime |
| **Database** | SQLite / PostgreSQL | **Built-in SQLite** or **Neon / Supabase** | Free serverless PostgreSQL (0.5 GB free storage) |
| **TTS Narration**| gTTS / Regional Audio Proxy | Included in Backend | In-memory & audio buffer streaming for English, Hindi, Marathi |

---

## Method A: The Recommended Setup (Vercel + Render in 5 Minutes)

This is the standard modern web architecture: your Vite Single Page App is served by Vercel's global CDN, and dynamic API requests route to your FastAPI backend on Render.

### Step 1: Push Your Code to GitHub
Ensure all your project files are committed to a GitHub repository:
```bash
git add .
git commit -m "feat: complete living heritage platform with 30 motifs and admin console"
git push origin main
```

---

### Step 2: Deploy Backend to Render.com (Free)

1. Sign up or log in at **[render.com](https://render.com)** (you can sign in with GitHub).
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and pick your `PARAMPARA` repository.
4. Fill in the service configuration:
   - **Name**: `parampara-api` (or any name you like)
   - **Region**: Choose the closest region (e.g. `Singapore` or `Frankfurt` or `Oregon`)
   - **Branch**: `main`
   - **Root Directory**: *(Leave empty)*
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r backend/requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT --app-dir backend
     ```
   - **Instance Type**: **Free** ($0/month)
5. Under **Advanced** → **Add Environment Variable**:
   - `PYTHON_VERSION` = `3.11.9`
   - `JWT_SECRET` = *(Click "Generate" or type a secure random string)*
   - `FRONTEND_URL` = `*`
6. Click **Create Web Service**.
7. Render will build and launch your backend. Once deployed, note down your backend URL (e.g. `https://parampara-api.onrender.com`).
8. Verify it by visiting `https://parampara-api.onrender.com/api/health` in your browser. You should see:
   ```json
   { "status": "healthy", "heritage_data_authenticity": "VERIFIED_ZERO_FABRICATION" }
   ```
   *(Note: The database automatically self-seeds all 4 living traditions, 30 Warli motifs, UNESCO citations, and the default admin user on first launch!)*

---

### Step 3: Deploy Frontend to Vercel (Free)

1. Sign up or log in at **[vercel.com](https://vercel.com)** using your GitHub account.
2. Click **Add New…** → **Project**.
3. Import your `PARAMPARA` repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select **`frontend`**.
   - **Build Command**: `npm run build` *(detected automatically)*
   - **Output Directory**: `dist` *(detected automatically)*
5. Open the **Environment Variables** section and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://parampara-api.onrender.com` *(use your actual Render backend URL from Step 2 without a trailing slash)*
6. Click **Deploy**.
7. In ~40 seconds, Vercel will finish building. Click on your assigned domain (e.g. `https://parampara.vercel.app`).

> [!TIP]
> The included [`frontend/vercel.json`](file:///c:/Users/Mayuresh/PARAMPARA/frontend/vercel.json) and [`frontend/public/_redirects`](file:///c:/Users/Mayuresh/PARAMPARA/frontend/public/_redirects) automatically configure Single Page Application rewrites so page refreshes on deep routes like `/tradition/warli/ar` or `/admin` will never trigger a 404!

---

## Method B: All-In-One Monolithic Deployment (Single URL)

If you prefer having **one single domain** for both the frontend and the backend (e.g., `https://parampara.onrender.com`), you can deploy using the included multi-stage [`Dockerfile`](file:///c:/Users/Mayuresh/PARAMPARA/Dockerfile).

### Where to host for free:
1. **Koyeb** ([koyeb.com](https://www.koyeb.com)):
   - Offers a **Free Nano instance** (512MB RAM, continuous deployment).
   - Click **Create App** → GitHub → Select repository.
   - Choose **Dockerfile** as the builder.
   - Koyeb will run the multi-stage Docker build, compile the Vite frontend, and serve everything via FastAPI on port `8000`.
2. **Hugging Face Spaces** ([huggingface.co/spaces](https://huggingface.co)):
   - 100% Free Docker space with **16 GB RAM and 2 vCPUs** that never spins down!
   - Create a new Space → Select **Docker** SDK → Blank.
   - Push this repository to your Space repository.
3. **Render (Docker)**:
   - When creating a Web Service on Render, select **Docker** as the environment. Render will build the container from `Dockerfile`.

---

## Free Database Options: SQLite vs. PostgreSQL

### 1. Default: Self-Contained SQLite (`parampara.db`)
- Zero configuration required.
- Automatically created and pre-seeded on first launch.
- Perfect for exhibitions, hackathons, and community presentations.

### 2. Upgrade to Serverless PostgreSQL (100% Free)
If you want persistent external cloud storage across container restarts:
1. Create a free database at **[Neon.tech](https://neon.tech)** or **[Supabase.com](https://supabase.com)** (both offer free PostgreSQL with instant connection strings).
2. Copy your connection URL (e.g. `postgresql://user:password@ep-xyz.neon.tech/parampara`).
3. Add it as an environment variable in Render or Koyeb:
   ```env
   DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/parampara?sslmode=require
   ```
4. The backend [`config.py`](file:///c:/Users/Mayuresh/PARAMPARA/backend/app/config.py) automatically handles PostgreSQL driver syntax and seeds the tables on first startup!

---

## Post-Deployment Verification Checklist

After deploying, verify these 5 core experiences:
1. **Public Catalog**: Visit `/explore` — ensure all 4 traditions (Thathera, Toda, Chhau, Warli) load with verified images.
2. **Poster Parity**: Visit `/posters` — verify images match the Explore catalog.
3. **WebAR Scanner**: Visit `/tradition/warli/ar` — test live webcam scan or select one of the curated sample paintings to verify dynamic 30-motif pin recognition.
4. **Multilingual Audio**: Click the speaker icon to test narration playback in **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)**.
5. **Curatorial Admin Console**: Visit `/admin/login` and log in:
   - **Username**: `admin`
   - **Password**: `ParamparaAdmin@2026`
   - Verify that the navigation bar transforms into the **Curatorial Admin Console** and allows managing submissions, traditions, sources, and running live system health diagnostics.
