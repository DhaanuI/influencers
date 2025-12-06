# 🎯 Instagram Influencers Platform - Backend

A platform connecting startups with Instagram influencers. Influencers showcase their profiles with embedded Instagram posts, and startups can discover and contact them.

## 🚀 Quick Start

```bash
# Install dependencies
npm install express mongoose dotenv cors axios bcryptjs jsonwebtoken
npm install --save-dev nodemon

# Start MongoDB (locally or use Atlas)
mongod

# Run the server
npm run dev
```

Server runs on: `http://localhost:5000`

## 📁 Project Structure

```
influencers/
├── models/
│   ├── User.js              # User model (Startup/Influencer)
│   └── Influencer.js        # Influencer profile model
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── influencerController.js # Influencer CRUD operations
├── routes/
│   ├── auth.js              # Auth routes
│   └── influencers.js       # Influencer routes
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── services/
│   └── instagramService.js  # Instagram integration (future)
├── server.js                # Main server file
├── .env                     # Environment variables
├── API_DOCUMENTATION.md     # Complete API docs
└── SETUP.md                 # Setup guide
```

## 🎯 Key Features

### For Influencers:
- ✅ Sign up and create profile
- ✅ Add Instagram username and follower count
- ✅ Embed up to 3 Instagram posts
- ✅ Categorize profile (fashion, fitness, food, etc.)
- ✅ Profile visibility to startups

### For Startups:
- ✅ Sign up and browse influencers
- ✅ Filter by category and follower count
- ✅ View influencer profiles (limited by plan)
- ✅ See embedded Instagram posts
- ✅ Contact influencers via Instagram

### Platform Features:
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Plan limits (Free: 5 views)
- ✅ Instagram post embeds (no API needed!)
- ✅ Future-ready for Instagram Graph API

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Influencers
- `POST /api/influencers/profile` - Create/update profile (Influencer)
- `POST /api/influencers/posts` - Add Instagram embeds (Influencer)
- `GET /api/influencers/me/profile` - Get own profile (Influencer)
- `GET /api/influencers` - Browse all influencers (Authenticated)
- `GET /api/influencers/:id` - Get influencer by ID (Authenticated)
- `GET /api/influencers/view/:id` - View profile (Startup - uses 1 view)

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API docs.

## 📸 Instagram Embeds

Instead of complex Instagram API integration, we use **Instagram's native embed feature**:

1. Influencers get embed URLs from Instagram posts
2. Frontend displays posts using iframes
3. No API keys or OAuth needed!
4. Works immediately for demo

**How to get embed URL:**
- Go to Instagram post → Click "..." → Click "Embed" → Copy URL
- Or add `/embed` to post URL: `https://www.instagram.com/p/ABC123/embed`

## 🎨 Frontend Integration

```jsx
// Display Instagram embed
<iframe 
  src={post.embedUrl}
  width="400" 
  height="480" 
  frameBorder="0"
  scrolling="no"
  allowTransparency="true"
/>
```

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

## 📊 User Types & Plans

### Influencer
- Create profile with Instagram username
- Add follower count manually
- Embed up to 3 posts
- Free forever

### Startup
- **Free Plan:** 5 profile views
- **Basic Plan:** 50 views/month (future)
- **Premium Plan:** Unlimited (future)

## 🛠️ Tech Stack

- **Node.js** + **Express** - Backend framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

## 🎯 Hackathon Strategy

✅ **Backend is COMPLETE!**

**Why this approach wins:**
1. ✅ **Works immediately** - No API approval needed
2. ✅ **Real Instagram content** - Using native embeds
3. ✅ **Scalable** - Can add Graph API later
4. ✅ **Focus on UI** - Spend time on frontend polish
5. ✅ **Reliable demo** - No API rate limits or failures

## 🚀 Next Steps

1. **Build Frontend** (React + Vite recommended)
2. **Add Tinder-like UI** for profile browsing
3. **Create pricing page** for plans
4. **Polish design** with Tailwind CSS
5. **Prepare demo** with test accounts

## 📝 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/influencers
JWT_SECRET=your-super-secret-jwt-key
```

## 🎬 Demo Flow

1. **Influencer Journey:**
   - Sign up → Create profile → Add Instagram posts → Profile live

2. **Startup Journey:**
   - Sign up → Browse influencers → Filter by category → View profiles → Contact

## 📚 Documentation

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [SETUP.md](./SETUP.md) - Detailed setup guide

## 🏆 Built for Hackathon

Optimized for rapid development and reliable demo. Focus on the idea, not API complexity!

---

**Ready to build the frontend? The backend is waiting! 🚀**

