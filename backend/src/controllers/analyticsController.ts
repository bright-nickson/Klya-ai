import { Response, NextFunction } from 'express'
import { User } from '../models/User'
import { Content } from '../models/Content'
import { Usage } from '../models/Usage'
import { subscriptionService } from '../services/subscriptionService'
import { logger } from '../utils/logger'
import { AuthRequest } from '../middleware/auth'

// @desc    Get platform analytics
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments()
    
    // Get users by subscription plan
    const usersByPlan = await User.aggregate([
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 }
        }
      }
    ])

    // Get users by region
    const usersByRegion = await User.aggregate([
      {
        $group: {
          _id: '$location.region',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])

    // Get users by business type
    const usersByBusinessType = await User.aggregate([
      {
        $group: {
          _id: '$businessType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    })

    // Get active users (logged in within last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: sevenDaysAgo }
    })

    // Calculate total usage across all users
    const totalUsage = await User.aggregate([
      {
        $group: {
          _id: null,
          totalContentGenerations: { $sum: '$subscription.usage.contentGenerations' },
          totalAudioTranscriptions: { $sum: '$subscription.usage.audioTranscriptions' },
          totalApiCalls: { $sum: '$subscription.usage.apiCalls' }
        }
      }
    ])

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          recentUsers,
          activeUsers
        },
        subscription: {
          byPlan: usersByPlan
        },
        geography: {
          byRegion: usersByRegion
        },
        business: {
          byType: usersByBusinessType
        },
        usage: totalUsage[0] || {
          totalContentGenerations: 0,
          totalAudioTranscriptions: 0,
          totalApiCalls: 0
        }
      }
    })
  } catch (error) {
    logger.error('Get analytics error:', error)
    next(error)
  }
}

// @desc    Get user analytics
// @route   GET /api/analytics/user
// @access  Private
export const getUserAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id)
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Get user's usage statistics
    const usage = user.subscription.usage

    // Calculate usage percentage based on plan limits
    const limits = getUserLimits(user.subscription.plan)
    const usagePercentage = {
      contentGenerations: limits.contentGenerations === -1 
        ? 0 
        : Math.round((usage.contentGenerations / limits.contentGenerations) * 100),
      audioTranscriptions: limits.audioTranscriptions === -1 
        ? 0 
        : Math.round((usage.audioTranscriptions / limits.audioTranscriptions) * 100),
      apiCalls: limits.apiCalls === -1 
        ? 0 
        : Math.round((usage.apiCalls / limits.apiCalls) * 100)
    }

    // Get account age
    const accountAge = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          businessName: user.businessName,
          subscription: user.subscription
        },
        usage: {
          current: usage,
          limits: limits,
          percentage: usagePercentage
        },
        account: {
          age: accountAge,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    logger.error('Get user analytics error:', error)
    next(error)
  }
}

