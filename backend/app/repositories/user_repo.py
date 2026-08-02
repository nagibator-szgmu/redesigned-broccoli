from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


def get_by_email(db: Session, email: str) -> User | None:
    return db.execute(select(User).where(User.email == email)).scalar_one_or_none()


def get_by_username(db: Session, username: str) -> User | None:
    return db.execute(select(User).where(User.username == username)).scalar_one_or_none()


def get_by_id(db: Session, user_id: str) -> User | None:
    return db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()


def create(db: Session, email: str, username: str, password_hash: str) -> User:
    user = User(email=email, username=username, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def exists(db: Session, email: str, username: str) -> bool:
    return get_by_email(db, email) is not None or get_by_username(db, username) is not None