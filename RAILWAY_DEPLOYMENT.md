# 🚂 Railway Deployment Guide for Elysia User CRUD API

This guide will walk you through deploying your Elysia.js + Prisma + PostgreSQL application to Railway.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Railway Account** - Sign up at [railway.app](https://railway.app)
3. **Project Ready** - Your code is committed and pushed to GitHub

## 🚀 Deployment Steps

### Step 1: Push Your Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Ready for Railway deployment"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

### Step 2: Create a Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Click **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your repository: `elysia-user-crud`

### Step 3: Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically provision a PostgreSQL database
4. The `DATABASE_URL` environment variable will be automatically added to your service

### Step 4: Configure Environment Variables

Railway will automatically set `DATABASE_URL` and `PORT`. You need to verify:

1. Click on your **service** (not the database)
2. Go to the **"Variables"** tab
3. Verify these variables exist:
   - `DATABASE_URL` - Should be automatically linked from PostgreSQL service
   - `PORT` - Railway automatically provides this
4. Add any additional variables if needed:
   - `NODE_ENV=production` (optional, for production mode)

### Step 5: Configure Build & Deploy Settings

Railway should auto-detect your Bun project. The configuration files (`railway.json` and `nixpacks.toml`) in your project will:

- Install Bun runtime
- Run `bun install` to install dependencies
- Run `bunx prisma generate` to generate Prisma client
- Start the server with `bun run start`

**Verify Settings:**
1. Click on your service
2. Go to **"Settings"** tab
3. Under **"Build"** section, verify:
   - **Build Command**: (should use nixpacks.toml config)
   - **Start Command**: `bun run start`

### Step 6: Run Database Migration

After the first deployment, you need to push your Prisma schema to the database:

**Option A: Using Railway CLI (Recommended)**

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   # or
   brew install railway
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Link to your project:
   ```bash
   railway link
   ```

4. Run Prisma migration:
   ```bash
   railway run bunx prisma db push
   ```

**Option B: Using Railway Dashboard**

1. Go to your service in Railway
2. Click on **"Settings"** → **"Deploy"**
3. Under **"Deploy Logs"**, wait for deployment to complete
4. Click **"Settings"** → **"One-Click Deploy"**
5. You can manually run commands in the deployment environment

**Option C: Add to Build Phase (Automatic)**

Edit `nixpacks.toml` to include migration in build:
```toml
[phases.build]
cmds = ['bunx prisma generate', 'bunx prisma db push --accept-data-loss']
```

⚠️ **Warning**: `--accept-data-loss` is risky in production. Use migrations instead for production.

### Step 7: Deploy Your Application

1. Railway will automatically deploy when you push to GitHub
2. Monitor the deployment in the **"Deployments"** tab
3. Check the logs for any errors

### Step 8: Get Your Public URL

1. Go to your service in Railway
2. Click on **"Settings"** tab
3. Under **"Networking"** → **"Public Networking"**
4. Click **"Generate Domain"**
5. Railway will provide a public URL like: `your-app-production.up.railway.app`

### Step 9: Test Your Deployment

Visit these URLs (replace with your Railway domain):

- **API Health**: `https://your-app-production.up.railway.app/`
- **Database Health**: `https://your-app-production.up.railway.app/health`
- **API Documentation**: `https://your-app-production.up.railway.app/swagger`
- **Create User**: POST to `https://your-app-production.up.railway.app/api/users`

## 🔄 Continuous Deployment

Railway automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update features"
git push origin main

# Railway will automatically detect the push and redeploy
```

## 🐛 Troubleshooting

### Issue: "Error: P1001: Can't reach database server"

**Solution**: 
- Verify `DATABASE_URL` is set correctly in Variables
- Check that the PostgreSQL service is running
- Ensure the PostgreSQL service and your app are in the same project

### Issue: "Port already in use" or "EADDRINUSE"

**Solution**: 
- Railway automatically sets the `PORT` variable
- Your app is configured to use `process.env.PORT`
- Don't set a custom `APP_PORT` in Railway (only for local dev)

### Issue: "Prisma Client not initialized"

**Solution**: 
- Run database migration: `railway run bunx prisma db push`
- Ensure `prisma generate` runs during build (check `nixpacks.toml`)

### Issue: Build fails

**Solution**: 
- Check deployment logs in Railway dashboard
- Verify all dependencies are in `package.json`
- Ensure Bun is supported (Railway uses nixpacks with Bun)

## 📊 Monitoring

1. **Logs**: View real-time logs in Railway dashboard under "Deployments"
2. **Metrics**: Check CPU, Memory, and Network usage in the "Metrics" tab
3. **Health Check**: Visit `/health` endpoint to check API and database status

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` file to Git
2. **Database Backups**: Enable regular backups in Railway PostgreSQL settings
3. **CORS Configuration**: Update CORS settings in `src/index.ts` if needed
4. **Rate Limiting**: Consider adding rate limiting for production

## 💰 Pricing

- Railway offers a **free trial with $5 credit** (no credit card required)
- After trial: Pay-as-you-go pricing
- Check current pricing at [railway.app/pricing](https://railway.app/pricing)

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Elysia Documentation](https://elysiajs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Bun Documentation](https://bun.sh/docs)

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Database schema pushed
- [ ] Public domain generated
- [ ] API endpoints tested
- [ ] Swagger documentation accessible
- [ ] Health checks passing

## 🎉 Success!

Your Elysia.js CRUD API should now be live on Railway! 

**Next Steps:**
- Share your API documentation URL with your team
- Set up monitoring and alerts
- Configure custom domain (optional)
- Implement CI/CD pipeline enhancements

---

**Need Help?** 
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway Support: support@railway.app
