# PARAMPARA AR LITE: Complete Project Dossier
### *SCAN • DISCOVER • PRESERVE — National Living Digital Heritage Initiative*

---

## 1. Executive Summary & Non-Technical Identity

### 1.1 Project Purpose & Vision
**Parampara AR Lite** is an interactive, community-driven digital heritage platform designed to bridge physical encounters with Indian traditions (in museums, art galleries, artisan clusters, cultural festivals, and printed exhibition posters) to verified digital discovery, augmented reality exploration, active learning, and community preservation.

Most traditional cultural exhibits suffer from three core drawbacks:
1. **Static and passive displays**: Museum placards only offer brief text without contextualizing the living techniques, music, tools, and spiritual philosophies behind motifs.
2. **Fabricated or ungrounded narratives**: Online cultural portals often blend myth, tourism marketing, and unverified assumptions without primary source citations.
3. **High barrier to entry**: Proprietary AR solutions (like 8th Wall, Unity app downloads, or Vuforia) require expensive subscriptions, app store installations, and heavy downloads that exclude grassroots communities and free public exhibitions.

Parampara AR Lite solves these challenges by providing a **₹0 (100% free-tier), browser-native, zero-download, and strictly verified** physical-to-digital bridge. Visitors scan a clean QR code on physical heritage posters to instantly launch tailored interactive experiences, real in-browser computer vision AR, multilingual native voice narration, verified quizzes, and human-moderated community contribution.

---

### 1.2 The Non-Negotiable "Zero-Mock / Zero-Fabrication" Guarantee
Parampara is engineered around a strict cultural ethics framework:
- **Zero Fabricated Folklore & Dates**: Every single description, ritual significance, historical timestamp, and artisan tool is strictly grounded in primary institutional archives:
  - **UNESCO** Intangible Cultural Heritage Representative Lists
  - **Government of India Geographical Indications (GI) Registry** (Controller General of Patents, Designs & Trade Marks)
  - **INTACH** (Indian National Trust for Art and Cultural Heritage) Cultural Mapping dossiers
  - **Sangeet Natak Akademi** & **Ministry of Culture**
- **Zero Fabricated Community Voices**: The platform never invents fictitious artisan quotes or testimonials. Community contributions are submitted through a transparent public portal, stored in a `PENDING` state, and manually audited by authorized curators in the Admin Console before publication.
- **Traceable Source Badging**: Every tradition, craft step, hotspot, and quiz explanation prominently links to its specific institutional archive via verified source badges.

---

### 1.3 The Four-Region Strategic Heritage Architecture
Rather than forcing a single generic template on diverse traditions, Parampara features four flagship traditions representing India’s cardinal directions, each paired with a custom interactive modality:

| Cardinal Region | Living Tradition | Indigenous Community & State | Custom Interactive Experience | Ground Truth Institutional Citation |
| :--- | :--- | :--- | :--- | :--- |
| **North** | **Thathera Metal Craft** | Thatheras of Jandiala Guru, Amritsar, **Punjab** | **8-Stage Craft Journey** (Ingot to Kalai tinning) | UNESCO Representative List File 00845 |
| **South** | **Toda Embroidery (*Pukhoor*)** | Toda Pastoral Tribe, Nilgiris, **Tamil Nadu** | **Counted-Thread Motif Explorer** (Pan & Zoom fabric canvas) | Geographical Indications Registry No. 135 |
| **East** | **Chhau Dance** | Regional Akhadas, **Jharkhand, West Bengal, Odisha** | **3-Style Performance Explorer** (Mask, martial & musical comparison) | UNESCO Representative List File 00337 |
| **West** | **Warli Painting** | Warli Adivasi Tribe, Palghar/Thane, **Maharashtra** | **Flagship WebAR + Digital Fallback** (30-Motif CV recognition) | INTACH Cultural Mapping & GI Registry No. 342 |

---

## 2. Complete Features & Functional Breakdown

