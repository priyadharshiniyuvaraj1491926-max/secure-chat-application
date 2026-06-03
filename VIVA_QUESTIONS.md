# Viva Questions & Answers - Secure Chat Application

## Architecture & Design

### Q1: Explain the overall architecture of the Secure Chat Application.
A: The application uses a three-tier architecture:
1. **Frontend (React + Vite)**: Handles UI and client-side logic
2. **Backend (FastAPI)**: Provides REST API and WebSocket endpoints
3. **Database (SQLite)**: Stores user data and messages

Frontend communicates with backend via HTTP for CRUD operations and WebSocket for real-time messaging.

### Q2: Why did you choose FastAPI over other Python frameworks?
A: FastAPI offers:
- Built-in data validation with Pydantic
- Automatic API documentation (Swagger/ReDoc)
- Native async/await support for high performance
- WebSocket support for real-time features
- Easy dependency injection for middleware

### Q3: How does the WebSocket connection work in this application?
A: WebSocket connection is established when user connects to `/ws/chat/{user_id}`. It handles:
- Real-time message delivery
- Typing indicators
- Read receipts
- User status updates
- Connection pooling with WebSocketManager

## Authentication & Security

### Q4: Explain the JWT authentication flow.
A: The flow is:
1. User provides credentials during login
2. Server validates and creates JWT tokens (access + refresh)
3. Client stores tokens in localStorage
4. Each API request includes Authorization header with access token
5. If token expires, client uses refresh token to get new one
6. Server validates token signature and expiration

### Q5: How is the password security implemented?
A: 
- Passwords are hashed using bcrypt with 12 rounds of salting
- Raw passwords are never stored in database
- During login, provided password is hashed and compared with stored hash
- Minimum 8 characters required
- Password validation happens client-side before submission

### Q6: What encryption method is used for messages?
A: Messages are encrypted using Fernet (symmetric encryption) from the `cryptography` library:
- Uses AES-128 in CBC mode
- Includes authentication tags to prevent tampering
- Each message is encrypted with the same key
- Encrypted messages are stored in database
- Only authorized users can decrypt messages

### Q7: What are the security concerns and mitigation strategies?
A: 
**Concerns:**
- Man-in-the-middle attacks
- Token theft
- SQL injection
- XSS attacks

**Mitigations:**
- HTTPS/WSS in production
- HttpOnly cookies for tokens
- SQLAlchemy ORM prevents SQL injection
- React's built-in XSS protection
- CORS configuration
- Rate limiting (can be added)

## Database Design

### Q8: Explain the database schema.
A: The schema consists of 4 tables:

1. **Users**: Stores user credentials, profile info, and status
2. **Messages**: Stores encrypted messages with metadata
3. **AuditLogs**: Logs security and privacy events
4. **Sessions**: Tracks active user sessions

Relationships:
- Users → Messages (one-to-many for sent and received)
- Users → AuditLogs (one-to-many)
- Users → Sessions (one-to-many)

### Q9: Why use soft delete instead of hard delete for messages?
A: Soft delete provides:
- Data recovery capability
- Audit trail preservation
- GDPR compliance option (retention period)
- Referential integrity
- Better user experience (undo functionality)

### Q10: How would you handle message pagination?
A: Implementation uses skip/limit pagination:
```python
db.query(Message)
  .offset(skip)
  .limit(limit)
  .order_by(Message.created_at.desc())
```
Allows loading older messages in batches without loading all data.

## Frontend Development

### Q11: Explain React hooks usage in the application.
A: Custom hooks used:
- **useAuth**: Manages authentication state and current user
- **useMessages**: Handles message fetching and sending
- **useWebSocket**: Manages WebSocket connection
- **useState**: Component state management
- **useEffect**: Side effects and data fetching
- **useRef**: Message scroll reference

### Q12: How is real-time messaging implemented?
A: Using WebSocket:
1. Client connects via `new WebSocket()`
2. Server manages connections in WebSocketManager
3. Messages are sent as JSON with type identifier
4. Server routes messages to recipient's connection
5. Client receives and updates UI
6. Works bidirectionally for true real-time chat

### Q13: How does the focus protection feature work?
A: Implemented with event listeners:
```javascript
window.addEventListener('focus', () => setShowPrivacyOverlay(false))
window.addEventListener('blur', () => setShowPrivacyOverlay(true))
```
When window loses focus (tab switch, minimize), chat content is blurred with overlay.

