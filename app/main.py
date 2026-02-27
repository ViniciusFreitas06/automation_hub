from fastapi import FastAPI
from app.routes import scripts, runner, download, admin
from app.db.session import create_db_and_tables
from app.auth.router import router as auth_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Automation Hub",
    description="Plataforma corporativa de automação de scripts",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.15.20:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(scripts.router)
app.include_router(runner.router)
app.include_router(download.router)
app.include_router(auth_router)
app.include_router(admin.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "Automation Hub"}


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
