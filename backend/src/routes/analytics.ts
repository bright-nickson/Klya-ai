import express from 'express'
import { getAnalytics, getUserAnalytics, getDashboard, getContentHistory, getContentItem } from '../controllers/analyticsController'
import { protect, authorize } from '../middleware/auth'

const router = express.Router()

// @route   GET /api/analytics
// @desc    Get platform analytics (admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getAnalytics)

// @route   GET /api/analytics/user
// @desc    Get user analytics
// @access  Private
router.get('/user', protect, getUserAnalytics)

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard overview
// @access  Private
router.get('/dashboard', protect, getDashboard)

// @route   GET /api/analytics/content-history
// @desc    Get content generation history
// @access  Private
router.get('/content-history', protect, getContentHistory)

// @route   GET /api/analytics/content/:id
// @desc    Get specific content item
// @access  Private
router.get('/content/:id', protect, getContentItem)

export default router
