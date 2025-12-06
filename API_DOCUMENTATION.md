# Instagram Influencers Platform API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Signup
Create a new user account (Startup or Influencer).

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "influencer",
  "name": "John Doe",
  "companyName": "Tech Startup Inc" // Only for startups
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "influencer",
    "plan": "free",
    "profileViewsRemaining": 5
  }
}
```

### 2. Login
Login to existing account.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {...}
}
```

### 3. Get Current User
Get logged-in user details.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {...}
}
```

---

## 👤 Influencer Endpoints

### 4. Create/Update Influencer Profile
Create or update influencer profile with Instagram and/or LinkedIn (Influencer only).

**Endpoint:** `POST /influencers/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body (Instagram + LinkedIn):**
```json
{
  "name": "John Doe",
  "bio": "B2B Marketing Expert | Tech Influencer 🚀",
  "followersCount": 50000,
  "category": "b2b",

  "instagramUsername": "johndoe",
  "instagramEmbedLinks": [
    "https://www.instagram.com/p/ABC123/embed",
    "https://www.instagram.com/p/DEF456/embed"
  ],

  "linkedinProfileUrl": "https://www.linkedin.com/in/johndoe",
  "linkedinEmbedLinks": [
    "https://www.linkedin.com/embed/feed/update/urn:li:activity:1234567890",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:9876543210"
  ],

  "platforms": ["instagram", "linkedin"]
}
```

**Note:** At least ONE platform (Instagram OR LinkedIn) is required.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "profile_id",
    "userId": "user_id",
    "name": "John Doe",
    "bio": "B2B Marketing Expert | Tech Influencer 🚀",
    "followersCount": 50000,
    "category": "b2b",
    "platforms": ["instagram", "linkedin"],
    "instagramUsername": "johndoe",
    "instagramProfileUrl": "https://instagram.com/johndoe",
    "instagramEmbedLinks": [
      "https://www.instagram.com/p/ABC123/embed",
      "https://www.instagram.com/p/DEF456/embed"
    ],
    "linkedinProfileUrl": "https://www.linkedin.com/in/johndoe",
    "linkedinEmbedLinks": [
      "https://www.linkedin.com/embed/feed/update/urn:li:activity:1234567890",
      "https://www.linkedin.com/embed/feed/update/urn:li:share:9876543210"
    ],
    "isProfileComplete": true,
    "totalInterests": 0,
    "totalViews": 0
  }
}
```

### 5. Update Embed Links (Platform-Specific)
Update Instagram or LinkedIn embed links (Influencer only). Max 3 links per platform.

**Endpoint:** `PUT /influencers/embed-links`

**Headers:** `Authorization: Bearer <token>`

**Request Body (Instagram):**
```json
{
  "platform": "instagram",
  "embedLinks": [
    "https://www.instagram.com/p/ABC123/embed",
    "https://www.instagram.com/p/DEF456/embed",
    "https://www.instagram.com/p/GHI789/embed"
  ]
}
```

**Request Body (LinkedIn):**
```json
{
  "platform": "linkedin",
  "embedLinks": [
    "https://www.linkedin.com/embed/feed/update/urn:li:activity:1234567890",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:9876543210"
  ]
}
```

**How to get embed URLs:**

**Instagram:**
1. Go to Instagram post on web
2. Click "..." → "Embed"
3. Copy URL from embed code
4. Or add `/embed` to post URL: `https://www.instagram.com/p/POST_ID/embed`

**LinkedIn:**
1. Go to LinkedIn post
2. Click "..." → "Embed this post"
3. Copy iframe src URL
4. Format: `https://www.linkedin.com/embed/feed/update/urn:li:activity:POST_ID`

**Response:**
```json
{
  "success": true,
  "data": {
    "instagramEmbedLinks": [...],
    "linkedinEmbedLinks": [...],
    "platforms": ["instagram", "linkedin"],
    "isProfileComplete": true
  }
}
```

### 6. Get My Profile
Get own influencer profile (Influencer only).

**Endpoint:** `GET /influencers/me/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

---

## 🏢 Startup Endpoints

### 7. Browse All Influencers (with Pagination)
Get all influencers with optional filters and pagination (Authenticated users).

**Endpoint:** `GET /influencers?category=fashion&minFollowers=10000&page=1&limit=10`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `category` (optional): fashion, fitness, food, travel, tech, lifestyle, beauty, gaming, other
- `minFollowers` (optional): Minimum follower count
- `maxFollowers` (optional): Maximum follower count
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "totalCount": 45,
  "totalPages": 5,
  "currentPage": 1,
  "data": [
    {
      "_id": "influencer_id",
      "name": "Jane Doe",
      "instagramUsername": "janedoe",
      "instagramProfileUrl": "https://instagram.com/janedoe",
      "followersCount": 250000,
      "category": "fashion",
      "embedLinks": [
        "https://www.instagram.com/p/ABC123/embed",
        "https://www.instagram.com/p/DEF456/embed",
        "https://www.instagram.com/p/GHI789/embed"
      ],
      "totalInterests": 12,
      "totalViews": 45
    }
  ]
}
```

