# Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. ✅ A Vercel account
2. ✅ A PostgreSQL database (Vercel Postgres, Supabase, etc.)
3. ✅ Stripe account with API keys
4. ✅ PayPal developer account
5. ✅ AWS S3 bucket configured
6. ✅ Resend API key
7. ✅ Mapbox access token
8. ✅ Google OAuth credentials (optional)

## Step 1: Database Setup

### Option A: Vercel Postgres

1. Go to Vercel Dashboard → Storage → Create Database
2. Choose Postgres
3. Copy the `DATABASE_URL` connection string

### Option B: Supabase

1. Create a new project at supabase.com
2. Go to Settings → Database
3. Copy the connection string (use "Transaction" mode)
4. Replace `[password]` with your database password

### Option C: Railway/Render

1. Create a PostgreSQL instance
2. Copy the connection string

### Run Migrations

```bash
# Set DATABASE_URL in your .env
DATABASE_URL="postgresql://..."

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

## Step 2: AWS S3 Setup

1. **Create S3 Bucket**
   - Go to AWS Console → S3
   - Create a new bucket (e.g., `routemarket-files`)
   - Enable public access for read operations

2. **Configure CORS**
   
   Add this CORS configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

3. **Create IAM User**
   - Go to IAM → Users → Create User
   - Attach `AmazonS3FullAccess` policy
   - Create access keys
   - Save `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

## Step 3: Stripe Setup

1. **Get API Keys**
   - Go to stripe.com/dashboard
   - Developers → API keys
   - Copy Secret key and Publishable key

2. **Create Webhook**
   - Developers → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen:
     - `payment_intent.succeeded`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy webhook signing secret

3. **Create Products (Optional)**
   - Products → Add product
   - Create subscription plans
   - Note the Price IDs

## Step 4: PayPal Setup

1. **Get Credentials**
   - Go to developer.paypal.com
   - My Apps & Credentials
   - Create an app
   - Copy Client ID and Secret

2. **Configure Webhooks**
   - Webhooks → Add Webhook
   - URL: `https://yourdomain.com/api/webhooks/paypal`
   - Select relevant payment events

## Step 5: Email Setup (Resend)

1. **Get API Key**
   - Go to resend.com
   - API Keys → Create
   - Copy the API key

2. **Verify Domain (Production)**
   - Domains → Add domain
   - Follow DNS configuration steps
   - Update `EMAIL_FROM` to use verified domain

## Step 6: Mapbox Setup

1. **Get Access Token**
   - Go to mapbox.com
   - Account → Access tokens
   - Copy public token (starts with `pk.`)

## Step 7: Google OAuth (Optional)

1. **Create OAuth Credentials**
   - Go to console.cloud.google.com
   - APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect: `https://yourdomain.com/api/auth/callback/google`
   - Copy Client ID and Secret

## Step 8: Deploy to Vercel

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Via Vercel Dashboard

1. **Import Repository**
   - Go to vercel.com/new
   - Import your GitHub repository

2. **Configure Environment Variables**
   
   Add all variables from `.env`:
   
   ```
   DATABASE_URL
   NEXTAUTH_URL
   NEXTAUTH_SECRET
   GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET
   STRIPE_SECRET_KEY
   STRIPE_PUBLISHABLE_KEY
   STRIPE_WEBHOOK_SECRET
   PAYPAL_CLIENT_ID
   PAYPAL_CLIENT_SECRET
   PAYPAL_MODE
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_REGION
   AWS_S3_BUCKET
   RESEND_API_KEY
   EMAIL_FROM
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## Step 9: Post-Deployment

### 1. Update Webhook URLs

Update your Stripe and PayPal webhook URLs to use your production domain:
- Stripe: `https://yourdomain.com/api/webhooks/stripe`
- PayPal: `https://yourdomain.com/api/webhooks/paypal`

### 2. Update OAuth Redirects

Update Google OAuth redirect URI:
- `https://yourdomain.com/api/auth/callback/google`

### 3. Test Payment Flow

1. Create a test route in admin panel
2. Purchase with Stripe test card: `4242 4242 4242 4242`
3. Verify webhook processing
4. Check email delivery

### 4. Create Admin User

```bash
# Connect to your production database
psql $DATABASE_URL

# Update a user to admin
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## Step 10: Monitoring & Maintenance

### Set Up Monitoring

1. **Vercel Analytics**
   - Enable in dashboard
   - Monitor performance

2. **Error Tracking**
   - Add Sentry or similar
   - Track API errors

3. **Database Backups**
   - Enable automated backups
   - Test restore process

### Regular Maintenance

- Monitor webhook delivery
- Check S3 storage usage
- Review failed payments
- Update dependencies monthly
- Monitor email deliverability

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Reset if needed
npx prisma migrate reset
```

### Webhook Not Receiving Events

1. Check webhook URL is correct
2. Verify signing secret
3. Check Vercel function logs
4. Test with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

### File Upload Fails

1. Verify S3 bucket permissions
2. Check CORS configuration
3. Verify IAM user has correct permissions
4. Check file size limits in `next.config.mjs`

### Email Not Sending

1. Verify Resend API key
2. Check domain verification
3. Review Resend logs
4. Test with curl:
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "from": "test@yourdomain.com",
       "to": "you@email.com",
       "subject": "Test",
       "html": "<p>Test email</p>"
     }'
   ```

## Security Checklist

- [ ] Environment variables set correctly
- [ ] Database uses SSL connection
- [ ] Webhook endpoints verify signatures
- [ ] S3 bucket has proper access controls
- [ ] Rate limiting enabled (add via middleware)
- [ ] CORS properly configured
- [ ] Auth secret is strong and unique
- [ ] Production mode enabled
- [ ] Error messages don't leak sensitive info

## Performance Optimization

1. **Enable caching**
   ```typescript
   // Add to API routes
   export const revalidate = 3600; // Cache for 1 hour
   ```

2. **Optimize images**
   - Use Next.js Image component
   - Configure image domains in `next.config.mjs`

3. **Database indexing**
   ```prisma
   // Add indexes to frequently queried fields
   @@index([accessType, isPublished])
   ```

4. **CDN for static files**
   - Vercel automatically provides CDN
   - Consider CloudFront for S3 files

## Cost Estimation

### Vercel
- **Hobby**: Free (limited usage)
- **Pro**: $20/month (recommended for production)

### Database
- **Vercel Postgres**: $10-25/month
- **Supabase**: Free tier available, $25/month pro

### AWS S3
- Storage: ~$0.023 per GB
- Data transfer: First 100GB free

### Stripe
- 2.9% + $0.30 per transaction

### Resend
- Free: 3,000 emails/month
- Pro: $20/month for 50,000 emails

**Estimated Monthly Cost**: $50-100 for small scale

## Support

If you encounter issues:
1. Check Vercel function logs
2. Review database logs
3. Test webhooks with provider tools
4. Verify all environment variables

Need help? Open an issue on GitHub or contact support.
