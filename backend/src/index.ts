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

// ✅ Required for Render, Nginx, etc.
app.set('trust proxy', 1)

// ✅ Security headers
app.use(helmet())

// ✅ CORS setup
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://klya-ai.vercel.app', //✅ Your frontend
      'http://localhost:3000',
      'http://localhost:3003',
      process.env.FRONTEND_URL // Optional extra
    ].filter(Boolean)

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`❌ CORS blocked for origin: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

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

// ✅ API routes
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
