# Architecture & Design: PARAMPARA AR LITE

Tagline: **SCAN • DISCOVER • PRESERVE**
National Digital Heritage Platform • Living Traditions of India
Category: Software • Theme: Heritage & Culture

---

## 1. Architectural Philosophy

Parampara AR Lite bridges physical heritage encounters (museum exhibits, galleries, community centres) with interactive, research-backed digital exploration and preservation.

It is structured around three non-negotiable core pillars:
1. **Zero Data Fabrication**: 100% of cultural descriptions, dates, tool names, and motif meanings are grounded in primary archival sources (UNESCO, Government of India GI Registry, and INTACH).
2. **Modality Diversity**: Rather than forcing a single generic layout, each of the four cardinal regions features a tailored interactive experience:
   - **North (Thathera)**: 8-Stage Craft Journey
   - **South (Toda)**: Counted-Thread Motif Explorer with Pan & Zoom
   - **East (Chhau)**: 3-Style Performance Explorer (Seraikella, Purulia, Mayurbhanj)
   - **West (Warli)**: Flagship WebAR Experience with Natural Feature Tracking + Fallback
3. **100% Free-Tier Architecture**: Built and deployable at ₹0 recurring expense using open-source technologies.

---

## 2. System Diagram

```
                                      USER
                                        |
                 +----------------------+----------------------+
                 |                      |                      |
                 v                      v                      v
          Physical Posters         Direct Web URL         QR Code Scan
        (Printed with 1 QR)      (/explore, /tradition)     (/scan/:slug)
                 |                      |                      |
                 +----------------------+----------------------+
                                        |
                                        v
                       RESPONSIVE REACT 19 APPLICATION
                         (Vite + TypeScript + Tailwind)
                                        |
                 +----------------------+----------------------+
                 |                      |                      |
                 v                      v                      v
           Explore Hub           Experience Router       Contribute Form
        (Region/Category)      (Craft/Motif/Perform/AR)  (Consent Verified)
                 |                      |                      |
                 +----------------------+----------------------+
                                        |
                                        v
                         FASTAPI REST ENGINE (Python)
                     (Pydantic v2 + SQLAlchemy + JWT)
                                        |
          +-----------------------------+-----------------------------+
          |                             |                             |
          v                             v                             v
    SQL Database                  Asset Server                  Auth & Review
 (SQLite/Postgres)           (/qr-assets, /ar-assets)        (PBKDF2-SHA256 & JWT)
          |
  [Four Real Traditions]
  - Thatheras of Jandiala Guru (Punjab)
  - Toda Embroidery (Tamil Nadu)
  - Chhau Dance (Eastern India)
  - Warli Painting (Maharashtra)
```

---

## 3. Database Schema

- **`sources`**: Authoritative institutional references (UNESCO, Government of India, INTACH).
- **`traditions`**: Verified core traditions with state, region, community, and categorization.
- **`experiences`**: Experience headers mapped to tradition IDs.
- **`experience_items`**: Sequential stages, motifs, and performance style sections.
- **`ar_experiences` & `ar_hotspots`**: Augmented Reality image tracking targets and normalized hotspot coordinates.
- **`quizzes`, `quiz_questions`, `quiz_options`**: Verified assessment questions with explanation and source linking.
- **`contributions`**: Community submissions lifecycle (PENDING -> APPROVED / REJECTED) with explicit consent verification.
- **`users`**: Administrator credentials with PBKDF2-SHA256 password hashing.
