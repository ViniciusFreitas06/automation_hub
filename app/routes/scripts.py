from fastapi import APIRouter
from fastapi import APIRouter
from pathlib import Path

router = APIRouter(prefix="/scripts", tags=["Scripts"])

SCRIPTS_DIR = Path("scripts")


@router.get("/")
def list_scripts():
    scripts = []

    for file in SCRIPTS_DIR.glob("*.py"):
        if file.name != "__init__.py":
            scripts.append(file.stem)

    return scripts
