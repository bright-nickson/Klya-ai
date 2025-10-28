import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import { MockAuthService } from '../services/mockAuthService'
import mongoose from 'mongoose'

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

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    
    // Check for token in cookies
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    // Make sure token exists
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      })
      return
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
      
      // Get user from token
      let user: any
      if (isMockMode()) {
        user = await MockAuthService.findUserById(decoded.id)
      } else {
        user = await User.findById(decoded.id).select('-password')
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