## Privacy Features

### Q14: Explain the View Once message feature.
A: 
- Sender marks message with `view_once: true`
- Receiver opens message once
- `view_once_opened` flag changes to true
- Message can be deleted or marked as read-only
- On client-side, message can be auto-deleted after viewing

### Q15: How does message expiration work?
A: 
- Client sets expiry_time (seconds) before sending
- Server calculates `expiry_time = now + expiry_seconds`
- Stores in database for audit trail
- Client-side timer auto-deletes message
- Could implement server-side cleanup job

### Q16: What privacy events are monitored?
A: 
- Login/logout events
- Failed login attempts
- Message view once opens
- Message expiration
- Screenshot attempts (best-effort)
- Screen recording attempts (best-effort)
- Session creation/termination

## API Design

### Q17: Why use REST for some endpoints and WebSocket for others?
A: 
- **REST**: Stateless operations (registration, user updates, history)
- **WebSocket**: Real-time bidirectional communication (live messages, typing indicators, status updates)
- REST is simpler for CRUD
- WebSocket maintains persistent connection for instant updates

### Q18: How is error handling implemented?
A: 
- HTTP status codes (400, 401, 403, 404, 500)
- Detailed error messages in response body
- Try-catch blocks for exception handling
- Pydantic validates input data
- Custom exception handlers for specific errors

## Performance & Optimization

### Q19: How would you optimize the application for scale?
A: 
1. **Database**: PostgreSQL instead of SQLite
2. **Caching**: Redis for sessions and frequently accessed data
3. **Message Queue**: Celery for async tasks
4. **CDN**: Static assets distribution
5. **Load Balancing**: Multiple backend instances
6. **Indexing**: Database indexes on query columns
7. **Connection Pooling**: Database and WebSocket
8. **Message Compression**: For network efficiency

### Q20: What's the time complexity of key operations?
A: 
- **Login**: O(1) email lookup with index
- **Message Send**: O(1) insertion
- **Chat History**: O(log n) with indexing on user_id and timestamp
- **User Search**: O(log n) with indexed username
- **WebSocket Broadcast**: O(n) where n = online users

## Deployment & Maintenance

### Q21: How would you deploy this application?
A: 
1. **Backend**: Docker container + Kubernetes
2. **Frontend**: Build + deploy to CDN/static hosting
3. **Database**: Managed database service (RDS/PostgreSQL)
4. **Reverse Proxy**: Nginx for load balancing
5. **SSL**: Let's Encrypt certificates
6. **Monitoring**: Prometheus + Grafana
7. **Logging**: ELK stack or CloudWatch

### Q22: What monitoring and logging should be in place?
A: 
- **Logs**: Application logs (debug, info, error)
- **Metrics**: Request count, response time, error rate
- **Health Checks**: API endpoint health status
- **Audit Logs**: Security and user action logs
- **Database Logs**: Query logs and slow queries
- **WebSocket Logs**: Connection/disconnection events

## Testing & Quality

### Q23: How would you test this application?
A: 
- **Unit Tests**: Individual functions (security, encryption)
- **Integration Tests**: API endpoints with database
- **E2E Tests**: Full user flows (login → message → logout)
- **Load Tests**: WebSocket handling with many users
- **Security Tests**: SQL injection, XSS, CSRF

### Q24: What are potential bugs and edge cases?
A: 
- Concurrent message sends
- Token refresh during request
- WebSocket reconnection on network loss
- Database connection timeouts
- Large message handling
- Deleted user message handling
- Timezone handling for timestamps

## Advanced Topics

### Q25: How would you implement end-to-end encryption with public key cryptography?
A: 
1. Generate RSA key pairs for each user
2. Exchange public keys during chat initialization
3. Client encrypts with recipient's public key
4. Server stores encrypted blob
5. Recipient decrypts with private key
6. Keys stored securely on device

### Q26: How would you implement group messaging?
A: 
1. Add Group and GroupMember tables
2. Modify Message table to reference Group
3. Broadcast to all group members
4. Manage group permissions (admin, member)
5. Handle leave/join events
6. Notify group of user status changes

### Q27: What about push notifications?
A: 
1. Register device tokens (FCM, APNs)
2. Store tokens in database
3. Send via notification service
4. Handle notification for offline users
5. Track notification read status

## Conclusion

This application demonstrates solid understanding of:
- Full-stack development
- Real-time communication
- Security best practices
- Database design
- API design
- Frontend optimization
