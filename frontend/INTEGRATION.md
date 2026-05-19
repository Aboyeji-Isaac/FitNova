# Frontend Integration Guide

## Backend API Integration

The frontend is now integrated with the Express.js backend API. This guide explains how to use the API services.

### Setup

1. **Configure Environment Variables**

Create `.env` file in the frontend directory:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

2. **Install Dependencies**

```bash
npm install
```

3. **Start Frontend**

```bash
npm run dev
```

## Available Services

### 1. API Client (`services/apiClient.js`)

Core Axios client with:
- Automatic token injection in headers
- Request/response interceptors
- 401 redirect to login

```javascript
import apiClient, { setAuthToken } from '@/services/apiClient';

// After login, set token
setAuthToken(token);

// Make authenticated request
const response = await apiClient.get('/users/profile/123');
```

### 2. Backend API Service (`services/backendApi.js`)

Pre-configured API endpoints for all routes:

```javascript
import { auth, users, challenges, progress, leaderboard } from '@/services/backendApi';

// Auth endpoints
await auth.signup({ email, password, displayName });
await auth.login({ email, password });
await auth.getCurrentUser();

// Challenges
await challenges.getAll();
await challenges.getById(id);
await challenges.join(id);
await challenges.leave(id);

// Progress
await progress.submit({ challengeId, value, notes });
await progress.getHistory(challengeId);

// Leaderboard
await leaderboard.getGlobal(limit);
await leaderboard.getByChallenge(challengeId, limit);
```

### 3. Auth Service (`services/backendAuthService.js`)

User authentication with token management:

```javascript
import backendAuthService from '@/services/backendAuthService';

// Signup
const result = await backendAuthService.signup({
  email: 'user@example.com',
  password: 'SecurePass123',
  displayName: 'John Doe'
});

if (result.success) {
  // User created and token saved
}

// Login
const result = await backendAuthService.login({
  email: 'user@example.com',
  password: 'SecurePass123'
});

// Get current user
const user = await backendAuthService.getCurrentUser();

// Update profile
await backendAuthService.updateProfile({
  displayName: 'Jane Doe',
  bio: 'Fitness enthusiast'
});

// Logout
await backendAuthService.logout();
```

### 4. Auth Context (`context/AuthContext.jsx`)

React Context for global auth state:

```javascript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { 
    user, 
    loading, 
    error, 
    isAuthenticated,
    signup,
    login,
    logout,
    updateProfile
  } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome, {user.displayName}</div>;
}
```

### 5. Socket.IO Client (`services/socketClient.js`)

Real-time communication:

```javascript
import {
  initializeSocket,
  joinChallenge,
  submitProgress,
  requestLeaderboard,
  onLeaderboardUpdate,
  onNotification
} from '@/services/socketClient';

// Initialize (auto-called on auth)
initializeSocket();

// Join challenge
joinChallenge(challengeId, userId);

// Submit progress
submitProgress(challengeId, userId, 50, 10);

// Request leaderboard
requestLeaderboard(challengeId);

// Listen for updates
onLeaderboardUpdate((data) => {
  console.log('Leaderboard updated:', data);
});

onNotification((notification) => {
  console.log('Notification:', notification);
});
```

### 6. API Hook (`services/useApi.js`)

Custom React hook for API calls:

```javascript
import { useApi } from '@/services/useApi';
import { users } from '@/services/backendApi';

function UserStats({ userId }) {
  const { request, loading, error } = useApi();

  const fetchStats = async () => {
    const { data, error } = await request(
      () => users.getStats(userId)
    );
    
    if (error) {
      console.error('Failed to fetch stats:', error);
      return;
    }
    
    console.log('User stats:', data);
  };

  return (
    <>
      <button onClick={fetchStats} disabled={loading}>
        {loading ? 'Loading...' : 'Get Stats'}
      </button>
      {error && <p className="error">{error}</p>}
    </>
  );
}
```

## Example: Complete Authentication Flow

```javascript
import { useAuth } from '@/context/AuthContext';
import { challenges } from '@/services/backendApi';

export function LoginFlow() {
  const { login, user, isAuthenticated } = useAuth();

  const handleLogin = async (email, password) => {
    const result = await login({ email, password });
    
    if (result.success) {
      // User logged in, Socket.IO initialized automatically
      // Fetch challenges
      const { data } = await challenges.getAll();
      console.log('Available challenges:', data.challenges);
    } else {
      console.error('Login failed:', result.error);
    }
  };

  if (isAuthenticated) {
    return <div>Welcome, {user.displayName}!</div>;
  }

  return (
    <button onClick={() => handleLogin('user@example.com', 'Password123')}>
      Login
    </button>
  );
}
```

## Environment Configuration

### Development

```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Production

```bash
VITE_API_URL=https://api.fitnova.com/api
VITE_SOCKET_URL=https://api.fitnova.com
```

## Error Handling

All API calls return standardized responses:

```javascript
{
  data: null,          // Response data or null on error
  error: "Error message" // Error string or null on success
}
```

Handle errors gracefully:

```javascript
const { data, error } = await request(() => challenges.getAll());

if (error) {
  // Handle error
  toast.error(error);
} else {
  // Use data
  setChallenges(data.challenges);
}
```

## Token Management

Tokens are automatically managed:

```javascript
// After login, token is saved
setAuthToken(response.data.token);

// Token automatically included in requests
// Authorization: Bearer <token>

// On 401 error, user redirected to login
// Token cleared on logout
```

## Real-time Updates

Subscribe to real-time events:

```javascript
import {
  onLeaderboardUpdate,
  onNotification,
  offLeaderboardUpdate,
  subscribeToNotifications
} from '@/services/socketClient';

// Subscribe to notifications
subscribeToNotifications(userId);

// Listen for updates
const handleUpdate = (data) => {
  console.log('Update:', data);
};

onLeaderboardUpdate(handleUpdate);

// Cleanup
offLeaderboardUpdate(handleUpdate);
```

## Troubleshooting

### "API URL not configured"
- Add `VITE_API_URL` to `.env`
- Restart dev server after changing env

### "401 Unauthorized"
- User token expired - user will be redirected to login
- Check if token is being stored correctly

### "Socket.IO connection failed"
- Verify backend is running on correct port
- Check `VITE_SOCKET_URL` configuration
- Check firewall allows WebSocket connections

### "CORS error"
- Verify `FRONTEND_URL` on backend matches frontend origin
- Backend should have CORS enabled for your frontend

## Next Steps

1. Create login/signup pages
2. Create challenge list and detail pages
3. Create progress submission form
4. Create leaderboard view
5. Add notifications UI
6. Set up state management (Redux/Zustand) if needed
