import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { paymentService } from '../services/paymentService'
import { subscriptionService } from '../services/subscriptionService'
import { User } from '../models/User'
import { logger } from '../utils/logger'
import { AuthRequest } from '../middleware/auth'

// @desc    Initialize payment transaction
// @route   POST /api/payments/initialize
// @access  Private
export const initializePayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { plan, billingCycle, paymentMethod, mobileMoneyNumber, network } = req.body

    // Validate required fields
    if (!plan || !billingCycle || !paymentMethod) {
      res.status(400).json({
        success: false,
        error: 'Plan, billing cycle, and payment method are required'
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

    // Calculate amount based on plan and billing cycle
    const amount = getPlanAmount(plan, billingCycle)
    
    // Generate transaction ID
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Mock payment initialization (in real implementation, integrate with Paystack)
    const paymentUrl = `https://checkout.paystack.com/mock_${transactionId}`
    
    // Set expiration time (15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    res.status(200).json({
      success: true,
      data: {
        transactionId,
        amount,
        currency: 'GHS',
        status: 'pending',
        paymentUrl,
        expiresAt: expiresAt.toISOString(),
        paymentMethod,
        mobileMoneyNumber,
        network
      },
      message: 'Payment initialized successfully'
    })

    logger.info(`Payment initialized for user ${user.email}: ${transactionId}`, {
      userId: user._id,
      plan,
      billingCycle,
      amount,
      transactionId
    })
  } catch (error) {
    logger.error('Initialize payment error:', error)
    next(error)
  }
}

// @desc    Handle payment webhook
// @route   POST /api/payments/webhook
// @access  Public (with signature verification)
export const handlePaymentWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // In real implementation, verify Paystack signature
    const { event, data } = req.body

    if (event === 'charge.success') {
      const { reference, amount, customer, status } = data

      // Find user by email
      const user = await User.findOne({ email: customer.email })
      if (!user) {
        logger.error('User not found for payment webhook:', customer.email)
        return
      }

      // Update user subscription
      user.subscription.status = 'active'
      user.subscription.startDate = new Date()
      
      // Set end date based on billing cycle (extract from reference or store in transaction)
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1) // Default to monthly
      user.subscription.endDate = endDate

      await user.save()

      logger.info(`Payment successful for user ${user.email}: ${reference}`, {
        userId: user._id,
        amount,
        reference,
        status
      })
    }

    res.status(200).json({
      success: true,
      message: 'Webhook processed'
    })
  } catch (error) {
    logger.error('Payment webhook error:', error)
    next(error)
  }
}

// @desc    Verify payment status
// @route   GET /api/payments/verify/:transactionId
// @access  Private
export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { transactionId } = req.params

    const user = await User.findById(req.user?._id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Mock payment verification (in real implementation, verify with Paystack)
    const paymentStatus = {
      transactionId,
      status: 'success',
      amount: 200,
      currency: 'GHS',
      paidAt: new Date().toISOString(),
      reference: `ref_${transactionId}`
    }

    // If payment is successful, update user subscription
    if (paymentStatus.status === 'success') {
      user.subscription.status = 'active'
      await user.save()
    }

    res.status(200).json({
      success: true,
      data: {
        payment: paymentStatus,
        subscription: user.subscription
      }
    })

    logger.info(`Payment verified for user ${user.email}: ${transactionId}`)
  } catch (error) {
    logger.error('Verify payment error:', error)
    next(error)
  }
}

// Helper functions
function getPlanAmount(plan: string, billingCycle: string): number {
  const prices = {
    starter: {
      monthly: 50,
      annual: 500
    },
    professional: {
      monthly: 200,
      annual: 2000
    },
    enterprise: {
      monthly: 500,
      annual: 5000
    }
  }

  return prices[plan as keyof typeof prices]?.[billingCycle as keyof typeof prices.starter] || 0
}
