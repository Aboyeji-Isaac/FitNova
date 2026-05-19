# FitNova Backend - Production Setup Guide

## Quick Start

### 1. Installation

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

**Required Variables:**
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email

**Optional Variables:**
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:4000)
- `RATE_LIMITING_ENABLED` - Enable rate limiting (default: true)
- `LOG_LEVEL` - Logging level (default: debug for dev, info for prod)

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (fitnova-6df1e)
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Copy the JSON and extract:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

**Important:** The `private_key` in JSON uses `\n` for newlines. Keep this as-is in your `.env` file.

### 4. Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:5000` (or your configured PORT)

## Features

### 🔐 Authentication
- Firebase Auth integration
- JWT token verification
- User profile initialization on signup
- Role-based access control (admin checks in routes)

### ⚡ Performance
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Request Logging** - Tracks all API calls with response times
- **Error Handling** - Comprehensive error handling with proper HTTP status codes
- **CORS** - Configurable origin, credentials, and methods

### 📝 Validation
- Email format validation
- Password strength requirements
- Input sanitization
- Type checking for all request bodies

### 📊 Real-time Features
- Socket.IO integration
- Challenge room subscriptions
- Progress update broadcasts
- Leaderboard live updates

### 🚨 Error Handling
- Firebase-specific error mapping
- Validation error details
- Development vs production error responses
- Structured error logging

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Create new user account
- `POST /login` - Login with credentials
- `GET /me` - Get current user profile
- `POST /logout` - Logout user
- `POST /verify-token` - Verify JWT token

### Onboarding (`/api/onboarding`)
- `POST /setup` - Complete profile setup
- `GET /status` - Check onboarding status

### Challenges (`/api/challenges`)
- `GET /` - Get all active challenges
- `GET /:challengeId` - Get challenge details
- `POST /` - Create challenge (admin)
- `PUT /:challengeId` - Update challenge (admin)
- `DELETE /:challengeId` - Delete challenge (admin)
- `POST /:challengeId/join` - Join challenge
- `POST /:challengeId/leave` - Leave challenge

### Users (`/api/users`)
- `GET /profile/:userId` - Get user profile
- `PUT /profile` - Update user profile
- `GET /challenges/active` - Get user's active challenges
- `GET /stats/:userId` - Get user statistics

### Progress (`/api/progress`)
- `POST /` - Submit progress
- `GET /:challengeId` - Get progress history
- `GET /daily/:challengeId` - Get today's progress

### Leaderboard (`/api/leaderboard`)
- `GET /` - Get global leaderboard
- `GET /:challengeId` - Get challenge leaderboard
- `GET /:challengeId/user/:userId` - Get user's rank

## Rate Limiting

The API implements IP-based rate limiting:
- **Default:** 100 requests per 15 minutes
- **Response Headers:**
  - `X-RateLimit-Limit` - Request limit
  - `X-RateLimit-Remaining` - Requests remaining
- **Rate limit hit:** Returns 429 status with retry-after

Disable in development by setting `RATE_LIMITING_ENABLED=false`

## Security Considerations

### ✅ Implemented
- CORS with configurable origins
- Input validation and sanitization
- Rate limiting per IP
- Firebase Auth token verification
- HTTP status code standards
- Error message filtering (stack traces hidden in production)

### 🔄 Recommended for Production
- Use HTTPS/TLS
- Set strong JWT_SECRET
- Enable Firebase security rules
- Use environment-specific Firebase projects
- Implement request signing/HMAC
- Add request ID tracking for logs
- Use a reverse proxy (nginx/traefik)
- Monitor rate limit effectiveness

## Deployment

### Environment Variables (Production)
```bash
NODE_ENV=production
PORT=5000
RATE_LIMITING_ENABLED=true
LOG_LEVEL=info
```

### Docker Example
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
```

### Monitoring
- Check server logs for `ERROR` level messages
- Monitor rate limiting headers for abuse patterns
- Track Socket.IO connection counts
- Set up Firebase alerts in console

## Troubleshooting

### "Database unavailable"
- Check Firebase credentials in `.env`
- Verify Firebase project has Firestore database enabled
- Check Firebase authentication is enabled

### "Too many requests" (429)
- Rate limit exceeded - wait before retrying
- Check X-RateLimit-Remaining header
- Adjust RATE_LIMIT_MAX_REQUESTS if needed

### "Invalid or expired token"
- Token has expired - request new one
- Token was not signed by Firebase Auth
- Check CORS origin matches frontend URL

### Socket.IO connection failures
- Verify CORS origin settings
- Check firewall allows WebSocket connections
- Ensure Socket.IO version compatibility

## Development Tips

1. **Logging:** Set `LOG_LEVEL=debug` to see detailed logs
2. **Testing Rates:** Temporarily disable rate limiting for load testing
3. **Error Details:** Production hides stack traces - enable in dev to debug
4. **Hot Reload:** Use `npm run dev` for automatic restart on file changes

## Next Steps

1. Set up CI/CD pipeline
2. Configure Firebase security rules
3. Add database backups
4. Implement custom admin dashboard
5. Add analytics integration
