from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter(prefix="/download", tags=["Download"])

OUTPUT_DIR = Path("outputs")


@router.get("/{filename}")
def download_file(filename: str, background_tasks: BackgroundTasks):
    file_path = (OUTPUT_DIR / filename).resolve()

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    
    background_tasks.add_task(file_path.unlink)

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream",
    )