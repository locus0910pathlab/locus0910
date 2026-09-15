from datetime import datetime
from typing import Optional, List
from sqlalchemy import Integer, String, Float, Text, DateTime, ForeignKey, Enum as SQLEnum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from app.database import Base


class VisitStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class TestStatus(str, enum.Enum):
    PENDING = "PENDING"
    SAMPLE_COLLECTED = "SAMPLE_COLLECTED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class VisitTest(Base):
    __tablename__ = "visit_tests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    visit_id: Mapped[int] = mapped_column(Integer, ForeignKey("visits.id", ondelete="CASCADE"), nullable=False)
    test_id: Mapped[int] = mapped_column(Integer, ForeignKey("tests.id", ondelete="RESTRICT"), nullable=False)
    status: Mapped[TestStatus] = mapped_column(SQLEnum(TestStatus), default=TestStatus.PENDING, nullable=False)
    result_value: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)

    # Relationships
    visit: Mapped["Visit"] = relationship("Visit", back_populates="tests_ordered")
    test: Mapped["Test"] = relationship("Test", back_populates="visit_associations")


class Visit(Base):
    __tablename__ = "visits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    patient_id: Mapped[int] = mapped_column(Integer, ForeignKey("patients_data.id", ondelete="CASCADE"), nullable=False)
    visit_date: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)
    status: Mapped[VisitStatus] = mapped_column(SQLEnum(VisitStatus), default=VisitStatus.SCHEDULED, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    total_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    patient: Mapped["Patient"] = relationship("Patient", back_populates="visits")
    tests_ordered: Mapped[List["VisitTest"]] = relationship("VisitTest", back_populates="visit", cascade="all, delete-orphan")
