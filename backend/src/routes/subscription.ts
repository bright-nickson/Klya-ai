import express from 'express'
import { body } from 'express-validator'
import { getSubscription, getSubscriptionPlans, upgradeSubscription, cancelSubscription } from '../controllers/subscriptionController'
import { protect } from '../middleware/auth'

const router = express.Router()

// @route   GET /api/subscription
// @desc    Get current subscription details
// @access  Private
router.get('/', protect, getSubscription)

// @route   GET /api/subscription/plans
// @desc    Get available subscription plans
// @access  Public
router.get('/plans', getSubscriptionPlans)

// @route   POST /api/subscription/upgrade
// @desc    Upgrade subscription plan
// @access  Private
router.post('/upgrade', protect, [
  body('plan').isIn(['starter', 'professional', 'enterprise']).withMessage('Invalid subscription plan'),
  body('billingCycle').optional().isIn(['monthly', 'annual']).withMessage('Invalid billing cycle'),
  body('paymentMethod').optional().isString().withMessage('Payment method is required')
], upgradeSubscription)

// @route   POST /api/subscription/cancel
// @desc    Cancel subscription
// @access  Private
router.post('/cancel', protect, cancelSubscription)

export default router
