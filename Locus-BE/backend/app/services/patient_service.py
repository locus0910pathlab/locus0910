from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate


class PatientService:
    @staticmethod
    def get_by_id(db: Session, patient_id: int) -> Optional[Patient]:
        return db.query(Patient).filter(Patient.id == patient_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[Patient]:
        return db.query(Patient).filter(Patient.email == email).first()

    @staticmethod
    def get_multi(
        db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None
    ) -> List[Patient]:
        query = db.query(Patient)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Patient.first_name.ilike(search_filter),
                    Patient.last_name.ilike(search_filter),
                    Patient.email.ilike(search_filter),
                    Patient.phone.ilike(search_filter),
                )
            )
        return query.order_by(Patient.id.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def create(db: Session, obj_in: PatientCreate) -> Patient:
        db_obj = Patient(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    @staticmethod
    def update(db: Session, db_obj: Patient, obj_in: PatientUpdate) -> Patient:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    @staticmethod
    def delete(db: Session, db_obj: Patient) -> None:
        db.delete(db_obj)
        db.commit()
