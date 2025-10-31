import mongoose from 'mongoose'
import { logger } from './logger'

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/KLYA-ai'
  
  const options = {
    serverSelectionTimeoutMS: 5000,  // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000,         // Close sockets after 45s of inactivity
    family: 4,                      // Use IPv4, skip trying IPv6
    maxPoolSize: 10,                // Maintain up to 10 socket connections
  }

  try {
    logger.info('🔌 Attempting to connect to MongoDB...')
    
    const conn = await mongoose.connect(mongoURI, options)
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`)
    
    // Handle connection events
    mongoose.connection.on('connecting', () => {
      logger.info('🔌 Connecting to MongoDB...')
    })

    mongoose.connection.on('connected', () => {
      logger.info('✅ MongoDB connected successfully')
    })

    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('♻️ MongoDB reconnected')
    })

    mongoose.connection.on('disconnecting', () => {
      logger.info('🛑 MongoDB disconnecting...')
    })

    mongoose.connection.on('close', () => {
      logger.info('❌ MongoDB connection closed')
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error('❌ Failed to connect to MongoDB:', errorMessage)
    
    // In production, we want to fail fast if we can't connect to the database
    if (process.env.NODE_ENV === 'production') {
      logger.error('💥 Fatal: Could not connect to MongoDB in production')
      process.exit(1)
    } else {
      logger.warn('⚠️ Running in development mode without database connection')
      // In development, we might want to continue with mock data
    }
    
    // Re-throw the error so the calling function knows the connection failed
    throw error
  }
}

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close()
    logger.info('MongoDB connection closed')
  } catch (error) {
    logger.error('Error closing database connection:', error)
  }
}
