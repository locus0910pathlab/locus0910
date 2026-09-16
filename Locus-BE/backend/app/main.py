import os
import sys
from pathlib import Path

# Ensure backend root is in sys.path
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.database import Base, engine
import app.models  # Ensures all models are registered with Base metadata
from app.routers.patients import router as patients_router
from app.routers.tests import router as tests_router
from app.routers.visits import router as visits_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="LocusLab API",
    description="Backend API for managing clinical diagnostic laboratory patients, tests, and visits.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration supporting localhost, Vercel deployments, and custom env origins
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
custom_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "https://locus0910.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(default_origins + custom_origins)),
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|.*\.vercel\.app)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(patients_router, prefix="/api/v1")
app.include_router(tests_router, prefix="/api/v1")
app.include_router(visits_router, prefix="/api/v1")


@app.get("/", include_in_schema=False)
def root():
    """Redirect root path to interactive Swagger documentation."""
    return RedirectResponse(url="/docs")


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint for container and uptime monitoring."""
    return {
        "status": "healthy",
        "service": "LocusLab API",
        "version": "1.0.0",
    }
