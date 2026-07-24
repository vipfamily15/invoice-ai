# 🧾 Invoice AI SaaS - AI-Powered Invoice Processing Platform

A modern, full-stack SaaS application that uses AI to automatically extract data from invoices and manage them efficiently.

## ✨ Features

- **🤖 AI-Powered Invoice Processing** - Automatically extract vendor name, amount, date, tax, and line items using OpenAI Vision API
- **📊 Invoice Dashboard** - Beautiful interface to view, filter, and manage all invoices
- **💳 Subscription Management** - Stripe integration with multiple pricing tiers
- **🔐 Secure Authentication** - NextAuth.js with email/password and social login
- **📥 CSV/PDF Export** - Export invoice data in multiple formats
- **📧 Email Notifications** - Get alerts for new invoices and important updates
- **🌙 Dark Mode** - Beautiful dark theme support
- **📱 Mobile Responsive** - Works perfectly on all devices
- **⚡ Real-time Updates** - Instant invoice processing feedback
- **🎯 Admin Dashboard** - Manage users, subscriptions, and system health

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ShadCN UI** - Component library
- **React Query** - Data fetching
- **Zustand** - State management
- **Stripe.js** - Payment integration

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **OpenAI API** - AI processing
- **Stripe API** - Payments
- **JWT** - Authentication
- **Multer** - File upload

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway/Render
- **Database:** PostgreSQL (Railway/Neon)
- **Storage:** AWS S3 / Supabase Storage

## 📁 Project Structure

```
invoice-ai/
├── frontend/                    # Next.js frontend application
│   ├── app/
│   │   ├── (auth)/             # Authentication pages
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── admin/              # Admin panel
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable components
│   ├── lib/                    # Utilities and helpers
│   ├── public/                 # Static assets
│   └── package.json
│
├── backend/                     # Express.js backend API
│   ├── src/
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Route handlers
│   │   ├── models/             # Database models
│   │   ├── middleware/         # Express middleware
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Helper functions
│   │   └── app.ts             # Express app setup
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── .env.example           # Environment variables
│   └── package.json
│
├── docs/
│   ├── API.md                 # API documentation
│   ├── SETUP.md               # Setup guide
│   └── DEPLOYMENT.md          # Deployment guide
│
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Stripe account

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/vipfamily15/invoice-ai.git
cd invoice-ai
```

#### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials:
# DATABASE_URL=postgresql://...
# OPENAI_API_KEY=sk-...
# STRIPE_SECRET_KEY=sk_live_...
# JWT_SECRET=your-secret-key

# Setup database
npx prisma migrate dev --name init

# Start backend
npm run dev
# Backend runs on http://localhost:5000
```

#### 3. Setup Frontend
```bash
cd ../frontend
npm install

# Create .env.local
cp .env.example .env.local

# Update .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_STRIPE_KEY=pk_test_...

# Start frontend
npm run dev
# Frontend runs on http://localhost:3000
```

#### 4. Open in Browser
Visit: http://localhost:3000

## 💳 Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| **Starter** | $19/month | 50 invoices/month, Basic support |
| **Professional** | $49/month | 500 invoices/month, Email support, CSV export |
| **Enterprise** | $99/month | Unlimited invoices, Priority support, API access |

## 📚 Documentation

- [API Documentation](./docs/API.md) - Complete API reference
- [Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to production
- [Architecture](./docs/ARCHITECTURE.md) - System design

## 🔑 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/invoice_ai
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk_live_your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_KEY=pk_test_your-stripe-key
NEXT_PUBLIC_SITE_NAME=Invoice AI
```

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Invoices
- `GET /api/invoices` - List all invoices (paginated)
- `POST /api/invoices` - Upload and process invoice
- `GET /api/invoices/:id` - Get invoice details
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/:id/export` - Export invoice as PDF/CSV

### Subscriptions
- `GET /api/subscriptions/plans` - Get available plans
- `POST /api/subscriptions/create` - Create subscription
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/cancel` - Cancel subscription

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List all users
- `GET /api/admin/invoices` - All invoices

## 💰 Monetization

1. **Subscription Tiers** - Monthly/yearly billing
2. **Usage-Based Pricing** - Pay per invoice processed
3. **Enterprise Plans** - Custom pricing for large teams
4. **API Access** - Premium API tier for integrations

## 🔒 Security

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting
- ✅ CORS protection
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ Environment variable management
- ✅ Secure file upload handling

## 📊 Performance

- **AI Processing:** ~2-5 seconds per invoice
- **Database Queries:** Indexed for sub-100ms response
- **Frontend:** Optimized with Next.js Image, Code Splitting
- **Caching:** Redis-ready architecture

## 🚀 Deployment

### Deploy Frontend to Vercel
```bash
cd frontend
npm run build
vercel deploy --prod
```

### Deploy Backend to Railway
```bash
cd backend
railway up
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## 📈 Growth Strategy

1. **Launch on ProductHunt** - Get initial users
2. **SEO Optimization** - Target "invoice processing software"
3. **Content Marketing** - Blog posts on invoicing tips
4. **Partnership** - Integrate with accounting software
5. **Referral Program** - Give discounts for referrals
6. **Email Marketing** - Newsletter for feature updates

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT License - See [LICENSE](./LICENSE)

## 🆘 Support

- 📧 Email: support@invoiceai.com
- 💬 Discord: [Join Community](#)
- 🐛 Issues: GitHub Issues

## 👨‍💻 Author

Created by [@vipfamily15](https://github.com/vipfamily15)

---

**Ready to automate your invoice processing? Get started now!** 🚀
