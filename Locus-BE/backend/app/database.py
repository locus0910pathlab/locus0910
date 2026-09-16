import os
from typing import Generator
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# Load environment variables from .env file
load_dotenv()

DEFAULT_DATABASE_URL = "postgresql://postgres.mdrrqxvbmxxgkjcbnawk:4297%40Locus0910@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
DATABASE_URL = os.getenv("DATABASE_URL") or DEFAULT_DATABASE_URL

# SQLite needs connect_args check_same_thread set to False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a database session and closes it afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
