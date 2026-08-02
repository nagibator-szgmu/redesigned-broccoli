from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    pass


engine = None
SessionLocal = None


def init_db():
    global engine, SessionLocal
    if engine is not None:
        return
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    init_db()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()