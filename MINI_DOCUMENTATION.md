# Mini Project Documentation - Secure Chat Application

## Project Overview

Secure Chat Application is a WhatsApp-inspired messaging platform built with React.js, FastAPI, and WebSockets. It focuses on end-to-end encryption, privacy protection, and security.

## Architecture

### Frontend Architecture

**Technology Stack:**
- React 18.2
- Vite (Build tool)
- Tailwind CSS (Styling)
- Axios (HTTP client)
- WebSocket API

**Key Components:**
1. **Authentication** - Login/Register pages with JWT token management
2. **Chat Interface** - Real-time messaging with WebSockets
3. **User Management** - User list, search, and profile management
4. **Privacy Controls** - Message expiration, view-once messages
5. **Encryption** - Client-side message encryption/decryption

**File Structure:**
```
frontend/src/
├── pages/          # Route pages
├── components/     # Reusable components
├── services/       # API calls
├── hooks/          # Custom React hooks
├── context/        # React context
├── utils/          # Utility functions
├── styles/         # CSS styles
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

### Backend Architecture

**Technology Stack:**
- FastAPI (Web framework)
- SQLAlchemy (ORM)
- SQLite (Database)
- Uvicorn (ASGI server)
- JWT (Authentication)
- Fernet (Encryption)

**Key Modules:**
1. **Models** - Database schema (User, Message, AuditLog, Session)
2. **Schemas** - Pydantic validation models
3. **CRUD** - Database operations
4. **Security** - JWT and password hashing
5. **Encryption** - Message encryption/decryption
6. **WebSocket** - Real-time communication
7. **API Routes** - REST endpoints

**File Structure:**
```
backend/app/
├── api/            # API routes
├── websocket/      # WebSocket handlers
├── models.py       # Database models
├── schemas.py      # Pydantic schemas
├── crud.py         # Database operations
├── security.py     # Authentication
├── encryption.py   # Message encryption
├── websocket_manager.py  # WS connection manager
├── database.py     # Database config
├── config.py       # Settings
└── main.py         # FastAPI app
```

## Key Features Implementation

### 1. Authentication
- User registration with email validation
- Login with JWT tokens
- Token refresh mechanism
- Password hashing with bcrypt
- Session management

### 2. Real-Time Messaging
- WebSocket connections for instant messaging
- Typing indicators
- Read receipts and delivery status
- Message history pagination

### 3. Message Privacy
- **Encryption**: Fernet symmetric encryption
- **View Once**: Messages can only be viewed once
- **Expiring Messages**: Auto-delete with configurable timers
- **Message Deletion**: Soft delete for recovery

### 4. User Management
- User profiles with avatars
- Online/offline status tracking
- Last seen timestamps
- User search functionality

### 5. Security & Privacy
- HTTPS/WSS support in production
- CORS configuration
- Password complexity requirements
- Audit logging for security events
- Privacy event monitoring

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    is_online BOOLEAN DEFAULT FALSE,
    last_seen DATETIME DEFAULT NOW(),
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    encrypted_message TEXT NOT NULL,
    view_once BOOLEAN DEFAULT FALSE,
    view_once_opened BOOLEAN DEFAULT FALSE,
    expiry_time DATETIME,
    read_status BOOLEAN DEFAULT FALSE,
    delivered_status BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    created_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);
```

### AuditLogs Table
```sql
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    description TEXT,
    ip_address VARCHAR(255),
    user_agent VARCHAR(500),
    created_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/` - List users
- `GET /api/users/{id}` - Get user
- `GET /api/users/search/{username}` - Search user
- `PUT /api/users/{id}` - Update profile
- `GET /api/users/{id}/status` - Get status

### Messages
- `POST /api/messages/` - Send message
- `GET /api/messages/chat/{user_id}` - Get chat history
- `GET /api/messages/{id}` - Get message
- `PUT /api/messages/{id}` - Update message
- `DELETE /api/messages/{id}` - Delete message

### WebSocket
- `WS /ws/chat/{user_id}` - Chat WebSocket

### Audit
- `POST /api/audit/log` - Create log
- `GET /api/audit/logs` - Get logs

## Encryption Implementation

### Backend Encryption
Using Python's `cryptography` library with Fernet:
```python
from cryptography.fernet import Fernet

cipher = Fernet(key)
encrypted = cipher.encrypt(message.encode())
decrypted = cipher.decrypt(encrypted).decode()
```

### Frontend Encryption
Placeholder implementation with Base64 encoding:
```javascript
const encrypted = btoa(message);  // Base64 encode
const decrypted = atob(encrypted);  // Base64 decode
```

*Note: For production, implement proper client-side encryption using TweetNaCl.js or similar.*

## Security Features

### Implemented
- ✅ End-to-end encryption
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS configuration
- ✅ Message expiration
- ✅ View-once messages
- ✅ Audit logging
- ✅ Online status tracking
- ✅ Focus protection (blur on blur event)

### Best-Effort Features
- ⚠️ Screenshot detection (browser-dependent)
- ⚠️ Screen recording detection (limited)
- ⚠️ Privacy event logging

## Setup Instructions

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Access at `http://localhost:5173`

## Running Tests

```bash
# Backend tests (create test files)
pytest backend/tests/

# Frontend tests
npm test
```

## Deployment

### Production Checklist
- [ ] Generate strong SECRET_KEY
- [ ] Generate Fernet encryption key
- [ ] Set DEBUG=False
- [ ] Configure HTTPS/WSS
- [ ] Set CORS_ORIGINS correctly
- [ ] Use production database (PostgreSQL)
- [ ] Set up SSL certificates
- [ ] Configure firewall
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

## Performance Considerations

1. **Database Indexing**: Added indexes on frequently queried columns
2. **Pagination**: Messages support skip/limit pagination
3. **WebSocket Optimization**: Connection pooling and message batching
4. **Caching**: Could implement Redis for session caching
5. **CDN**: Static assets can be served from CDN

## Known Limitations

1. Screenshot/recording detection is browser-dependent
2. Client-side encryption is placeholder (use TweetNaCl.js in production)
3. SQLite not suitable for large-scale deployments
4. No message search functionality
5. No group chat support
6. No file attachment support

## Future Enhancements

1. Group messaging
2. File and media sharing
3. Voice/video calls
4. Message search
5. User blocking
6. Two-factor authentication
7. End-to-end encryption with public key cryptography
8. Message backup and recovery
9. Push notifications
10. Mobile app

## Support & Troubleshooting

For issues:
1. Check logs in `logs/` directory
2. Verify environment variables in `.env`
3. Ensure ports 8000 and 5173 are available
4. Check database connectivity
5. Review WebSocket connection in browser console
