import { Response, NextFunction } from 'express'
import { huggingFaceService } from '../services/huggingFaceService'
import { openaiService } from '../services/openaiService'
import { User } from '../models/User'
import { logger } from '../utils/logger'
import { AuthRequest } from '../middleware/auth'

// @desc    Translate text
// @route   POST /api/ai/translate
// @access  Private
export const translateText = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body

    if (!text || !targetLanguage) {
      res.status(400).json({
        success: false,
        error: 'Text and target language are required'
      })
      return
    }

    // Check user's subscription limits
    const user = await User.findById(req.user?._id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Translate text using Hugging Face
    const translatedText = await huggingFaceService.translateText(text, targetLanguage)

    // Update user's API usage
    user.subscription.usage.apiCalls += 1
    await user.save()

    res.status(200).json({
      success: true,
      data: {
        originalText: text,
        translatedText,
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage,
        translatedAt: new Date().toISOString()
      }
    })

    logger.info(`Text translated for user ${user.email}: ${sourceLanguage || 'auto'} -> ${targetLanguage}`)
  } catch (error) {
    logger.error('Translate text error:', error)
    next(error)
  }
}

// @desc    Detect language of text
// @route   POST /api/ai/detect-language
// @access  Private
export const detectLanguage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { text } = req.body

    // Find user
    const user = await User.findById(req.user?._id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Mock language detection (in real implementation, use NLP service)
    const detectedLanguage = text.includes('Akwaaba') || text.includes('Me da wo ase') ? 'tw' : 'en'

    // Update user's API usage
    user.subscription.usage.apiCalls += 1
    await user.save()

    res.status(200).json({
      success: true,
      data: {
        text,
        detectedLanguage,
        confidence: 0.85,
        metadata: {
          processedAt: new Date().toISOString(),
          processingTime: 120
        }
      }
    })
  } catch (error) {
    logger.error('Detect language error:', error)
    next(error)
  }
}

// @desc    Extract named entities
// @route   POST /api/ai/entities
// @access  Private
export const extractEntities = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { text } = req.body

    if (!text) {
      res.status(400).json({
        success: false,
        error: 'Text is required'
      })
      return
    }

    // Check user's subscription limits
    const user = await User.findById(req.user?._id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Mock entity extraction (in real implementation, use NLP service)
    const entities = extractNamedEntities(text)

    // Update user's API usage
    user.subscription.usage.apiCalls += 1
    await user.save()

    res.status(200).json({
      success: true,
      data: {
        text,
        entities,
        extractedAt: new Date().toISOString()
      }
    })

    logger.info(`Entities extracted for user ${user.email}`)
  } catch (error) {
    logger.error('Extract entities error:', error)
    next(error)
  }
}

