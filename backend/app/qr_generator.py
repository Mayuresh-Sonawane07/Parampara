import os
import sys
import argparse
from pathlib import Path
import qrcode
from PIL import Image
from app.config import settings, PROJECT_ROOT

def generate_qr_codes(base_url: str = None):
    if not base_url:
        base_url = settings.FRONTEND_URL
        
    base_url = base_url.rstrip('/')
    
    # Save in both backend/root qr-assets and frontend/public/qr-assets
    output_dirs = [
        PROJECT_ROOT / "qr-assets",
        PROJECT_ROOT / "frontend" / "public" / "qr-assets"
    ]
    for d in output_dirs:
        os.makedirs(d, exist_ok=True)
    
    tradition_slugs = ["warli", "toda", "thathera", "chhau"]
    
    print(f"Generating high-contrast heritage QR codes...")
    print(f"Target Base URL: {base_url}")
    
    for slug in tradition_slugs:
        target_url = f"{base_url}/scan/{slug}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=3,
        )
        qr.add_data(target_url)
        qr.make(fit=True)
        
        # High contrast obsidian black on archival cream
        img = qr.make_image(fill_color="#1E1E24", back_color="#FAF7F2").convert("RGB")
        
        for d in output_dirs:
            file_path = d / f"{slug}.png"
            img.save(file_path)
            print(f"Saved: {file_path.relative_to(PROJECT_ROOT)} -> {target_url}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Parampara QR codes for heritage exhibits")
    parser.add_argument("--base-url", type=str, default=None, help="Base URL for QR codes (e.g. https://parampara-api-oocd.onrender.com)")
    args = parser.parse_args()
    
    generate_qr_codes(base_url=args.base_url)
