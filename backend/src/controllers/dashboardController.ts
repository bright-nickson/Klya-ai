import { Response } from 'express'
import { User } from '../models/User'
import { AuthRequest } from '../middleware/auth'
import { MockAuthService } from '../services/mockAuthService'
import mongoose from 'mongoose'

// Check if we're in mock mode
const isMockMode = (): boolean => {
  return mongoose.connection.readyState === 0 || process.env.NODE_ENV === 'development'
}

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      })
      return
    }

    const userId = req.user._id.toString()
    let user: any

    if (isMockMode()) {
      user = await MockAuthService.findUserById(userId)
    } else {
      user = await User.findById(userId)
    }

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Calculate stats
    const totalGenerations = user.subscription.usage.contentGenerations
    const todayGenerations = Math.floor(Math.random() * 10) // Mock data - replace with actual logic
    const successRate = totalGenerations > 0 ? Math.floor(85 + Math.random() * 15) : 0
    const activeProjects = Math.floor(Math.random() * 5) + 1 // Mock data

    // Generate recent activity (mock data - replace with actual activity tracking)
    const recentActivity = [
      {
        action: 'Generated blog post',
        type: 'Blog Post',
        language: 'English',
        status: 'success',
        time: '2 hours ago'
      },
      {
        action: 'Created social media content',
        type: 'Social Media',
        language: 'Twi',
        status: 'success',
        time: '5 hours ago'
      },
      {
        action: 'Generated product description',
        type: 'Product Description',
        language: 'English',
        status: 'success',
        time: '1 day ago'
      }
    ]

    res.json({
      success: true,
      stats: {
        totalGenerations,
        todayGenerations,
        successRate,
        activeProjects
      },
      recentActivity
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats'
    })
    return
  }
}

// @desc    Get user activity history
// @route   GET /api/dashboard/activity
// @access  Private
export const getUserActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      })
      return
    }

    const userId = req.user._id.toString()
    let user: any

    if (isMockMode()) {
      user = await MockAuthService.findUserById(userId)
    } else {
      user = await User.findById(userId)
    }

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Mock activity data - in production, this would come from an Activity model
    const activities = [
      {
        id: '1',
        type: 'content_generation',
        action: 'Generated blog post about African entrepreneurship',
        contentType: 'Blog Post',
        language: 'English',
        status: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        metadata: {
          wordCount: 850,
          tokensUsed: 1200
        }
      },
      {
        id: '2',
        type: 'translation',
        action: 'Translated marketing content to Twi',
        contentType: 'Marketing Copy',
        language: 'Twi',
        status: 'success',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        metadata: {
          wordCount: 320,
          tokensUsed: 450
        }
      },
      {
        id: '3',
        type: 'content_generation',
        action: 'Created social media posts',
        contentType: 'Social Media',
        language: 'English',
        status: 'success',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          wordCount: 180,
          tokensUsed: 250
        }
      },
      {
        id: '4',
        type: 'audio_transcription',
        action: 'Transcribed customer interview',
        contentType: 'Audio Transcription',
        language: 'English',
        status: 'success',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          duration: 1800,
          wordCount: 2400
        }
      }
    ]

    res.json({
      success: true,
      data: activities
    })
  } catch (error) {
    console.error('Get user activity error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user activity'
    })
    return
  }
}

