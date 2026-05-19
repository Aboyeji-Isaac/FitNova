# FitNova Backend

Express.js API server with Socket.IO for real-time updates.

## Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase Admin SDK credentials

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

**Getting Firebase Credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (fitnova-6df1e)
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Copy the JSON and fill in your `.env` file

For detailed production setup, see [PRODUCTION.md](./PRODUCTION.md)

### Running

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Routes

### Challenges
- `GET /api/challenges` - Get all active challenges
- `GET /api/challenges/:challengeId` - Get challenge details
- `POST /api/challenges` - Create challenge (admin only)
- `PUT /api/challenges/:challengeId` - Update challenge (admin only)
- `DELETE /api/challenges/:challengeId` - Delete challenge (admin only)
- `POST /api/challenges/:challengeId/join` - Join a challenge
- `POST /api/challenges/:challengeId/leave` - Leave a challenge

### Users
- `GET /api/users/profile/:userId` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/challenges/active` - Get user's active challenges
- `GET /api/users/stats/:userId` - Get user statistics

### Progress
- `POST /api/progress` - Submit progress
- `GET /api/progress/:challengeId` - Get progress history for a challenge
- `GET /api/progress/daily/:challengeId` - Get today's progress

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/:challengeId` - Get challenge leaderboard
- `GET /api/leaderboard/:challengeId/user/:userId` - Get user's rank in challenge

## Socket.IO Events

### Client → Server

- `join-challenge` - Join a challenge room
  ```js
  { challengeId, userId }
  ```

- `leave-challenge` - Leave a challenge room
  ```js
  { challengeId, userId }
  ```

- `progress-submitted` - Notify progress submission
  ```js
  { progress: number, points: number }
  ```

- `request-leaderboard` - Request real-time leaderboard
  ```js
  { challengeId }
  ```

- `subscribe-notifications` - Subscribe to user notifications
  ```js
  { userId }
  ```

### Server → Client

- `user-joined` - User joined the challenge
  ```js
  { userId, timestamp, activeCount }
  ```

- `user-left` - User left the challenge
  ```js
  { userId, timestamp, activeCount }
  ```

- `leaderboard-update` - Leaderboard changed
  ```js
  { userId, progress, points, timestamp }
  ```

- `leaderboard-data` - Full leaderboard snapshot
  ```js
  { leaderboard, challengeId }
  ```

- `notification` - User notification
  ```js
  { message, type, timestamp }
  ```

## Firestore Schema

### Collections

**challenges**
```
{
  title: string
  description: string
  startDate: timestamp
  endDate: timestamp
  rules: array
  rewards: object
  status: 'active' | 'closed' | 'archived'
  createdBy: string (user ID)
  createdAt: timestamp
  updatedAt: timestamp
  
  subcollections:
    - participants (userId → { userId, joinedAt, points, status })
    - leaderboard (userId → { userId, displayName, points, rank })
}
```

**users**
```
{
  displayName: string
  email: string
  photoURL: string
  bio: string
  totalPoints: number
  totalChallenges: number
  badges: array
  preferences: object
  createdAt: timestamp
  updatedAt: timestamp
  
  subcollections:
    - joinedChallenges (challengeId → { challengeId, joinedAt, status })
    - progress (auto-generated → { userId, challengeId, value, notes, submittedAt })
}
```

## Development

### Project Structure

```
backend/
├── server.js                 # Main server entry point
├── package.json
├── .env.example
├── README.md
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorHandler.js      # Error handling
├── routes/
│   ├── challenges.js        # Challenge endpoints
│   ├── users.js             # User endpoints
│   ├── progress.js          # Progress endpoints
│   └── leaderboard.js       # Leaderboard endpoints
└── services/
    ├── firebaseAdmin.js     # Firebase Admin SDK setup
    └── socketHandlers.js    # Socket.IO event handlers
```

## Error Handling

All endpoints return JSON with appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

## Notes

- All timestamps are in UTC
- Authentication uses Firebase Auth tokens
- Point calculations are simplified (10 points per submission)
- Real-time updates require Socket.IO connection
