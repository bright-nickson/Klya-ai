import { Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { subscriptionService } from '../services/subscriptionService'
import { User } from '../models/User'
import { logger } from '../utils/logger'
import { AuthRequest } from '../middleware/auth'

// @desc    Get current subscription details
// @route   GET /api/subscription
// @access  Private
export const getSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id?.toString()
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      })
      return
    }

    // Get user with subscription data
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Return user's subscription data
    const subscriptionData = {
      currentPlan: user.subscription.plan,
      status: user.subscription.status,
      startDate: user.subscription.startDate,
      endDate: user.subscription.endDate,
      usage: user.subscription.usage
    }

    res.status(200).json({
      success: true,
      data: subscriptionData
    })
  } catch (error) {
    logger.error('Get subscription error:', error)
    next(error)
  }
}

// @desc    Get available subscription plans
// @route   GET /api/subscription/plans
// @access  Public
export const getSubscriptionPlans = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plans = subscriptionService.getPlans()

    res.status(200).json({
      success: true,
      data: {
        plans
      }
    })
  } catch (error) {
    logger.error('Get subscription plans error:', error)
    next(error)
  }
}

// @desc    Upgrade subscription plan
// @route   POST /api/subscription/upgrade
// @access  Private
export const upgradeSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { plan, billingCycle, paymentMethod } = req.body

    // Validate plan
    if (!['starter', 'professional', 'enterprise'].includes(plan)) {
      res.status(400).json({
        success: false,
        error: 'Invalid subscription plan'
      })
      return
    }

    const user = await User.findById(req.user?._id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // For now, simulate upgrade (in real implementation, integrate with payment gateway)
    user.subscription.plan = plan
    user.subscription.status = 'pending_payment'
    user.subscription.startDate = new Date()
    
    // Set end date based on billing cycle
    const endDate = new Date()
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1)
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }
    user.subscription.endDate = endDate

    await user.save()

    // Generate payment URL (mock for now)
    const paymentUrl = `https://checkout.paystack.com/mock_payment_${Date.now()}`

    res.status(200).json({
      success: true,
      data: {
        subscription: {
          plan: user.subscription.plan,
          status: user.subscription.status
        },
        paymentUrl
      },
      message: 'Redirecting to payment gateway'
    })

    logger.info(`Subscription upgrade initiated for user ${user.email}: ${plan}`)
  } catch (error) {
    logger.error('Upgrade subscription error:', error)
    next(error)
  }
}

// @desc    Cancel subscription
// @route   POST /api/subscription/cancel
// @access  Private
export const cancelSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    user.subscription.status = 'cancelled'
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully'
    })

    logger.info(`Subscription cancelled for user ${user.email}`)
  } catch (error) {
    logger.error('Cancel subscription error:', error)
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

function getBillingCycle(plan: string): string {
  return 'monthly' // Default to monthly for now
}

function getPlanPrice(plan: string) {
  const prices = {
    starter: { amount: 50, currency: 'GHS', symbol: '₵' },
    professional: { amount: 200, currency: 'GHS', symbol: '₵' },
    enterprise: { amount: 500, currency: 'GHS', symbol: '₵' }
  }
  return prices[plan as keyof typeof prices] || prices.starter
}
