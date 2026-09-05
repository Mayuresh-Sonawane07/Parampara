import os
import qrcode
from PIL import Image
from app.config import settings

def generate_qr_codes(base_url: str = None):
    if not base_url:
        base_url = settings.FRONTEND_URL
        
    output_dir = "qr-assets"
    os.makedirs(output_dir, exist_ok=True)
    
    tradition_slugs = ["warli", "toda", "thathera", "chhau"]
    
    print(f"Generating QR codes with Base URL: {base_url}")
    
    for slug in tradition_slugs:
        target_url = f"{base_url.rstrip('/')}/scan/{slug}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=3,
        )
        qr.add_data(target_url)
        qr.make(fit=True)
        
        # High contrast black on white QR
        img = qr.make_image(fill_color="#1E1E24", back_color="#FAF7F2").convert("RGB")
        file_path = os.path.join(output_dir, f"{slug}.png")
        img.save(file_path)
        print(f"Saved: {file_path} -> {target_url}")

if __name__ == "__main__":
    generate_qr_codes()
