# Invoice AI - Architecture Overview

## System Design

```
┌────────────────────────────────┐
│   Frontend      │
│  (Next.js/React)│
└────────────────┬────────────────┘
         │ HTTP/REST
         ↓
┌────────────────────────────────┐
│  Backend API    │
│ (Express/Node)  │
└────────────────┬────────────────┘
         │
    ┌────┴────┬────────────────┬──────────────────┬────────────────────┐
    ↓         ↓                ↓                  ↓                    ↓
┌────────┐ ┌──────────────┐ ┌────────┐ ┌──────────────┐
│ Prisma │ │ OpenAI       │ │ Stripe │ │ Auth         │
│  ORM   │ │  Vision      │ │  API   │ │  JWT         │
└────┬───┘ └──────────────┘ └────────┘ └──────────────┘
    ↓
┌────────────────────────────────┐
│   PostgreSQL     │
│    Database      │
└────────────────────────────────┘
```

## Data Flow

### Invoice Processing
```
1. User uploads invoice (PDF/Image)
   ↓
2. Backend receives file via multipart/form-data
   ↓
3. File saved to disk storage
   ↓
4. OpenAI Vision API processes image
   ↓
5. AI extracts: vendor, amount, date, items, tax
   ↓
6. Data saved to PostgreSQL
   ↓
7. Response sent to frontend
   ↓
8. Frontend displays extracted data
```

### Authentication Flow
```
1. User enters credentials
   ↓
2. Frontend sends to /api/auth/login
   ↓
3. Backend verifies password (bcrypt)
   ↓
4. JWT token generated
   ↓
5. Token stored in browser localStorage
   ↓
6. Token sent with every API request
   ↓
7. Backend validates JWT for protected routes
   ↓
8. User data returned if valid
```

### Subscription Flow
```
1. User selects plan
   ↓
2. Stripe payment modal appears
   ↓
3. User enters card details
   ↓
4. Stripe processes payment
   ↓
5. Backend creates subscription record
   ↓
6. Invoice limit updated in database
   ↓
7. Frontend shows success message
   ↓
8. User can now process more invoices
```

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **State:** Context API + Local Storage
- **API Client:** Axios
- **Language:** TypeScript

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **AI:** OpenAI Vision API
- **Payment:** Stripe
- **Auth:** JWT + bcrypt
- **Language:** TypeScript

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Railway
- **Database:** PostgreSQL (Neon/Railway/Supabase)
- **File Storage:** Local disk (production: AWS S3)
- **Email:** SMTP/SendGrid

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `name`
- `avatar` (Optional)
- `isAdmin` (Boolean)
- Timestamps

### Invoices Table
- `id` (Primary Key)
- `userId` (Foreign Key)
- `vendorName`, `vendorEmail`, `vendorAddress`
- `amount`, `currency`, `tax`
- `invoiceDate`, `dueDate`, `invoiceNumber`
- `fileUrl`, `fileType`
- `extractedData` (JSON)
- `status`, `processedAt`
- Timestamps

### LineItems Table
- `id` (Primary Key)
- `invoiceId` (Foreign Key)
- `description`, `quantity`, `unitPrice`, `amount`, `tax`

### Subscriptions Table
- `id` (Primary Key)
- `userId` (Foreign Key, Unique)
- `planId` (Foreign Key)
- `stripeId`, `status`
- `invoicesUsed`, `invoicesLimit`
- `startDate`, `renewalDate`, `canceledAt`

### SubscriptionPlans Table
- `id` (Primary Key)
- `name` (Unique)
- `price`, `currency`
- `invoicesLimit`
- `features` (Array)
- `stripePriceId`

### AuditLogs Table
- `id` (Primary Key)
- `userId` (Foreign Key)
- `action`, `details`
- `ipAddress`
- `createdAt`

## API Architecture

### Request Flow
```
Client Request
    ↓
CORS Middleware
    ↓
Body Parser
    ↓
Auth Middleware (validate JWT)
    ↓
Route Handler
    ↓
Controller (business logic)
    ↓
Prisma (database query)
    ↓
Response
    ↓
Error Handler
```

### Middleware Stack
1. CORS - Allow cross-origin requests
2. Body Parser - Parse JSON/form data
3. Auth Middleware - Verify JWT tokens
4. Admin Middleware - Check admin status
5. Error Handler - Catch and format errors

## Security Measures

1. **Authentication:** JWT tokens with 7-day expiration
2. **Password:** bcrypt hashing (10 rounds)
3. **Authorization:** Role-based access (user/admin)
4. **Input Validation:** express-validator on all endpoints
5. **CORS:** Restricted to frontend origin only
6. **Environment Variables:** Never committed to git
7. **HTTPS:** Enforced in production
8. **Rate Limiting:** Prevent abuse (coming soon)
9. **SQL Injection:** Prevented by Prisma ORM
10. **XSS Protection:** Next.js built-in protection

## Performance Optimizations

1. **Database Indexing:** On userId, invoiceDate, status
2. **Pagination:** 10 items per page default
3. **Image Optimization:** Next.js automatic image optimization
4. **Code Splitting:** Next.js automatic route-based splitting
5. **Caching:** Browser cache + future Redis support
6. **Lazy Loading:** Components loaded on demand
7. **CDN:** Vercel CDN for static assets
8. **Compression:** gzip compression on API responses

## Scaling Strategy

### Phase 1 (Current)
- Single backend instance
- Single database
- Local file storage
- Free tier hosting

### Phase 2 (10k users)
- Database read replicas
- Redis caching layer
- AWS S3 for file storage
- Load balancing

### Phase 3 (100k+ users)
- Horizontal scaling (multiple backend instances)
- Database sharding
- Microservices (invoices, payments, notifications)
- Message queue (RabbitMQ/SQS)
- CDN for global distribution

## Monitoring & Logging

- **Logs:** Centralized logging (Datadog/Loggly)
- **Monitoring:** Uptime monitoring (StatusPage)
- **Errors:** Error tracking (Sentry)
- **Metrics:** Response times, error rates, user analytics
- **Alerts:** Email/Slack notifications for critical issues
