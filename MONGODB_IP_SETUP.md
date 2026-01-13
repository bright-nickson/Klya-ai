# MongoDB Atlas IP Whitelist Setup

## 🚨 The Problem

Your MongoDB Atlas cluster is blocking your IP address. You need to **whitelist it**.

## ✅ How to Fix (3 Steps)

### Step 1: Get Your Current IP

Run this command to find your IP:

```bash
curl https://api.ipify.org?format=json
```

You'll see output like:
```json
{"ip":"203.45.67.89"}
```

**Copy this IP address** - you'll need it in the next step.

---

### Step 2: Add IP to MongoDB Atlas Whitelist

1. Go to **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. Log in with your account
3. Click on your **"KLYA-AI"** cluster
4. Go to **Security** → **Network Access** (left sidebar)
5. Click **"+ Add IP Address"** button
6. Paste your IP from Step 1 in the textbox
7. Click **"Confirm"**

**OR** to allow all IPs (less secure but easier for testing):
- In the same Network Access page
- Click **"+ Add IP Address"**
- Enter: `0.0.0.0/0` (this allows all IPs)
- Click **"Confirm"**

---

### Step 3: Wait 1-2 Minutes

MongoDB takes a moment to apply the whitelist. Wait 1-2 minutes, then run:

```bash
cd /home/bright-nickson/Klya-ai/backend
npm run setup:admin
```

---

## 📋 What the Setup Script Does

When you run `npm run setup:admin`, it will:

✅ **Connect to MongoDB** (now that IP is whitelisted)
✅ **Create database indexes** for better performance
✅ **Create admin user** with:
   - Email: `admin@klya.ai`
   - Password: `Admin@123456`
   - Role: `admin`
   - Plan: `enterprise`
✅ **Show you user statistics**
✅ **Give you next steps**

---

## 🔧 Alternative: Use 0.0.0.0/0 for Development

If you want faster setup and are in development:

1. Add `0.0.0.0/0` to Network Access (allows all IPs)
2. Run `npm run setup:admin`
3. After setup, remove `0.0.0.0/0` and add only your specific IP

⚠️ **WARNING:** Don't use `0.0.0.0/0` in production!

---

## 🆘 Still Getting Connection Errors?

If you still see connection errors after 2 minutes, try:

1. **Refresh the MongoDB Atlas page** (sometimes the UI doesn't update)
2. **Wait another minute** and try again
3. **Check if your IP is correct** - it might have changed
4. **Create a new IP** - sometimes the old one expires

---

## ✨ After Setup

Once you see this message, you're ready:

```
✅ Setup completed successfully!

🚀 NEXT STEPS:
1. Start the backend:  npm run dev:backend
2. Start the frontend: npm run dev:frontend
3. Login at: http://localhost:3000/login
4. Use email: admin@klya.ai
5. Use password: Admin@123456
6. Access dashboard at: http://localhost:3000/dashboard/admin
```

---

## 📝 Document These Credentials

Save this somewhere safe:

```
Admin Email:    admin@klya.ai
Admin Password: Admin@123456
Dashboard URL:  http://localhost:3000/dashboard/admin
```

⚠️ **Change the password after your first login!**

---

## 🎯 Quick Summary

| Step | Action | Command |
|------|--------|---------|
| 1 | Get IP | `curl https://api.ipify.org?format=json` |
| 2 | Add to whitelist | Go to MongoDB Atlas → Network Access → Add IP |
| 3 | Wait | 1-2 minutes |
| 4 | Setup admin | `cd backend && npm run setup:admin` |
| 5 | Start backend | `npm run dev:backend` |
| 6 | Start frontend | `npm run dev:frontend` |
| 7 | Login | Visit `http://localhost:3000/login` |
| 8 | Access dashboard | Visit `http://localhost:3000/dashboard/admin` |

---

**Ready? Let's go! 🚀**
