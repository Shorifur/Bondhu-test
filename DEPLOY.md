# Bondhu Deployment Guide (Free Tiers)

## Architecture

```
User --> Vercel (Frontend) --> Railway/Render (API) --> Supabase (DB)
                                                     --> Upstash (Redis)
```

## Step 1: Database (Supabase - Free Tier)

1. Go to [supabase.com](https://supabase.com) and sign up with GitHub
2. Create a new project called `bondhu-db`
3. Wait for the database to be provisioned (~2 minutes)
4. Go to **Project Settings** > **Database**
5. Copy the **Connection string** (URI format)
6. Save it - you'll need it for the API deployment

## Step 2: Redis (Upstash - Free Tier)

1. Go to [upstash.com](https://upstash.com) and sign up
2. Create a new Redis database called `bondhu-redis`
3. Choose the region closest to your API server (e.g., `ap-south-1` for Asia)
4. Copy the **REDIS_URL** (it starts with `rediss://`)
5. Save it for the API deployment

## Step 3: Deploy API Backend (Railway - Free Tier)

1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click **New Project** > **Deploy from GitHub repo**
3. Select your `Bondhu-test` repository
4. Railway will auto-detect the NestJS project
5. Add the following **Environment Variables** (from `.env.example`):

```
NODE_ENV=production
APP_NAME=Bondhu
APP_URL=https://bondhu.vercel.app
DATABASE_URL=<from Supabase>
DIRECT_DATABASE_URL=<same as DATABASE_URL>
REDIS_URL=<from Upstash>
JWT_SECRET=<generate a random 64-char string>
JWT_REFRESH_SECRET=<generate a different random 64-char string>
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
OTP_SECRET=<generate a random 32-char string>
ZEROBOUNCE_API_KEY=<your zerobounce key>
WS_HEARTBEAT_INTERVAL=30000
WS_MAX_CONNECTIONS_PER_USER=5
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

6. Click **Deploy** and wait for the build (~3-5 minutes)
7. Once deployed, copy your Railway URL (e.g., `https://bondhu-api.up.railway.app`)

### Run Database Migrations

After the API deploys, you need to run Prisma migrations:

1. In Railway dashboard, click on your service
2. Go to **Settings** > **Deploy** > Add a **Start Command**:
```
cd apps/api && npx prisma migrate deploy && npm run start:prod
```
3. Or run manually via Railway CLI:
```bash
railway login
railway link
railway run -- cd apps/api && npx prisma migrate deploy
```

### Seed the Database (64 Districts + Test Users)

```bash
railway run -- cd apps/api && npx prisma db seed
```

## Step 4: Deploy Frontend (Vercel - Free Tier)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **Add New Project** > Import your `Bondhu-test` repo
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../../ && npm install && cd apps/web && npm run build`

4. Add **Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://bondhu-api.up.railway.app
NEXT_PUBLIC_WS_URL=wss://bondhu-api.up-railway.app
```

5. Click **Deploy**

6. After deployment:
   - Go to **Settings** > **Domains**
   - Your app will be at `https://bondhu.vercel.app` (or similar)

## Step 5: Update CORS on Backend

1. Go back to Railway dashboard
2. Add/update this environment variable:
```
APP_URL=https://bondhu.vercel.app  <-- your actual Vercel URL
```
3. Redeploy the API

## Step 6: Verify Everything Works

1. Open your Vercel URL in browser
2. Register a new account
3. Check the API logs in Railway dashboard for any errors
4. Test login, posting, and other features

---

## Troubleshooting

### 401 Unauthorized after login
- Check that `JWT_SECRET` is set correctly
- Check that `api.setToken()` is being called after login

### Database connection errors
- Verify `DATABASE_URL` is the **URI format** from Supabase
- Make sure the URL includes `?schema=public`

### CORS errors in browser
- Check `APP_URL` matches your Vercel domain exactly
- Must include `https://` and no trailing slash

### Images not uploading
- The app uses local MinIO for development
- For production, set up Cloudflare R2 or AWS S3
- Or disable image upload for initial testing

---

## Cost Estimate (Free Tier Limits)

| Service | Free Limit |
|---------|-----------|
| Vercel | 100GB bandwidth, 6,000 build minutes |
| Railway | $5 credit/month (~500 hours) |
| Supabase | 500MB database, 2GB bandwidth |
| Upstash | 10,000 commands/day |

**Total: $0/month** for light testing (up to ~100 users)
