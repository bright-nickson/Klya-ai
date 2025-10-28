import express from 'express'
import { body } from 'express-validator'
import { initializePayment, handlePaymentWebhook, verifyPayment } from '../controllers/paymentController'
import { protect } from '../middleware/auth'

const router = express.Router()

// @route   POST /api/payments/initialize
// @desc    Initialize payment transaction
// @access  Private
router.post('/initialize', protect, [
  body('plan').isIn(['starter', 'professional', 'enterprise']).withMessage('Invalid subscription plan'),
  body('billingCycle').isIn(['monthly', 'annual']).withMessage('Invalid billing cycle'),
  body('paymentMethod').isIn(['mobile_money', 'card', 'bank_transfer']).withMessage('Invalid payment method'),
  body('mobileMoneyNumber').optional().matches(/^\+233[0-9]{9}$/).withMessage('Please provide a valid Ghanaian phone number'),
  body('network').optional().isIn(['MTN', 'Vodafone', 'AirtelTigo']).withMessage('Invalid network')
], initializePayment)

// @route   POST /api/payments/webhook
// @desc    Paystack webhook handler
// @access  Public (with signature verification)
router.post('/webhook', handlePaymentWebhook)

// @route   GET /api/payments/verify/:transactionId
// @desc    Verify payment status
// @access  Private
router.get('/verify/:transactionId', protect, verifyPayment)

export default router