```
                                          VISITOR / USER
                                                |
               +--------------------------------+--------------------------------+
               |                                |                                |
               v                                v                                v
       Physical Posters                  Direct Browsing                    QR Code Scan
    (Exhibition A4 Posters)         (/explore, /about, /sources)           (/scan/:slug)
               |                                |                                |
               +--------------------------------+--------------------------------+
                                                |
                                                v
                                 [ FRONTEND: REACT 19 + VITE SPA ]
                                                |
         +------------------+-------------------+-------------------+------------------+
         |                  |                   |                   |                  |
         v                  v                   v                   v                  v
     Explore Hub     Flagship WebAR      Regional Modalities    Quiz Engine     Contribute Portal
     (4 Regions)     (Warli Scanner)     - Thathera Journey     (Archival Qs)   (Public Submissions)
                            |            - Toda Canvas
                            |            - Chhau 3-Style
                            v
                 [ In-Browser CV Engine ]
                 (8x8 Grid, Luminance,
                  Centroid Motif Match)
                                                |
                                                v
                              [ BACKEND: FASTAPI REST ENGINE ]
                                                |
         +-------------------------+------------+------------+-------------------------+
         |                         |                         |                         |
         v                         v                         v                         v
     Database Engine           Auth & JWT               TTS Audio Stream           Admin Console
   (SQLite / PostgreSQL)    (PBKDF2 Hashing)         (gTTS + Chunking Proxy)    (Audit, Review, CRUD)
```

### 2.1 Physical-to-Digital Poster Bridge
- **Printable A4 Posters (`/posters`)**: Exhibition-ready posters generated for each tradition with authentic archival imagery, regional highlights, and high-density QR codes generated via Python Pillow (`qrcode`).
- **Dynamic QR Router (`/scan/:slug`)**: Directs mobile scanners automatically to the appropriate experience:
  - Scanning Warli routes to the **Flagship WebAR Scanner** (`/tradition/warli/ar`).
  - Scanning Thathera routes to the **Craft Journey** (`/tradition/thathera/experience`).
  - Scanning Toda routes to the **Motif Explorer** (`/tradition/toda/experience`).
  - Scanning Chhau routes to the **Performance Explorer** (`/tradition/chhau/experience`).
- **Smooth Transition Animation**: Shows a circular pulse and progress state confirming physical recognition before launching the experience.

---

### 2.2 Flagship WebAR Scanner (`/tradition/warli/ar`)
- **Live Viewfinder & Camera Access**: Uses `navigator.mediaDevices.getUserMedia` with rear/environment camera preference, facing toggle, and zoom controls.
- **Real-Time Canvas CV Analysis**: Continuous background frame analysis detecting terracotta ochre backgrounds and rice-paste strokes at 300ms intervals.
- **Snap & Lock Feature**: Users can click "Scan Artwork" or press the **Spacebar** to capture the exact viewfinder rectangle, freeze the frame, and run the 30-motif taxonomy detector.
- **Dynamic Hotspot Pins**: Pins appear directly on top of the detected motifs with pulsating micro-animations. Clicking a pin opens a modal containing:
  - Archival description and cultural significance
  - Philosophical balance (e.g. Purusha and Prakriti in inverted triangles)
  - Regional field perspective from INTACH / GI records
  - Multi-language spoken narration player
- **Curated Sample Artworks**: Users without a physical poster or webcam can select from 4 preset canonical artworks (*Tarpa Festival*, *Palaghata Marriage*, *Gramjeevan Village Harvest*, *Prakriti Sacred Forest*).
- **Custom Image Upload**: Users can upload any photo or painting from their device and run the client-side CV analyzer.
- **Graceful Fallback Mode (`/tradition/warli/experience`)**: When camera permissions are denied or unavailable, the system automatically launches the digital fallback experience (`WarliDigitalExperience.tsx`) without breaking the user journey.

---

### 2.3 Distinct Regional Interactive Experiences

#### 1. North: Thathera 8-Stage Craft Journey (`/tradition/thathera/experience`)
- Explores the sole Indian craft inscribed on UNESCO’s Intangible Cultural Heritage List (File 00845).
- **Interactive 8-Stage Timeline**:
  1. *Ingot Selection & Melting* (Raw brass/copper alloys)
  2. *Charcoal Furnace Heating* (Bhatti annealing at 700°C–800°C)
  3. *Sledgehammer Flattening* (Synchronized rhythmic forging)
  4. *Bowl Hemispherical Shaping* (Forging curved surfaces)
  5. *Brazing & Solder Joining* (Borax flux joining)
  6. *Acid Polishing & Cleaning* (Dilute acid & tamarind bath)
  7. *Surface Dimpling (*Kandhai*)* (Thousands of light hammer indentations for structural stiffness and radiant shine)
  8. *Tinning (*Kalai*)* (Molten tin coating for food-safe cooking)
