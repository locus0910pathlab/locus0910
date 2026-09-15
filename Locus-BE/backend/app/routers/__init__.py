from app.routers.patients import router as patients_router
from app.routers.tests import router as tests_router
from app.routers.visits import router as visits_router

__all__ = [
    "patients_router",
    "tests_router",
    "visits_router",
]