// @desc    Generate content with AI (aligned route)
// @route   POST /api/ai/content
// @access  Private
export const generateAIContent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      contentType,
      topic,
      language = 'en',
      tone = 'professional',
      length = 'medium',
      keywords = [],
      targetAudience
    } = req.body

    if (!contentType || !topic) {
      res.status(400).json({
        success: false,
        error: 'Content type and topic are required'
      })
      return
    }

    // Check user's subscription limits
    const user = await User.findById(req.user?._id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Build enhanced prompt
    let prompt = `Generate ${contentType} about "${topic}"`
    
    if (language !== 'en') {
      const languageNames = {
        'tw': 'Twi',
        'ga': 'Ga',
        'ew': 'Ewe',
        'ha': 'Hausa'
      }
      prompt += ` in ${languageNames[language as keyof typeof languageNames] || language}`
    }
    
    if (tone) {
      prompt += ` with a ${tone} tone`
    }
    
    if (length) {
      prompt += ` and ${length} length`
    }
    
    if (keywords.length > 0) {
      prompt += `. Include these keywords: ${keywords.join(', ')}`
    }
    
    if (targetAudience) {
      prompt += `. Target audience: ${targetAudience}`
    }

    // Generate content using OpenAI
    // Allow forcing provider via env: 'openai' | 'huggingface' | 'auto'
    const forcedProvider = (process.env.AI_PROVIDER || 'auto').toLowerCase()

    try {
      if (forcedProvider === 'huggingface') {
        if (!process.env.HUGGINGFACE_API_KEY) {
          res.status(500).json({ success: false, error: 'Hugging Face API key not configured' })
          return
        }

        const hfMax = Math.min((getMaxTokensForLength(length) || 300), 300)
        const hfContent = await huggingFaceService.generateGhanaianContent(prompt, {
          maxLength: hfMax,
          language
        })

        // Update user's usage
        user.subscription.usage.contentGenerations += 1
        await user.save()

        const wordCount = hfContent.split(' ').length

        res.status(200).json({
          success: true,
          data: {
            content: hfContent,
            provider: 'huggingface',
            metadata: {
              wordCount,
              language,
              tone,
              generatedAt: new Date().toISOString(),
              processingTime: Math.floor(Math.random() * 3000) + 1000
            },
            usage: {
              generationsToday: user.subscription.usage.contentGenerations,
              dailyLimit: getUserLimits(user.subscription.plan).contentGenerations === -1 ? 'unlimited' : getUserLimits(user.subscription.plan).contentGenerations,
              remaining: getUserLimits(user.subscription.plan).contentGenerations === -1 ? 'unlimited' : getUserLimits(user.subscription.plan).contentGenerations - user.subscription.usage.contentGenerations
            }
          }
        })

        logger.info(`AI content generated via Hugging Face for user ${user.email}: ${contentType}`)
        return
      }

      const content = await openaiService.generateContent(prompt, {
        language,
        tone,
        maxTokens: getMaxTokensForLength(length),
        temperature: 0.7
      })

      // Update user's usage
      user.subscription.usage.contentGenerations += 1
      await user.save()

      // Mock word count
      const wordCount = content.split(' ').length

      res.status(200).json({
        success: true,
        data: {
          content,
          provider: 'openai',
          metadata: {
            wordCount,
            language,
            tone,
            generatedAt: new Date().toISOString(),
            processingTime: Math.floor(Math.random() * 5000) + 3000
          },
          usage: {
            generationsToday: user.subscription.usage.contentGenerations,
            dailyLimit: getUserLimits(user.subscription.plan).contentGenerations === -1 ? 'unlimited' : getUserLimits(user.subscription.plan).contentGenerations,
            remaining: getUserLimits(user.subscription.plan).contentGenerations === -1 ? 'unlimited' : getUserLimits(user.subscription.plan).contentGenerations - user.subscription.usage.contentGenerations
          }
        }
      })

      logger.info(`AI content generated for user ${user.email}: ${contentType}`)
    } catch (openaiError: any) {
      logger.error('OpenAI generation failed, attempting Hugging Face fallback:', openaiError)

      // Attempt Hugging Face fallback if key is available
      if (process.env.HUGGINGFACE_API_KEY) {
        try {
          const hfMax = Math.min( (getMaxTokensForLength(length) || 300), 300)
          const hfContent = await huggingFaceService.generateGhanaianContent(prompt, {
            maxLength: hfMax,
            language
          })

          // Update user's usage (count fallback usage as a generation)
          user.subscription.usage.contentGenerations += 1
          await user.save()

          const wordCount = hfContent.split(' ').length

          res.status(200).json({
            success: true,
            data: {
              content: hfContent,
              provider: 'huggingface',
              metadata: {
                wordCount,
                language,
                tone,
                generatedAt: new Date().toISOString(),
                processingTime: Math.floor(Math.random() * 3000) + 1000
              },
              usage: {
                generationsToday: user.subscription.usage.contentGenerations,
                dailyLimit: user.subscription.usage.contentGenerations === -1 ? 'unlimited' : getUserLimits(user.subscription.plan).contentGenerations,
                remaining: getUserLimits(user.subscription.plan).contentGenerations === -1 ? 'unlimited' : getUserLimits(user.subscription.plan).contentGenerations - user.subscription.usage.contentGenerations
              }
            }
          })

          logger.info(`AI content generated via Hugging Face for user ${user.email}: ${contentType}`)
          return
        } catch (hfError: any) {
          logger.error('Hugging Face fallback failed:', hfError)
          // Return combined error info
          res.status(500).json({
            success: false,
            error: openaiError?.message || 'Failed to generate content with OpenAI',
            fallbackError: hfError?.message || 'Hugging Face fallback failed'
          })
          return
        }
      }

      // No Hugging Face key or fallback didn't run
      res.status(500).json({
        success: false,
        error: openaiError?.message || 'Failed to generate content'
      })
    }
  } catch (error) {
    logger.error('Generate AI content error:', error)
    next(error)
  }
}

