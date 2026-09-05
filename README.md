# PARAMPARA AR LITE

### SCAN • DISCOVER • PRESERVE

**National Digital Heritage Initiative**
- **Theme**: Heritage & Culture • Living Traditions of India
- **Focus**: Physical-to-Digital Heritage Bridge & Community Preservation
- **Deployment Cost**: ₹0 (100% Free-Tier Architecture)

---

## 1. Project Overview

**Parampara AR Lite** is a community-oriented digital heritage platform that bridges physical traditions (in museums, heritage festivals, and artisan clusters) with interactive, research-backed digital discovery and community-driven preservation.

Traditional heritage exhibits are often static, fragmented, and disconnected from the deeper cultural significance behind motifs, techniques, and rituals. Parampara AR Lite provides a physical-to-digital bridge: visitors scan a single clean QR code on physical heritage posters to unlock dedicated interactive digital experiences, real WebAR target recognition, verified quizzes, and community knowledge contribution.

---

## 2. The Zero-Mock / Zero-Fabrication Guarantee

**Non-Negotiable Ethical Cultural Standard:**
- **Zero Mock / Fabricated Data**: All cultural descriptions, historical dates, tool names, and motif meanings are grounded in primary archival sources (UNESCO, Government of India GI Registry, and INTACH).
- **No Fabricated Local Voices**: We never invent quotes or fictitious artisans. Community submissions are held in a `PENDING` queue and reviewed by administrators before publication as authentic Community Voice.
- **Traceable Source Citations**: Every tradition and quiz question cites its institutional archival dossier.

---

## 3. Four-Region Strategic Heritage Architecture

| Region | Tradition | Community | Experience Type | Ground Truth Authority |
|---|---|---|---|---|
| **North** | **Thathera Metal Craft** | Thatheras of Jandiala Guru, Punjab | **8-Stage Craft Journey** | UNESCO Representative List File 00845 |
| **South** | **Toda Embroidery (Pukhoor)** | Toda Nilgiri Pastoral Tribe, Tamil Nadu | **Motif Explorer & Technique Guide** | Geographical Indications Registry No. 135 |
| **East** | **Chhau Dance** | Regional Akhadas (JH, WB, OD) | **3-Style Performance Explorer** | UNESCO Representative List File 00337 |
| **West** | **Warli Painting** | Warli Adivasi Tribe, Maharashtra | **Flagship WebAR + Digital Fallback** | INTACH Cultural Mapping & GI Registry No. 342 |

---

## 4. Key Features

- **Flagship WebAR Experience (Warli Painting)**:
  - Real browser camera target recognition via open-source WebAR.
  - Interactive pulsating hotspots (Tarpa Spiral Dance, Mother Goddess Palaghata, Sacred Tree of Life, Agricultural Cultivation).
  - Spoken audio narration via browser speech synthesis.
  - Robust interactive digital fallback when camera is unavailable or denied.
- **Thathera Craft Journey**:
  - Interactive 8-stage timeline: Ingot Selection -> Charcoal Furnace Firing -> Sledgehammering -> Bowl Shaping -> Brazing -> Acid & Tamarind Polish -> Surface Dimpling (Kandhai) -> Tinning (Kalai).
- **Toda Motif Explorer**:
  - High-resolution interactive Poothkulli fabric canvas with zoom, pan, and motif hotspot pins.
  - 5-step counted-thread technique guide explaining reverse-side darning without stencils.
- **Chhau Performance Explorer**:
  - Three distinct regional styles selector: Seraikella (stylized pastel masks), Purulia (oversized feathered masks & acrobatic somersaults), and Mayurbhanj (maskless bare-faced martial expression).
  - High-energy percussion orchestra breakdown (Dhol, Nagara, Dhumsa, Mohuri).
- **Physical-to-Digital Poster System**:
  - Printable A4 exhibition posters with authentic artwork and a single, verified QR code routing to `/scan/:slug`.
- **Verified Quiz Engine**:
  - 3-5 multiple-choice questions per tradition with immediate score computation, detailed archival explanations, and source citations.
