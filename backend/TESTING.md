# FitNova Integration Testing Guide

## Overview
This document describes the integration testing strategy for FitNova backend API endpoints.

## Testing Framework
- **Framework**: Jest (with Supertest for HTTP assertions)
- **Environment**: Node.js with mock Express servers
- **Coverage**: API routes, authentication, data validation, and error handling

## Test Suites

### 1. Authentication Routes (`auth.test.js`)
Tests user authentication flows including signup, login, logout, and token verification.

**Endpoints Tested:**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `POST /api/auth/verify-token` - Token validation

**Test Cases:**
```javascript
// Signup tests
✓ Should create a new user account with valid data
✓ Should return 400 if required fields (email, password, firstName, lastName) are missing
✓ Should validate email format
✓ Should validate password strength (8+ chars, uppercase, lowercase, numbers)

// Login tests
✓ Should login with valid credentials
✓ Should return 401 for invalid credentials
✓ Should return 400 if email or password missing

// Logout tests
✓ Should logout successfully

// Token verification tests
✓ Should verify valid tokens
✓ Should return 401 for invalid tokens
✓ Should return 401 if no token provided
```

### 2. Challenge Routes (`challenges.test.js`)
Tests challenge CRUD operations (Create, Read, Update, Delete).

**Endpoints Tested:**
- `GET /api/challenges` - List all challenges
- `GET /api/challenges/:id` - Get specific challenge
- `POST /api/challenges` - Create challenge
- `PUT /api/challenges/:id` - Update challenge
- `DELETE /api/challenges/:id` - Delete challenge

**Test Cases:**
```javascript
// List tests
✓ Should return all challenges
✓ Should return challenges with required fields (id, title, description, category)

// Get by ID tests
✓ Should return a specific challenge
✓ Should return 404 for non-existent challenge

// Create tests
✓ Should create a new challenge with valid data
✓ Should return 400 if required fields missing
✓ Should set default difficulty and reward if not provided

// Update tests
✓ Should update an existing challenge
✓ Should return 404 for non-existent challenge
✓ Should preserve fields not being updated

// Delete tests
✓ Should delete a challenge
✓ Should return 404 for non-existent challenge
```

### 3. Progress Routes (`progress.test.js`)
Tests progress submission, tracking, and validation.

**Endpoints Tested:**
- `GET /api/progress` - Get all progress records (with filtering)
- `POST /api/progress` - Submit progress
- `GET /api/progress/:id` - Get specific progress record

**Test Cases:**
```javascript
// List tests
✓ Should return all progress records
✓ Should filter progress by userId
✓ Should filter progress by challengeId
✓ Should support pagination

// Submit tests
✓ Should submit progress successfully with all required fields
✓ Should return 400 if required fields (userId, challengeId, value) missing
✓ Should return 400 if progress value is not positive (must be > 0)
✓ Should set current timestamp on submission
✓ Should set default status to 'submitted'

// Get by ID tests
✓ Should return a specific progress record with all fields
✓ Should return 404 for non-existent progress record
```

### 4. Leaderboard Routes (`leaderboard.test.js`)
Tests leaderboard calculations and live ranking updates.

**Endpoints Tested:**
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/user/:userId` - Get user's leaderboard position
- `GET /api/leaderboard/challenge/:challengeId` - Get challenge-specific leaderboard

**Test Cases:**
```javascript
// Global leaderboard tests
✓ Should return global leaderboard with all users
✓ Should support pagination (limit, offset parameters)
✓ Should sort by totalPoints (default)
✓ Should sort by streak
✓ Should sort by challengesCompleted
✓ Should maintain correct ranking order

// User position tests
✓ Should return user's position on leaderboard
✓ Should return rank, totalPoints, streak, challengesCompleted
✓ Should return 404 for non-existent user

// Challenge leaderboard tests
✓ Should return challenge-specific leaderboard
✓ Should show only users who participated in challenge
✓ Should rank users by challenge performance
```

## Running Tests

### Installation
```bash
npm install --save-dev jest supertest
```

### Scripts in package.json
```json
{
  "scripts": {
    "test": "jest --detectOpenHandles",
    "test:watch": "jest --watch"
  }
}
```

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on changes)
```bash
npm run test:watch
```

### Run specific test file
```bash
npm test -- auth.test.js
```

### Run tests with coverage
```bash
npm test -- --coverage
```

## Test Data & Mocking

### Mock Express Servers
Each test file creates a mock Express server with the necessary endpoints. This allows testing without requiring:
- Real Firebase connection
- Database setup
- External service dependencies

### Test Data Structure

**User Object**
```javascript
{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  displayName?: string
}
```

**Challenge Object**
```javascript
{
  id: string,
  title: string,
  description: string,
  category: string,
  difficulty: 'easy' | 'medium' | 'hard',
  reward: number
}
```

**Progress Object**
```javascript
{
  id: string,
  userId: string,
  challengeId: string,
  status: 'submitted' | 'approved' | 'rejected',
  value: number,
  evidence?: string,
  submittedAt: ISO8601Date
}
```

**Leaderboard Entry**
```javascript
{
  rank: number,
  userId: string,
  userName: string,
  totalPoints: number,
  challengesCompleted: number,
  streak: number
}
```

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE, verification |
| 201 | Created | Successful POST (new resource created) |
| 400 | Bad Request | Validation errors, missing fields, invalid data |
| 401 | Unauthorized | Invalid credentials, invalid/missing token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected server errors |

## Error Response Format

All error responses follow a consistent format:
```json
{
  "error": "Human-readable error message",
  "fields": ["field1", "field2"] // Optional: for validation errors
}
```

## Validation Rules

### Authentication
- **Email**: Must be valid email format
- **Password**: Minimum 8 characters, must include uppercase, lowercase, and numbers
- **Names**: Should be non-empty strings

### Challenges
- **Title**: Non-empty string (max 255 characters)
- **Description**: Non-empty string (max 2000 characters)
- **Category**: One of predefined categories (running, cycling, yoga, etc.)
- **Difficulty**: 'easy', 'medium', or 'hard'
- **Reward**: Positive number

### Progress
- **Value**: Must be positive number (> 0)
- **Evidence**: Optional URL or identifier for proof
- **Status**: Automatically set to 'submitted', can be changed by admin

## Real-World Integration

To integrate these tests with actual API endpoints:

1. **Update mock servers** to use actual Express server instances
2. **Add Firebase Admin SDK** for real authentication
3. **Connect to Firestore** for data persistence
4. **Add setup/teardown** hooks for test data cleanup
5. **Mock Socket.IO** for real-time features

Example integration pattern:
```javascript
import app from '../server.js';
import { initializeFirebase, getAuth } from '../services/firebaseAdmin.js';

beforeAll(async () => {
  await initializeFirebase();
});

afterEach(async () => {
  // Cleanup test data
});

// Tests remain the same, just use real 'app' instead of 'createTestApp()'
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Next Steps

1. **Add Socket.IO tests** for real-time leaderboard updates
2. **Add rate limiting tests** to verify request throttling
3. **Add middleware tests** for validation and error handling
4. **Add database tests** with actual Firebase/Firestore
5. **Add e2e tests** for complete user workflows

---

*Last updated: December 2024*
*For questions or contributions, contact the FitNova development team*
