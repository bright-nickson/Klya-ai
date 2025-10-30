import mongoose from 'mongoose'
import { logger } from './logger'

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/KLYA-ai'
    
    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options
    })

    logger.info(`📦 MongoDB Connected: ${conn.connection.host}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected')
    })

  } catch (error) {
    logger.warn('⚠️ MongoDB not available, running in development mode without database')
    logger.info('🚀 Server will start with mock authentication for development')
    // Don't exit in development mode
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
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