// Helper functions
// @desc    Get dashboard overview
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { period = 'month' } = req.query
    
    // Calculate date range based on period
    const dateRange = getDateRange(period as string)
    
    // Get user's usage for the period
    const user = await User.findById(req.user?._id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Mock content history (in real implementation, this would come from a Content model)
    const contentHistory = [
      {
        id: 'cont_abc123',
        contentType: 'blog_post',
        topic: 'Mobile Money benefits',
        language: 'en',
        wordCount: 850,
        excerpt: 'Mobile Money has revolutionized financial services...',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'cont_def456',
        contentType: 'social_media',
        topic: 'Business tips',
        language: 'tw',
        wordCount: 150,
        excerpt: 'Akwaaba! Here are some business tips...',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    res.status(200).json({
      success: true,
      data: {
        period,
        dateRange,
        overview: {
          contentGenerated: user.subscription.usage.contentGenerations,
          audioTranscribed: user.subscription.usage.audioTranscriptions,
          imagesCreated: user.subscription.usage.imageGenerations || 0,
          totalApiCalls: user.subscription.usage.apiCalls
        },
        contentBreakdown: {
          blog_post: contentHistory.filter(c => c.contentType === 'blog_post').length,
          social_media: contentHistory.filter(c => c.contentType === 'social_media').length,
          email: 0,
          ad_copy: 0,
          product_description: 0
        },
        languageUsage: {
          en: contentHistory.filter(c => c.language === 'en').length,
          tw: contentHistory.filter(c => c.language === 'tw').length,
          ga: 0,
          ee: 0,
          ha: 0
        },
        trends: {
          contentGenerationTrend: '+25%',
          transcriptionTrend: '+12%'
        }
      }
    })
  } catch (error) {
    logger.error('Get dashboard error:', error)
    next(error)
  }
}

// @desc    Get content generation history
// @route   GET /api/analytics/content-history
// @access  Private
export const getContentHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 20, contentType, sortBy = 'createdAt' } = req.query
    
    const pageNum = parseInt(page as string)
    const limitNum = Math.min(parseInt(limit as string), 100)
    const skip = (pageNum - 1) * limitNum

    // Mock content history with pagination
    let contentHistory = [
      {
        id: 'cont_abc123',
        contentType: 'blog_post',
        topic: 'Mobile Money benefits',
        language: 'en',
        wordCount: 850,
        excerpt: 'Mobile Money has revolutionized financial services in Ghana...',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'cont_def456',
        contentType: 'social_media',
        topic: 'Business tips',
        language: 'tw',
        wordCount: 150,
        excerpt: 'Akwaaba! Here are some business tips for entrepreneurs...',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'cont_ghi789',
        contentType: 'email',
        topic: 'Newsletter welcome',
        language: 'en',
        wordCount: 300,
        excerpt: 'Welcome to our newsletter! We\'re excited to have you...',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Filter by contentType if provided
    if (contentType) {
      contentHistory = contentHistory.filter(c => c.contentType === contentType)
    }

    // Sort content
    if (sortBy === 'wordCount') {
      contentHistory.sort((a, b) => b.wordCount - a.wordCount)
    } else {
      contentHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Paginate
    const paginatedContent = contentHistory.slice(skip, skip + limitNum)
    const totalItems = contentHistory.length
    const totalPages = Math.ceil(totalItems / limitNum)

    res.status(200).json({
      success: true,
      data: {
        content: paginatedContent,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    })
  } catch (error) {
    logger.error('Get content history error:', error)
    next(error)
  }
}

// @desc    Get specific content item
// @route   GET /api/analytics/content/:id
// @access  Private
export const getContentItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params

    // Mock content item (in real implementation, fetch from database)
    const contentItem = {
      id,
      contentType: 'blog_post',
      topic: 'Mobile Money benefits in Ghana',
      language: 'en',
      wordCount: 850,
      content: 'Mobile Money has revolutionized financial services in Ghana, providing accessible banking to millions of people who previously had no access to formal financial institutions...',
      metadata: {
        tone: 'professional',
        generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        processingTime: 8200
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }

    res.status(200).json({
      success: true,
      data: {
        content: contentItem
      }
    })
  } catch (error) {
    logger.error('Get content item error:', error)
    next(error)
  }
}

// Helper functions
function getUserLimits(plan: string) {
  const limits = {
    starter: {
      contentGenerations: 5,
      audioTranscriptions: 1,
      apiCalls: 100
    },
    professional: {
      contentGenerations: -1, // unlimited
      audioTranscriptions: 10,
      apiCalls: 1000
    },
    enterprise: {
      contentGenerations: -1, // unlimited
      audioTranscriptions: -1, // unlimited
      apiCalls: -1 // unlimited
    }
  }
  return limits[plan as keyof typeof limits] || limits.starter
}

function getDateRange(period: string) {
  const now = new Date()
  const start = new Date()

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      break
    case 'week':
      start.setDate(now.getDate() - 7)
      break
    case 'month':
      start.setMonth(now.getMonth() - 1)
      break
    case 'year':
      start.setFullYear(now.getFullYear() - 1)
      break
    default:
      start.setMonth(now.getMonth() - 1)
  }

  return {
    start: start.toISOString(),
    end: now.toISOString()
  }
}
