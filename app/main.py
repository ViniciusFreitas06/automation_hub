from fastapi import FastAPI
from app.routes import scripts, runner, download, admin
from app.db.session import create_db_and_tables
from app.auth.router import router as auth_router



app = FastAPI(
    title="Automation Hub",
    description="Plataforma corporativa de automação de scripts",
    version="1.0.0",
)

app.include_router(scripts.router)
app.include_router(runner.router)
app.include_router(download.router)
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(admin.router)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "Automation Hub"}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()