// @desc    Get usage analytics
// @route   GET /api/dashboard/analytics
// @access  Private
export const getUsageAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      })
      return
    }

    const userId = req.user._id.toString()
    let user: any

    if (isMockMode()) {
      user = await MockAuthService.findUserById(userId)
    } else {
      user = await User.findById(userId)
    }

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Get plan limits
    const limits = getUserLimits(user.subscription.plan)

    // Mock weekly data - in production, this would come from analytics tracking
    const weeklyUsage = [
      { day: 'Mon', generations: 12, transcriptions: 2, images: 1 },
      { day: 'Tue', generations: 8, transcriptions: 1, images: 0 },
      { day: 'Wed', generations: 15, transcriptions: 3, images: 2 },
      { day: 'Thu', generations: 10, transcriptions: 1, images: 1 },
      { day: 'Fri', generations: 18, transcriptions: 4, images: 3 },
      { day: 'Sat', generations: 5, transcriptions: 0, images: 0 },
      { day: 'Sun', generations: 7, transcriptions: 1, images: 1 }
    ]

    // Language distribution
    const languageDistribution = [
      { language: 'English', count: 45, percentage: 60 },
      { language: 'Twi', count: 20, percentage: 27 },
      { language: 'Ga', count: 7, percentage: 9 },
      { language: 'Ewe', count: 3, percentage: 4 }
    ]

    // Content type distribution
    const contentTypeDistribution = [
      { type: 'Blog Posts', count: 25, percentage: 33 },
      { type: 'Social Media', count: 30, percentage: 40 },
      { type: 'Marketing Copy', count: 15, percentage: 20 },
      { type: 'Product Descriptions', count: 5, percentage: 7 }
    ]

    res.json({
      success: true,
      data: {
        currentUsage: {
          contentGenerations: user.subscription.usage.contentGenerations,
          audioTranscriptions: user.subscription.usage.audioTranscriptions,
          imageGenerations: user.subscription.usage.imageGenerations,
          apiCalls: user.subscription.usage.apiCalls
        },
        limits: {
          contentGenerations: limits.contentGenerations === -1 ? 'unlimited' : limits.contentGenerations,
          audioTranscriptions: limits.audioTranscriptions === -1 ? 'unlimited' : limits.audioTranscriptions,
          imageGenerations: limits.imageGenerations === -1 ? 'unlimited' : limits.imageGenerations,
          apiCalls: limits.apiCalls === -1 ? 'unlimited' : limits.apiCalls
        },
        weeklyUsage,
        languageDistribution,
        contentTypeDistribution,
        plan: user.subscription.plan,
        planStatus: user.subscription.status
      }
    })
  } catch (error) {
    console.error('Get usage analytics error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch usage analytics'
    })
    return
  }
}

// Helper function to get user limits based on plan
function getUserLimits(plan: string) {
  const limits = {
    starter: {
      contentGenerations: 50,
      audioTranscriptions: 300,
      imageGenerations: 10,
      apiCalls: 500
    },
    professional: {
      contentGenerations: -1, // unlimited
      audioTranscriptions: 1800,
      imageGenerations: 50,
      apiCalls: 5000
    },
    enterprise: {
      contentGenerations: -1, // unlimited
      audioTranscriptions: -1, // unlimited
      imageGenerations: -1, // unlimited
      apiCalls: -1 // unlimited
    }
  }
  return limits[plan as keyof typeof limits] || limits.starter
}

export const completeOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      })
      return
    }

    const onboardingData = req.body
    const userId = req.user._id.toString()

    let user: any

    if (isMockMode()) {
      // Fetch user from mock service
      user = await MockAuthService.findUserById(userId)
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        })
        return
      }

      // Update user with onboarding data
      const updateData: any = {
        onboardingCompleted: true,
        onboardingData
      }

      // Update preferences based on onboarding
      if (onboardingData.preferredLanguages && onboardingData.preferredLanguages.length > 0) {
        updateData.preferences = {
          ...user.preferences,
          language: onboardingData.preferredLanguages[0]
        }
      }

      user = await MockAuthService.updateUser(userId, updateData)
    } else {
      // Fetch the latest user data from database
      user = await User.findById(userId)

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        })
        return
      }

      // Update user with onboarding data
      user.onboardingCompleted = true
      user.onboardingData = onboardingData

      // Update preferences based on onboarding
      if (onboardingData.preferredLanguages && onboardingData.preferredLanguages.length > 0) {
        user.preferences.language = onboardingData.preferredLanguages[0]
      }

      await user.save()
    }

    // Return updated user data
    const userResponse = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      businessName: user.businessName,
      businessType: user.businessType,
      phoneNumber: user.phoneNumber,
      onboardingCompleted: user.onboardingCompleted,
      location: user.location,
      preferences: user.preferences,
      subscription: {
        plan: user.subscription.plan,
        status: user.subscription.status,
        usage: user.subscription.usage
      },
      lastLogin: user.lastLogin
    }

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      user: userResponse
    })
  } catch (error) {
    console.error('Onboarding completion error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to complete onboarding'
    })
    return
  }
}
