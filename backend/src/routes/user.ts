import express from 'express'
import { body } from 'express-validator'
import { getUserProfile, updateUserProfile, getUserUsage, deleteUserAccount, exportUserData } from '../controllers/userController'
import { protect } from '../middleware/auth'

const router = express.Router()

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getUserProfile)

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
  body('firstName').optional().isString().withMessage('First name must be a string'),
  body('lastName').optional().isString().withMessage('Last name must be a string'),
  body('businessName').optional().isString().withMessage('Business name must be a string'),
  body('businessType').optional().isIn([
    'retail', 'restaurant', 'technology', 'healthcare', 'education',
    'finance', 'agriculture', 'manufacturing', 'services', 'other'
  ]).withMessage('Invalid business type'),
  body('location.city').optional().isString().withMessage('City must be a string'),
  body('location.region').optional().isIn([
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Volta', 'Eastern',
    'Northern', 'Upper East', 'Upper West', 'Brong-Ahafo', 'Western North',
    'Ahafo', 'Bono', 'Bono East', 'Oti', 'Savannah', 'North East'
  ]).withMessage('Invalid region'),
  body('preferences.language').optional().isIn(['en', 'tw', 'ga', 'ew', 'ha']).withMessage('Invalid language'),
  body('preferences.emailNotifications').optional().isBoolean().withMessage('Email notifications must be boolean')
], updateUserProfile)

// @route   GET /api/user/usage
// @desc    Get user usage statistics
// @access  Private
router.get('/usage', protect, getUserUsage)

// @route   DELETE /api/user/account
// @desc    Delete user account
// @access  Private
router.delete('/account', protect, deleteUserAccount)

// @route   GET /api/user/data-export
// @desc    Export user data
// @access  Private
router.get('/data-export', protect, exportUserData)

export default router
