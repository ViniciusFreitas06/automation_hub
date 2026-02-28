from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.session import get_session
from app.db.models import User
from app.core.permissions import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.put("/users/{user_id}/role")
def change_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_session),
    admin=Depends(require_admin),
):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if role not in ["user", "dev", "admin"]:
        raise HTTPException(status_code=400, detail="Role inválida")

    user.role = role
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"status": "ok", "user_id": user.id, "new_role": user.role}


@router.get("/users")
def list_users(
    db: Session = Depends(get_session),
    admin=Depends(require_admin),
):
    users = db.exec(select(User)).all()
    return users

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_session),
    admin=Depends(require_admin),
):
    user = db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    db.delete(user)
    db.commit()

    return {"status": "ok", "deleted_id": user_id}