# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/main.py | Last Modified: 2026-08-22
# ============================================================

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from apps.api.src.core.config import get_settings
from apps.api.src.db.database import init_db, SessionLocal
from apps.api.src.db.models import SpatialZone, IoTReading, MenuItem
from apps.api.src.routes import (
    checkin, radar, menu, telemetry, warden, consent, simulation
)


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("chowki-api")
settings = get_settings()


def seed_initial_campus_zones():
    """
    Ensures all standard campus zones and initial baseline records exist.
    """
    db = SessionLocal()
    try:
        default_zones = [
            ("Hostel_A_Fl_1", "Hostel A — 1st Floor", "floor", "Hostel_A_Block", 60),
            ("Hostel_B_Fl_2", "Hostel B — 2nd Floor", "floor", "Hostel_B_Block", 55),
            ("Hostel_C_Fl_3", "Hostel C — 3rd Floor", "floor", "Hostel_C_Block", 65),
            ("Hostel_D_Fl_1", "Hostel D — 1st Floor", "floor", "Hostel_D_Block", 50),
            ("Mess_1_Main", "Mess 1 (Main Hall)", "mess", None, 450),
            ("Mess_2_Girls", "Mess 2 (Dining Hall 2)", "mess", None, 380)
        ]
        for token, name, z_type, parent, cap in default_zones:
            existing = db.query(SpatialZone).filter(SpatialZone.zone_token == token).first()
            if not existing:
                db.add(SpatialZone(
                    zone_token=token,
                    display_name=name,
                    zone_type=z_type,
                    parent_zone=parent,
                    resident_capacity=cap,
                    current_alert_level=0
                ))
            
        # Seed standard menu if empty
        if db.query(MenuItem).count() == 0:
            db.add(MenuItem(
                mess_id="Mess_2_Girls",
                meal_type="dinner",
                item_name="Palak Paneer",
                risk_tag="high",
                risk_multiplier=1.5,
                vendor_type="external",
                estimated_servings=320,
                is_active=True
            ))
            db.add(MenuItem(
                mess_id="Mess_2_Girls",
                meal_type="dinner",
                item_name="Steamed Rice",
                risk_tag="high",
                risk_multiplier=1.2,
                vendor_type="in-house",
                estimated_servings=320,
                is_active=True
            ))
            db.add(MenuItem(
                mess_id="Mess_1_Main",
                meal_type="dinner",
                item_name="Dal Tadka & Roti",
                risk_tag="normal",
                risk_multiplier=1.0,
                vendor_type="in-house",
                estimated_servings=400,
                is_active=True
            ))

        # Seed baseline clean IoT if empty
        if db.query(IoTReading).count() == 0:
            db.add(IoTReading(
                sensor_id="SENSOR-BlockC-RO-01",
                zone="Hostel_C_Fl_3",
                chlorine_mg_l=0.52,
                turbidity_ntu=1.2,
                ph=7.3,
                flow_lpm=50.0,
                alert_triggered=False
            ))

        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.app_name} v{settings.app_version} in [{settings.environment}] mode.")
    init_db()
    seed_initial_campus_zones()
    yield
    logger.info("Shutting down Project CHOWKI API.")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Bio-Spatiotemporal Micro-Outbreak Early Warning & Containment Architecture for Indian Campuses.",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_security_headers_and_watermark(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Powered-By"] = "CHOWKI/1.0 (Synthreaper)"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response


app.include_router(checkin.router, prefix=settings.api_prefix)
app.include_router(radar.router, prefix=settings.api_prefix)
app.include_router(menu.router, prefix=settings.api_prefix)
app.include_router(telemetry.router, prefix=settings.api_prefix)
app.include_router(warden.router, prefix=settings.api_prefix)
app.include_router(consent.router, prefix=settings.api_prefix)
app.include_router(simulation.router, prefix=settings.api_prefix)


@app.get("/")
def root_endpoint():
    return {
        "status": "online",
        "service": "Project CHOWKI Outbreak Surveillance API",
        "version": settings.app_version,
        "author": "Synthreaper (github.com/synthreaper/chowki)",
        "docs_url": "/docs",
        "health_endpoint": "/health",
        "live_radar": "/api/v1/radar/live"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Project CHOWKI API",
        "version": settings.app_version,
        "environment": settings.environment,
        "author": "Synthreaper (github.com/synthreaper/chowki)"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("apps.api.src.main:app", host=settings.host, port=settings.port, reload=True)
