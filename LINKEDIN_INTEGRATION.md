# 🔗 LinkedIn Integration - Complete Guide

## ✅ What's Been Implemented

LinkedIn embed support has been added alongside Instagram. Influencers can now add posts from **both platforms**.

---

## 📊 Schema Changes

### Updated Influencer Model

**Before (Instagram only):**
```javascript
{
  instagramUsername: String,
  instagramProfileUrl: String,
  embedLinks: [String]  // Only Instagram
}
```

**After (Instagram + LinkedIn):**
```javascript
{
  // Instagram
  instagramUsername: String,
  instagramProfileUrl: String,
  instagramEmbedLinks: [String],  // Max 3
  
  // LinkedIn
  linkedinProfileUrl: String,
  linkedinEmbedLinks: [String],   // Max 3
  
  // Platform tracking
  platforms: ['instagram', 'linkedin'],
  
  // Categories expanded
  category: ['fashion', 'fitness', ..., 'b2b', 'business', 'other']
}
```

**Key Changes:**
- ✅ `embedLinks` → `instagramEmbedLinks` (renamed for clarity)
- ✅ Added `linkedinProfileUrl` and `linkedinEmbedLinks`
- ✅ Added `platforms` array to track which platforms influencer uses
- ✅ Added 'b2b' and 'business' categories for LinkedIn professionals
- ✅ Instagram username is now optional (can be LinkedIn-only influencer)

---

## 🔌 Updated APIs

### 1. Create/Update Profile (Now Supports Both Platforms)

**Endpoint:** `POST /api/influencers/profile`

**Request Body:**
```json
{
  "name": "John Doe",
  "followersCount": 50000,
  "bio": "B2B Marketing Expert | Tech Influencer",
  "category": "b2b",
  
  // Instagram (optional)
  "instagramUsername": "johndoe",
  "instagramEmbedLinks": [
    "https://www.instagram.com/p/ABC123/embed",
    "https://www.instagram.com/p/DEF456/embed"
  ],
  
  // LinkedIn (optional)
  "linkedinProfileUrl": "https://www.linkedin.com/in/johndoe",
  "linkedinEmbedLinks": [
    "https://www.linkedin.com/embed/feed/update/urn:li:activity:1234567890",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:9876543210"
  ],
  
  "platforms": ["instagram", "linkedin"]
}
```

**Validation:**
- ✅ At least ONE platform (Instagram OR LinkedIn) is required
- ✅ Max 3 embed links per platform
- ✅ Name and follower count are required

---

### 2. Update Embed Links (Platform-Specific)

**Endpoint:** `PUT /api/influencers/embed-links`

**Request Body:**
```json
{
  "platform": "linkedin",  // or "instagram"
  "embedLinks": [
    "https://www.linkedin.com/embed/feed/update/urn:li:activity:1234567890",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:9876543210",
    "https://www.linkedin.com/embed/feed/update/urn:li:activity:5555555555"
  ]
}
```

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

---

### 3. Get Influencer's Embeds (Both Platforms)

**Endpoint:** `GET /api/influencers/:id/embeds?platform=linkedin`

**Query Parameters:**
- `platform` (optional): Filter by 'instagram' or 'linkedin'
- If not specified, returns both platforms

**Example 1: Get Both Platforms**
```
GET /api/influencers/675a123.../embeds
```

**Response:**
```json
{
  "success": true,
  "data": {
    "influencerId": "675a123...",
    "name": "John Doe",
    "followersCount": 50000,
    "category": "b2b",
    "platforms": ["instagram", "linkedin"],
    "instagram": {
      "username": "johndoe",
      "profileUrl": "https://instagram.com/johndoe",
      "embedLinks": ["..."],
      "totalEmbeds": 2
    },
    "linkedin": {
      "profileUrl": "https://www.linkedin.com/in/johndoe",
      "embedLinks": ["..."],
      "totalEmbeds": 3
    },
    "totalEmbeds": 5
  }
}
```

**Example 2: Get LinkedIn Only**
```
GET /api/influencers/675a123.../embeds?platform=linkedin
```

**Response:**
```json
{
  "success": true,
  "data": {
    "influencerId": "675a123...",
    "name": "John Doe",
    "platforms": ["instagram", "linkedin"],
    "linkedin": {
      "profileUrl": "https://www.linkedin.com/in/johndoe",
      "embedLinks": [
        "https://www.linkedin.com/embed/feed/update/urn:li:activity:1234567890",
        "https://www.linkedin.com/embed/feed/update/urn:li:share:9876543210"
      ],
      "totalEmbeds": 2
    }
  }
}
```

---

## 📸 How to Get LinkedIn Embed URLs

### Method 1: From LinkedIn Post (Desktop)
1. Go to the LinkedIn post
2. Click "..." (three dots) in top right
3. Click "Embed this post"
4. Copy the iframe src URL

### Method 2: Manual Format
LinkedIn embed URLs follow this pattern:

**For Activity Posts:**
```
https://www.linkedin.com/embed/feed/update/urn:li:activity:POST_ID
```

**For Share Posts:**
```
https://www.linkedin.com/embed/feed/update/urn:li:share:POST_ID
```

**Example:**
- Post URL: `https://www.linkedin.com/posts/johndoe_tech-innovation-activity-7123456789012345678-AbCd`
- Embed URL: `https://www.linkedin.com/embed/feed/update/urn:li:activity:7123456789012345678`

---

## 🎨 Frontend Display

### React Example (Both Platforms):

```jsx
function InfluencerProfile({ influencerId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/influencers/${influencerId}/embeds`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(result => setData(result.data));
  }, [influencerId]);

  return (
    <div>
      <h2>{data?.name}</h2>
      <p>{data?.followersCount.toLocaleString()} followers</p>
      
      {/* Instagram Embeds */}
      {data?.instagram?.embedLinks?.length > 0 && (
        <div className="instagram-section">
          <h3>Instagram Posts</h3>
          {data.instagram.embedLinks.map((url, i) => (
            <iframe
              key={i}
              src={url}
              width="400"
              height="480"
              frameBorder="0"
            />
          ))}
        </div>
      )}
      
      {/* LinkedIn Embeds */}
      {data?.linkedin?.embedLinks?.length > 0 && (
        <div className="linkedin-section">
          <h3>LinkedIn Posts</h3>
          {data.linkedin.embedLinks.map((url, i) => (
            <iframe
              key={i}
              src={url}
              width="504"
              height="400"
              frameBorder="0"
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## ✅ Summary

### What's Complete:

✅ **Schema Updated** - Separate fields for Instagram and LinkedIn  
✅ **Both Platforms Supported** - Can have Instagram, LinkedIn, or both  
✅ **Platform-Specific Updates** - Update embeds per platform  
✅ **Flexible Queries** - Get all embeds or filter by platform  
✅ **New Categories** - Added 'b2b' and 'business' for LinkedIn pros  
✅ **Backward Compatible** - Existing Instagram-only profiles still work  

### API Endpoints:

| Endpoint | Purpose | Platforms |
|----------|---------|-----------|
| `POST /api/influencers/profile` | Create/update profile | Both |
| `PUT /api/influencers/embed-links` | Update embeds | Specify platform |
| `GET /api/influencers/:id/embeds` | Get embeds | Both or filter |
| `GET /api/influencers/view/:id` | View full profile | Both |

**Ready to use! 🚀**

