# 📊 Database Structure

## Collections Overview

The database has **3 main collections**:
1. **Users** - Authentication for both Startups and Influencers
2. **Influencers** - Influencer profiles with Instagram data
3. **Interests** - Tracks when startups are interested in influencers

---

## 1️⃣ Users Collection

Stores authentication and basic info for both user types.

```javascript
{
  _id: ObjectId,
  email: String,              // Unique email
  password: String,           // Hashed password
  userType: String,           // "startup" or "influencer"
  name: String,               // User's full name
  
  // For Startups only
  companyName: String,        // Company name (optional)
  plan: String,               // "free", "basic", "premium"
  profileViewsRemaining: Number, // Default: 5 for free plan
  
  // For Influencers only
  influencerProfile: ObjectId, // Reference to Influencer collection
  
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Example:**
```json
{
  "_id": "user123",
  "email": "influencer@example.com",
  "userType": "influencer",
  "name": "Jane Doe",
  "influencerProfile": "influencer456"
}
```

---

## 2️⃣ Influencers Collection

Stores influencer profiles with Instagram data and embed links.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User collection
  
  // Basic Info
  name: String,               // Influencer's name
  instagramUsername: String,  // Instagram handle (unique)
  instagramProfileUrl: String, // Full Instagram profile URL
  
  // Profile Details
  bio: String,                // Bio/description
  followersCount: Number,     // Manually entered follower count
  category: String,           // "fashion", "fitness", "food", etc.
  
  // Instagram Embeds (Array of embed URLs)
  embedLinks: [String],       // Max 3 embed URLs
  
  // Status
  isProfileComplete: Boolean, // True when embedLinks added
  
  // Stats
  totalInterests: Number,     // Count of startups interested
  totalViews: Number,         // Count of profile views
  
  lastUpdated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Example:**
```json
{
  "_id": "influencer456",
  "userId": "user123",
  "name": "Jane Doe",
  "instagramUsername": "janedoe",
  "instagramProfileUrl": "https://instagram.com/janedoe",
  "bio": "Fashion & Lifestyle Influencer 👗✨",
  "followersCount": 250000,
  "category": "fashion",
  "embedLinks": [
    "https://www.instagram.com/p/ABC123/embed",
    "https://www.instagram.com/p/DEF456/embed",
    "https://www.instagram.com/p/GHI789/embed"
  ],
  "isProfileComplete": true,
  "totalInterests": 12,
  "totalViews": 45
}
```

---

## 3️⃣ Interests Collection

Tracks when startups mark interest in influencers.

```javascript
{
  _id: ObjectId,
  startupId: ObjectId,        // Reference to User (startup)
  influencerId: ObjectId,     // Reference to Influencer
  status: String,             // "interested", "contacted", "rejected"
  note: String,               // Optional note from startup
  createdAt: Date,
  updatedAt: Date
}
```

**Unique Index:** `{ startupId, influencerId }` - Prevents duplicate interests

**Example:**
```json
{
  "_id": "interest789",
  "startupId": "startup_user_id",
  "influencerId": "influencer456",
  "status": "interested",
  "note": "Would love to collaborate on our new product launch",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

---

## 🔄 Data Flow

### Influencer Journey:
1. **Signup** → Creates User document (userType: "influencer")
2. **Create Profile** → Creates Influencer document with basic info
3. **Add Embed Links** → Updates embedLinks array (max 3)
4. **Profile Complete** → isProfileComplete = true, visible to startups

### Startup Journey:
1. **Signup** → Creates User document (userType: "startup", profileViewsRemaining: 5)
2. **Browse** → Queries Influencer collection with filters
3. **View Profile** → Decrements profileViewsRemaining, increments totalViews
4. **Mark Interest** → Creates Interest document, increments totalInterests
5. **Contact** → Redirects to instagramProfileUrl

---

## 📸 Instagram Embed Links

**Format:** `https://www.instagram.com/p/POST_ID/embed`

**Storage:** Array of strings in `embedLinks` field

**Display in Frontend:**
```html
<iframe 
  src="https://www.instagram.com/p/ABC123/embed"
  width="400" 
  height="480" 
  frameBorder="0"
/>
```

---

## 🔍 Key Queries

### Get all influencers by category:
```javascript
Influencer.find({ 
  category: "fashion", 
  isProfileComplete: true 
}).sort({ followersCount: -1 })
```

### Get startup's interests:
```javascript
Interest.find({ startupId: userId })
  .populate('influencerId')
```

### Get influencers interested in me:
```javascript
Interest.find({ influencerId: myInfluencerId })
  .populate('startupId', 'name email companyName')
```

---

## ✅ Summary

**What's Stored:**
- ✅ User name
- ✅ Instagram account name (username)
- ✅ Instagram profile link (auto-generated from username)
- ✅ Array of embed links (max 3)
- ✅ Follower count (manual input)
- ✅ Interest tracking (when startups click "Interested")

**Perfect for your use case!** 🎯

