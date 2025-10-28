import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { openaiService } from '../services/openaiService'
import { huggingFaceService } from '../services/huggingFaceService'
import { subscriptionService } from '../services/subscriptionService'
import { User } from '../models/User'
import { Content } from '../models/Content'
import { Usage } from '../models/Usage'
import { logger } from '../utils/logger'
import { AuthRequest } from '../middleware/auth'

// @desc    Generate AI content
// @route   POST /api/content/generate
// @access  Private
export const generateContent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
      prompt,
      type,
      language = 'en',
      tone = 'professional',
      maxTokens = 1000,
      temperature = 0.7
    } = req.body

    // Check user's subscription limits
    const userId = req.user?._id?.toString()
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      })
      return
    }

    // Check usage limits using subscription service
    const usageCheck = await subscriptionService.checkUsageLimit(userId, 'contentGenerations')
    if (!usageCheck.allowed) {
      res.status(403).json({
        success: false,
        error: 'Content generation limit reached. Please upgrade your plan.',
        usage: usageCheck
      })
      return
    }

    // Enhance prompt based on content type
    const enhancedPrompt = enhancePromptForType(prompt, type, language)

    // Generate content using OpenAI
    const content = await openaiService.generateContent(enhancedPrompt, {
      language,
      tone,
      maxTokens,
      temperature
    })

    // Save content to database
    const savedContent = new Content({
      userId,
      title: `${type} - ${new Date().toLocaleDateString()}`,
      content,
      type,
      language,
      prompt,
      aiModel: 'gpt-3.5-turbo',
      tokensUsed: Math.ceil(content.length / 4), // Rough estimate
      metadata: {
        wordCount: content.split(' ').length,
        readingTime: Math.ceil(content.split(' ').length / 200)
      }
    })
    await savedContent.save()

    // Update usage tracking
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let usage = await Usage.findOne({ userId, date: today })
    if (!usage) {
      usage = new Usage({ userId, date: today })
    }
    
    usage.contentGenerations.push({
      count: 1,
      tokens: savedContent.tokensUsed,
      language,
      type
    })
    usage.totalTokensUsed += savedContent.tokensUsed
    await usage.save()

    // Log the generation
    logger.info(`Content generated for user ${userId}: ${type}`)

    res.status(200).json({
      success: true,
      data: {
        id: savedContent._id,
        content,
        type,
        language,
        tone,
        tokensUsed: savedContent.tokensUsed,
        remaining: usageCheck.remaining - 1
      }
    })
  } catch (error) {
    logger.error('Content generation error:', error)
    next(error)
  }
}

// @desc    Generate AI image
// @route   POST /api/content/image
// @access  Private
export const generateImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
      prompt,
      size = '512x512',
      quality = 'standard',
      style = 'natural'
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

    // Check usage limits
    const limits = getUserLimits(user.subscription.plan)
    if (user.subscription.usage.contentGenerations >= limits.contentGenerations) {
      res.status(403).json({
        success: false,
        error: 'Image generation limit reached. Please upgrade your plan.'
      })
      return
    }

    // Generate image using OpenAI
    const imageUrl = await openaiService.generateImage(prompt, {
      size,
      quality,
      style
    })

    // Update user's usage
    user.subscription.usage.contentGenerations += 1
    await user.save()

    logger.info(`Image generated for user ${user.email}`)

    res.status(200).json({
      success: true,
      data: {
        imageUrl,
        prompt,
        size,
        quality,
        style,
        usage: user.subscription.usage
      }
    })
  } catch (error) {
    logger.error('Image generation error:', error)
    next(error)
  }
}

// @desc    Summarize text
// @route   POST /api/content/summarize
// @access  Private
export const summarizeText = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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

    const { text, maxLength = 150 } = req.body

    // Summarize using Hugging Face
    const summary = await huggingFaceService.summarizeText(text, maxLength)

    logger.info(`Text summarized for user ${req.user?.email}`)

    res.status(200).json({
      success: true,
      data: {
        originalText: text,
        summary,
        maxLength
      }
    })
  } catch (error) {
    logger.error('Text summarization error:', error)
    next(error)
  }
}

// @desc    Analyze text sentiment
// @route   POST /api/content/sentiment
// @access  Private
export const analyzeSentiment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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

    const { text, language = 'en' } = req.body

    // Analyze sentiment using Hugging Face
    const sentiment = await huggingFaceService.analyzeSentiment(text, language)

    logger.info(`Sentiment analyzed for user ${req.user?.email}`)

    res.status(200).json({
      success: true,
      data: {
        text,
        sentiment,
        language
      }
    })
  } catch (error) {
    logger.error('Sentiment analysis error:', error)
    next(error)
  }
}

// @desc    Get content generation history
// @route   GET /api/content/history
// @access  Private
export const getContentHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id?.toString()
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      })
      return
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const type = req.query.type as string
    const skip = (page - 1) * limit

    // Build query
    const query: any = { userId }
    if (type) {
      query.type = type
    }

    // Get content with pagination
    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content') // Exclude full content for list view

    const total = await Content.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        content,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    logger.error('Get content history error:', error)
    next(error)
  }
}

// @desc    Delete content item
// @route   DELETE /api/content/:id
// @access  Private
export const deleteContent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params

    // This would typically delete from a Content model
    // For now, we'll return a placeholder response
    res.status(200).json({
      success: true,
      message: 'Content deletion feature coming soon'
    })
  } catch (error) {
    logger.error('Delete content error:', error)
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

function enhancePromptForType(prompt: string, type: string, language: string): string {
  const typeEnhancements = {
    blog: 'Write a comprehensive blog post for Ghanaian readers: ',
    social: 'Create engaging social media content for Ghanaian audience: ',
    email: 'Write a professional email for Ghanaian business context: ',
    ad: 'Create compelling advertisement copy for Ghanaian market: ',
    product: 'Write product description for Ghanaian customers: ',
    custom: 'Create content for Ghanaian business: '
  }

  const enhancement = typeEnhancements[type as keyof typeof typeEnhancements] || typeEnhancements.custom
  return `${enhancement}${prompt}`
}