### 8. Get Influencer by ID
Get basic influencer info (Authenticated users).

**Endpoint:** `GET /influencers/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "influencer_id",
    "name": "Jane Doe",
    "instagramUsername": "janedoe",
    "instagramProfileUrl": "https://instagram.com/janedoe",
    "bio": "Fashion Influencer",
    "followersCount": 250000,
    "category": "fashion",
    "embedLinks": [...],
    "totalInterests": 12,
    "totalViews": 45
  }
}
```

### 8b. Get Influencer's Embed Posts Only
Get only the embed links for a specific influencer (lightweight endpoint).

**Endpoint:** `GET /influencers/:id/embeds`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "influencerId": "influencer_id",
    "name": "Jane Doe",
    "instagramUsername": "janedoe",
    "instagramProfileUrl": "https://instagram.com/janedoe",
    "followersCount": 250000,
    "category": "fashion",
    "embedLinks": [
      "https://www.instagram.com/p/ABC123/embed",
      "https://www.instagram.com/p/DEF456/embed",
      "https://www.instagram.com/p/GHI789/embed"
    ],
    "totalEmbeds": 3
  }
}
```

### 9. View Influencer Profile (Decrements Views)
View full influencer profile including embed links (Startup only - uses 1 view).

**Endpoint:** `GET /influencers/view/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "influencer_id",
    "name": "John Doe",
    "instagramUsername": "johndoe",
    "instagramProfileUrl": "https://instagram.com/johndoe",
    "bio": "Fashion & Lifestyle Influencer",
    "followersCount": 150000,
    "category": "fashion",
    "embedLinks": [
      "https://www.instagram.com/p/ABC123/embed",
      "https://www.instagram.com/p/DEF456/embed",
      "https://www.instagram.com/p/GHI789/embed"
    ],
    "totalInterests": 5,
    "totalViews": 42
  },
  "viewsRemaining": 4
}
```

### 10. Mark Interest in Influencer
Startup marks interest in an influencer (like clicking "Interested" button).

**Endpoint:** `POST /influencers/interest/:influencerId`

**Headers:** `Authorization: Bearer <token>`

**Request Body (optional):**
```json
{
  "note": "Interested in collaboration for our new product launch"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Interest marked successfully",
  "data": {
    "_id": "interest_id",
    "startupId": "startup_user_id",
    "influencerId": "influencer_id",
    "status": "interested",
    "note": "Interested in collaboration for our new product launch",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 11. Get My Interests (Startup)
Get list of influencers the startup has marked interest in.

**Endpoint:** `GET /influencers/my/interests`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "interest_id",
      "influencerId": {
        "name": "John Doe",
        "instagramUsername": "johndoe",
        "followersCount": 150000,
        "category": "fashion"
      },
      "status": "interested",
      "note": "...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 12. Get Profile Interests (Influencer)
Get list of startups interested in the influencer's profile.

**Endpoint:** `GET /influencers/me/interests`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "interest_id",
      "startupId": {
        "name": "John Smith",
        "email": "startup@example.com",
        "companyName": "Tech Innovations Inc"
      },
      "status": "interested",
      "note": "Interested in collaboration",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 📊 Plan Limits

### Free Plan (Default for Startups)
- 5 profile views
- Browse all influencers
- Filter by category

### Future Plans
- **Basic:** 50 views/month
- **Premium:** Unlimited views

---

## Example Usage

### Complete Flow Example

```javascript
// 1. Influencer Signup
const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'influencer@example.com',
    password: 'password123',
    userType: 'influencer',
    name: 'Jane Doe'
  })
});
const { token } = await signupRes.json();

// 2. Create Profile
await fetch('http://localhost:5000/api/influencers/profile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    instagramUsername: 'janedoe',
    fullName: 'Jane Doe',
    bio: 'Fashion Influencer',
    followersCount: 250000,
    category: 'fashion'
  })
});

// 3. Add Post Embeds
await fetch('http://localhost:5000/api/influencers/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    posts: [
      {
        embedUrl: 'https://www.instagram.com/p/ABC123/embed',
        postUrl: 'https://www.instagram.com/p/ABC123/'
      }
    ]
  })
});
```

