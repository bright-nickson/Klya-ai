import express from 'express'
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/userController'
import { protect, authorize } from '../middleware/auth'

const router = express.Router()

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getUsers)

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private
router.get('/:id', protect, getUser)

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', protect, updateUser)

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteUser)

export default router
