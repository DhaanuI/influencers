# 🚀 Render Deployment Guide

## ✅ Fixed Issues

### Problem:
- ❌ `package.json` was pointing to `index.js` instead of `server.js`
- ❌ Missing dependencies: `bcryptjs` and `jsonwebtoken`

### Solution:
- ✅ Updated `package.json` to use `server.js`
- ✅ Added missing dependencies

---

## 📋 Deployment Steps

### 1. **Set Up MongoDB Atlas** (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/influencers
   ```
6. Replace `<password>` with your actual password

---

### 2. **Configure Render Environment Variables**

In your Render dashboard, add these environment variables:

| Key | Value | Example |
|-----|-------|---------|
| `PORT` | `5000` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/influencers` |
| `JWT_SECRET` | A strong random string | `your-super-secret-jwt-key-12345` |
| `NODE_ENV` | `production` | `production` |

**Important:** 
- ✅ Use MongoDB Atlas connection string (not localhost)
- ✅ Change JWT_SECRET to a strong random string
- ✅ Make sure to replace `<password>` in MongoDB URI

---

### 3. **Render Build Settings**

In your Render service settings:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment:**
- Node

**Branch:**
- main (or your default branch)

---

### 4. **MongoDB Atlas Network Access**

1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

**Note:** For production, you should whitelist only Render's IP addresses.

---

### 5. **Deploy**

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Fix package.json and add missing dependencies"
   git push origin main
   ```

2. Render will automatically detect the changes and redeploy

3. Check the logs in Render dashboard for any errors

---

## ✅ Verification

Once deployed, test your API:

```bash
# Health check
curl https://your-app.onrender.com/

# Test signup
curl -X POST https://your-app.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "userType": "startup"
  }'
```

---

## 🔧 Troubleshooting

### Build Fails:
- ✅ Check that `package.json` has `"main": "server.js"`
- ✅ Check that `"start"` script is `"node server.js"`
- ✅ Verify all dependencies are listed

### App Crashes:
- ✅ Check Render logs for errors
- ✅ Verify MongoDB connection string is correct
- ✅ Verify environment variables are set

### Can't Connect to Database:
- ✅ Check MongoDB Atlas network access (allow 0.0.0.0/0)
- ✅ Verify connection string has correct password
- ✅ Check MongoDB Atlas cluster is running

---

## 📝 Current Configuration

**package.json:**
```json
{
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^9.0.1"
  }
}
```

**Environment Variables Needed:**
- `PORT` - Server port (5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - production

---

## 🎯 Next Steps

1. ✅ Commit and push the fixed `package.json`
2. ✅ Set up MongoDB Atlas
3. ✅ Configure Render environment variables
4. ✅ Deploy and test

**Your backend should now deploy successfully! 🚀**