- Displays specific artisan tools, temperatures, chemical processes, and native Punjabi/Hindi narration.

#### 2. South: Toda Counted-Thread Motif Explorer (`/tradition/toda/experience`)
- Explores the GI-registered embroidery (*Pukhoor*) of the Nilgiri pastoral community.
- **Pan & Zoom Canvas**: High-resolution Poothkulli shawl fabric with interactive zoom (1x to 2.5x), drag pan, and reset.
- **Sacred Motif Pins**:
  - *Pukhoor* (Flower motif symbolizing wild Nilgiri shola flora)
  - *Modi* (Curled buffalo horn motif, central to Toda buffalo pastoral veneration)
  - *Karthal* (Traditional wooden milk-churning rod)
  - *Enepukhoor* (Geometric diamond border representing structural cosmic balance)
- **5-Step Technique Guide**: Explains reverse-side darning on unbleached coarse cotton without stencils, tracing, or measuring tapes.

#### 3. East: Chhau Dance Performance Explorer (`/tradition/chhau/experience`)
- Explores the UNESCO-inscribed martial dance tradition (File 00337).
- **3-Style Interactive Selector**:
  - **Seraikella Chhau (Jharkhand)**: Stylized pastel papier-mâché masks, aristocratic Bhanja royal court patronage, poetic and lyrical *Topkas* and *Upalayas*.
  - **Purulia Chhau (West Bengal)**: Gigantic feathered masks hand-crafted in Charida village, community *Gajan* festival roots, acrobatic 360° somersaults and leaps.
  - **Mayurbhanj Chhau (Odisha)**: Maskless (bare-faced expression), martial footwork (*Chalis* and *Dharans*), Baripada royal court tradition.
- **Traditional Percussion Orchestra**: Breakdown of primary musical instruments (Dhol, Nagara, Dhumsa, Mohuri) and their rhythmic martial cues.

---

### 2.4 Multilingual Audio Narration Engine
- **Indigenous Regional Language Integration**:
  - Warli: **English**, **Hindi (हिन्दी)**, **Marathi (मराठी)**
  - Thathera: **English**, **Hindi (हिन्दी)**, **Punjabi (ਪੰਜਾਬੀ)**
  - Toda: **English**, **Hindi (हिन्दी)**, **Tamil (தமிழ்)**
  - Chhau: **English**, **Hindi (हिन्दी)**, **Bengali (বাংলা)**
- **Dual-Tier Audio Pipeline**:
  1. *Backend TTS Stream (`/api/narration/audio`)*: Asynchronously queries gTTS, splits sentences at cultural punctuation boundaries (like the Indian Danda `।`), stitches MP3 bytes, and serves with in-memory LRU caching.
  2. *Frontend Web Speech API Fallback*: If the network is restricted or offline, the browser’s native `window.speechSynthesis` voice synthesizer executes automatically.

---

### 2.5 Active Learning Quiz Engine (`/tradition/:slug/quiz`)
- 3 to 5 multiple-choice questions per tradition grounded in institutional dossiers.
- Instant score computation upon submission.
- **Archival Feedback**: For each question, displays why the correct answer is valid and cites the exact institutional file (e.g. INTACH Chapter, GI Registry No., or UNESCO dossier).

---

### 2.6 Community Contribution Portal (`/contribute`)
- Clean public form enabling visitors, students, and community elders to submit oral histories, local craft variants, photos, and references.
- Mandatory legal and cultural consent checkbox ensuring knowledge sovereignty.
- Automatically ingested into the database as `PENDING` submissions for administrative review.

---

### 2.7 Curatorial Admin Console (`/admin`, `/admin/login`)
Secured by JWT authentication and PBKDF2 password hashing. Features four distinct tabs:
1. **Submissions Moderation**: Filter pending/approved/rejected contributions, inspect contributor metadata, approve with curatorial notes, or delete spam.
2. **Traditions Management**: Full CRUD operations to add, edit, or remove living traditions, adjust hero images, and monitor linked hotspots/quizzes.
3. **Sources Repository**: Add and manage authoritative references (UNESCO, GI Registry, INTACH, Academic) with direct external URL links.
4. **Live System Health & Audit**:
   - Real-time database connection status
   - Server timestamp
   - Total count metrics across all tables
   - Status of local heritage image assets
   - Audio narration engine diagnostic status

---

## 3. How the Augmented Reality (AR) Works

