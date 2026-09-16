from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class TestBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = None
    description: Optional[str] = None
    price: float = Field(default=0.0, ge=0.0)
    turnaround_hours: Optional[int] = Field(default=24, ge=0)
    is_active: bool = True
    is_b2b: Optional[bool] = False
    b2b_price: Optional[float] = Field(default=None, ge=0.0)
    b2b_name: Optional[str] = None

    @field_validator('code')
    @classmethod
    def uppercase_code(cls, v: str) -> str:
        if v:
            return v.strip().upper()
        return v


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
    is_b2b: Optional[bool] = None
    b2b_price: Optional[float] = Field(default=None, ge=0.0)
    b2b_name: Optional[str] = None

    @field_validator('code')
    @classmethod
    def uppercase_code(cls, v: Optional[str]) -> Optional[str]:
        if v:
            return v.strip().upper()
        return v


class TestResponse(TestBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
