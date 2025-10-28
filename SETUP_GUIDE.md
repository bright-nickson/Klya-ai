# 🚀 AfriGrowth AI - Complete Setup Guide

## 📋 System Requirements

- **Node.js**: v18.19.1+ ✅ (Installed)
- **npm**: v9.2.0+ ✅ (Installed)
- **Docker**: v28.2.2+ ✅ (Installed)
- **MongoDB**: v7.0+ (Will be installed via Docker)

## 🎯 Quick Start

### 1. Install Dependencies

```bash
# Backend dependencies (already installed)
cd backend && npm install

# Frontend dependencies (already installed)
cd frontend && npm install
```

### 2. Start Database Services

```bash
# Start MongoDB
sudo docker run -d --name afrigrowth-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -e MONGO_INITDB_DATABASE=afrigrowth-ai \
  mongo:7.0

# Start Redis (optional, for caching)
sudo docker run -d --name afrigrowth-redis \
  -p 6379:6379 \
  redis:7.2-alpine
```

### 3. Configure Environment Variables

The environment files have been created with default values. Update them with your actual API keys:

**Backend (.env)**:
```bash
# Update these with your actual API keys
OPENAI_API_KEY=your-openai-api-key-here
HUGGINGFACE_API_KEY=your-huggingface-api-key-here
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

**Frontend (.env.local)**:
```bash
# Already configured with default values
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### 5. Test the System

```bash
# Run API tests
node test-api.js
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Documentation**: See `docs/API.md`

## 📊 Current Status

### ✅ Completed
- [x] Backend API implementation (100% complete)
- [x] Frontend build configuration
- [x] TypeScript compilation
- [x] Environment configuration
- [x] API test suite
- [x] All 37 documented endpoints implemented

### 🔄 In Progress
- [ ] MongoDB connection setup
- [ ] API key configuration
- [ ] End-to-end testing

### 📝 Next Steps
1. **Start MongoDB** using Docker command above
2. **Configure API keys** in environment files
3. **Run the development servers**
4. **Test all endpoints** using the test script

## 🧪 Testing

### API Testing
```bash
# Run comprehensive API tests
node test-api.js
```

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test subscription plans
curl http://localhost:3001/api/subscription/plans

# Test user registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Kwame",
    "lastName": "Mensah",
    "email": "kwame@example.com",
    "password": "TestPass123!",
    "businessName": "Kwame Fashion"
  }'
```

## 🐳 Docker Deployment (Production)

```bash
# Build and start all services
sudo docker-compose up -d

# View logs
sudo docker-compose logs -f

# Stop services
sudo docker-compose down
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo docker ps | grep mongo

# Check MongoDB logs
sudo docker logs afrigrowth-mongodb

# Restart MongoDB
sudo docker restart afrigrowth-mongodb
```

### Port Conflicts
```bash
# Check what's using port 3001
sudo lsof -i :3001

# Kill process if needed
sudo kill -9 <PID>
```

### Permission Issues
```bash
# Add user to docker group (if needed)
sudo usermod -aG docker $USER
# Then logout and login again
```

## 📚 API Documentation

The complete API documentation is available in `docs/API.md` with:
- 37 endpoints across 8 categories
- Authentication & authorization
- Request/response examples
- Error codes and handling
- Rate limiting information
- Ghana-specific features

## 🎉 Success Criteria

Your system is ready when:
1. ✅ Backend compiles without errors
2. ✅ Frontend builds successfully
3. ✅ MongoDB is running and accessible
4. ✅ API test suite passes
5. ✅ Frontend loads at http://localhost:3000
6. ✅ Backend health check responds at http://localhost:3001/health

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the logs: `sudo docker logs afrigrowth-mongodb`
3. Verify environment variables are set correctly
4. Ensure all ports (3000, 3001, 27017) are available

---

**Ready to launch! 🚀**
