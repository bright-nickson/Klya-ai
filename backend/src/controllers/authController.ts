import { Response, NextFunction } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'

// Extend SignOptions to include audience
interface CustomSignOptions extends SignOptions {
  audience?: string | string[];
  issuer?: string;
}
import { validationResult } from 'express-validator'
import { User, IUser } from '../models/User'
import { logger } from '../utils/logger'
import { AuthRequest } from '../middleware/auth'
import { MockAuthService } from '../services/mockAuthService'
import mongoose from 'mongoose'

type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  profilePicture?: string;
  phoneNumber?: string;
  businessName?: string;
  businessType?: string;
  onboardingCompleted: boolean;
  location?: any;
  preferences?: any;
  subscription?: {
    plan?: string;
    status?: string;
    usage?: any;
  };
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

// Rate limiting store
const loginAttempts = new Map<string, { attempts: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

/**
 * Check if the application is running in mock mode
 */
const isMockMode = (): boolean => {
  return process.env.NODE_ENV === 'test' || 
         mongoose.connection.readyState === 0 || 
         process.env.USE_MOCK === 'true';
}

/**
 * Generate a JWT token for the given user ID
 */
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error('JWT_SECRET is not defined');
    throw new Error('Server configuration error');
  }
  
  // Set default expiration to 30 days
  const jwtExpire = process.env.JWT_EXPIRE || '30d';

  const options = {
    expiresIn: jwtExpire as string,
    algorithm: 'HS256',
    issuer: 'klya-ai',
    audience: 'klya-ai-web',
  };
  
  return jwt.sign({ id }, secret, options as SignOptions);
};

/**
 * Prepare user data for response (exclude sensitive fields)
 */
const prepareUserResponse = (user: any): UserResponse => {
  return {
    id: user._id?.toString() || user.id,
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
    subscription: user.subscription ? {
      plan: user.subscription.plan,
      status: user.subscription.status,
      usage: user.subscription.usage
    } : undefined,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

/**
 * Validate password strength
 */
const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { firstName, lastName, email, password, businessName, businessType, phoneNumber, location } = req.body;

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      res.status(400).json({
        success: false,
        error: 'Password validation failed',
        details: passwordValidation.errors.map(msg => ({
          field: 'password',
          message: msg
        }))
      });
      return;
    }

    let user: any;

    if (isMockMode()) {
      const existingUser = await MockAuthService.findUserByEmail(email);
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
        return;
      }

      user = await MockAuthService.createUser({
        firstName,
        lastName,
        email,
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        businessName,
        businessType,
        phoneNumber,
        location: location || { country: 'Ghana' }
      });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
        return;
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
      });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Set HTTP-only cookie with cross-origin support
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    const userResponse = prepareUserResponse(user);

    res.status(201).json({
      success: true,
      user: userResponse,
      token
    });

    logger.info(`New user registered: ${email}`);
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Check rate limiting
    const now = Date.now();
    const userAttempts = loginAttempts.get(email) || { attempts: 0, lastAttempt: 0 };
    
    if (now - userAttempts.lastAttempt > LOGIN_ATTEMPT_WINDOW) {
      userAttempts.attempts = 0;
    }
    
    if (userAttempts.attempts >= MAX_LOGIN_ATTEMPTS) {
      const retryAfter = Math.ceil((userAttempts.lastAttempt + LOGIN_ATTEMPT_WINDOW - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      res.status(429).json({
        success: false,
        error: 'Too many login attempts. Please try again later.',
        retryAfter: `${retryAfter} seconds`
      });
      return;
    }

    let user: any;
    let isMatch = false;

    if (isMockMode()) {
      user = await MockAuthService.findUserByEmail(email);
      if (user) {
        isMatch = await MockAuthService.comparePassword(password, user.password);
      }
    } else {
      user = await User.findOne({ email }).select('+password');
      if (user) {
        isMatch = await user.comparePassword(password);
      }
    }

    if (!user || !isMatch) {
      // Update login attempts
      userAttempts.attempts++;
      userAttempts.lastAttempt = now;
      loginAttempts.set(email, userAttempts);
      
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact support.'
      });
      return;
    }

    // Reset login attempts on successful login
    loginAttempts.delete(email);

    // Update last login
    user.lastLogin = new Date();
    if (!isMockMode()) {
      await user.save();
    } else {
      await MockAuthService.updateUser(user._id.toString(), { lastLogin: new Date() });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    const userResponse = prepareUserResponse(user);

    res.status(200).json({
      success: true,
      user: userResponse,
      token
    });

    logger.info(`User logged in: ${email}`);
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

/**
 * Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });

    logger.info(`User logged out: ${req.user?.email}`);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
};

/**
 * Get current user
 * @route GET /api/auth/me
 * @access Public (returns null if not authenticated)
 */
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?._id) {
      logger.debug('No authenticated user in /api/auth/me request');
      res.status(200).json({
        success: false,
        user: null,
        message: 'Not authenticated'
      });
      return;
    }

    const userId = req.user._id.toString();
    let user: any = null;

    if (isMockMode()) {
      logger.debug(`Using mock data for user ${userId}`);
      user = await MockAuthService.findUserById(userId);
    } else {
      user = await User.findById(userId)
        .select('-password -__v')
        .lean()
        .exec();
    }

    if (!user) {
      logger.warn(`User not found: ${userId}`);
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    logger.info(`User data retrieved for: ${user.email}`);

    const userData = prepareUserResponse(user);

    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    // Define allowed fields
    const allowedFields = [
      'firstName', 'lastName', 'businessName', 'businessType',
      'phoneNumber', 'location', 'preferences'
    ];

    // Build updates object
    const updates: any = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Handle preferences merge
    if (updates.preferences && typeof updates.preferences === 'object') {
      const currentUser = await User.findById(userId);
      if (currentUser) {
        updates.preferences = { ...currentUser.preferences, ...updates.preferences };
      }
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    const userResponse = prepareUserResponse(user);

    res.status(200).json({
      success: true,
      user: userResponse
    });

    logger.info(`User profile updated: ${user.email}`);
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};

/**
 * Change user password
 * @route PUT /api/auth/change-password
 * @access Private
 */
export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      res.status(400).json({
        success: false,
        error: 'New password does not meet requirements',
        details: passwordValidation.errors.map(msg => ({
          field: 'newPassword',
          message: msg
        }))
      });
      return;
    }

    // Find user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
      return;
    }

    // Check if new password is different
    if (currentPassword === newPassword) {
      res.status(400).json({
        success: false,
        error: 'New password must be different from current password'
      });
      return;
    }

    // Update password
    user.password = newPassword;
    if (user.schema.path('passwordChangedAt')) {
      (user as any).passwordChangedAt = new Date();
    }
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    next(error);
  }
};