from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db
from app.encryption import get_encryption_manager
from typing import List

router = APIRouter(prefix="/api/messages", tags=["messages"])

@router.post("/", response_model=schemas.MessageResponse)
async def send_message(
    message: schemas.MessageCreate,
    db: Session = Depends(get_db),
    current_user_id: int = None,
    encryption_manager = Depends(get_encryption_manager)
):
    """Send a message"""
    if not current_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Verify receiver exists
    receiver = crud.get_user(db, message.receiver_id)
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found"
        )
    
    # Encrypt the message
    encrypted_msg = encryption_manager.encrypt_message(message.message)
    
    # Create message with encrypted content
    message_create = schemas.MessageCreate(
        receiver_id=message.receiver_id,
        message=encrypted_msg,
        view_once=message.view_once,
        expiry_time=message.expiry_time
    )
    
    db_message = crud.create_message(db, message_create, current_user_id)
    return db_message

@router.get("/chat/{other_user_id}", response_model=List[schemas.MessageResponse])
async def get_chat(
    other_user_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user_id: int = None
):
    """Get chat history with another user"""
    if not current_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    messages = crud.get_messages_between(db, current_user_id, other_user_id, skip=skip, limit=limit)
    return messages

@router.get("/{message_id}", response_model=schemas.MessageResponse)
async def get_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = None
):
    """Get a specific message"""
    if not current_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    db_message = crud.get_message(db, message_id)
    if not db_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Check if user has access to this message
    if db_message.sender_id != current_user_id and db_message.receiver_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return db_message

@router.put("/{message_id}", response_model=schemas.MessageResponse)
async def update_message(
    message_id: int,
    message_update: schemas.MessageUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = None
):
    """Update message status"""
    if not current_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    db_message = crud.get_message(db, message_id)
    if not db_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Check permissions
    if db_message.sender_id != current_user_id and db_message.receiver_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    updated_message = crud.update_message(db, message_id, message_update)
    return updated_message

@router.delete("/{message_id}")
async def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = None
):
    """Delete a message"""
    if not current_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    db_message = crud.get_message(db, message_id)
    if not db_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Check if sender
    if db_message.sender_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only sender can delete message"
        )
    
    crud.delete_message(db, message_id)
    return {"message": "Message deleted successfully"}
