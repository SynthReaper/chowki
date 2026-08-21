# ============================================================
# Project CHOWKI — Vercel Serverless Function Entry Point
# Made by Synthreaper | github.com/synthreaper/chowki
# File: api/index.py | Last Modified: 2026-08-22
# ============================================================

import os
import sys

# Ensure root workspace directory is in python module search path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Import the main FastAPI application instance
from apps.api.src.main import app

# Handler for Vercel Serverless
app = app
