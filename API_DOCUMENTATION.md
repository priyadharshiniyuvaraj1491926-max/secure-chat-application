# Secure Chat Application - API Documentation

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "avatar": null,
  "is_online": false,
  "last_seen": "2024-01-10T12:00:00",
  "created_at": "2024-01-10T12:00:00"
}
```

### Login
**POST** `/api/auth/login`

Authenticate user and return JWT tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Refresh Token
**POST** `/api/auth/refresh`

Refresh expired access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Logout
**POST** `/api/auth/logout`

Logout user and invalidate session.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

## User Endpoints

### List Users
**GET** `/api/users/?skip=0&limit=100`

Get list of all users.

**Response (200):**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": null,
    "is_online": true,
    "last_seen": "2024-01-10T12:00:00",
    "created_at": "2024-01-10T12:00:00"
  }
]
```

### Get User
**GET** `/api/users/{user_id}`

Get user details by ID.

**Response (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "avatar": null,
  "is_online": true,
  "last_seen": "2024-01-10T12:00:00",
  "created_at": "2024-01-10T12:00:00",
  "updated_at": "2024-01-10T12:00:00"
}
```

### Search User
**GET** `/api/users/search/{username}`

Search user by username.

**Response (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "avatar": null,
  "is_online": true,
  "last_seen": "2024-01-10T12:00:00"
}
```

### Update Profile
**PUT** `/api/users/{user_id}`

Update user profile.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "username": "new_username",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "id": 1,
  "username": "new_username",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "is_online": true,
  "last_seen": "2024-01-10T12:00:00",
  "created_at": "2024-01-10T12:00:00",
  "updated_at": "2024-01-10T12:00:00"
}
```

### Get User Status
**GET** `/api/users/{user_id}/status`

Get user's online status.

**Response (200):**
```json
{
  "user_id": 1,
  "is_online": true,
  "last_seen": "2024-01-10T12:00:00"
}
```

## Message Endpoints

### Send Message
**POST** `/api/messages/`

Send an encrypted message.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "receiver_id": 2,
  "message": "Hello, this is an encrypted message",
  "view_once": false,
  "expiry_time": 3600
}
```

**Response (201):**
```json
{
  "id": 1,
  "sender_id": 1,
  "receiver_id": 2,
  "encrypted_message": "gAAAAABlK3h...",
  "view_once": false,
  "view_once_opened": false,
  "expiry_time": "2024-01-10T13:00:00",
  "read_status": false,
  "delivered_status": true,
  "created_at": "2024-01-10T12:00:00"
}
```

### Get Chat History
**GET** `/api/messages/chat/{user_id}?skip=0&limit=50`

Get message history with a user.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "encrypted_message": "gAAAAABlK3h...",
    "view_once": false,
    "view_once_opened": false,
    "expiry_time": null,
    "read_status": true,
    "delivered_status": true,
    "created_at": "2024-01-10T12:00:00"
  }
]
```

### Get Message
**GET** `/api/messages/{message_id}`

Get a specific message.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "sender_id": 1,
  "receiver_id": 2,
  "encrypted_message": "gAAAAABlK3h...",
  "view_once": false,
  "view_once_opened": false,
  "expiry_time": null,
  "read_status": true,
  "delivered_status": true,
  "created_at": "2024-01-10T12:00:00"
}
```

### Update Message
**PUT** `/api/messages/{message_id}`

Update message status (read/view_once_opened).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "read_status": true,
  "view_once_opened": true
}
```

**Response (200):**
```json
{
  "id": 1,
  "sender_id": 1,
  "receiver_id": 2,
  "encrypted_message": "gAAAAABlK3h...",
  "view_once": false,
  "view_once_opened": true,
  "expiry_time": null,
  "read_status": true,
  "delivered_status": true,
  "created_at": "2024-01-10T12:00:00"
}
```

### Delete Message
**DELETE** `/api/messages/{message_id}`

Delete a message (soft delete).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "Message deleted successfully"
}
```

## Audit Log Endpoints

### Create Audit Log
**POST** `/api/audit/log`

Create an audit log entry.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "event_type": "LOGIN",
  "description": "User logged in",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
```

**Response (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "event_type": "LOGIN",
  "description": "User logged in",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "created_at": "2024-01-10T12:00:00"
}
```

### Get Audit Logs
**GET** `/api/audit/logs?skip=0&limit=100`

Get audit logs for current user.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "event_type": "LOGIN",
    "description": "User logged in",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "created_at": "2024-01-10T12:00:00"
  }
]
```

## WebSocket Endpoint

### Chat WebSocket
**WS** `/ws/chat/{user_id}`

Establish WebSocket connection for real-time chat.

**Message Types:**

#### Send Message
```json
{
  "type": "message",
  "receiver_id": 2,
  "message": "Hello!",
  "timestamp": "2024-01-10T12:00:00"
}
```

#### Typing Indicator
```json
{
  "type": "typing",
  "receiver_id": 2
}
```

#### Read Receipt
```json
{
  "type": "read_receipt",
  "message_id": 1,
  "sender_id": 2
}
```

#### Status Update
```json
{
  "type": "status"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "Access denied"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```
