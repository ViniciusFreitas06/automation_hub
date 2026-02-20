from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter(prefix="/download", tags=["Download"])

OUTPUT_DIR = Path("outputs")


@router.get("/{filename}")
def download_file(filename: str):
    file_path = OUTPUT_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    return FileResponse(
        path=file_path, filename=filename, media_type="application/octet-stream"
    )
