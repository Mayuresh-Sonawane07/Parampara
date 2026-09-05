# Local Development & Setup Guide: PARAMPARA AR LITE

National Living Heritage Platform • Scan • Discover • Preserve

---

## 1. Prerequisites

- **Python**: 3.10, 3.11, 3.12, 3.13, or 3.14
- **Node.js**: v18+ or v20+ (Node v24 tested)
- **Git**

---

## 2. Quickstart Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/your-team/parampara-ar-lite.git
cd parampara-ar-lite
```

### Step 2: Backend Setup
```bash
# Create Python virtual environment
python -m venv .venv

# Activate environment
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On macOS / Linux:
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Seed verified cultural database (traditions, sources, quizzes, AR hotspots)
python -m app.seed

# Create administrator account
python -m app.create_admin --username admin --email admin@parampara.heritage --password YourSecurePassword2026!
# Or run interactively (will prompt securely for password):
# python -m app.create_admin

# Generate physical QR assets
python -m app.qr_generator

# Start FastAPI backend server
uvicorn app.main:app --reload --port 8000
```
The backend will be live at `http://localhost:8000`.
Interactive API documentation is available at `http://localhost:8000/docs`.

---

## 3. Frontend Setup

In a second terminal window:
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will be live at `http://localhost:5173`.

---

## 4. Admin Management

For platform administration and testing:
- **Admin Portal**: `http://localhost:5173/admin`
- **Username & Password**: Created via `python -m app.create_admin` above.
- **Admin CLI Help**:
  ```bash
  python -m app.create_admin --help
  ```
