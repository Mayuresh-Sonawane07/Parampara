import os
from pathlib import Path

# Resolve project root (two levels up from backend/app/config.py)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_SQLITE_PATH = (PROJECT_ROOT / "parampara.db").as_posix()

class Settings:
    PROJECT_NAME: str = 'Parampara AR Lite'
    PROJECT_TAGLINE: str = 'SCAN • DISCOVER • PRESERVE'
    DATABASE_URL: str = os.getenv('DATABASE_URL', f'sqlite:///{DEFAULT_SQLITE_PATH}')
    if DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
        
    JWT_SECRET: str = os.getenv('JWT_SECRET', 'parampara-heritage-secret-key-change-in-prod')
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    FRONTEND_URL: str = os.getenv('FRONTEND_URL', 'http://localhost:5173')

settings = Settings()
