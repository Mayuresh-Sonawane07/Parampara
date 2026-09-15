import io
from typing import Optional
from fastapi import APIRouter, Query, Request, HTTPException, Response
import qrcode
from app.config import settings

router = APIRouter(prefix="/api/qr", tags=["QR Codes"])

VALID_SLUGS = {"warli", "toda", "thathera", "chhau"}

def generate_qr_png(target_url: str) -> bytes:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=3,
    )
    qr.add_data(target_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#1E1E24", back_color="#FAF7F2").convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

@router.get("/{slug}")
def get_tradition_qr(
    slug: str,
    request: Request,
    base_url: Optional[str] = Query(None, description="Optional base URL for the QR code target")
):
    """
    Dynamically generates a high-contrast PNG QR code for a given heritage tradition.
    Defaults to the deployed URL or the request's origin header.
    """
    slug = slug.lower().strip()
    if slug not in VALID_SLUGS:
        raise HTTPException(status_code=404, detail=f"Tradition '{slug}' not found. Valid slugs: {', '.join(sorted(VALID_SLUGS))}")

    # Determine base URL
    if not base_url:
        origin = request.headers.get("origin")
        referer = request.headers.get("referer")
        if origin and "://" in origin:
            base_url = origin.rstrip("/")
        elif referer and "://" in referer:
            from urllib.parse import urlparse
            p = urlparse(referer)
            base_url = f"{p.scheme}://{p.netloc}"
        else:
            base_url = settings.FRONTEND_URL.rstrip("/")

    target_url = f"{base_url.rstrip('/')}/scan/{slug}"
    png_data = generate_qr_png(target_url)

    return Response(
        content=png_data,
        media_type="image/png",
        headers={
            "Cache-Control": "public, max-age=300",
            "X-QR-Target-URL": target_url
        }
    )

@router.get("/dynamic/generate")
def generate_custom_qr(
    url: str = Query(..., description="Target URL to encode into QR code")
):
    """
    Generates a QR code for any specified target URL.
    """
    if not url.startswith("http://") and not url.startswith("https://"):
        raise HTTPException(status_code=400, detail="Target URL must start with http:// or https://")
        
    png_data = generate_qr_png(url)
    return Response(
        content=png_data,
        media_type="image/png",
        headers={
            "Cache-Control": "public, max-age=3600",
            "X-QR-Target-URL": url
        }
    )
