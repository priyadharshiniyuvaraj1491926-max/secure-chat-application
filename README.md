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
```

5. Run the backend server:
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

3. Start the development server:
```bash
npm run dev
```

## API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

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

### Messages Table
- `id` (Integer, Primary Key)
- `sender_id` (Integer, Foreign Key)
- `receiver_id` (Integer, Foreign Key)
- `encrypted_message` (String)
- `view_once` (Boolean)
- `view_once_opened` (Boolean)
- `expiry_time` (DateTime, Optional)
- `read_status` (Boolean)
- `created_at` (DateTime)

## License

MIT License
