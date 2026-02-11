# Real Estate Comparables App

A Next.js web application for finding comparable real estate properties using the RentCast API.

## Features

- User authentication with Supabase
- Property search with comparable properties
- Subscription tiers (Free, Pro, Premium)
- Historical search tracking
- Stripe payment integration

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Fill in your API keys
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database & Auth)
- RentCast API
- Stripe (Payments)
