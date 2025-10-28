import { Response, NextFunction } from 'express'
import { User } from '../models/User'
import { logger } from '../utils/logger'
import { AuthRequest } from '../middleware/auth'

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    })
  } catch (error) {
    logger.error('Get users error:', error)
    next(error)
  }
}

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password')

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    logger.error('Get user error:', error)
    next(error)
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Check if user is updating their own profile or is admin
    if (user._id.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Not authorized to update this user'
      })
      return
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password')

    res.status(200).json({
      success: true,
      data: updatedUser
    })

    logger.info(`User updated: ${user.email}`)
  } catch (error) {
    logger.error('Update user error:', error)
    next(error)
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    })

    logger.info(`User deleted: ${user.email}`)
  } catch (error) {
    logger.error('Delete user error:', error)
    next(error)
  }
}

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-password')
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    res.status(200).json({
      success: true,
      data: {
        profile: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          businessName: user.businessName,
          businessType: user.businessType,
          location: user.location,
          preferences: user.preferences,
          subscription: user.subscription,
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    logger.error('Get user profile error:', error)
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id)
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password')

    res.status(200).json({
      success: true,
      data: {
        profile: updatedUser
      },
      message: 'Profile updated successfully'
    })

    logger.info(`User profile updated: ${user.email}`)
  } catch (error) {
    logger.error('Update user profile error:', error)
    next(error)
  }
}

// @desc    Get user usage statistics
// @route   GET /api/user/usage
// @access  Private
export const getUserUsage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id)
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    const usage = user.subscription.usage
    const limits = getUserLimits(user.subscription.plan)

    res.status(200).json({
      success: true,
      data: {
        usage: {
          contentGenerations: {
            daily: {
              used: usage.contentGenerations,
              limit: limits.contentGenerations === -1 ? 'unlimited' : limits.contentGenerations,
              remaining: limits.contentGenerations === -1 ? 'unlimited' : limits.contentGenerations - usage.contentGenerations
            },
            monthly: {
              used: usage.contentGenerations,
              limit: limits.contentGenerations === -1 ? 'unlimited' : limits.contentGenerations
            }
          },
          transcriptionSeconds: {
            used: usage.audioTranscriptions,
            limit: limits.audioTranscriptions === -1 ? 'unlimited' : limits.audioTranscriptions,
            remaining: limits.audioTranscriptions === -1 ? 'unlimited' : limits.audioTranscriptions - usage.audioTranscriptions,
            resetAt: getNextMonthReset()
          },
          imageGenerations: {
            daily: {
              used: usage.imageGenerations || 0,
              limit: limits.imageGenerations === -1 ? 'unlimited' : limits.imageGenerations,
              remaining: limits.imageGenerations === -1 ? 'unlimited' : (limits.imageGenerations || 0) - (usage.imageGenerations || 0)
            }
          }
        },
        subscription: {
          plan: user.subscription.plan,
          status: user.subscription.status
        }
      }
    })
  } catch (error) {
    logger.error('Get user usage error:', error)
    next(error)
  }
}

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
export const deleteUserAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id)
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Soft delete by deactivating account
    user.isActive = false
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    })

    logger.info(`User account deleted: ${user.email}`)
  } catch (error) {
    logger.error('Delete user account error:', error)
    next(error)
  }
}

// @desc    Export user data
// @route   GET /api/user/data-export
// @access  Private
export const exportUserData = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-password')
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    const userData = {
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        businessName: user.businessName,
        businessType: user.businessType,
        location: user.location,
        preferences: user.preferences
      },
      subscription: user.subscription,
      account: {
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        isActive: user.isActive,
        emailVerified: user.emailVerified
      },
      exportedAt: new Date().toISOString()
    }

    res.status(200).json({
      success: true,
      data: userData,
      message: 'User data exported successfully'
    })

    logger.info(`User data exported: ${user.email}`)
  } catch (error) {
    logger.error('Export user data error:', error)
    next(error)
  }
}

// Helper functions
function getUserLimits(plan: string) {
  const limits = {
    starter: {
      contentGenerations: 5,
      audioTranscriptions: 60,
      imageGenerations: 3,
      apiCalls: 100
    },
    professional: {
      contentGenerations: -1, // unlimited
      audioTranscriptions: 600,
      imageGenerations: 20,
      apiCalls: 1000
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

function getNextMonthReset(): string {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return nextMonth.toISOString()
}
