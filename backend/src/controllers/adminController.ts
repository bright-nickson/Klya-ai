import { Response, NextFunction } from 'express'
import { User } from '../models/User'
import { logger } from '../utils/logger'
import { AuthRequest } from '../middleware/auth'

// @desc    Get all users (enhanced for admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAdminUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 50, plan, search } = req.query
    
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Build query
    let query: any = {}
    
    if (plan) {
      query['subscription.plan'] = plan
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)

    const totalUsers = await User.countDocuments(query)
    const totalPages = Math.ceil(totalUsers / limitNum)

    // Format user data for admin view
    const formattedUsers = users.map(user => ({
      id: user._id,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      subscription: {
        plan: user.subscription.plan,
        status: user.subscription.status
      },
      usage: {
        contentGenerations: user.subscription.usage.contentGenerations,
        transcriptionSeconds: user.subscription.usage.audioTranscriptions
      },
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }))

    res.status(200).json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: totalUsers
        }
      }
    })
  } catch (error) {
    logger.error('Get admin users error:', error)
    next(error)
  }
}

// @desc    Get system-wide metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
export const getSystemMetrics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    
    // Get new users this month
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const newThisMonth = await User.countDocuments({ createdAt: { $gte: thisMonth } })

    // Get users by subscription plan
    const subscriptionStats = await User.aggregate([
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 }
        }
      }
    ])

    // Calculate total usage
    const totalUsage = await User.aggregate([
      {
        $group: {
          _id: null,
          totalContentGenerations: { $sum: '$subscription.usage.contentGenerations' },
          totalTranscriptionSeconds: { $sum: '$subscription.usage.audioTranscriptions' },
          totalImagesGenerated: { $sum: '$subscription.usage.imageGenerations' }
        }
      }
    ])

    // Mock today's usage (in real implementation, this would be tracked separately)
    const todayUsage = {
      contentGenerationsToday: 2340,
      transcriptionSecondsToday: 18000,
      imagesGeneratedToday: 450
    }

    // Mock revenue data (in real implementation, integrate with payment system)
    const revenue = {
      monthly: 85400,
      annual: 950000,
      currency: 'GHS'
    }

    // Mock performance metrics
    const performance = {
      avgResponseTime: 280,
      errorRate: 0.003,
      uptime: 0.997
    }

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth
        },
        subscriptions: {
          starter: subscriptionStats.find(s => s._id === 'starter')?.count || 0,
          professional: subscriptionStats.find(s => s._id === 'professional')?.count || 0,
          enterprise: subscriptionStats.find(s => s._id === 'enterprise')?.count || 0
        },
        usage: {
          ...todayUsage,
          total: totalUsage[0] || {
            totalContentGenerations: 0,
            totalTranscriptionSeconds: 0,
            totalImagesGenerated: 0
          }
        },
        revenue,
        performance
      }
    })
  } catch (error) {
    logger.error('Get system metrics error:', error)
    next(error)
  }
}

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private/Admin
export const getSystemLogs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { level = 'info', limit = 100 } = req.query
    
    // Mock system logs (in real implementation, this would come from a logging service)
    const logs = [
      {
        id: 'log_001',
        level: 'info',
        message: 'User registration successful',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        userId: 'user_123',
        ip: '192.168.1.1'
      },
      {
        id: 'log_002',
        level: 'error',
        message: 'Failed to process payment',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        userId: 'user_456',
        ip: '192.168.1.2',
        error: 'Payment gateway timeout'
      },
      {
        id: 'log_003',
        level: 'warn',
        message: 'Rate limit exceeded',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        userId: 'user_789',
        ip: '192.168.1.3'
      }
    ]

    // Filter by level if specified
    let filteredLogs = logs
    if (level && level !== 'all') {
      filteredLogs = logs.filter(log => log.level === level)
    }

    // Limit results
    const limitedLogs = filteredLogs.slice(0, parseInt(limit as string))

    res.status(200).json({
      success: true,
      data: {
        logs: limitedLogs,
        total: filteredLogs.length
      }
    })
  } catch (error) {
    logger.error('Get system logs error:', error)
    next(error)
  }
}

// @desc    Broadcast notification to users
// @route   POST /api/admin/broadcast
// @access  Private/Admin
export const broadcastNotification = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, message, targetUsers, notificationType = 'info' } = req.body

    // Validate required fields
    if (!title || !message) {
      res.status(400).json({
        success: false,
        error: 'Title and message are required'
      })
      return
    }

    // Mock broadcast (in real implementation, integrate with notification service)
    const broadcastId = `broadcast_${Date.now()}`
    
    // In real implementation, you would:
    // 1. Save notification to database
    // 2. Send push notifications
    // 3. Send emails if configured
    // 4. Send SMS if configured

    res.status(200).json({
      success: true,
      data: {
        broadcastId,
        title,
        message,
        targetUsers: targetUsers || 'all',
        notificationType,
        sentAt: new Date().toISOString(),
        status: 'sent'
      },
      message: 'Notification broadcasted successfully'
    })

    logger.info(`Admin broadcast sent: ${title}`, { 
      adminId: req.user?._id, 
      broadcastId,
      targetUsers: targetUsers || 'all'
    })
  } catch (error) {
    logger.error('Broadcast notification error:', error)
    next(error)
  }
}
