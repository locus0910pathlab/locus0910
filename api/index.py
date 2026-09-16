import os
import sys
from pathlib import Path

# Add Locus-BE/backend to sys.path so that 'app' module imports work seamlessly
root_dir = Path(__file__).resolve().parent.parent
backend_dir = root_dir / "Locus-BE" / "backend"

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app

# Export app for Vercel Serverless ASGI handler
__all__ = ["app"]
