import express from 'express'
import { getDashboardStats, getUserActivity, getUsageAnalytics } from '../controllers/dashboardController'
import { protect } from '../middleware/auth'

const router = express.Router()

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, getDashboardStats)

// @route   GET /api/dashboard/activity
// @desc    Get user activity history
// @access  Private
router.get('/activity', protect, getUserActivity)

// @route   GET /api/dashboard/analytics
// @desc    Get usage analytics
// @access  Private
router.get('/analytics', protect, getUsageAnalytics)

export default router
