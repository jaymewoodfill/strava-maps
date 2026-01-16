# Strava Routes Marketplace

A full-stack marketplace for buying and selling cycling and running routes with mixed monetization models.

## Features

- 🗺️ **Route Marketplace** - Browse, search, and filter routes
- 🆓 **Free Routes** - Email-gated free route downloads
- 💳 **Paid Routes** - Individual route purchases
- 👑 **Premium Subscription** - Unlimited access to all routes
- 🔐 **Authentication** - Email/password + Google OAuth
- 📧 **Email Marketing** - Automated emails for downloads and purchases
- 💰 **Dual Payment Processing** - Stripe and PayPal integration
- 🗺️ **Interactive Maps** - Mapbox integration with GPX rendering
- 👨‍💼 **Admin Panel** - Route management and analytics
- 📊 **User Dashboard** - Purchase history and downloads

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React** + **TypeScript**
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Mapbox GL JS** for maps

### Backend
- **Next.js API Routes**
- **NextAuth.js v5** for authentication
- **Prisma ORM** for database
- **PostgreSQL** database

### Payment & Services
- **Stripe** - Payments and subscriptions
- **PayPal** - Alternative payment method
- **Resend** - Email delivery
- **AWS S3** - File storage for GPX and images

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account
- PayPal developer account
- AWS S3 bucket
- Resend API key
- Mapbox access token

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Copy `env.example` to `.env` and fill in your credentials:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/strava_routes"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_MODE="sandbox"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.ey..."
```

3. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User** - User accounts with authentication
- **Route** - Route details, GPX files, pricing
- **Purchase** - Individual route purchases
- **Subscription** - Premium subscription management
- **Bundle** - Grouped route packages
- **EmailSubscriber** - Email list management
- **EmailDownload** - Free route download tracking

## Security Features

✅ **OWASP Top 10 Compliant**
- Input validation and sanitization
- SQL injection prevention (Prisma)
- XSS protection (React)
- CSRF protection
- Password hashing (bcrypt)
- Secure session management
- Rate limiting ready
- Webhook signature verification
- Environment variable secrets

## Payment Integration

### Stripe
- One-time payments for routes
- Subscription management
- Webhook handling for payment events
- Secure payment intents

### PayPal
- Alternative checkout option
- One-time payments
- IPN handling

## Email Automation

- **Free Route Downloads** - Email gate with download link
- **Purchase Confirmations** - Receipt and download access
- **Subscription Updates** - Renewal reminders
- **Marketing Emails** - New route announcements

## Admin Features

- Route CRUD operations
- GPX file uploads to S3
- Pricing management
- Analytics dashboard
- User management
- Email subscriber list

## API Routes

### Authentication
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Register
- `GET /api/auth/[...nextauth]` - NextAuth handlers

### Routes
- `GET /api/routes` - List routes
- `POST /api/routes` - Create route (admin)
- `GET /api/routes/[id]` - Get route details
- `GET /api/routes/download/[token]` - Download GPX

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment
- `POST /api/webhooks/stripe` - Stripe webhooks
- `POST /api/webhooks/paypal` - PayPal webhooks

### Email
- `POST /api/email/capture` - Capture email for free route

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**

2. **Add environment variables** in Vercel dashboard

3. **Deploy**

```bash
vercel --prod
```

### Database

Use a managed PostgreSQL service:
- **Vercel Postgres**
- **Supabase**
- **Railway**
- **Render**
- **AWS RDS**

### File Storage

Ensure your AWS S3 bucket is configured:
- Public read access for route files
- CORS configuration for uploads

## Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Prisma Studio (database GUI)
npx prisma studio
```

## Future Enhancements

- [ ] Strava API integration for auto-import
- [ ] User route uploads (marketplace model)
- [ ] Route reviews and ratings
- [ ] Social features (following, sharing)
- [ ] Mobile app (React Native)
- [ ] Advanced route filtering
- [ ] Bulk bundle creation
- [ ] Analytics dashboard improvements
- [ ] Multi-language support
- [ ] Route recommendations based on preferences

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@yourdomain.com or open an issue on GitHub.
