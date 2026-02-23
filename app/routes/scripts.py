from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import shutil
from pathlib import Path
from app.core.permissions import require_dev, require_user

router = APIRouter(prefix="/scripts", tags=["Scripts"])

SCRIPTS_DIR = Path("scripts")


@router.get("/")
def list_scripts(user = Depends(require_user)):
    scripts = []

    for file in SCRIPTS_DIR.glob("*.py"):
        if file.name != "__init__.py":
            scripts.append(file.stem)

    return scripts

@router.post("/upload")
async def upload_script(file: UploadFile = File(...), user = Depends(require_dev)):

    if not file.filename.endswith(".py"):
        raise HTTPException(status_code=400, detail="Somente arquivos .py são permitidos")

    script_path = SCRIPTS_DIR / file.filename

    
    if script_path.exists():
        raise HTTPException(status_code=409, detail="Script já existe")


    with open(script_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "status": "ok",
        "script": file.filename
    }