# Quick Start Guide - Enhanced Dashboard

## Running the Application

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
Backend will run on `http://localhost:3001`

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`

## Testing the New Features

### Onboarding Flow
1. Register a new account at `/register`
2. After registration, you'll automatically see the onboarding flow
3. Complete all 6 steps:
   - Select your purpose(s)
   - Choose age range
   - Select business size
   - Pick your industry
   - Define your goals
   - Choose languages and content types
4. Click "Complete" to finish

**Skip Option:** You can click "Skip for now" at any step to go directly to the dashboard

### Enhanced Dashboard
Navigate to `/dashboard` to see:

**Key Features to Test:**
- View your stats cards (Total Generations, Today's Activity, Success Rate, Active Projects)
- Check the Recent Activity feed
- Click Quick Action buttons:
  - "Create Content" → Goes to AI Generator
  - "Detect Language" → Goes to Language Detection
  - "View Analytics" → Goes to Analytics page
  - "Settings" → Goes to Settings
- View your Achievements (unlock by generating content)
- Check Usage Overview progress bars

### Analytics Page
Navigate to `/dashboard/analytics` to see:

**Features to Test:**
- Time period selector buttons (7, 30, 90 days, Custom)
- Content generation trend chart
- Language distribution breakdown
- Content type statistics
- Peak usage times heatmap
- Export button (UI only - needs backend implementation)
- Filter button (UI only - needs backend implementation)

### History Page
Navigate to `/dashboard/history` to see:

**Features to Test:**
- Search bar (type to filter content)
- Content type filter dropdown
- View all generated content with:
  - Status indicators (success/error)
  - Timestamps
  - Word counts
  - Preview text
- Action buttons on each item:
  - View (eye icon)
  - Copy (copy icon)
  - Download (download icon)
  - Delete (trash icon)
- Pagination controls at bottom

### AI Generator
Navigate to `/dashboard/ai-generator` to:

**Features to Test:**
- Select content type from dropdown
- Enter a prompt
- Click "Generate Content"
- View generated content
- Copy to clipboard
- Download as file
- Check "Recent Generations" list

### Settings
Navigate to `/dashboard/settings` to:

**Features to Test:**
- **Profile Tab:**
  - Update name, business info, phone, city
  - Click "Save Changes"
- **Security Tab:**
  - Change password
  - Enter current and new password
  - Click "Update Password"
- **Notifications Tab:**
  - Toggle notification preferences
- **Billing Tab:**
  - View current plan
  - Check usage progress
  - View upgrade options

## Navigation Testing

### Sidebar (Desktop)
Click each menu item:
- Dashboard → `/dashboard`
- AI Generator → `/dashboard/ai-generator`
- Analytics → `/dashboard/analytics`
- History → `/dashboard/history`
- Settings → `/dashboard/settings`

### Mobile Menu
1. Resize browser to mobile width (< 1024px)
2. Click hamburger menu icon (top left)
3. Sidebar slides in from left
4. Click any menu item
5. Sidebar automatically closes

### User Menu
- Click theme toggle (sun/moon icon) to switch dark/light mode
- View user info in top right
- Click "Sign out" in sidebar to logout

## Dark Mode Testing

1. Click the sun/moon icon in the top right
2. Verify all pages switch between light and dark mode:
   - Dashboard
   - Analytics
   - History
   - AI Generator
   - Settings
3. Check that theme persists on page refresh

## Responsive Design Testing

Test on different screen sizes:

**Mobile (< 640px):**
- Hamburger menu appears
- Stats cards stack vertically
- Tables scroll horizontally
- Buttons stack vertically

**Tablet (640px - 1024px):**
- 2-column grid for stats
- Sidebar toggles with hamburger
- Comfortable spacing

**Desktop (> 1024px):**
- Sidebar always visible
- 4-column grid for stats
- Full-width charts
- Optimal spacing

## API Endpoints to Test

### Onboarding
```bash
# Complete onboarding
curl -X POST http://localhost:3001/api/auth/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "purpose": ["business", "content"],
    "ageRange": "25-34",
    "businessSize": "small",
    "industry": "technology",
    "goals": ["increase-sales", "content-creation"],
    "preferredLanguages": ["en", "tw"],
    "contentTypes": ["blog", "social"]
  }'
```

### Dashboard Stats
```bash
# Get dashboard statistics
curl http://localhost:3001/api/dashboard/stats \
  -H "Cookie: token=YOUR_TOKEN"
```

### User Profile
```bash
# Get current user
curl http://localhost:3001/api/auth/me \
  -H "Cookie: token=YOUR_TOKEN"
```

## Common Issues & Solutions

### Issue: Onboarding doesn't show
**Solution:** Check that `onboardingCompleted` is `false` in the user document

### Issue: Dashboard stats show 0
**Solution:** Generate some content in AI Generator first, or check backend connection

### Issue: Dark mode doesn't persist
**Solution:** Clear browser cache and cookies, then try again

### Issue: Navigation doesn't work
**Solution:** Ensure Next.js dev server is running and check console for errors

### Issue: API calls fail
**Solution:** 
1. Check backend is running on port 3001
2. Verify CORS settings allow localhost:3000
3. Check browser console for specific errors

## Browser Testing

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Checklist

- [ ] Dashboard loads in < 2 seconds
- [ ] Navigation is instant
- [ ] Charts render smoothly
- [ ] No console errors
- [ ] Images load properly
- [ ] Animations are smooth (60fps)

## Accessibility Testing

- [ ] Tab navigation works through all elements
- [ ] Form inputs have labels
- [ ] Buttons have descriptive text
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader can navigate (test with NVDA/JAWS)

## Feature Completion Status

### ✅ Completed
- Onboarding flow (6 steps)
- Enhanced dashboard with stats
- Analytics page with charts
- History page with search/filter
- Updated navigation
- Dark mode support
- Responsive design
- All buttons functional
- User profile updates
- Settings management

### 🚧 Needs Backend Integration
- Real activity tracking
- Actual usage statistics
- Content history from database
- Export functionality
- Advanced filtering
- Real-time notifications

### 💡 Future Enhancements
- WebSocket for real-time updates
- Advanced analytics (custom date ranges)
- Team collaboration features
- Content templates
- AI-powered recommendations
- Bulk operations
- Advanced search

## Support

If you encounter any issues:
1. Check the console for errors
2. Verify all environment variables are set
3. Ensure database connection is working
4. Check that all dependencies are installed
5. Review the DASHBOARD_ENHANCEMENT_SUMMARY.md for detailed information

## Next Steps

1. **Test all features** using this guide
2. **Report any bugs** you find
3. **Integrate real data** from backend
4. **Deploy to staging** environment
5. **Gather user feedback**
6. **Iterate and improve**

Happy testing! 🚀
