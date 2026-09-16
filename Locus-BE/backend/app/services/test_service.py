from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.models.test import Test
from app.schemas.test import TestCreate, TestUpdate


class TestService:
    @staticmethod
    def get_by_id(db: Session, test_id: int) -> Optional[Test]:
        return db.query(Test).filter(Test.id == test_id).first()

    @staticmethod
    def get_by_code(db: Session, code: str) -> Optional[Test]:
        return db.query(Test).filter(func.upper(Test.code) == code.strip().upper()).first()

    @staticmethod
    def get_multi(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        category: Optional[str] = None,
        is_active: Optional[bool] = None,
        search: Optional[str] = None,
    ) -> List[Test]:
        query = db.query(Test)
        if category:
            query = query.filter(Test.category == category)
        if is_active is not None:
            query = query.filter(Test.is_active == is_active)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Test.name.ilike(search_filter),
                    Test.code.ilike(search_filter),
                    Test.description.ilike(search_filter),
                )
            )
        return query.order_by(Test.id.asc()).offset(skip).limit(limit).all()

    @staticmethod
    def create(db: Session, obj_in: TestCreate) -> Test:
        db_obj = Test(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    @staticmethod
    def update(db: Session, db_obj: Test, obj_in: TestUpdate) -> Test:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    @staticmethod
    def delete(db: Session, db_obj: Test) -> None:
        db.delete(db_obj)
        db.commit()
