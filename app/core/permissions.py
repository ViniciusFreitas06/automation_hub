from fastapi import Depends, HTTPException, status
from app.auth.security import get_current_user

def require_user(user = Depends(get_current_user)):
    return user

def require_dev(user = Depends(get_current_user)):
    if user.role not in ["dev", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissão insuficiente"
        )
    return user

def require_admin(user = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem acessar"
        )
    return user