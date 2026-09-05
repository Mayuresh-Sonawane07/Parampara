@echo off
echo ===================================================
echo Starting PARAMPARA AR LITE (Backend + Frontend)
echo ===================================================
start "PARAMPARA Backend (FastAPI)" cmd /k "cd /d ""%~dp0"" && call .venv\Scripts\activate.bat && set PYTHONPATH=backend && uvicorn app.main:app --reload --port 8000"
start "PARAMPARA Frontend (Vite)" cmd /k "cd /d ""%~dp0\frontend"" && npm run dev"
echo.
echo [OK] Both servers are launching in dedicated windows!
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:8000
echo - API Documentation: http://localhost:8000/docs
echo ===================================================
