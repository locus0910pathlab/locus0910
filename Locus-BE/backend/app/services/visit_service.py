from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.visit import Visit, VisitTest, VisitStatus
from app.models.test import Test
from app.schemas.visit import VisitCreate, VisitUpdate, VisitTestUpdate


class VisitService:
    @staticmethod
    def get_by_id(db: Session, visit_id: int) -> Optional[Visit]:
        return (
            db.query(Visit)
            .options(
                joinedload(Visit.patient),
                joinedload(Visit.tests_ordered).joinedload(VisitTest.test),
            )
            .filter(Visit.id == visit_id)
            .first()
        )

    @staticmethod
    def get_multi(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        patient_id: Optional[int] = None,
        status: Optional[VisitStatus] = None,
    ) -> List[Visit]:
        query = db.query(Visit).options(
            joinedload(Visit.patient),
            joinedload(Visit.tests_ordered).joinedload(VisitTest.test),
        )
        if patient_id is not None:
            query = query.filter(Visit.patient_id == patient_id)
        if status is not None:
            query = query.filter(Visit.status == status)
        return query.order_by(Visit.visit_date.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def create(db: Session, obj_in: VisitCreate) -> Visit:
        # Calculate total price if tests are included
        total_amount = 0.0
        tests: List[Test] = []
        if obj_in.test_ids:
            tests = db.query(Test).filter(Test.id.in_(obj_in.test_ids)).all()
            total_amount = sum(t.price for t in tests)

        db_visit = Visit(
            patient_id=obj_in.patient_id,
            visit_date=obj_in.visit_date or datetime.now(),
            status=VisitStatus.SCHEDULED,
            notes=obj_in.notes,
            total_amount=total_amount,
        )
        db.add(db_visit)
        db.flush()

        for test in tests:
            visit_test = VisitTest(
                visit_id=db_visit.id,
                test_id=test.id,
            )
            db.add(visit_test)

        db.commit()
        db.refresh(db_visit)
        return VisitService.get_by_id(db, db_visit.id)  # type: ignore

    @staticmethod
    def update(db: Session, db_obj: Visit, obj_in: VisitUpdate) -> Visit:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return VisitService.get_by_id(db, db_obj.id)  # type: ignore

    @staticmethod
    def update_visit_test(
        db: Session, visit_id: int, visit_test_id: int, obj_in: VisitTestUpdate
    ) -> Optional[VisitTest]:
        visit_test = (
            db.query(VisitTest)
            .filter(VisitTest.id == visit_test_id, VisitTest.visit_id == visit_id)
            .first()
        )
        if not visit_test:
            return None

        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(visit_test, field, value)

        db.commit()
        db.refresh(visit_test)
        return visit_test

    @staticmethod
    def delete(db: Session, db_obj: Visit) -> None:
        db.delete(db_obj)
        db.commit()
