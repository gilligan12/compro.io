# Setup Guide

## Prerequisites

1. Node.js 18+ installed
2. A Supabase account and project
3. A RentCast API account and API key
4. A Stripe account (for payments) - *Can be set up later*

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the migration file:
   - `supabase/migrations/001_initial_schema.sql`
3. Get your Supabase credentials:
   - Project URL (Settings > API)
   - Anon/public key (Settings > API)
   - Service role key (Settings > API) - Keep this secret!

## Step 3: Set Up RentCast API

**IMPORTANT**: You need an **active API subscription** for RentCast. Free accounts may not have API access.

1. Sign up at https://www.rentcast.io/api
2. **Activate your API subscription** in the dashboard: https://app.rentcast.io/app/api
   - You may need to subscribe to a paid plan to get API access
3. Get your API key from the dashboard (make sure it's associated with an active subscription)
4. Note: Review RentCast API documentation for the exact endpoint structure as it may differ from the implementation

## Step 4: Configure Environment Variables

**Note:** You can set up Stripe later. For now, you can leave Stripe variables empty or use placeholder values.

1. Copy `.env.local.example` to `.env.local`
2. Fill in all the values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# RentCast
RENTCAST_API_KEY=your_rentcast_api_key

# Stripe (Optional - can be configured later)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_PREMIUM_PRICE_ID=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard (Stripe variables can be added later)
4. Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

## Step 7: Set Up Monthly Usage Reset (Optional)

You can set up a cron job to reset monthly usage. Options:

1. **Supabase Cron** (Recommended): Use Supabase's pg_cron extension
2. **Vercel Cron**: Use Vercel's cron jobs feature
3. **External Service**: Use a service like cron-job.org to call an API endpoint

## Step 8: Set Up Stripe (Optional - Can be done later)

Once your app is running and you're ready to enable payments:

1. Create a Stripe account at https://stripe.com
2. Create two products:
   - **Pro Plan**: $20/month recurring
   - **Premium Plan**: $50/month recurring
3. Get the Price IDs for each product
4. Set up a webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the webhook signing secret
5. Update your `.env.local` file (and Vercel environment variables) with:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID`
   - `STRIPE_PRO_PRICE_ID`
   - `STRIPE_PREMIUM_PRICE_ID`
6. Update the Stripe webhook URL in your Stripe dashboard to point to your deployed domain

**Note:** The app will work without Stripe for the free tier. Users can sign up and use the free plan (5 searches/month) without any payment setup.

## Important Notes

- The RentCast API endpoints in `lib/rentcast.ts` may need adjustment based on the actual API documentation
- Make sure Row Level Security (RLS) policies are properly set up in Supabase
- The app works without Stripe - users can use the free tier without payment setup
- When ready to enable payments, test the Stripe webhook locally using Stripe CLI before deploying
- The monthly usage reset function needs to be scheduled separately

## Troubleshooting

- **Authentication issues**: Check Supabase RLS policies
- **API errors**: Verify all environment variables are set correctly (except Stripe if not set up yet)
- **Stripe webhook failures**: Ensure webhook secret matches and endpoint is accessible (only relevant if Stripe is configured)
- **Database errors**: Verify migration was run successfully
- **Payment features not working**: Make sure Stripe is fully configured (Step 8) if you want to enable paid tiers
