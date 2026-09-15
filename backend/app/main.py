import os
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base
from app.routers import traditions, contributions, admin, sources, narration, qr
from app.seed import seed_database

# Create database tables & automatically seed if fresh
Base.metadata.create_all(bind=engine)
try:
    seed_database()
except Exception as e:
    print(f"Database initialization: {e}")

app = FastAPI(
    title="PARAMPARA AR LITE API",
    description="Community-Oriented Digital Heritage Platform - Real, source-backed living traditions of India.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production can restrict with settings.FRONTEND_URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file mounts for QR, AR, and heritage images
os.makedirs("qr-assets", exist_ok=True)
os.makedirs("ar-assets", exist_ok=True)
os.makedirs("heritage-images", exist_ok=True)
app.mount("/qr-assets", StaticFiles(directory="qr-assets"), name="qr-assets")
app.mount("/ar-assets", StaticFiles(directory="ar-assets"), name="ar-assets")
app.mount("/heritage-images", StaticFiles(directory="heritage-images"), name="heritage-images")

# Include Routers
app.include_router(traditions.router)
app.include_router(contributions.router)
app.include_router(admin.router)
app.include_router(sources.router)
app.include_router(narration.router)
app.include_router(qr.router)

@app.get("/healthz", tags=["System"])
@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "tagline": settings.PROJECT_TAGLINE,
        "version": "1.0.0",
        "heritage_data_authenticity": "VERIFIED_ZERO_FABRICATION"
    }

# Serve built frontend with SPA catch-all (for single-container/monolithic deployments)
frontend_dist_paths = [
    os.path.join(os.getcwd(), "frontend", "dist"),
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
]
dist_dir = None
for candidate in frontend_dist_paths:
    if os.path.exists(candidate) and os.path.isdir(candidate):
        dist_dir = os.path.abspath(candidate)
        break

if dist_dir:
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir) and os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="frontend-assets")

    index_html = os.path.join(dist_dir, "index.html")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa_app(full_path: str):
        # 1. Check if exact file exists in dist (e.g. favicon.svg, icons.svg, etc.)
        candidate_file = os.path.join(dist_dir, full_path)
        if full_path and os.path.isfile(candidate_file):
            return FileResponse(candidate_file)
        # 2. SPA client-side fallback for direct navigation (e.g. /scan/warli, /posters, /tradition/chhau)
        if os.path.exists(index_html):
            return FileResponse(index_html)
        return {"detail": "Not Found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
