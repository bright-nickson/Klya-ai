import dotenv from 'dotenv'

// Load environment variables early
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

import { connectDB } from './utils/database'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

// Import routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import userProfileRoutes from './routes/user'
import contentRoutes from './routes/content'
import audioRoutes from './routes/audio'
import analyticsRoutes from './routes/analytics'
import subscriptionRoutes from './routes/subscription'
import adminRoutes from './routes/admin'
import paymentRoutes from './routes/payments'
import aiRoutes from './routes/ai'
import dashboardRoutes from './routes/dashboard'

const app = express()
const PORT = process.env.PORT || 3001

// ✅ Enhanced proxy configuration
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

// ✅ Security headers
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for now to prevent errors
}))

// ✅ CORS setup with enhanced logging
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = new Set([
      'https://klya-ai.vercel.app',
      'http://localhost:3000',
      'http://localhost:3003'
    ])
    
    // Add FRONTEND_URL if it exists
    if (process.env.FRONTEND_URL) {
      allowedOrigins.add(process.env.FRONTEND_URL)
    }
    
    const allowedOriginsArray = Array.from(allowedOrigins).filter(Boolean)

    // Log all incoming origins for debugging
    console.log('Incoming origin:', origin)
    console.log('Allowed origins:', allowedOriginsArray)

    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) {
      console.log('No origin, allowing request')
      return callback(null, true)
    }

    if (allowedOriginsArray.includes(origin)) {
      console.log(`✅ Allowed origin: ${origin}`)
      return callback(null, true)
    }

    console.warn(`❌ CORS blocked for origin: ${origin}`)
    callback(new Error(`Not allowed by CORS. Origin: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}

app.use(cors(corsOptions))

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log('\n=== New Request ===')
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  console.log('Headers:', req.headers)
  console.log('IP:', req.ip)
  console.log('IPs:', req.ips)
  console.log('X-Forwarded-For:', req.headers['x-forwarded-for'])
  next()
})

// ✅ Rate limiter to protect backend
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// ✅ Body parsing & cookies
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// ✅ Compression & logging
app.use(compression())
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }))

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// ✅ API routes (standardized under /api prefix)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/user', userProfileRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/audio', audioRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/dashboard', dashboardRoutes)

// ✅ Error handling
app.use(notFound)
app.use(errorHandler)

// ✅ Start the server
const startServer = async () => {
  try {
    await connectDB()
    logger.info('✅ MongoDB connected successfully')

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`🌍 Health check: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}/health`)
    })
  } catch (error) {
    logger.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// ✅ Global error handlers
process.on('unhandledRejection', (err: Error) => {
  logger.error('💥 Unhandled Promise Rejection:', err)
  process.exit(1)
})

process.on('uncaughtException', (err: Error) => {
  logger.error('💥 Uncaught Exception:', err)
  process.exit(1)
})

startServer()

export default app
