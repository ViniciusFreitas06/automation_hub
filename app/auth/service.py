from sqlmodel import Session, select
from app.db.models import User
from app.auth.security import get_password_hash, verify_password


def create_user(db: Session, name: str, email: str, password: str, role="user"):
    hashed_password = get_password_hash(password)

    user = User(
        name=name,
        email=email,
        hashed_password=hashed_password,
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(db: Session, email: str, password: str):
    user = db.exec(select(User).where(User.email == email)).first()

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user