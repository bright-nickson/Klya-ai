import { Request, Response, NextFunction } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import { User, IUser } from '../models/User'
import { logger } from '../utils/logger'
import { AuthRequest } from '../middleware/auth'
import { MockAuthService } from '../services/mockAuthService'
import mongoose from 'mongoose'

// Check if we're in mock mode (MongoDB not available)
const isMockMode = (): boolean => {
  return mongoose.connection.readyState === 0 || process.env.NODE_ENV === 'development'
}

// Generate JWT Token
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET as string
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }
  
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  } as SignOptions)
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
      return
    }

    const {
      firstName,
      lastName,
      email,
      password,
      businessName,
      businessType,
      phoneNumber,
      location
    } = req.body

    let user: any

    if (isMockMode()) {
      // Use mock service
      const existingUser = await MockAuthService.findUserByEmail(email)
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        })
        return
      }

      user = await MockAuthService.createUser({
        firstName,
        lastName,
        email,
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // Mock hash
        businessName,
        businessType,
        phoneNumber,
        location: location || { country: 'Ghana' }
      })
    } else {
      // Use MongoDB
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        })
        return
      }

      user = await User.create({
        firstName,
        lastName,
        email,
        password,
        businessName,
        businessType,
        phoneNumber,
        location: location || { country: 'Ghana' }
      })
    }

    // Generate token
    const token = generateToken(user._id.toString())

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    })

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        businessType: user.businessType,
        phoneNumber: user.phoneNumber,
        onboardingCompleted: user.onboardingCompleted || false,
        location: user.location,
        preferences: user.preferences,
        subscription: {
          plan: user.subscription?.plan,
          status: user.subscription?.status,
          usage: user.subscription?.usage
        }
      }
    })

    logger.info(`New user registered: ${email}`)
  } catch (error) {
    logger.error('Registration error:', error)
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
      return
    }

    const { email, password } = req.body

    let user: any
    let isMatch = false

    if (isMockMode()) {
      // Use mock service
      user = await MockAuthService.findUserByEmail(email)
      if (user) {
        isMatch = await MockAuthService.comparePassword(password, user.password)
      }
    } else {
      // Use MongoDB
      user = await User.findOne({ email }).select('+password')
      if (user) {
        isMatch = await user.comparePassword(password)
      }
    }

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
      return
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact support.'
      })
      return
    }

    // Check password
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
      return
    }

    // Update last login
    user.lastLogin = new Date()
    if (!isMockMode()) {
      await user.save()
    } else {
      await MockAuthService.updateUser(user._id.toString(), { lastLogin: new Date() })
    }

    // Generate token
    const token = generateToken(user._id.toString())

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    })

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        businessType: user.businessType,
        phoneNumber: user.phoneNumber,
        onboardingCompleted: user.onboardingCompleted || false,
        location: user.location,
        preferences: user.preferences,
        subscription: {
          plan: user.subscription?.plan,
          status: user.subscription?.status,
          usage: user.subscription?.usage
        },
        lastLogin: user.lastLogin
      }
    })

    logger.info(`User logged in: ${email}`)
  } catch (error) {
    logger.error('Login error:', error)
    next(error)
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    })

    logger.info(`User logged out: ${req.user?.email}`)
  } catch (error) {
    logger.error('Logout error:', error)
    next(error)
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let user: any

    if (isMockMode()) {
      user = await MockAuthService.findUserById(req.user?._id?.toString() || '')
    } else {
      user = await User.findById(req.user?._id)
    }
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        profilePicture: user.profilePicture,
        phoneNumber: user.phoneNumber,
        businessName: user.businessName,
        businessType: user.businessType,
        onboardingCompleted: user.onboardingCompleted || false,
        location: user.location,
        preferences: user.preferences,
        subscription: {
          plan: user.subscription?.plan,
          status: user.subscription?.status,
          usage: user.subscription?.usage
        },
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  } catch (error) {
    logger.error('Get user error:', error)
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
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

    // Update fields
    const allowedUpdates = [
      'firstName', 'lastName', 'businessName', 'businessType', 
      'phoneNumber', 'location', 'preferences'
    ]
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'preferences' && typeof req.body[field] === 'object') {
          // Merge preferences object
          user.preferences = { ...user.preferences, ...req.body[field] }
        } else {
          (user as any)[field] = req.body[field]
        }
      }
    })

    await user.save()

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        businessType: user.businessType,
        location: user.location,
        preferences: user.preferences,
        subscription: user.subscription
      }
    })

    logger.info(`User profile updated: ${user.email}`)
  } catch (error) {
    logger.error('Update profile error:', error)
    next(error)
  }
}

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
      return
    }

    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id).select('+password')
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      })
      return
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    })

    logger.info(`Password changed for user: ${user.email}`)
  } catch (error) {
    logger.error('Change password error:', error)
    next(error)
  }
}
