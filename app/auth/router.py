from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db.session import get_session
from app.auth.service import create_user, authenticate_user
from app.auth.security import create_access_token
from app.auth.schemas import UserRegister, UserLogin

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(
    payload: UserRegister,
    db: Session = Depends(get_session),
):
    return create_user(db, payload.name, payload.email, payload.password)


@router.post("/login")
def login(
    payload: UserLogin,
    db: Session = Depends(get_session),
):
    user = authenticate_user(db, payload.email, payload.password)

    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role,
        }
    )

    return {"access_token": token, "token_type": "bearer"}