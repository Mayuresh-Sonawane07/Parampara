# ₹0 Free-Tier Production Deployment Guide

Project: **PARAMPARA AR LITE**
National Digital Heritage Platform

The entire application is engineered to deploy seamlessly on 100% free-tier services without introducing paid dependencies or trial credit expiration risks.

---

## 1. Free-Tier Stack Architecture

| Component | Recommended Free Provider | Free Tier Limits | Cost |
|---|---|---|---|
| **Database** | **Neon Free** or **Supabase Free** | 500 MB PostgreSQL, SSL enabled | ₹0 |
| **Backend API** | **Render Free Web Service** | 512 MB RAM, free HTTPS domain | ₹0 |
| **Frontend UI** | **Vercel Hobby** or **Render Static** | Unlimited bandwidth for demo traffic | ₹0 |
| **Media Assets** | **Local static serving** or **Cloudinary Free** | Free 25 GB monthly bandwidth | ₹0 |
| **WebAR Engine** | **AR.js & Client Browser** | Runs 100% on user device | ₹0 |

---

## 2. Step 1: Deploy Database (Neon Free or Supabase)

1. Create a free account on [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
2. Create a new project called `parampara-db`.
3. Copy the PostgreSQL connection string. Format:
   ```
   postgresql://user:password@ep-xyz.region.aws.neon.tech/parampara?sslmode=require
   ```

---

## 3. Step 2: Deploy Backend to Render

1. Create a free account on [render.com](https://render.com).
2. Click **New** -> **Web Service** -> Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: Leave blank (or `backend`)
   - **Environment**: Python 3
   - **Build Command**:
     ```bash
     pip install -r backend/requirements.txt && export PYTHONPATH=backend && python -m app.seed && python -m app.qr_generator
     ```
   - **Start Command**:
     ```bash
     export PYTHONPATH=backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
4. Add Environment Variables:
   - `DATABASE_URL`: `[Your Neon/Supabase PostgreSQL connection string]`
   - `JWT_SECRET`: `[Generate a secure 32+ character random key]`
   - `FRONTEND_URL`: `https://parampara-ar-lite.vercel.app`
   - `ADMIN_DEFAULT_PASSWORD`: `ParamparaAdmin@2026`
5. Click **Deploy**. Note down the assigned URL: `https://parampara-backend.onrender.com`.

---

## 4. Step 3: Deploy Frontend to Vercel

1. Create a free account on [vercel.com](https://vercel.com).
2. Click **Add New Project** -> Import repository.
3. Configure Project Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL`: `https://parampara-backend.onrender.com/api`
5. Click **Deploy**.

---

## 5. Step 4: Regenerate Production QR Codes

Once your production frontend URL is live (e.g. `https://parampara.vercel.app`):
1. Run the QR generator with your production URL:
   ```bash
   python -c "from app.qr_generator import generate_qr_codes; generate_qr_codes('https://parampara.vercel.app')"
   ```
2. The generated posters will now directly navigate mobile scanners to your live production HTTPS experiences.
