# Deployment Guide - Deploying Compro to Vercel

This guide will walk you through deploying your Compro application to Vercel step by step.

## Prerequisites

Before you begin, make sure you have:
- A GitHub account
- A Vercel account (sign up at https://vercel.com)
- A Supabase account (sign up at https://supabase.com)
- A RentCast API account (sign up at https://www.rentcast.io/api)
- Git installed on your local machine

## Step 1: Prepare Your Local Repository

### 1.1 Initialize Git (if not already done)

```bash
cd /Volumes/T9/COMPRO
git init
```

### 1.2 Create .gitignore (if not exists)

Make sure your `.gitignore` file includes:
- `node_modules/`
- `.env.local`
- `.next/`
- Other sensitive files

### 1.3 Stage and Commit Your Code

```bash
git add .
git commit -m "Initial commit: Compro real estate comparables app"
```

## Step 2: Push to GitHub

### 2.1 Create a New GitHub Repository

1. Go to https://github.com/new
2. Repository name: `compro` (or your preferred name)
3. Set it to **Private** (recommended for now)
4. Do NOT initialize with README, .gitignore, or license
5. Click "Create repository"

### 2.2 Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/compro.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Set Up Supabase

### 3.1 Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: Compro (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for project to finish setting up (2-3 minutes)

### 3.2 Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press Cmd/Ctrl + Enter
6. Verify the tables were created by checking the **Table Editor**

### 3.3 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys") - Keep this secret!

## Step 4: Set Up RentCast API

1. Go to https://www.rentcast.io/api and sign up
2. Navigate to your dashboard/API keys section
3. Copy your **API Key**

## Step 5: Deploy to Vercel

### 5.1 Import Project to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository (`compro`)
4. Vercel will auto-detect Next.js settings

### 5.2 Configure Build Settings

Vercel should auto-detect:
- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 5.3 Add Environment Variables

Before deploying, add all environment variables in Vercel:

Click "Environment Variables" and add:

#### Supabase Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### RentCast Variable
```
RENTCAST_API_KEY=your_rentcast_api_key
```

#### Stripe Variables (Optional - can add later)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_PREMIUM_PRICE_ID=
```

#### App URL
```
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
```

**Important**: 
- Add these for **Production**, **Preview**, and **Development** environments
- Replace `your-project-name.vercel.app` with your actual Vercel domain (you'll get this after first deploy)

### 5.4 Deploy

1. Click "Deploy"
2. Wait for the build to complete (2-5 minutes)
3. Once deployed, you'll get a URL like: `https://compro-xxxxx.vercel.app`

### 5.5 Update App URL

After first deployment:
1. Go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel domain
3. Redeploy (or it will auto-redeploy on next push)

## Step 6: Configure Supabase for Production

### 6.1 Update Supabase Site URL

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your Vercel URL to:
   - **Site URL**: `https://your-project-name.vercel.app`
   - **Redirect URLs**: Add `https://your-project-name.vercel.app/**`

### 6.2 Test Authentication

1. Visit your deployed site
2. Try signing up for a new account
3. Verify the account is created in Supabase **Authentication** → **Users**

## Step 7: Set Up Stripe (Optional - Can Do Later)

If you want to enable payments now:

### 7.1 Create Stripe Products

1. Go to https://dashboard.stripe.com
2. Navigate to **Products**
3. Create two products:
   - **Pro Plan**: $20/month recurring subscription
   - **Premium Plan**: $50/month recurring subscription
4. Copy the **Price IDs** for each product

### 7.2 Set Up Stripe Webhook

1. In Stripe dashboard, go to **Developers** → **Webhooks**
2. Click "Add endpoint"
3. Endpoint URL: `https://your-project-name.vercel.app/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret**
6. Add to Vercel environment variables:
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID`
   - `STRIPE_PRO_PRICE_ID`
   - `STRIPE_PREMIUM_PRICE_ID`

### 7.3 Add Stripe Keys

1. In Stripe dashboard, go to **Developers** → **API keys**
2. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`
3. Add both to Vercel environment variables

## Step 8: Set Up Monthly Usage Reset (Optional)

You can set up automatic monthly usage resets using one of these methods:

### Option A: Supabase Cron (Recommended)

1. In Supabase dashboard, go to **Database** → **Extensions**
2. Enable `pg_cron` extension
3. Go to **SQL Editor** and run:

```sql
SELECT cron.schedule(
  'reset-monthly-usage',
  '0 0 1 * *', -- Run at midnight on the 1st of every month
  $$SELECT reset_monthly_usage()$$
);
```

### Option B: Vercel Cron Jobs

1. Create `vercel.json` (if not exists) or update it
2. Add cron configuration:

```json
{
  "crons": [{
    "path": "/api/cron/reset-usage",
    "schedule": "0 0 1 * *"
  }]
}
```

3. Create the API route at `app/api/cron/reset-usage/route.ts`

### Option C: External Cron Service

Use a service like cron-job.org to call an API endpoint monthly.

## Step 9: Verify Deployment

### 9.1 Test the Application

1. Visit your Vercel URL
2. Test the following:
   - ✅ Homepage loads correctly
   - ✅ Sign up flow works
   - ✅ Login works
   - ✅ Dashboard displays after login
   - ✅ Search functionality (if RentCast is configured)
   - ✅ Search history saves

### 9.2 Check for Errors

1. In Vercel dashboard, check **Deployments** → **Functions** for any errors
2. Check browser console for client-side errors
3. Verify Supabase connection in **Logs** section

## Step 10: Custom Domain (Optional)

### 10.1 Add Custom Domain

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Enter your domain name
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificate

### 10.2 Update Environment Variables

After adding custom domain:
1. Update `NEXT_PUBLIC_APP_URL` to your custom domain
2. Update Supabase redirect URLs
3. Update Stripe webhook URL (if configured)

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Verify `package.json` has all required dependencies
- Check build logs in Vercel dashboard

### Authentication Not Working

- Verify Supabase URL and keys are correct
- Check Supabase redirect URLs include your Vercel domain
- Ensure RLS policies are set up correctly

### API Errors

- Check RentCast API key is valid
- Verify API endpoints are accessible
- Check Vercel function logs for errors

### Database Errors

- Verify migrations ran successfully in Supabase
- Check RLS policies allow authenticated users
- Ensure tables exist in Supabase dashboard

## Next Steps

After successful deployment:

1. ✅ Test all user flows
2. ✅ Set up monitoring (Vercel Analytics)
3. ✅ Configure error tracking (Sentry, etc.)
4. ✅ Set up monthly usage reset cron job
5. ✅ Test Stripe integration (if enabled)
6. ✅ Share your deployed URL!

## Quick Reference

**Vercel Dashboard**: https://vercel.com/dashboard  
**Supabase Dashboard**: https://app.supabase.com  
**Stripe Dashboard**: https://dashboard.stripe.com  
**RentCast Dashboard**: https://www.rentcast.io/api

---

**Your deployed app will be live at**: `https://your-project-name.vercel.app`
