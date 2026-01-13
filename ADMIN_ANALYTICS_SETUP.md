# Admin Analytics Integration Guide

This document outlines the user signup tracking and analytics integration for the Klya AI platform.

## What Was Implemented

### 1. Backend - Signup Stats Endpoint

**Route:** `GET /api/admin/stats`
**Authentication:** Admin role required (protected by `protect` and `authorize('admin')` middleware)
**Location:** `/backend/src/controllers/adminController.ts` & `/backend/src/routes/admin.ts`

#### Response Format
```json
{
  "success": true,
  "data": {
    "totalUsers": 1320,
    "newUsersLast7Days": 85,
    "activeUsers": 120,
    "subscriptionStats": {
      "starter": 950,
      "professional": 250,
      "enterprise": 120
    },
    "dailySignups": [
      { "date": "2025-10-20", "count": 15 },
      { "date": "2025-10-21", "count": 20 }
    ]
  }
}
```

#### Key Features
- **totalUsers**: Count of all registered users
- **newUsersLast7Days**: Count of users created in the last 7 days
- **activeUsers**: Count of users who logged in within the last 7 days
- **subscriptionStats**: Breakdown of users by subscription plan
- **dailySignups**: Array of daily signup counts for the past 30 days

#### Implementation Details
- Uses MongoDB aggregation pipeline for efficient data retrieval
- Filters users by `createdAt` timestamp for date ranges
- Groups daily signups by year, month, and day
- Returns formatted date strings (YYYY-MM-DD)

### 2. Frontend - Admin Dashboard

**Route:** `/dashboard/admin`
**Location:** `/frontend/src/app/dashboard/admin/page.tsx`

#### Features

##### Display Components
1. **Top Stats Cards (4 columns)**
   - Total Users (blue)
   - New Users Last 7 Days (green)
   - Active Users (purple)
   - Paid Plans Count (pink)

2. **Signup Trends Chart**
   - Line chart showing signups over 30 days
   - Interactive tooltips with dark theme
   - Responsive layout

3. **Subscription Breakdown**
   - Pie chart showing distribution of subscription plans
   - Color-coded: Starter (blue), Professional (purple), Enterprise (pink)
   - Legend with counts

4. **Key Metrics**
   - Conversion Rate: (Paid plans / Total users) × 100%
   - Weekly Growth: New users in the last 7 days
   - Engagement: (Active users / Total users) × 100%

#### UI/UX Features
- Clean gradient background (slate-50 to slate-100)
- Responsive grid layout (mobile, tablet, desktop)
- Loading spinner with skeleton state
- Error handling with retry button
- Refresh data button to update statistics
- Lucide React icons for visual hierarchy

### 3. API Client Integration

**Location:** `/frontend/src/lib/api.ts`

#### Admin API Methods
```typescript
export const adminApi = {
  getSignupStats: () => api.get<ApiResponse<SignupStats>>('/admin/stats'),
  getAdminUsers: (page, limit, plan?, search?) => api.get<ApiResponse<any>>('/admin/users'),
  getSystemMetrics: () => api.get<ApiResponse<any>>('/admin/metrics'),
  getSystemLogs: (level, limit) => api.get<ApiResponse<any>>('/admin/logs'),
  broadcastNotification: (title, message, targetUsers?, notificationType?) => api.post('/admin/broadcast'),
}
```

#### SignupStats TypeScript Interface
```typescript
export interface SignupStats {
  totalUsers: number;
  newUsersLast7Days: number;
  activeUsers: number;
  subscriptionStats: {
    starter: number;
    professional: number;
    enterprise: number;
  };
  dailySignups: Array<{
    date: string;
    count: number;
  }>;
}
```

## Security & Authentication

### Access Control
- Route is protected by existing `protect` middleware (JWT validation)
- Authorized only for users with `role: 'admin'`
- Non-admin users receive 403 Unauthorized response
- Tokens are sent via Bearer header or cookies

### Error Handling
- Returns 401 if user is not authenticated
- Returns 403 if user is not an admin
- Returns 500 with error details if database query fails
- Frontend displays user-friendly error messages

## Database Queries

### Query Performance
- Uses MongoDB aggregation pipeline for efficient grouping
- Indexes should exist on `createdAt` and `role` fields (recommended)
- Date filtering uses `$gte` operator for range queries

### Recommended Indexes
```javascript
// Create these indexes for optimal performance:
db.users.createIndex({ "createdAt": 1 })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "subscription.plan": 1 })
db.users.createIndex({ "lastLogin": 1 })
```

## File Structure

```
Backend:
├── src/
│   ├── controllers/
│   │   └── adminController.ts (updated with getSignupStats)
│   └── routes/
│       └── admin.ts (updated with /stats route)

Frontend:
├── src/
│   ├── app/dashboard/admin/
│   │   └── page.tsx (new admin dashboard)
│   └── lib/
│       └── api.ts (updated with adminApi)
```

## Testing the Integration

### 1. Backend Test (cURL)
```bash
# Get auth token first
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Use the token to access stats
curl -X GET http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Frontend Test
1. Login as an admin user
2. Navigate to `/dashboard/admin`
3. Verify data loads from backend
4. Check charts render correctly
5. Click "Refresh Data" button to verify data updates

### 3. Authorization Test
```bash
# Try accessing with non-admin user token
curl -X GET http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer USER_TOKEN"
# Should return 403 Forbidden
```

## Deployment Considerations

### Environment Variables
Ensure the following are set in `.env`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url
JWT_SECRET=your-secret-key
```

### CORS Configuration
The backend already includes CORS for:
- https://klya-ai.vercel.app
- http://localhost:3000
- http://localhost:3003
- Custom FRONTEND_URL if set

### Build Requirements
- Backend: TypeScript compiles to JavaScript
- Frontend: Next.js builds and optimizes React components
- Recharts library is already installed

## Monitoring & Maintenance

### Data Refresh Strategy
- Frontend refetches data on page load
- Manual refresh button available
- Consider adding auto-refresh every 5-10 minutes for real-time updates

### Performance Optimization
- Consider caching stats for 1-5 minutes on backend
- Implement pagination for large datasets
- Add database query optimization if dataset grows beyond 100K users

### Future Enhancements
1. Real-time updates using WebSockets
2. Export statistics as CSV/PDF
3. Custom date range filtering
4. User segmentation analytics
5. Revenue/MRR tracking
6. Cohort analysis
7. Churn rate calculations
8. Google Analytics/PostHog integration (mentioned as bonus)

## Troubleshooting

### Issue: 403 Unauthorized
**Cause:** User is not an admin
**Solution:** Ensure user has `role: 'admin'` in database or change role via admin panel

### Issue: Empty charts
**Cause:** No signups in the 30-day window
**Solution:** Create test users or wait for real user data

### Issue: Type errors in TypeScript
**Solution:** Ensure all types are properly imported from `@/lib/api`

### Issue: API not responding
**Solution:** 
1. Check backend is running on correct port (3001)
2. Verify CORS configuration
3. Check token is valid and not expired

## Support & Documentation

For detailed API documentation, see:
- Backend: `/backend/src/routes/admin.ts`
- Frontend: `/frontend/src/app/dashboard/admin/page.tsx`
- Types: `/frontend/src/lib/api.ts`

## Summary

This implementation provides a complete admin analytics dashboard with:
✅ Secure backend endpoint with authentication
✅ Real-time statistics from MongoDB
✅ Beautiful responsive frontend dashboard
✅ Interactive charts and visualizations
✅ Error handling and loading states
✅ TypeScript type safety
✅ Production-ready code

All code follows existing project patterns and integrates seamlessly with the current Klya AI architecture.
