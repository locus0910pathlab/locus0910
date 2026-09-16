from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.visit import VisitStatus
from app.schemas.visit import (
    VisitCreate,
    VisitUpdate,
    VisitResponse,
    VisitTestUpdate,
    VisitTestResponse,
)
from app.services.patient_service import PatientService
from app.services.visit_service import VisitService

router = APIRouter(prefix="/visits", tags=["Visits"])


@router.post("/", response_model=VisitResponse, status_code=status.HTTP_201_CREATED)
def create_visit(visit_in: VisitCreate, db: Session = Depends(get_db)):
    """Create a new patient visit and order tests."""
    patient = PatientService.get_by_id(db, visit_in.patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {visit_in.patient_id} not found.",
        )
    return VisitService.create(db, visit_in)


@router.get("/", response_model=List[VisitResponse])
def get_visits(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=1000),
    patient_id: Optional[int] = Query(None, description="Filter by patient ID"),
    visit_status: Optional[VisitStatus] = Query(None, alias="status", description="Filter by visit status"),
    db: Session = Depends(get_db),
):
    """Retrieve list of visits with optional filters."""
    return VisitService.get_multi(
        db,
        skip=skip,
        limit=limit,
        patient_id=patient_id,
        status=visit_status,
    )


@router.get("/{visit_id}", response_model=VisitResponse)
def get_visit(visit_id: int, db: Session = Depends(get_db)):
    """Retrieve a single visit by ID, including ordered tests and patient details."""
    visit = VisitService.get_by_id(db, visit_id)
    if not visit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Visit with ID {visit_id} not found.",
        )
    return visit


@router.put("/{visit_id}", response_model=VisitResponse)
def update_visit(
    visit_id: int,
    visit_in: VisitUpdate,
    db: Session = Depends(get_db),
):
    """Update visit status, notes, or date."""
    visit = VisitService.get_by_id(db, visit_id)
    if not visit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Visit with ID {visit_id} not found.",
        )
    return VisitService.update(db, visit, visit_in)


@router.patch("/{visit_id}/tests/{visit_test_id}", response_model=VisitTestResponse)
def update_visit_test_result(
    visit_id: int,
    visit_test_id: int,
    test_update_in: VisitTestUpdate,
    db: Session = Depends(get_db),
):
    """Update diagnostic test status and result within a visit."""
    updated = VisitService.update_visit_test(db, visit_id, visit_test_id, test_update_in)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ordered test with ID {visit_test_id} not found in visit {visit_id}.",
        )
    return updated


@router.delete("/{visit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_visit(visit_id: int, db: Session = Depends(get_db)):
    """Delete a visit record."""
    visit = VisitService.get_by_id(db, visit_id)
    if not visit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Visit with ID {visit_id} not found.",
        )
    VisitService.delete(db, visit)
    return None
