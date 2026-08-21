# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/routes/consent.py | Last Modified: 2026-08-22
# ============================================================

from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from apps.api.src.db.database import get_db
from apps.api.src.db.models import ConsentRecord, ComplianceAuditLog, Checkin


router = APIRouter(prefix="/consent", tags=["DPDP Privacy & Consent Hub"])


@router.get("/{token}")
def get_consent_status(token: str, db: Session = Depends(get_db)):
    """
    Returns student data principal consent status and transparency processing logs.
    """
    consent = db.query(ConsentRecord).filter(ConsentRecord.token == token).first()
    if not consent:
        return {
            "token": token,
            "consent_given": True,
            "status": "active_opt_in",
            "retention_policy": "30 days auto-purge",
            "audit_entries_count": 0
        }

    # Fetch audit entries associated with this pseudonymous token
    audit_logs = db.query(ComplianceAuditLog).order_by(ComplianceAuditLog.created_at.desc()).limit(15).all()
    token_audits = [
        {
            "id": a.id,
            "event": a.event_type,
            "zone": a.zone_affected,
            "legal_basis": a.legal_basis,
            "timestamp": a.created_at.isoformat()
        }
        for a in audit_logs
        if a.details and a.details.get("token") == token
    ]

    return {
        "token": token,
        "consent_given": consent.consent_given,
        "given_at": consent.given_at.isoformat() if consent.given_at else None,
        "withdrawn_at": consent.withdrawn_at.isoformat() if consent.withdrawn_at else None,
        "purge_deadline": consent.purge_deadline.isoformat() if consent.purge_deadline else None,
        "processing_audit_history": token_audits
    }


@router.delete("/{token}")
def revoke_consent_and_purge_data(token: str, db: Session = Depends(get_db)):
    """
    Implements DPDP Act 2023 Section 8(7) mandatory right to erasure.
    Revokes consent and initiates immediate purging of check-in records.
    """
    consent = db.query(ConsentRecord).filter(ConsentRecord.token == token).first()
    if not consent:
        consent = ConsentRecord(token=token)
        db.add(consent)

    now = datetime.now(timezone.utc)
    consent.consent_given = False
    consent.withdrawn_at = now
    consent.purge_deadline = now + timedelta(hours=72)

    # Immediately delete raw checkin telemetry matching this pseudonymous token
    deleted_count = db.query(Checkin).filter(Checkin.token == token).delete()

    # Immutable audit log
    db.add(ComplianceAuditLog(
        event_type="DATA_ERASURE_REQUEST",
        actor_role="data_principal_student",
        zone_affected="all",
        legal_basis="DPDP_ACT_2023_SECTION_8_7",
        details={"token": token, "deleted_checkins": deleted_count}
    ))
    db.commit()

    return {
        "message": "Consent successfully revoked. Personal telemetry erased.",
        "records_purged": deleted_count,
        "purge_deadline": consent.purge_deadline.isoformat()
    }


@router.get("/audit/ledger")
def get_compliance_audit_ledger(db: Session = Depends(get_db)):
    """
    Returns the immutable compliance audit ledger for DPO statutory verification.
    """
    logs = db.query(ComplianceAuditLog).order_by(ComplianceAuditLog.created_at.desc()).limit(30).all()
    return [
        {
            "id": l.id,
            "event_type": l.event_type,
            "actor_role": l.actor_role,
            "zone_affected": l.zone_affected,
            "legal_basis": l.legal_basis,
            "details": l.details,
            "created_at": l.created_at.isoformat()
        }
        for l in logs
    ]
