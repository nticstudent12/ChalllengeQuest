# Questify Atlas API Testing Guide

This guide will help you test all backend endpoints using Postman.

## Prerequisites

1. **Start the Backend Server**:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Import Postman Collection**:
   - Import the `Questify-Atlas-API-Tests.postman_collection.json` file into Postman
   - The collection includes all endpoints with proper authentication and test data

## Environment Variables

Set up these variables in Postman:

- `base_url`: `http://localhost:5000`
- `auth_token`: (will be set automatically after login)
- `admin_token`: (will be set automatically after admin login)
- `challenge_id`: (will be set after creating a challenge)
- `stage_id`: (will be set after creating a challenge)
- `task_id`: (will be set after creating a challenge)

## Testing Sequence

### 1. Health Check

- **Endpoint**: `GET /health`
- **Purpose**: Verify server is running
- **Expected**: 200 OK with server status

### 2. Authentication Flow

#### 2.1 Register User

- **Endpoint**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }
  ```
- **Expected**: 201 Created with user data

#### 2.2 Login User

- **Endpoint**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Expected**: 200 OK with token
- **Action**: Copy the token and set it as `auth_token` variable

#### 2.3 Get Profile

- **Endpoint**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Expected**: 200 OK with user profile

#### 2.4 Update Profile

- **Endpoint**: `PUT /api/auth/profile`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Body**:
  ```json
  {
    "firstName": "Updated",
    "lastName": "User",
    "bio": "Updated bio"
  }
  ```
- **Expected**: 200 OK with updated profile

#### 2.5 Change Password

- **Endpoint**: `PUT /api/auth/change-password`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Body**:
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newpassword123"
  }
  ```
- **Expected**: 200 OK with success message

#### 2.6 Refresh Token

- **Endpoint**: `POST /api/auth/refresh`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Expected**: 200 OK with new token

### 3. Challenge Endpoints

#### 3.1 Get All Challenges

- **Endpoint**: `GET /api/challenges`
- **Query Parameters**: `limit=10&offset=0`
- **Expected**: 200 OK with challenges list

#### 3.2 Get Challenges with Filters

- **Endpoint**: `GET /api/challenges`
- **Query Parameters**: `category=adventure&difficulty=medium&status=active&limit=5`
- **Expected**: 200 OK with filtered challenges

#### 3.3 Get Challenge by ID

- **Endpoint**: `GET /api/challenges/:id`
- **Expected**: 200 OK with challenge details
- **Note**: Use a valid challenge ID from previous responses

#### 3.4 Create Challenge (Admin Only)

- **Endpoint**: `POST /api/challenges`
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: See collection for full example
- **Expected**: 201 Created with challenge data
- **Action**: Copy the challenge ID and set as `challenge_id` variable

#### 3.5 Update Challenge (Admin Only)

- **Endpoint**: `PUT /api/challenges/:id`
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Expected**: 501 Not Implemented (as per current code)

#### 3.6 Delete Challenge (Admin Only)

- **Endpoint**: `DELETE /api/challenges/:id`
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Expected**: 501 Not Implemented (as per current code)

#### 3.7 Join Challenge

- **Endpoint**: `POST /api/challenges/join`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Body**:
  ```json
  {
    "challengeId": "{{challenge_id}}"
  }
  ```
- **Expected**: 200 OK with progress data

#### 3.8 Submit Stage

- **Endpoint**: `POST /api/challenges/submit-stage`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Body**: See collection for full example
- **Expected**: 200 OK with stage progress

#### 3.9 Get User Challenges

- **Endpoint**: `GET /api/challenges/user/my-challenges`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Query Parameters**: `status=active`
- **Expected**: 200 OK with user's challenges

### 4. Leaderboard Endpoints

#### 4.1 Get Leaderboard

- **Endpoint**: `GET /api/leaderboard`
- **Query Parameters**: `period=ALL_TIME&limit=50`
- **Expected**: 200 OK with leaderboard data

#### 4.2 Get Weekly Leaderboard

- **Endpoint**: `GET /api/leaderboard`
- **Query Parameters**: `period=WEEKLY&limit=20`
- **Expected**: 200 OK with weekly leaderboard

#### 4.3 Get Leaderboard Stats

- **Endpoint**: `GET /api/leaderboard/stats`
- **Expected**: 200 OK with statistics

#### 4.4 Get User Rank

- **Endpoint**: `GET /api/leaderboard/user-rank`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Query Parameters**: `period=ALL_TIME`
- **Expected**: 200 OK with user's rank

#### 4.5 Update Ranks (Admin Only)

- **Endpoint**: `POST /api/leaderboard/update-ranks`
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Expected**: 200 OK with success message

### 5. Error Testing

#### 5.1 Test 404 - Non-existent Challenge

- **Endpoint**: `GET /api/challenges/non-existent-id`
- **Expected**: 404 Not Found

#### 5.2 Test 401 - Unauthorized Access

- **Endpoint**: `GET /api/auth/profile` (without token)
- **Expected**: 401 Unauthorized

#### 5.3 Test 403 - Invalid Token

- **Endpoint**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer invalid-token`
- **Expected**: 403 Forbidden

#### 5.4 Test 403 - Non-Admin Access

- **Endpoint**: `POST /api/challenges` (with regular user token)
- **Expected**: 403 Forbidden

## Admin User Setup

To test admin-only endpoints, you'll need to create an admin user. You can either:

1. **Modify the database directly** to set `isAdmin: true` for a user
2. **Use Prisma Studio**: `npm run db:studio` and update a user's admin status
3. **Create a seed script** that creates an admin user

## Rate Limiting

The API has rate limiting enabled:

- General endpoints: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Submission endpoints: 10 requests per 15 minutes

If you hit rate limits, wait 15 minutes or restart the server.

## Database Setup

Make sure your database is set up and migrated:

```bash
cd backend
npm run db:migrate
npm run db:seed
```

## Troubleshooting

1. **Server not starting**: Check if port 5000 is available
2. **Database errors**: Ensure Prisma is properly configured
3. **Authentication errors**: Verify JWT_SECRET is set in environment
4. **CORS errors**: Check if frontend is running on allowed origins

## Expected Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "message": "Optional message",
  "data": {
    /* response data */
  }
}
```

Error responses follow this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Testing Tips

1. **Use Postman's Test Scripts**: Add scripts to automatically extract tokens and IDs from responses
2. **Test Edge Cases**: Try invalid data, missing fields, boundary values
3. **Test Authentication**: Verify all protected routes require valid tokens
4. **Test Authorization**: Ensure admin-only routes reject regular users
5. **Test Rate Limiting**: Verify rate limits work as expected
6. **Test Error Handling**: Ensure proper error messages and status codes

## Postman Test Scripts

Add these scripts to automatically handle token extraction:

### For Login Response:

```javascript
if (pm.response.code === 200) {
  const response = pm.response.json();
  if (response.success && response.data.token) {
    pm.environment.set("auth_token", response.data.token);
  }
}
```

### For Challenge Creation Response:

```javascript
if (pm.response.code === 201) {
  const response = pm.response.json();
  if (response.success && response.data.id) {
    pm.environment.set("challenge_id", response.data.id);
  }
}
```

This comprehensive testing approach will ensure all your API endpoints are working correctly!
