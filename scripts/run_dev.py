# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: scripts/run_dev.py | Last Modified: 2026-08-22
# ============================================================

import subprocess
import sys
import time
import os

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass


def run_development_servers():
    """
    Launches FastAPI Backend (Port 8000) and Vite Web Frontend (Port 5173) concurrently.
    """
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    api_dir = root_dir
    web_dir = os.path.join(root_dir, "apps", "web")

    print("=" * 65)
    print("[PROJECT CHOWKI] Campus Outbreak Surveillance Radar")
    print("Made by Synthreaper | github.com/synthreaper/chowki")
    print("=" * 65)
    print(f"Workspace Root: {root_dir}")
    print("Starting FastAPI backend on http://127.0.0.1:8000 ...")
    print("Starting Vite web frontend on http://localhost:5173 ...")
    print("=" * 65)

    # 1. Start FastAPI Backend
    api_cmd = [sys.executable, "-m", "uvicorn", "apps.api.src.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    api_proc = subprocess.Popen(api_cmd, cwd=api_dir)

    # 2. Start Vite Frontend
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    web_cmd = [npm_cmd, "run", "dev"]
    web_proc = subprocess.Popen(web_cmd, cwd=web_dir)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down Project CHOWKI servers...")
        api_proc.terminate()
        web_proc.terminate()
        api_proc.wait()
        web_proc.wait()
        print("All servers gracefully stopped.")


if __name__ == "__main__":
    run_development_servers()
