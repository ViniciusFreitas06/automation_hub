from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db.session import get_session
from app.db.models import User
from pathlib import Path 
import os

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

SCRIPTS_DIR = Path("scripts")

@router.get("/metrics")
def dashboard_metrics():
    total_scripts = len([
        f for f in os.listdir(SCRIPTS_DIR)
        if f.endswith(".py")
    ])

    return {
        "total_scripts": total_scripts
    }