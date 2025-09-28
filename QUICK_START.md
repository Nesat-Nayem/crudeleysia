# Quick Start - Deploy to Railway

## ⚠️ IMPORTANT: MongoDB Atlas Setup First!

Before deploying, you MUST configure MongoDB Atlas to allow connections:

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com
2. **Navigate to Network Access** (left sidebar)
3. **Add IP Address**:
   - Click "Add IP Address"
   - Click **"Allow Access from Anywhere"** button
   - This adds `0.0.0.0/0` (required for Railway)
   - Click "Confirm"
4. **Wait 2-3 minutes** for changes to take effect

## 🚀 Deploy to Railway (5 minutes)

### Step 1: Push to GitHub
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy on Railway
1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will start deploying automatically

### Step 3: Add MongoDB Connection
1. In Railway, click on your service
2. Go to **"Variables"** tab
3. Click **"Add Variable"**
4. Add:
   ```
   MONGODB_URI = mongodb+srv://elesyaproject:4jplVYcIajEhKrhw@cluster0.hty68.mongodb.net/elesyaproject
   ```
5. Railway will redeploy automatically

### Step 4: Access Your API
Once deployed (green checkmark), Railway provides a URL like:
- `https://your-app-name.railway.app`

Test it:
- API Status: `https://your-app-name.railway.app/`
- Swagger Docs: `https://your-app-name.railway.app/swagger`
- Health Check: `https://your-app-name.railway.app/health`

## 📋 Test Your API

### Using Swagger (Recommended)
1. Open `https://your-app-name.railway.app/swagger`
2. Try out the endpoints directly in the browser

### Using cURL
```bash
# Create a user
curl -X POST https://your-app-name.railway.app/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "age": 25
  }'

# Get all users
curl https://your-app-name.railway.app/users

# Get user by ID
curl https://your-app-name.railway.app/users/{USER_ID}
```

## 🔧 Troubleshooting

### Database Not Connecting?
1. Check MongoDB Atlas Network Access (must have 0.0.0.0/0)
2. Wait 2-3 minutes after adding IP whitelist
3. Check Railway logs for errors

### Deployment Failed?
1. Check Railway build logs
2. Ensure all files are committed to GitHub
3. Try redeploying from Railway dashboard

## 📝 What You Get

✅ Full CRUD Operations (Create, Read, Update, Delete)
✅ Interactive Swagger Documentation
✅ MongoDB Atlas Integration
✅ Automatic HTTPS/SSL
✅ Scalable Bun/ElysiaJS Backend
✅ Production-Ready API

## 🎉 Success!

Your API is now live on Railway with:
- Automatic deployments on git push
- Free tier hosting (500 hours/month)
- MongoDB Atlas cloud database
- Full Swagger API documentation

---

**Need Help?** Check the full [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
