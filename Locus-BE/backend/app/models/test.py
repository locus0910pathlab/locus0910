from datetime import datetime
from typing import Optional, List
from sqlalchemy import Integer, String, Float, Boolean, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Test(Base):
    __tablename__ = "tests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    turnaround_hours: Mapped[Optional[int]] = mapped_column(Integer, default=24, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_b2b: Mapped[bool] = mapped_column(Boolean, default=False, nullable=True)
    b2b_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    b2b_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    visit_associations: Mapped[List["VisitTest"]] = relationship("VisitTest", back_populates="test")
