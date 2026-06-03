# Secure Chat Application (ShadowChat)

A production-ready WhatsApp-inspired secure private messaging application built with React.js, FastAPI, and WebSockets, featuring end-to-end encryption and advanced privacy controls.

## Features

### Authentication & Security
- User registration and login
- JWT-based authentication
- bcrypt password hashing
- Session management with auto-logout on inactivity
- Secure token refresh mechanism

### Real-Time Messaging
- One-to-one private chat
- Instant messaging via WebSockets
- Typing indicators
- Read receipts and delivery status
- Message search and history

### Privacy & Encryption
- **End-to-End Encryption**: Messages encrypted using Fernet before sending
- **View Once Messages**: Messages that can only be viewed once and auto-delete
- **Disappearing Messages**: Auto-delete timers (5s, 30s, 1m, 5m, 1h)
- **Focus Protection**: Blur chat content when browser loses focus
- **Privacy Dashboard**: Track privacy events and security alerts

### User Management
- User profiles with avatar upload
- Online/offline status tracking
- Last seen timestamp
- Username search functionality
- Profile customization

### Additional Features
- Delete messages and chats
- Audit logs for security events
- Device session tracking
- Security alerts and monitoring
- Responsive design with mobile support
- Dark mode UI

## Technology Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **WebSockets** - Real-time communication

### Backend
- **FastAPI** - Modern Python web framework
- **SQLite** - Database
- **SQLAlchemy** - ORM
- **Uvicorn** - ASGI server
- **WebSockets** - Real-time bidirectional communication

### Security
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Fernet** - Symmetric encryption for messages
- **cryptography** - Cryptographic recipes

## Project Structure

```
secure-chat-application/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── security.py
│   │   ├── crud.py
│   │   ├── websocket_manager.py
│   │   ├── encryption.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── messages.py
│   │   │   ├── audit.py
│   │   │   └── health.py
│   │   └── websocket/
│   │       ├── __init__.py
│   │       └── chat.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env
├── database/
│   └── secure_chat.db
├── .gitignore
├── .env.example
├── requirements.txt
└── README.md
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Initialize the database:
```bash
python -c "from app.database import init_db; init_db()"
```

6. Run the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:5173
```

## API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Usage

### Registration
1. Click "Sign Up" on the login page
2. Enter username, email, and password
3. Password must be at least 8 characters
4. Click "Register"

### Login
1. Enter your email and password
2. Click "Sign In"
3. You'll be redirected to the chat dashboard

### Sending Messages
1. Click on a user from the sidebar to open a chat
2. Type your message in the message input field
3. Press Enter or click Send
4. Messages are encrypted before sending

### Privacy Features

**View Once Messages**
1. Click the options menu on a message
2. Select "Mark as View Once"
3. Recipient can open only once

**Disappearing Messages**
1. Click the timer icon before sending
2. Select duration (5s, 30s, 1m, 5m, 1h)
3. Message auto-deletes after timer expires

**Delete Messages**
1. Right-click a message
2. Select "Delete"
3. Message is removed from both sides

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with salt
- Minimum 8 characters required
- Never transmitted in plain text

### Message Encryption
- All messages are encrypted using Fernet (symmetric encryption)
- Encryption key is securely stored
- Only authorized users can decrypt messages

### Session Management
- JWT tokens expire after 30 minutes
- Refresh tokens available for 7 days
- Auto-logout after 30 minutes of inactivity

### HTTPS/WSS
- In production, always use HTTPS and WSS (WebSocket Secure)
- Configure proper SSL certificates
- Update CORS origins for your domain

## Environment Variables

```env
# Backend
BACKEND_URL=http://localhost:8000
DATABASE_URL=sqlite:///./secure_chat.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=["http://localhost:5173"]
SESSION_TIMEOUT_MINUTES=30

# Frontend
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## Database Schema

### Users Table
- `id` (Integer, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password_hash` (String)
- `avatar` (String, Optional)
- `is_online` (Boolean)
- `last_seen` (DateTime)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Messages Table
- `id` (Integer, Primary Key)
- `sender_id` (Integer, Foreign Key)
- `receiver_id` (Integer, Foreign Key)
- `encrypted_message` (String)
- `view_once` (Boolean)
- `view_once_opened` (Boolean)
- `expiry_time` (DateTime, Optional)
- `read_status` (Boolean)
- `delivered_status` (Boolean)
- `deleted_at` (DateTime, Optional)
- `created_at` (DateTime)

### AuditLogs Table
- `id` (Integer, Primary Key)
- `user_id` (Integer, Foreign Key)
- `event_type` (String)
- `description` (String)
- `ip_address` (String, Optional)
- `user_agent` (String, Optional)
- `created_at` (DateTime)

### Sessions Table
- `id` (Integer, Primary Key)
- `user_id` (Integer, Foreign Key)
- `token` (String)
- `device_info` (String)
- `ip_address` (String)
- `created_at` (DateTime)
- `expires_at` (DateTime)

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed
- Check all dependencies are installed: `pip install -r requirements.txt`
- Verify database file permissions
- Check port 8000 is not in use

### Frontend won't connect to backend
- Ensure backend is running on http://localhost:8000
- Check CORS configuration in backend
- Verify firewall settings
- Check WebSocket connection in browser console

### Messages not encrypting/decrypting
- Verify Fernet key is set correctly
- Check database connectivity
- Ensure both users are authenticated

### WebSocket connection fails
- Check WebSocket URL is correct (ws:// for dev, wss:// for prod)
- Verify backend WebSocket endpoint is accessible
- Check browser console for detailed error messages

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@shadowchat.com or open an issue on GitHub.

## Disclaimer

This application implements legitimate privacy and security features only. Screenshot and screen recording detection features are best-effort and should not be relied upon as guaranteed protection. Always comply with local laws and regulations regarding privacy monitoring.
