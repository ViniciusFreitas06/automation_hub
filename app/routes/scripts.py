from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
import shutil
import os
from pathlib import Path
from sqlmodel import Session, select
from app.auth.security import get_current_user
from app.core.permissions import require_dev, require_user
from app.db.session import get_session
from app.db.models import Script

router = APIRouter(prefix="/scripts", tags=["Scripts"])

SCRIPTS_DIR = Path("scripts")


@router.get("/")
def list_scripts(db: Session = Depends(get_session)):
    scripts = db.exec(select(Script)).all()
    return scripts


@router.post("/upload")
async def upload_script(
    name: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_session),
    user=Depends(require_dev),
):

    if not file.filename.endswith(".py"):
        raise HTTPException(
            status_code=400, detail="Somente arquivos .py são permitidos"
        )

    script_path = SCRIPTS_DIR / file.filename

    if script_path.exists():
        raise HTTPException(status_code=409, detail="Script já existe")

    with open(script_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    script = Script(
        name=name,
        description=description,
        author=user.name,
        filename=file.filename,
    )

    db.add(script)
    db.commit()
    db.refresh(script)

    return {"status": "ok", "script": script}


@router.delete("/{script_id}")
def delete_script(
    script_id: int, db: Session = Depends(get_session), user=Depends(require_dev)
):
    script = db.get(Script, script_id)

    if not script:
        raise HTTPException(status_code=404, detail="Script não encontrado")

    script_path = SCRIPTS_DIR / script.filename

    if script_path.exists():
        os.remove(script_path)

    db.delete(script)
    db.commit()

    return {"status": "ok"}


@router.get("/{script_id}")
def get_script_by_id(script_id: int, db: Session = Depends(get_session)):
    script = db.get(Script, script_id)
    if not script:
        raise HTTPException(status_code=404, detail="Script não encontrado")

    return script
