import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import { MockAuthService } from '../services/mockAuthService'
import mongoose from 'mongoose'
import { logger } from '../utils/logger'

export interface AuthRequest extends Request {
  user?: IUser
}

// Check if we're in mock mode
const isMockMode = (): boolean => {
  return mongoose.connection.readyState === 0 || process.env.NODE_ENV === 'development'
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined

    // Check for token in headers (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    
    // Check for token in cookies
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token
    }
    
    // Check for token in query params (for email verification links, etc.)
    if (!token && req.query.token) {
      token = req.query.token as string
    }

    // Make sure token exists
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Not authorized to access this route. No authentication token found.'
      })
      return
    }

    try {
      if (!process.env.JWT_SECRET) {
        logger.error('JWT_SECRET is not defined')
        throw new Error('Server configuration error')
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string }
      
      // Get user from token
      let user: IUser | null = null
      
      if (isMockMode()) {
        const mockUser = await MockAuthService.findUserById(decoded.id)
        if (mockUser) {
          // Convert plain object to Mongoose document
          user = new User(mockUser)
        }
      } else {
        user = await User.findById(decoded.id).select('-password')
      }
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not found or no longer exists'
        })
        return
      }
      
      // Check if user is active
      if (!user.isActive) {
        res.status(403).json({
          success: false,
          error: 'Account is deactivated. Please contact support.'
        })
        return
      }
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'No user found with this token'
        })
        return
      }

      req.user = user
      next()
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      })
      return
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
}

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      })
      return
    }

    next()
  }
}
