import express from 'express'
import { body } from 'express-validator'
import { getAdminUsers, getSystemMetrics, getSystemLogs, broadcastNotification } from '../controllers/adminController'
import { protect, authorize } from '../middleware/auth'

const router = express.Router()

// All admin routes require admin role
router.use(protect)
router.use(authorize('admin'))

// @route   GET /api/admin/users
// @desc    List all users (enhanced for admin)
// @access  Private/Admin
router.get('/users', getAdminUsers)

// @route   GET /api/admin/metrics
// @desc    Get system-wide metrics
// @access  Private/Admin
router.get('/metrics', getSystemMetrics)

// @route   GET /api/admin/logs
// @desc    Get system logs
// @access  Private/Admin
router.get('/logs', getSystemLogs)

// @route   POST /api/admin/broadcast
// @desc    Broadcast notification to users
// @access  Private/Admin
router.post('/broadcast', [
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('targetUsers').optional().isString().withMessage('Target users must be a string'),
  body('notificationType').optional().isIn(['info', 'warning', 'success', 'error']).withMessage('Invalid notification type')
], broadcastNotification)

export default router
