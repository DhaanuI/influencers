# 🚀 Quick Setup Guide - Instagram Influencers Platform

## ⏱️ 5-Minute Setup for Hackathon

### Step 1: Install Dependencies (Run in Git Bash)

```bash
# Initialize project
npm init -y

# Install backend dependencies
npm install express mongoose dotenv cors axios bcryptjs jsonwebtoken

# Install dev dependencies
npm install --save-dev nodemon
```

### Step 2: Update package.json Scripts

Add these to your `package.json` under `"scripts"`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Step 3: Start MongoDB

Make sure MongoDB is running locally:

```bash
# If using MongoDB locally
mongod

# OR use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### Step 4: Start the Server

```bash
npm run dev
```

You should see:
```
Server is running on port 5000
MongoDB connected successfully
```

---

## 🎯 Testing the API

### 1. Test with Postman or cURL

#### Influencer Flow:

```bash
# 1. Signup as Influencer
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "influencer@test.com",
    "password": "password123",
    "userType": "influencer",
    "name": "Jane Doe"
  }'

# Save the token from response!

# 2. Create Profile
curl -X POST http://localhost:5000/api/influencers/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "instagramUsername": "janedoe",
    "fullName": "Jane Doe",
    "bio": "Fashion & Lifestyle Influencer",
    "followersCount": 150000,
    "category": "fashion"
  }'

# 3. Add Instagram Post Embeds
curl -X POST http://localhost:5000/api/influencers/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "posts": [
      {
        "embedUrl": "https://www.instagram.com/p/ABC123/embed",
        "postUrl": "https://www.instagram.com/p/ABC123/",
        "caption": "My latest fashion post"
      }
    ]
  }'
```

#### Startup Flow:

```bash
# 1. Signup as Startup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "startup@test.com",
    "password": "password123",
    "userType": "startup",
    "name": "John Smith",
    "companyName": "Tech Startup Inc"
  }'

# 2. Browse Influencers
curl http://localhost:5000/api/influencers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 3. View Influencer Profile (uses 1 view)
curl http://localhost:5000/api/influencers/view/INFLUENCER_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📸 How to Get Instagram Embed URLs

### Method 1: From Instagram Website
1. Go to any Instagram post
2. Click the "..." (three dots) menu
3. Click "Embed"
4. Copy the URL from the embed code (looks like: `https://www.instagram.com/p/ABC123/embed`)

### Method 2: Manual Format
```
Post URL: https://www.instagram.com/p/ABC123/
Embed URL: https://www.instagram.com/p/ABC123/embed
```

Just add `/embed` to the end of the post URL!

---

## 🎨 Frontend Integration (Next Step)

The backend is ready! Now you can:

1. **Build React Frontend** with Vite
2. **Connect to these APIs**
3. **Display Instagram embeds** using iframe:

```jsx
<iframe 
  src="https://www.instagram.com/p/ABC123/embed" 
  width="400" 
  height="480" 
  frameBorder="0"
/>
```

---

## 🔑 Key Features Implemented

✅ **User Authentication** (JWT-based)
✅ **Two User Types** (Startup & Influencer)
✅ **Influencer Profiles** with manual follower count
✅ **Instagram Post Embeds** (up to 3 posts)
✅ **Browse & Filter** influencers
✅ **Plan Limits** (Free plan: 5 profile views)
✅ **Category System** (fashion, fitness, food, etc.)

---

## 🎯 Demo Strategy

1. **Create 3-5 influencer accounts** with real Instagram embeds
2. **Create 1 startup account** to browse
3. **Show the flow**:
   - Influencer signs up → Creates profile → Adds posts
   - Startup signs up → Browses influencers → Views profiles
   - Show view limit decreasing

---

## 🚨 Troubleshooting

**MongoDB Connection Error?**
- Make sure MongoDB is running
- Or use MongoDB Atlas and update `.env`

**JWT Error?**
- Make sure you're sending the token in headers
- Format: `Authorization: Bearer <token>`

**CORS Error?**
- Already configured in server.js
- Should work with any frontend

---

## 📚 Next Steps

1. ✅ Backend is DONE!
2. 🎨 Build frontend (React + Vite)
3. 🎴 Add Tinder-like swipe UI
4. 💳 Add plan/pricing page
5. 🎬 Prepare demo script

**Time saved: 2+ hours by using Instagram embeds instead of API!**

