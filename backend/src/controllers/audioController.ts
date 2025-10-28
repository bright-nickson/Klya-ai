import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { openaiService } from '../services/openaiService'
import { User } from '../models/User'
import { logger } from '../utils/logger'
import { AuthRequest } from '../middleware/auth'

// @desc    Transcribe audio file
// @route   POST /api/audio/transcribe
// @access  Private
export const transcribeAudio = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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

    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'Audio file is required'
      })
      return
    }

    const {
      language = 'en',
      responseFormat = 'text'
    } = req.body

    // Check user's subscription limits
    const user = await User.findById(req.user?._id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Check usage limits based on subscription
    const limits = getUserLimits(user.subscription.plan)
    if (user.subscription.usage.audioTranscriptions >= limits.audioTranscriptions && limits.audioTranscriptions !== -1) {
      res.status(403).json({
        success: false,
        error: 'Audio transcription limit reached. Please upgrade your plan.'
      })
      return
    }

    // Check file size (Whisper has a 25MB limit)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (req.file.size > maxSize) {
      res.status(400).json({
        success: false,
        error: 'Audio file too large. Maximum size is 25MB.'
      })
      return
    }

    // Transcribe audio using OpenAI Whisper
    const transcription = await openaiService.transcribeAudio(req.file.buffer, {
      language,
      responseFormat
    })

    // Update user's usage
    user.subscription.usage.audioTranscriptions += 1
    await user.save()

    // Log the transcription
    logger.info(`Audio transcribed for user ${user.email}: ${req.file.originalname}`)

    res.status(200).json({
      success: true,
      data: {
        transcription,
        language,
        responseFormat,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        usage: user.subscription.usage
      }
    })
  } catch (error) {
    logger.error('Audio transcription error:', error)
    next(error)
  }
}

// @desc    Get transcription history
// @route   GET /api/audio/history
// @access  Private
export const getTranscriptionHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // This would typically fetch from a Transcription model
    // For now, we'll return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        history: [],
        total: 0,
        message: 'Transcription history feature coming soon'
      }
    })
  } catch (error) {
    logger.error('Get transcription history error:', error)
    next(error)
  }
}

// @desc    Delete transcription
// @route   DELETE /api/audio/:id
// @access  Private
export const deleteTranscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params

    // This would typically delete from a Transcription model
    // For now, we'll return a placeholder response
    res.status(200).json({
      success: true,
      message: 'Transcription deletion feature coming soon'
    })
  } catch (error) {
    logger.error('Delete transcription error:', error)
    next(error)
  }
}

// Helper functions
function getUserLimits(plan: string) {
  const limits = {
    starter: {
      contentGenerations: 5,
      audioTranscriptions: 1,
      apiCalls: 100
    },
    professional: {
      contentGenerations: -1, // unlimited
      audioTranscriptions: 10,
      apiCalls: 1000
    },
    enterprise: {
      contentGenerations: -1, // unlimited
      audioTranscriptions: -1, // unlimited
      apiCalls: -1 // unlimited
    }
  }
  return limits[plan as keyof typeof limits] || limits.starter
}