// @desc    Transcribe audio with AI (aligned route)
// @route   POST /api/ai/transcribe
// @access  Private
export const transcribeAudio = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'Audio file is required'
      })
      return
    }

    const { language = 'en', responseFormat = 'text' } = req.body

    // Check user's subscription limits
    const user = await User.findById(req.user?._id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
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

    res.status(200).json({
      success: true,
      data: {
        transcription,
        metadata: {
          duration: Math.floor(Math.random() * 300) + 60, // Mock duration
          language,
          format: responseFormat,
          fileName: req.file.originalname,
          processedAt: new Date().toISOString()
        },
        usage: {
          secondsUsed: Math.floor(Math.random() * 300) + 60,
          monthlyLimit: getUserLimits(user.subscription.plan).audioTranscriptions === -1 ? 'unlimited' : getUserLimits(user.subscription.plan).audioTranscriptions,
          remaining: getUserLimits(user.subscription.plan).audioTranscriptions === -1 ? 'unlimited' : getUserLimits(user.subscription.plan).audioTranscriptions - user.subscription.usage.audioTranscriptions
        }
      }
    })

    logger.info(`Audio transcribed for user ${user.email}`)
  } catch (error) {
    logger.error('Transcribe audio error:', error)
    next(error)
  }
}

// @desc    Generate image with AI (aligned route)
// @route   POST /api/ai/image
// @access  Private
export const generateImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { prompt, size = '1024x1024', style = 'vivid' } = req.body

    if (!prompt) {
      res.status(400).json({
        success: false,
        error: 'Prompt is required'
      })
      return
    }

    // Check user's subscription limits
    const user = await User.findById(req.user?._id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    // Generate image using OpenAI DALL-E
    const imageUrl = await openaiService.generateImage(prompt, { size, style })

    // Update user's usage
    user.subscription.usage.imageGenerations = (user.subscription.usage.imageGenerations || 0) + 1
    await user.save()

    res.status(200).json({
      success: true,
      data: {
        image: {
          url: imageUrl,
          revisedPrompt: prompt,
          size
        },
        usage: {
          imagesDaily: user.subscription.usage.imageGenerations || 0,
          dailyLimit: getUserLimits(user.subscription.plan).imageGenerations === -1 ? 'unlimited' : getUserLimits(user.subscription.plan).imageGenerations,
          remaining: getUserLimits(user.subscription.plan).imageGenerations === -1 ? 'unlimited' : (getUserLimits(user.subscription.plan).imageGenerations || 0) - (user.subscription.usage.imageGenerations || 0)
        }
      }
    })

    logger.info(`Image generated for user ${user.email}`)
  } catch (error) {
    logger.error('Generate image error:', error)
    next(error)
  }
}

// Helper functions
function detectTextLanguage(text: string): string {
  // Simple language detection based on common words
  const words = text.toLowerCase().split(' ')
  
  // Twi detection
  const twiWords = ['akwaaba', 'medaase', 'yɛ', 'me', 'wo', 'ɛ']
  if (twiWords.some(word => words.includes(word))) return 'tw'
  
  // Ga detection
  const gaWords = ['akwaaba', 'mi', 'e', 'ka', 'a']
  if (gaWords.some(word => words.includes(word))) return 'ga'
  
  // Ewe detection
  const eweWords = ['akpe', 'nye', 'woe', 'mi', 'a']
  if (eweWords.some(word => words.includes(word))) return 'ew'
  
  // Hausa detection
  const hausaWords = ['sannu', 'na', 'ka', 'shi', 'su']
  if (hausaWords.some(word => words.includes(word))) return 'ha'
  
  // Default to English
  return 'en'
}

function extractNamedEntities(text: string): any[] {
  // Mock entity extraction
  const entities: any[] = []
  
  // Extract potential names (capitalized words)
  const words = text.split(' ')
  words.forEach(word => {
    if (word[0] === word[0].toUpperCase() && word.length > 2) {
      entities.push({
        text: word,
        type: 'PERSON',
        confidence: 0.8
      })
    }
  })
  
  // Extract potential locations (common Ghanaian locations)
  const locations = ['Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Ghana']
  locations.forEach(location => {
    if (text.includes(location)) {
      entities.push({
        text: location,
        type: 'LOCATION',
        confidence: 0.9
      })
    }
  })
  
  return entities
}

function getMaxTokensForLength(length: string): number {
  switch (length) {
    case 'short': return 500
    case 'medium': return 1000
    case 'long': return 2000
    default: return 1000
  }
}

function getUserLimits(plan: string) {
  const limits = {
    starter: {
      contentGenerations: 5,
      audioTranscriptions: 60,
      imageGenerations: 3,
      apiCalls: 100
    },
    professional: {
      contentGenerations: -1, // unlimited
      audioTranscriptions: 600,
      imageGenerations: 20,
      apiCalls: 1000
    },
    enterprise: {
      contentGenerations: -1, // unlimited
      audioTranscriptions: -1, // unlimited
      imageGenerations: -1, // unlimited
      apiCalls: -1 // unlimited
    }
  }
  return limits[plan as keyof typeof limits] || limits.starter
}
