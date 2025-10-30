# KLYA AI API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://api.KLYA.ai/api`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "businessName": "Doe Enterprises",
  "businessType": "technology",
  "phoneNumber": "+233241234567",
  "location": {
    "city": "Accra",
    "region": "Greater Accra"
  }
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "businessName": "Doe Enterprises",
    "subscription": {
      "plan": "starter",
      "status": "trial"
    }
  }
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
```

#### Update Profile
```http
PUT /api/auth/profile
```

#### Change Password
```http
PUT /api/auth/change-password
```

### Content Generation

#### Generate AI Content
```http
POST /api/content/generate
```

**Request Body:**
```json
{
  "prompt": "Write a blog post about sustainable farming in Ghana",
  "type": "blog",
  "language": "en",
  "tone": "professional",
  "maxTokens": 1000,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Generated content here...",
    "type": "blog",
    "language": "en",
    "tone": "professional",
    "usage": {
      "contentGenerations": 1,
      "audioTranscriptions": 0,
      "apiCalls": 1
    }
  }
}
```

#### Generate AI Image
```http
POST /api/content/image
```

**Request Body:**
```json
{
  "prompt": "A modern Ghanaian business office",
  "size": "512x512",
  "quality": "standard",
  "style": "natural"
}
```

#### Summarize Text
```http
POST /api/content/summarize
```

**Request Body:**
```json
{
  "text": "Long text to summarize...",
  "maxLength": 150
}
```

#### Analyze Sentiment
```http
POST /api/content/sentiment
```

**Request Body:**
```json
{
  "text": "Text to analyze sentiment",
  "language": "en"
}
```

### Audio Transcription

#### Transcribe Audio
```http
POST /api/audio/transcribe
```

**Request:** Multipart form data with audio file
- `audio`: Audio file (max 25MB)
- `language`: Language code (en, tw, ga, ew, ha)
- `responseFormat`: Response format (text, json, srt, vtt)

**Response:**
```json
{
  "success": true,
  "data": {
    "transcription": "Transcribed text here...",
    "language": "en",
    "fileName": "audio.mp3",
    "fileSize": 1024000,
    "usage": {
      "contentGenerations": 0,
      "audioTranscriptions": 1,
      "apiCalls": 1
    }
  }
}
```

### Analytics

#### Get User Analytics
```http
GET /api/analytics/user
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "subscription": {
        "plan": "professional",
        "status": "active"
      }
    },
    "usage": {
      "current": {
        "contentGenerations": 15,
        "audioTranscriptions": 3,
        "apiCalls": 45
      },
      "limits": {
        "contentGenerations": -1,
        "audioTranscriptions": 10,
        "apiCalls": 1000
      },
      "percentage": {
        "contentGenerations": 0,
        "audioTranscriptions": 30,
        "apiCalls": 4
      }
    }
  }
}
```

#### Get Platform Analytics (Admin Only)
```http
GET /api/analytics
```

### Users

#### Get All Users (Admin Only)
```http
GET /api/users
```

#### Get Single User
```http
GET /api/users/:id
```

#### Update User
```http
PUT /api/users/:id
```

#### Delete User (Admin Only)
```http
DELETE /api/users/:id
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "details": [] // Optional validation errors
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting
- General endpoints: 30 requests per 15 minutes
- API endpoints: 10 requests per 15 minutes
- Rate limit headers are included in responses

## Supported Languages
- `en` - English
- `tw` - Twi (Akan)
- `ga` - Ga
- `ew` - Ewe
- `ha` - Hausa

## Content Types
- `blog` - Blog posts
- `social` - Social media content
- `email` - Email content
- `ad` - Advertisement copy
- `product` - Product descriptions
- `custom` - Custom content

## Subscription Plans

### Starter
- 5 content generations per day
- 1 hour audio transcription per month
- Basic analytics
- Email support

### Professional
- Unlimited content generation
- 10 hours audio transcription per month
- Advanced analytics
- Priority support
- API access

### Enterprise
- Unlimited everything
- Custom AI model training
- Dedicated account manager
- 24/7 phone support
- On-premise deployment

## Webhooks (Coming Soon)
- User registration
- Subscription changes
- Usage limit reached
- Content generation completed
