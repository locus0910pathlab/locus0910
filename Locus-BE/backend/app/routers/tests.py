from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.test import TestCreate, TestUpdate, TestResponse
from app.services.test_service import TestService

router = APIRouter(prefix="/tests", tags=["Tests"])


@router.post("", response_model=TestResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
@router.post("/", response_model=TestResponse, status_code=status.HTTP_201_CREATED)
def create_test(test_in: TestCreate, db: Session = Depends(get_db)):
    """Create a new diagnostic test catalog item."""
    existing = TestService.get_by_code(db, test_in.code)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Test with code '{test_in.code}' already exists.",
        )
    return TestService.create(db, test_in)


@router.get("", response_model=List[TestResponse], include_in_schema=False)
@router.get("/", response_model=List[TestResponse])
def get_tests(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    category: Optional[str] = Query(None, description="Filter by test category"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    search: Optional[str] = Query(None, description="Search by name, code, or description"),
    db: Session = Depends(get_db),
):
    """Retrieve list of diagnostic tests catalog."""
    return TestService.get_multi(
        db,
        skip=skip,
        limit=limit,
        category=category,
        is_active=is_active,
        search=search,
    )


@router.get("/{test_id}", response_model=TestResponse)
def get_test(test_id: int, db: Session = Depends(get_db)):
    """Retrieve a single test by ID."""
    test = TestService.get_by_id(db, test_id)
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Test with ID {test_id} not found.",
        )
    return test


@router.put("/{test_id}", response_model=TestResponse)
def update_test(
    test_id: int,
    test_in: TestUpdate,
    db: Session = Depends(get_db),
):
    """Update diagnostic test details."""
    test = TestService.get_by_id(db, test_id)
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Test with ID {test_id} not found.",
        )
    if test_in.code and test_in.code != test.code:
        existing = TestService.get_by_code(db, test_in.code)
        if existing and existing.id != test_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Test with code '{test_in.code}' already exists.",
            )
    return TestService.update(db, test, test_in)


@router.delete("/{test_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_test(test_id: int, db: Session = Depends(get_db)):
    """Delete a test item from the catalog."""
    test = TestService.get_by_id(db, test_id)
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Test with ID {test_id} not found.",
        )
    TestService.delete(db, test)
    return None
