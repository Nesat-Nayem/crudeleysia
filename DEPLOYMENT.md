# Railway Deployment Guide

## Prerequisites
1. GitHub account with the code pushed to a repository
2. Railway account (free tier available)
3. MongoDB Atlas account with database configured

## MongoDB Atlas Setup

### Important: IP Whitelist Configuration
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your cluster
3. Click on "Network Access" in the left sidebar
4. Click "Add IP Address"
5. For Railway deployment, you have two options:
   - **Option A (Recommended for production)**: Add Railway's IP addresses
   - **Option B (For testing/development)**: Click "Allow Access from Anywhere" (0.0.0.0/0)
6. Click "Confirm"

**Note**: It may take a few minutes for the IP whitelist changes to take effect.

## Railway Deployment Steps

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select your repository

### Step 3: Configure Environment Variables

In Railway dashboard:
1. Click on your deployed service
2. Go to "Variables" tab
3. Add the following environment variable:
   ```
   MONGODB_URI=mongodb+srv://elesyaproject:4jplVYcIajEhKrhw@cluster0.hty68.mongodb.net/elesyaproject
   ```
4. Railway automatically provides:
   - `PORT` - The port your app should listen on
   - `RAILWAY_PUBLIC_DOMAIN` - Your app's public URL

### Step 4: Deploy

1. Railway will automatically deploy your app
2. Wait for the build to complete (usually 1-2 minutes)
3. Once deployed, you'll see a green checkmark
4. Click on the generated domain to access your app

### Step 5: Access Your API

Your API endpoints will be available at:
- API Root: `https://your-app.railway.app/`
- Swagger Docs: `https://your-app.railway.app/swagger`
- Health Check: `https://your-app.railway.app/health`

## Testing the Deployment

### 1. Check API Health
```bash
curl https://your-app.railway.app/health
```

### 2. Test User Creation
```bash
curl -X POST https://your-app.railway.app/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'
```

### 3. Access Swagger Documentation
Open in browser: `https://your-app.railway.app/swagger`

## Troubleshooting

### Database Connection Issues
1. **Error**: "Could not connect to any servers in your MongoDB Atlas cluster"
   - **Solution**: Check IP whitelist in MongoDB Atlas Network Access

2. **Error**: "MongoServerSelectionError"
   - **Solution**: Verify your MongoDB URI is correct
   - **Solution**: Ensure database user has proper permissions

### Railway Deployment Issues
1. **Build Failures**
   - Check Railway build logs
   - Ensure all dependencies are listed in package.json
   - Verify bun version compatibility

2. **App Not Accessible**
   - Check if deployment is successful (green checkmark)
   - Verify PORT environment variable is being used
   - Check Railway logs for runtime errors

## Monitoring

### Railway Logs
1. Go to your Railway project
2. Click on the service
3. Navigate to "Logs" tab to view real-time logs

### MongoDB Atlas Monitoring
1. Go to MongoDB Atlas dashboard
2. Click on your cluster
3. View metrics and performance data

## Updating Your App

Railway automatically deploys when you push to your main branch:
```bash
git add .
git commit -m "Update message"
git push origin main
```

## Custom Domain (Optional)

1. In Railway, go to Settings
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## Environment-Specific Configurations

For production deployments, consider:
1. Setting `NODE_ENV=production` in Railway variables
2. Using stronger MongoDB user credentials
3. Implementing rate limiting
4. Adding authentication/authorization
5. Setting up monitoring and alerting

## Cost Considerations

- **Railway Free Tier**: $5 free credits per month, good for testing
- **MongoDB Atlas Free Tier**: 512MB storage, shared cluster
- For production, consider upgrading both services

## Support

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
