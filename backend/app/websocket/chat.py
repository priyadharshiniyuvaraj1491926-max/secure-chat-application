from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from app.websocket_manager import ws_manager
from app.encryption import get_encryption_manager
import json

router = APIRouter()
encryption_manager = get_encryption_manager()

@router.websocket("/ws/chat/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    """WebSocket endpoint for real-time chat"""
    await ws_manager.connect(user_id, websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            message_type = message_data.get("type")
            
            if message_type == "message":
                # Handle message
                receiver_id = message_data.get("receiver_id")
                message_content = message_data.get("message")
                
                # Encrypt message
                encrypted_msg = encryption_manager.encrypt_message(message_content)
                
                # Send to receiver if online
                await ws_manager.send_personal_message(
                    receiver_id,
                    {
                        "type": "message",
                        "sender_id": user_id,
                        "message": encrypted_msg,
                        "timestamp": message_data.get("timestamp")
                    }
                )
                
                # Send delivery receipt
                await ws_manager.send_personal_message(
                    user_id,
                    {
                        "type": "delivery_receipt",
                        "receiver_id": receiver_id,
                        "status": "delivered" if ws_manager.is_user_online(receiver_id) else "pending"
                    }
                )
            
            elif message_type == "typing":
                # Handle typing indicator
                receiver_id = message_data.get("receiver_id")
                await ws_manager.send_personal_message(
                    receiver_id,
                    {
                        "type": "typing",
                        "sender_id": user_id
                    }
                )
            
            elif message_type == "read_receipt":
                # Handle read receipt
                message_id = message_data.get("message_id")
                sender_id = message_data.get("sender_id")
                await ws_manager.send_personal_message(
                    sender_id,
                    {
                        "type": "read_receipt",
                        "message_id": message_id,
                        "reader_id": user_id
                    }
                )
            
            elif message_type == "status":
                # Broadcast status
                online_users = ws_manager.get_online_users()
                await ws_manager.broadcast({
                    "type": "user_status",
                    "user_id": user_id,
                    "status": "online",
                    "online_users": online_users
                })
    
    except WebSocketDisconnect:
        ws_manager.disconnect(user_id)
        # Notify others that user went offline
        online_users = ws_manager.get_online_users()
        await ws_manager.broadcast({
            "type": "user_status",
            "user_id": user_id,
            "status": "offline",
            "online_users": online_users
        })
    except Exception as e:
        ws_manager.disconnect(user_id)
        print(f"WebSocket error: {e}")
