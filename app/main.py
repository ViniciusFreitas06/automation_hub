from fastapi import FastAPI
from app.routes import scripts, runner, download

app = FastAPI(
    title="Automation Hub",
    description="Plataforma corporativa de automação de scripts",
    version="1.0.0",
)

app.include_router(scripts.router)
app.include_router(runner.router)
app.include_router(download.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "Automation Hub"}
