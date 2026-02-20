from datetime import datetime
from pathlib import Path

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

LOG_FILE = LOG_DIR / "executions.log"


def log_execution(script, filename, status, duration):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"{timestamp} | {script} | {filename} | {status} | {duration:.2f}s\n"

    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line)
