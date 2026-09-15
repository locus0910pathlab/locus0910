from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class TestBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = None
    description: Optional[str] = None
    price: float = Field(default=0.0, ge=0.0)
    turnaround_hours: Optional[int] = Field(default=24, ge=0)
    is_active: bool = True


class TestCreate(TestBase):
    pass


class TestUpdate(BaseModel):
    code: Optional[str] = Field(None, min_length=1, max_length=50)
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0.0)
    turnaround_hours: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None


class TestResponse(TestBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
