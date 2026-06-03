from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db
from app.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from datetime import datetime, timedelta, timezone
from typing import Annotated

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserResponse)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    new_user = crud.create_user(db, user)
    
    # Create audit log
    audit_log = schemas.AuditLogCreate(
        event_type="USER_REGISTERED",
        description=f"User {user.username} registered"
    )
    crud.create_audit_log(db, audit_log, new_user.id)
    
    return new_user

@router.post("/login", response_model=schemas.Token)
async def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    """User login"""
    db_user = crud.get_user_by_email(db, user.email)
    
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": db_user.id})
    refresh_token = create_refresh_token(data={"sub": db_user.id})
    
    # Update last seen and online status
    db_user.is_online = True
    db_user.last_seen = datetime.utcnow()
    db.commit()
    
    # Create audit log
    audit_log = schemas.AuditLogCreate(
        event_type="LOGIN",
        description=f"User {db_user.username} logged in"
    )
    crud.create_audit_log(db, audit_log, db_user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=schemas.Token)
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """Refresh access token"""
    try:
        payload = decode_token(refresh_token)
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        db_user = crud.get_user(db, user_id)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Create new tokens
        new_access_token = create_access_token(data={"sub": db_user.id})
        new_refresh_token = create_refresh_token(data={"sub": db_user.id})
        
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

@router.post("/logout")
async def logout(db: Session = Depends(get_db), current_user_id: int = None):
    """User logout"""
    if not current_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    db_user = crud.get_user(db, current_user_id)
    if db_user:
        db_user.is_online = False
        db.commit()
        
        # Create audit log
        audit_log = schemas.AuditLogCreate(
            event_type="LOGOUT",
            description=f"User {db_user.username} logged out"
        )
        crud.create_audit_log(db, audit_log, db_user.id)
    
    return {"message": "Logged out successfully"}
