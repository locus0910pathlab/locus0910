from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.models.visit import VisitStatus, TestStatus
from app.schemas.patient import PatientResponse
from app.schemas.test import TestResponse


class VisitTestCreate(BaseModel):
    test_id: int
    notes: Optional[str] = None


class VisitTestUpdate(BaseModel):
    status: Optional[TestStatus] = None
    result_value: Optional[str] = None
    notes: Optional[str] = None


class VisitTestResponse(BaseModel):
    id: int
    visit_id: int
    test_id: int
    status: TestStatus
    result_value: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    test: Optional[TestResponse] = None

    model_config = ConfigDict(from_attributes=True)


class VisitBase(BaseModel):
    patient_id: int
    notes: Optional[str] = None
    visit_date: Optional[datetime] = None


class VisitCreate(VisitBase):
    test_ids: Optional[List[int]] = Field(default_factory=list)


class VisitUpdate(BaseModel):
    status: Optional[VisitStatus] = None
    notes: Optional[str] = None
    visit_date: Optional[datetime] = None


class VisitResponse(BaseModel):
    id: int
    patient_id: int
    visit_date: datetime
    status: VisitStatus
    notes: Optional[str] = None
    total_amount: float
    created_at: datetime
    updated_at: datetime
    patient: Optional[PatientResponse] = None
    tests_ordered: List[VisitTestResponse] = []

    model_config = ConfigDict(from_attributes=True)
