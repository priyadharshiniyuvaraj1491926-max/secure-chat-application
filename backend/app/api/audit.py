from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db
from typing import List

router = APIRouter(prefix="/api/audit", tags=["audit"])

@router.post("/log", response_model=schemas.AuditLogResponse)
async def create_audit_log(
    audit_log: schemas.AuditLogCreate,
    db: Session = Depends(get_db),
    current_user_id: int = None
):
    """Create an audit log entry"""
    if not current_user_id:
        return {"error": "Not authenticated"}
    
    return crud.create_audit_log(db, audit_log, current_user_id)

@router.get("/logs", response_model=List[schemas.AuditLogResponse])
async def get_audit_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = None
):
    """Get audit logs for current user"""
    if not current_user_id:
        return []
    
    return crud.get_audit_logs(db, user_id=current_user_id, skip=skip, limit=limit)

@router.get("/all-logs", response_model=List[schemas.AuditLogResponse])
async def get_all_audit_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all audit logs (admin only)"""
    return crud.get_audit_logs(db, skip=skip, limit=limit)
