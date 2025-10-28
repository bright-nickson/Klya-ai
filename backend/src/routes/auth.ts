import express from 'express'
import { body } from 'express-validator'
import { register, login, logout, getMe, updateProfile, changePassword } from '../controllers/authController'
import { completeOnboarding } from '../controllers/dashboardController'
import { protect } from '../middleware/auth'

const router = express.Router()

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('businessName').optional().isString(),
  body('businessType').optional().isIn([
    'startup', 'small-business', 'enterprise', 'freelancer', 'creator',
    'retail', 'restaurant', 'technology', 'healthcare', 'education',
    'finance', 'agriculture', 'manufacturing', 'services', 'other'
  ]),
  body('phoneNumber').optional().matches(/^\+233[0-9]{9}$/).withMessage('Please provide a valid Ghanaian phone number'),
  body('location.city').optional().isString(),
  body('location.region').optional().isIn([
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Volta', 'Eastern',
    'Northern', 'Upper East', 'Upper West', 'Brong-Ahafo', 'Western North',
    'Ahafo', 'Bono', 'Bono East', 'Oti', 'Savannah', 'North East'
  ])
], register)

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login)

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logout)

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe)

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
  body('firstName').optional().isString().trim(),
  body('lastName').optional().isString().trim(),
  body('businessName').optional().isString().trim(),
  body('businessType').optional().isIn([
    'startup', 'small-business', 'enterprise', 'freelancer', 'creator',
    'retail', 'restaurant', 'technology', 'healthcare', 'education',
    'finance', 'agriculture', 'manufacturing', 'services', 'other'
  ]),
  body('phoneNumber').optional().matches(/^\+233[0-9]{9}$/).withMessage('Please provide a valid Ghanaian phone number'),
  body('location.city').optional().isString().trim(),
  body('location.region').optional().isIn([
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Volta', 'Eastern',
    'Northern', 'Upper East', 'Upper West', 'Brong-Ahafo', 'Western North',
    'Ahafo', 'Bono', 'Bono East', 'Oti', 'Savannah', 'North East'
  ]),
  body('preferences.language').optional().isIn(['en', 'tw', 'ga', 'ew', 'ha']),
  body('preferences.theme').optional().isIn(['light', 'dark', 'auto']),
  body('preferences.notifications.email').optional().isBoolean(),
  body('preferences.notifications.push').optional().isBoolean(),
  body('preferences.notifications.sms').optional().isBoolean()
], updateProfile)

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], changePassword)

// @route   POST /api/auth/onboarding
// @desc    Complete user onboarding
// @access  Private
router.post('/onboarding', protect, completeOnboarding)

export default router
