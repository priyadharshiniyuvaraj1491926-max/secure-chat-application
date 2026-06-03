from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import os

from app.database import init_db, get_db
from app.config import get_settings
from app.api import health, auth, users, messages, audit
from app.websocket import chat
from app.security import decode_token

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="Secure Chat Application",
    description="End-to-end encrypted messaging application",
    version="1.0.0"
)

# Get settings
settings = get_settings()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(messages.router)
app.include_router(audit.router)
app.include_router(chat.router)

# Dependency for getting current user from token
def get_current_user_id(authorization: str = None) -> int:
    """Extract user ID from JWT token"""
    if not authorization:
        return None
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            return None
        
        payload = decode_token(token)
        user_id = payload.get("sub")
        return user_id
    except Exception as e:
        return None

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Secure Chat Application API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/api/me")
async def get_current_user(
    authorization: str = None,
    db: Session = Depends(get_db)
):
    """Get current user info"""
    from app import crud
    
    user_id = get_current_user_id(authorization)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "avatar": user.avatar,
        "is_online": user.is_online,
        "last_seen": user.last_seen,
        "created_at": user.created_at
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