### 3.1 Architecture Overview
Parampara AR Lite uses a **100% open-source, client-side, zero-cost** computer vision pipeline. It requires **no proprietary paid SDKs** (such as 8th Wall, Vuforia, or Unity Cloud) and does not transmit private camera frames to external servers.

```
+-----------------------------------------------------------------------------------+
|                            WARLI WEBAR SCANNER PIPELINE                           |
+-----------------------------------------------------------------------------------+
|  1. CAMERA CAPTURE                                                                |
|     navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }) |
|                                                                                   |
|  2. REAL-TIME RETICLE ANALYSIS (Every 300ms)                                      |
|     Downsample to 120x120 canvas -> Calculate Terracotta Ochre & White Luma Ratio |
|     -> If detected, Confidence = 90%+ & Reticle turns Emerald Green               |
|                                                                                   |
|  3. USER SNAP & LOCK (Spacebar or Button)                                         |
|     Crop Viewfinder Square -> Render to 900x900 analytical canvas                 |
|                                                                                   |
|  4. COMPUTER VISION ANALYSIS (warliCvEngine.ts)                                   |
|     - Rice paste white mask extraction (Luminance > 145)                          |
|     - 8x8 Spatial Grid Density & Centroid calculation                             |
|     - Structural & Compositional Heuristics:                                      |
|       * Border check (Sawtooth edge transitions) -> Motif #30                     |
|       * Center check: Rectangular frame (Palaghata #1) vs Concentric (Tarpa #8)  |
|       * Quadrant checks: Upper Sun (#3), Moon (#4), Tree Canopy (#12)             |
|       * Lower checks: Ploughing band (#27), Mortar (#24), Granary (#26)          |
|                                                                                   |
|  5. MOTIF HOTSPOT CONVERSION & RENDERING                                          |
|     Convert detected taxonomy IDs into interactive AR Hotspots -> Render pins     |
|     -> Audio Narration Player & Archival Context Modal                            |
+-----------------------------------------------------------------------------------+
```

### 3.2 Step-by-Step Technical Execution

1. **Camera Feed & Viewfinder Geometry**:
   The camera stream is attached to an HTML5 `<video>` element inside `WarliARPage.tsx`. A centered square reticle (`reticleRef`) establishes the target bounding box.

2. **Real-Time Visual Gradient & Color Analysis**:
   While live in the viewfinder, an analytical canvas samples the video at ~300ms intervals:
   - **Ochre Detection**: Checks red dominance over green and blue:
     ```typescript
     if (r > 70 && r > g * 1.08 && r > b * 1.18 && r < 240) { ochreCount++; }
     ```
   - **Rice-Paste White Detection**: Checks high luminance and balanced RGB channels:
     ```typescript
     if (r > 155 && g > 155 && b > 155) { highContrastWhiteCount++; }
     ```
   - **Edge Density**: Samples adjacent pixels to detect high-contrast stick-figure transitions.
   - When the ochre and white thresholds match authentic Warli proportions, the confidence score elevates to **90%–98%**, and status notifies: *"Warli Artwork in View! Tap Scan Artwork"*.

3. **Snap & Lock Frame Freezing**:
   When the visitor taps "Scan Artwork" (or hits the Spacebar):
   - The exact rectangular region inside the reticle is extracted and normalized onto a 900x900 canvas.
   - The live feed is frozen with the captured frame.
   - Auto-scan loops are paused to prevent flickering.

