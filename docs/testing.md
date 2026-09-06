# Testing & Verification Guide: PARAMPARA AR LITE

National Living Heritage Platform • Verification Guide

---

## 1. Automated Backend Test Suite

Run the full automated test suite using `pytest`:
```bash
$env:PYTHONPATH = "backend"
.\.venv\Scripts\pytest backend/tests/ -v
```

### Covered Test Specifications:
- `test_health`: Validates `/api/health` system status and version.
- `test_get_traditions`: Asserts exactly four verified regional traditions are returned.
- `test_tradition_detail_and_sources`: Verifies grounded sources and all 6 Warli AR hotspots.
- `test_thathera_craft_journey_experience`: Verifies all 8 sequential metalcraft stages.
- `test_quiz_retrieval_and_submission`: Tests question retrieval and automated scoring with source citation.
- `test_community_contribution_lifecycle`: Validates submission -> PENDING status -> admin authentication -> approval -> updated statistics.

### Run Comprehensive Endpoint Audit Script:
```bash
python scripts/audit_endpoints.py
```
Audits all 14 endpoint suites across both backend (`http://127.0.0.1:8000`) and Vite proxy (`http://localhost:5173`).

---

## 2. Frontend Build Verification

Run the TypeScript compiler and Vite production bundler:
```bash
cd frontend
npm run build
```
Expected output:
```
✓ 1863 modules transformed.
✓ built in ~800ms
```

---

## 3. Mobile & WebAR Checklist (Android Chrome Priority)

- [x] **Camera Permission Prompt**: Clear disclosure modal rendered before accessing camera.
- [x] **Camera Permission Denied**: Gracefully switches to interactive 2D digital canvas fallback without page crashes.
- [x] **WebAR Tracking Frame**: Responsive reticle overlay aligns with physical poster artwork.
- [x] **Interactive Hotspots**: 4 pulsating hotspots (Tarpa Dance, Chauk, Tree of Life, Farming) respond to touch.
- [x] **Information Modal**: Shows verified iconography, cultural context, regional perspective, and source badge.
- [x] **Browser Audio Narration**: Speech synthesis articulates cultural meaning clearly.
- [x] **Responsive Layout**: Mobile navigation drawer, touch-friendly buttons, and high-contrast typography.

---

## 4. Live 5–7 Minute Demo Runbook

1. **Homepage (1 min)**:
   - Introduce Parampara AR Lite and the National Digital Heritage Initiative.
   - Highlight the Zero-Mock Cultural Data guarantee and institutional ground truth.
2. **Four Regions & Warli AR (2 min)**:
   - Navigate to `/tradition/warli/ar`.
   - Explain camera permission flow.
   - Point device camera at physical Warli poster.
   - Tap hotspot (e.g. Tarpa Dance) -> Show cultural context -> Trigger audio narration.
   - Show digital fallback toggle.
3. **Tradition Experiences (1.5 min)**:
   - Open Toda Embroidery -> Explore counted-thread motifs with pan/zoom.
   - Open Thathera Metal Craft -> Walk through the 8 stages of hand-hammering and tamarind cleaning.
   - Open Chhau Dance -> Toggle between Seraikella, Purulia, and Mayurbhanj styles.
4. **Active Learning Quiz (1 min)**:
   - Take the 3-question quiz for any tradition -> Show immediate verification and score.
5. **Community Preservation & Admin Review (1 min)**:
   - Submit a test contribution on `/contribute`.
   - Log into `/admin` -> View real dashboard metrics (no fake stats) -> Approve the submission -> Explain future verified Community Voice publishing.
