from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pathlib import Path
import shutil
import time

from app.services.executor import execute
from app.services.logger import log_execution

router = APIRouter(prefix="/runner", tags=["Runner"])

UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)


@router.post("/")
async def run_script(file: UploadFile = File(...), script_name: str = Form(...)):
    input_path = UPLOAD_DIR / file.filename
    output_path = OUTPUT_DIR / f"resultado_{file.filename}"

    start_time = time.time()

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        execute(script_name, input_path, output_path)

        duration = time.time() - start_time
        log_execution(script_name, file.filename, "SUCCESS", duration)

        return {
            "status": "ok",
            "output_file": str(output_path),
            "duration": f"{duration:.2f}s",
        }

    except Exception as e:
        duration = time.time() - start_time
        log_execution(script_name, file.filename, "ERROR", duration)

        raise HTTPException(status_code=500, detail=str(e))