4. **8x8 Spatial Grid & Centroid Algorithm (`warliCvEngine.ts`)**:
   `analyzeWarliCanvas()` runs the following pipeline:
   - Divides the artwork into an **8x8 analytical matrix** (64 cells).
   - Computes the density of white rice-paste strokes and the exact geometric `(x, y)` centroid of stroke mass within each cell.
   - **Compositional Discrimination**:
     - *Palaghata Sacred Devchauk*: Evaluates border density around rows 2–5 and columns 2–5. If a closed quadrilateral is detected, it registers the central *Palaghata Sanctum* (Motif #1), along with adjacent *Panchashiriya Dev* (#2), Drummers (#9), Thatched Karvi Hut (#22), and Wine Urn (#11).
     - *Tarpa Spiral Dance*: If radial concentric rings dominate rows 2–5, it registers the central *Tarpa Musician* (Motif #7), *Spiral Dance* (#8), and *Dancing Maiden* (#10).
     - *Celestial Bodies*: Inspects upper right for *Sun God Hirva* (#3) and upper left for *Crescent Moon* (#4).
     - *Ecology & Sacred Groves*: Evaluates upper-middle arbor density for the *Tree of Life Devrai Canopy* (#12) and *Peacocks* (#16).
     - *Agrarian Labor*: Evaluates bottom horizontal rows 6–7 for *Ploughing Farmer with Oxen* (#27), *Winnowing Maiden* (#23), *Grain Pounding* (#24), and *Granary Silo* (#26).
     - *Protective Border*: Evaluates perimeter sawtooth transitions for the *Consecration Patti* (#30).

5. **Hotspot Overlay & Narration Trigger**:
   The detected motifs are converted into `ARHotspot` entities with normalized percentage coordinates `(x, y)`. The user can tap any pin to read its cultural context or listen to native Marathi/Hindi/English narration.

---

## 4. Database Architecture & Data Layer

### 4.1 Database Engine Choice
- **Local Development / Offline Exhibitions**: **SQLite** (`parampara.db`). Zero configuration, zero external service dependency, self-contained single-file storage.
- **Production Cloud Deployments**: **PostgreSQL** via **Neon.tech** or **Supabase** (100% free serverless tiers). The backend configuration automatically translates connection strings (`postgres://` to `postgresql://`) and establishes SSL connections.

---

### 4.2 Relational Entity Diagram

```
 +------------------+            +---------------------+            +------------------+
 |     sources      | 1        * |  tradition_sources  | *        1 |    traditions    |
 |------------------|<-----------|---------------------|----------->|------------------|
 | id (PK)          |            | tradition_id (FK)   |            | id (PK)          |
 | title            |            | source_id (FK)      |            | name             |
 | organization     |            +---------------------+            | slug (Unique)    |
 | source_type      |                                               | region, state    |
 | url              |                                               | category         |
 | verification_stat|                                               | experience_type  |
 +------------------+                                               | hero_image       |
        | 1                                                         +------------------+
        |                                                              | 1
        +-----------------------------------+                          |
        |                                   |                          |
        | *                                 | *                        |
 +------------------+                +------------------+              |
 |   ar_hotspots    |                | quiz_questions   |              |
 |------------------|                |------------------|              |
 | id (PK)          |                | id (PK)          |              |
 | ar_experience_id |                | quiz_id (FK)     |              |
 | name             |                | question_text    |              |
 | x, y (Float)     |                | explanation      |              |
 | content          |                | source_id (FK)   |              |
 | source_id (FK)   |                +------------------+              |
 +------------------+                         | 1                      |
        ^                                     |                        |
        | *                                   v *                      |
 +------------------+                +------------------+              |
 |  ar_experiences  | 1            1 |   quiz_options   |              |
 |------------------|<---------------|------------------|              |
 | id (PK)          |                | id (PK)          |              |
 | tradition_id(FK) |                | question_id (FK) |              |
 +------------------+                | option_text      |              |
        ^                            | is_correct (Bool)|              |
        | 1                          +------------------+              |
        |                                                              |
        +--------------------------------------------------------------+
        | 1
        v 1..*
 +------------------+        1..*   +------------------+
 |   experiences    |-------------->| experience_items |
 |------------------|               |------------------|
 | id (PK)          |               | id (PK)          |
 | tradition_id(FK) |               | experience_id(FK)|
 | type             |               | title, order_idx |
 +------------------+               | description      |
                                    | tool_or_material |
                                    | source_id (FK)   |
                                    +------------------+
```

### 4.3 Database Models Overview (`backend/app/models.py`)
1. **`sources`**: Authoritative institutional bodies (UNESCO, GI Registry, INTACH, Sangeet Natak Akademi).
2. **`traditions`**: Core heritage traditions, geographic locations, and classifications.
3. **`tradition_sources`**: Many-to-many link establishing traceability for each tradition.
4. **`experiences` & `experience_items`**: Modular hierarchical data for sequential stages (Thathera), fabric motifs (Toda), and dance styles (Chhau).
5. **`ar_experiences` & `ar_hotspots`**: AR target references and normalized percentage coordinates `(x, y)` for motif pins.
6. **`quizzes`, `quiz_questions`, & `quiz_options`**: Institutional quiz assessments with correct/incorrect flags and explanations.
7. **`contributions`**: Public community submissions with moderation statuses (`PENDING`, `APPROVED`, `REJECTED`), contributor details, and reviewer notes.
8. **`users`**: Administrator credentials with PBKDF2-SHA256 password hashing and JWT access control.

### 4.4 Automated Self-Seeding Mechanism
On startup, `backend/app/main.py` calls `seed_database()` in `backend/app/seed.py`. If the database is empty:
- Seeds all 8 authoritative research sources.
- Seeds all 4 cardinal living traditions.
- Seeds the 8 Thathera craft stages, Toda motifs, Chhau styles, and Warli AR targets.
- Seeds 4 verified quizzes with complete question options.
- Creates the default administrator account (`admin` / `ParamparaAdmin@2026`).

---

## 5. Complete Technology Stack

### 5.1 Frontend Technology Stack
- **Framework**: **React 19.2** + **TypeScript 6.0**
- **Build Tool**: **Vite 8.2** (sub-second HMR, optimized production chunks)
- **Styling**: **Tailwind CSS v4** (`@tailwindcss/vite`) with curated earthy heritage color palette:
  - Terracotta ochre: `#7C2D12`, `#9A3412`
  - Rice paste ivory: `#FAF8F5`, `#FBFBF9`
  - Antique border: `#E6D5C3`
- **Routing**: **React Router v7** (`react-router-dom`)
- **Icons**: **Lucide React** (featherweight accessible SVG icons)
- **Browser Native APIs**:
  - `navigator.mediaDevices.getUserMedia` (WebRTC camera stream)
  - `window.speechSynthesis` (Client-side TTS fallback)
  - `HTMLCanvasElement` (`willReadFrequently: true` 2D context)
  - `localStorage` (JWT token & session persistence)

---

### 5.2 Backend Technology Stack
- **API Framework**: **FastAPI 0.115** (High-performance async Python web framework)
- **Runtime Server**: **Uvicorn 0.30** (ASGI production web server)
- **Language**: **Python 3.11+ / 3.14**
- **Data Validation & Serialization**: **Pydantic v2.7**
- **ORM & Database Toolkit**: **SQLAlchemy 2.0**
- **Authentication & Security**:
  - **Passlib** with **PBKDF2-SHA256** password hashing
  - **Python-Jose** for **JWT (JSON Web Tokens)** with HS256 encryption
- **Audio & Speech Engine**:
  - **HTTPX 0.27** (Asynchronous HTTP client for Google Translate TTS audio synthesis)
  - Custom intelligent sentence and Indian Danda (`।`) text chunker
  - In-memory audio byte caching
- **Asset Generation**: **qrcode 7.4** + **Pillow 10.0** (A4 poster QR generator)
- **Testing**: **Pytest 8.0**

---

## 6. Cloud Deployment Architecture (₹0 / 100% Free Forever)

Parampara AR Lite is designed to run completely free using two modern hosting patterns:

### Option A: Decoupled Edge Deployment (Recommended)
This gives the best performance by serving the frontend from global CDN edge nodes and the backend on a managed Python container:

```
                  +----------------------------------------------+
                  |               PUBLIC INTERNET                |
                  +----------------------------------------------+
                          |                              |
                          | (Static Assets & HTML)       | (REST API & Audio)
                          v                              v
             +--------------------------+  +---------------------------+
             |      VERCEL / NETLIFY    |  |     RENDER.COM / KOYEB    |
             |       (Frontend CDN)     |  |       (FastAPI API)       |
             |--------------------------|  |---------------------------|
             | - React 19 + Vite Dist   |  | - Uvicorn + Python 3.11   |
             | - Global Edge Caching    |  | - Audio Narration Engine  |
             | - Automatic SSL / HTTPS  |  | - 750 Free Compute Hrs/Mo |
             | - SPA Rewrite Rules      |  | - Auto Deploy on Git Push |
             +--------------------------+  +---------------------------+
                                                         |
                                                         | DATABASE_URL
                                                         v
                                           +---------------------------+
                                           |      NEON / SUPABASE      |
                                           |    (Serverless Postgres)  |
                                           |---------------------------|
                                           | - 0.5 GB Free Storage     |
                                           | - Auto-seeded on startup  |
                                           +---------------------------+
```

1. **Frontend on Vercel**:
   - Import repository, set Root Directory to `frontend`.
   - Set Environment Variable: `VITE_API_URL = https://your-parampara-api.onrender.com`.
   - Handled by included `frontend/vercel.json` and `frontend/public/_redirects` for SPA routing without 404s.
2. **Backend on Render.com**:
   - Web Service connected to GitHub repository.
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --app-dir backend`
   - Handled automatically by the included `render.yaml`.
3. **Database on Neon.tech**:
   - Provide standard PostgreSQL connection string in `DATABASE_URL` env variable.

---

### Option B: Monolithic All-In-One Docker Container (Single URL)
For platforms that support Docker containers (such as **Koyeb**, **Hugging Face Spaces**, or **Render Docker**):
- The multi-stage `Dockerfile`:
  - **Stage 1**: Compiles the React Vite frontend into `frontend/dist`.
  - **Stage 2**: Installs Python dependencies, copies backend code and static assets, and mounts `frontend/dist` directly at the root (`/`) of FastAPI.
- A single domain serves both the API endpoints (`/api/*`) and the interactive user interface (`/`).

---

## 7. Complete Project Directory Structure

```
c:\Users\Mayuresh\PARAMPARA\
├── .env.example               # Template environment configuration
├── Dockerfile                 # Multi-stage production container build
├── package.json               # Root orchestrator scripts (npm run dev:all)
├── parampara.db               # Pre-seeded SQLite database file
├── render.yaml                # Infrastructure-as-code for Render.com free deployment
├── run-all.bat                # Windows double-click launcher (starts backend & frontend)
├── README.md                  # Comprehensive project presentation documentation
├── PROJECT_DOSSIER.md         # Full project technical and non-technical dossier
│
├── ar-assets/                 # WebAR target descriptors & reference images
│   ├── warli-target.jpg       # High-contrast 1200x1200px Warli training target
│   ├── warli-target.fset      # AR.js NFT feature tracking set
│   ├── warli-target.fset3     # AR.js NFT fast initialization descriptors
│   └── warli-target.iset      # AR.js multi-scale image set pyramid
│
├── heritage-images/           # High-resolution verified archival photographs
│   ├── thathera.jpg           # Forging brass utensils in Jandiala Guru
│   ├── toda.jpg               # Toda elder embroidering Poothkulli drape
│   ├── chhau.jpg              # Purulia Chhau dancer in feathered demon mask
│   └── warli.jpg              # Canonical Warli ritual marriage wall painting
│
├── qr-assets/                 # Generated exhibition QR code images
│   ├── thathera.png           # Direct link to /scan/thathera
│   ├── toda.png               # Direct link to /scan/toda
│   ├── chhau.png              # Direct link to /scan/chhau
│   └── warli.png              # Direct link to /scan/warli
│
├── docs/                      # Technical specification documents
│   ├── architecture.md        # Architectural philosophy & database schema
│   ├── ar-setup.md            # Natural Feature Tracking & descriptor training
│   ├── content-sources.md     # Institutional citations and ground truth dossiers
│   ├── deployment.md          # Free cloud deployment step-by-step tutorial
│   ├── setup.md               # Local environment installation guide
│   └── testing.md             # Automated test suite documentation
│
├── backend/                   # Python FastAPI Backend
│   ├── requirements.txt       # Python dependencies (FastAPI, SQLAlchemy, etc.)
│   └── app/
│       ├── main.py            # FastAPI entrypoint, CORS, static mounts, healthz
│       ├── config.py          # App settings, DB URL resolution, JWT secrets
│       ├── database.py        # SQLAlchemy engine, session maker, get_db generator
│       ├── models.py          # Relational ORM models (8 core tables)
│       ├── schemas.py         # Pydantic request/response validation schemas
│       ├── auth.py            # Password hashing, JWT token generation & verification
│       ├── seed.py            # Master seed script (4 traditions, 8 sources, admin)
│       ├── create_admin.py    # CLI tool to create custom admin credentials
│       ├── qr_generator.py    # Script generating clean QR codes for posters
│       └── routers/
│           ├── traditions.py  # Public tradition queries, experiences, quizzes
│           ├── narration.py   # Regional TTS audio streaming & chunking proxy
│           ├── contributions.py# Public community contribution submission
│           ├── sources.py     # Public listing of verified archival citations
│           └── admin.py       # Curatorial moderation, CRUD, and system audit
│
└── frontend/                  # React 19 + Vite + TypeScript Frontend
    ├── package.json           # Frontend dependencies (Tailwind 4, Lucide, React 19)
    ├── vite.config.ts         # Vite configuration with Tailwind plugin
    ├── vercel.json            # Vercel SPA client-side routing rewrites
    ├── public/_redirects      # Netlify SPA client-side routing rewrites
    └── src/
        ├── App.tsx            # Main application router with all 13 routes
        ├── index.css          # Design system root tokens and global styles
        ├── components/
        │   ├── Navbar.tsx     # Responsive navigation bar with Admin toggle
        │   ├── Footer.tsx     # Archival disclaimer and UNESCO links
        │   ├── SourceBadge.tsx# Reusable institutional citation component
        │   └── NarrationPlayer.tsx # Multi-lingual audio narration player
        ├── features/
        │   ├── thathera/      # North: 8-Stage Craft Journey timeline
        │   ├── toda/          # South: Counted-Thread Motif Explorer with Zoom
        │   ├── chhau/         # East: 3-Style Performance Explorer
        │   └── warli/         # West: In-browser CV engine & 30-motif taxonomy
        │       ├── warliCvEngine.ts      # Real-time computer vision analysis
        │       ├── warliTaxonomy30.ts    # 30 canonical Warli motifs database
        │       └── WarliDigitalExperience.tsx # Interactive fallback mode
        ├── pages/
        │   ├── HomePage.tsx             # Landing hero, mission, and regional cards
        │   ├── ExplorePage.tsx          # Filterable catalog of traditions
        │   ├── TraditionDetailPage.tsx  # Deep-dive archival narrative & history
        │   ├── ExperiencePage.tsx       # Dynamic router for regional modalities
        │   ├── WarliARPage.tsx          # Flagship WebAR camera scanner
        │   ├── QuizPage.tsx             # Interactive assessment with citations
        │   ├── PostersPage.tsx          # Printable physical A4 poster showcase
        │   ├── ContributePage.tsx       # Public community contribution form
        │   ├── SourcesPage.tsx          # Institutional citation directory
        │   ├── AboutPage.tsx            # Mission, methodology & ethics
        │   ├── AdminLoginPage.tsx       # Secure administrator sign-in
        │   ├── AdminDashboardPage.tsx   # Curatorial moderation console
        │   └── ScanRouterPage.tsx       # Instant QR code scanner resolver
        ├── services/
        │   ├── api.ts                   # Centralized API fetch layer
        │   └── narration.ts             # Language dictionary & speech synthesis
        └── types/
            └── index.ts                 # Full TypeScript interface definitions
```

---

## 8. Credentials & Testing Guide

### 8.1 Default Curatorial Administrator Credentials
- **Login URL**: `http://localhost:5173/admin/login` (or `/admin/login` on deployed URL)
- **Username**: `admin`
- **Password**: `ParamparaAdmin@2026`
*(These credentials are created automatically on first boot. The password can also be overridden via the `ADMIN_PASSWORD` environment variable or created via `python -m app.create_admin`)*.

### 8.2 Automated Backend Verification
To run the automated test suite verifying all API routes, database seeding, and zero-mock integrity:
```powershell
$env:PYTHONPATH = "backend"
.\.venv\Scripts\pytest backend/tests/ -v
```

### 8.3 Frontend Build Verification
To verify TypeScript compilation and bundle production distribution:
```powershell
cd frontend
npm run build
```

---

## 9. Summary: How Everything Works Together

1. **Physical World Encounter**: A visitor in a museum or community centre views a printed A4 poster featuring a living tradition (e.g. Warli Painting).
2. **Instant QR Resolution**: The visitor scans the poster's QR code with their mobile phone. It hits `/scan/warli`, which identifies the tradition and routes to the WebAR scanner.
3. **In-Browser Computer Vision**: The browser camera opens without requiring an app download. The custom in-browser CV engine recognizes the painting's ochre palette and rice-paste contours, locks the frame, and matches the artwork against the 30-motif taxonomy.
4. **Deep Cultural Engagement**: Hotspot pins reveal the deep cultural and ecological significance of each motif, accompanied by native Marathi, Hindi, or English audio narration.
5. **Active Knowledge Reinforcement**: The visitor takes a verified 3-question quiz with instant feedback and institutional citations.
6. **Community Continuity**: Community members can submit oral folklore on the Contribution portal, which curators review and approve directly from the Admin Console.
7. **Zero-Cost Sustainability**: The entire platform runs on a ₹0 free-tier cloud architecture with zero recurring maintenance fees.