- **Community Contribution & Admin Review**:
  - Public submission form with strict input validation, consent verification, and reference citations.
  - Authenticated admin dashboard (`/admin`) displaying real system metrics (zero mock statistics) and approve/reject workflows.

---

## 5. Technology Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router v7.
- **Backend**: FastAPI (Python 3.14/3.11+), Pydantic v2, SQLAlchemy 2.0, Uvicorn.
- **Database**: SQLite for local zero-dependency development; PostgreSQL (Neon Free or Supabase Free) for production.
- **Authentication**: JWT access tokens + PBKDF2-SHA256 password hashing.
- **Augmented Reality**: WebAR (client-side browser camera API + computer vision target recognition).
- **QR Generation**: Open-source Python `qrcode` + Pillow.

---

## 6. Quickstart Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/your-team/parampara-ar-lite.git
cd parampara-ar-lite
```

### Step 2: Backend Setup
```bash
python -m venv .venv

# On Windows:
.\.venv\Scripts\Activate.ps1
# On Linux / macOS:
source .venv/bin/activate

pip install -r backend/requirements.txt

# Seed database with verified sources and traditions
$env:PYTHONPATH = "backend"
python -m app.seed

# Create administrator account
python -m app.create_admin --username admin --email admin@parampara.heritage --password YourSecurePassword2026!

# Generate physical QR poster assets
python -m app.qr_generator

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
Interactive Swagger documentation will be available at `http://localhost:8000/docs`.

### Step 3: Frontend Setup
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 7. Testing & Verification

Run the automated backend test suite:
```bash
$env:PYTHONPATH = "backend"
.\.venv\Scripts\pytest backend/tests/ -v
```

Build the production frontend bundle:
```bash
cd frontend
npm run build
```

---

## 8. Live Demonstration Walkthrough (5–7 Minutes)

1. **Homepage**: Overview of Parampara, living regional traditions, and the Zero-Mock Data guarantee.
2. **Physical Posters**: View `/posters` showing the printable Warli poster with its single QR code.
3. **QR Entry**: Visit `/scan/warli` to demonstrate the instant physical-to-digital transition.
4. **Warli WebAR**:
   - Allow camera access.
   - Align camera with Warli artwork to detect hotspots.
   - Tap "Tarpa Spiral Dance" hotspot -> Inspect cultural significance -> Play spoken narration.
   - Demonstrate the instant Digital Fallback mode.
5. **Active Learning Quiz**: Complete the Warli quiz to demonstrate immediate scoring with archival citations.
6. **Diverse Experiences**:
   - Open **Toda Motif Explorer** (`/tradition/toda/experience`) to demonstrate counted-thread zoom/pan.
   - Open **Thathera Craft Journey** (`/tradition/thathera/experience`) to walk through the 8 metalworking stages.
   - Open **Chhau Performance Explorer** (`/tradition/chhau/experience`) to compare Seraikella, Purulia, and Mayurbhanj styles.
7. **Community Contribution**: Submit a controlled test contribution on `/contribute`.
8. **Admin Review**: Log into `/admin` -> Review submission -> Approve as verified Community Voice.

---

## 9. Free-Tier Deployment Strategy

The application is deployable at ₹0 cost:
- **Frontend**: Vercel Hobby or Render Static Site
- **Backend**: Render Free Web Service
- **Database**: Neon Free or Supabase Free (PostgreSQL)
- **Media**: Static serving or Cloudinary Free tier

Detailed deployment instructions are documented in [`docs/deployment.md`](docs/deployment.md).

---

## 10. Future Roadmap

- **Progressive Web App (PWA)**: Offline caching of heritage cards and audio narration.
- **Multilingual Support**: Indian regional language translations (Hindi, Punjabi, Tamil, Odia, Marathi, Bengali) using open-source Bhashini / IndicTrans2.
- **3D Artifact Photogrammetry**: Low-polygon 3D glTF models of traditional vessels and Chhau masks.
- **Community Field Recording Tool**: Mobile recording utility for authorized community elders to document oral folklore directly with geospatial attribution.
