from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db
from typing import List

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/", response_model=List[schemas.UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all users"""
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=schemas.UserDetailResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return db_user

@router.get("/search/{username}")
async def search_user(username: str, db: Session = Depends(get_db)):
    """Search user by username"""
    db_user = crud.get_user_by_username(db, username)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "avatar": db_user.avatar,
        "is_online": db_user.is_online,
        "last_seen": db_user.last_seen
    }

@router.put("/{user_id}", response_model=schemas.UserDetailResponse)
async def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = None
):
    """Update user profile"""
    if not current_user_id or current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update other user's profile"
        )
    
    db_user = crud.update_user(db, user_id, user_update)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return db_user

@router.get("/{user_id}/status")
async def get_user_status(user_id: int, db: Session = Depends(get_db)):
    """Get user online status"""
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {
        "user_id": db_user.id,
        "is_online": db_user.is_online,
        "last_seen": db_user.last_seen
    }
