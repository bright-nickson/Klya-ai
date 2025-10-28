import express from 'express'
import multer from 'multer'
import { body } from 'express-validator'
import { translateText, detectLanguage, extractEntities, generateAIContent, transcribeAudio, generateImage } from '../controllers/aiController'
import { protect } from '../middleware/auth'

const router = express.Router()

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/flac', 'audio/ogg']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only MP3, WAV, M4A, FLAC, OGG files are allowed.'))
    }
  }
})

// All AI routes require authentication
router.use(protect)

// @route   POST /api/ai/translate
// @desc    Translate text
// @access  Private
router.post('/translate', [
  body('text').notEmpty().withMessage('Text is required'),
  body('targetLanguage').isIn(['en', 'tw', 'ga', 'ew', 'ha']).withMessage('Invalid target language'),
  body('sourceLanguage').optional().isIn(['en', 'tw', 'ga', 'ew', 'ha']).withMessage('Invalid source language')
], translateText)

// @route   POST /api/ai/detect-language
// @desc    Detect language of text
// @access  Private
router.post('/detect-language', [
  body('text').notEmpty().withMessage('Text is required')
], detectLanguage)

// @route   POST /api/ai/entities
// @desc    Extract named entities
// @access  Private
router.post('/entities', [
  body('text').notEmpty().withMessage('Text is required')
], extractEntities)

// @route   POST /api/ai/content
// @desc    Generate AI content
// @access  Private
router.post('/content', [
  body('contentType').isIn(['blog_post', 'social_media', 'email', 'ad_copy', 'product_description']).withMessage('Invalid content type'),
  body('topic').notEmpty().withMessage('Topic is required'),
  body('language').optional().isIn(['en', 'tw', 'ga', 'ew', 'ha']).withMessage('Invalid language'),
  body('tone').optional().isIn(['professional', 'casual', 'friendly', 'formal']).withMessage('Invalid tone'),
  body('length').optional().isIn(['short', 'medium', 'long']).withMessage('Invalid length'),
  body('keywords').optional().isArray().withMessage('Keywords must be an array'),
  body('targetAudience').optional().isString().withMessage('Target audience must be a string')
], generateAIContent)

// @route   POST /api/ai/generate
// @desc    Generate AI content (simplified endpoint)
// @access  Private
router.post('/generate', [
  body('prompt').notEmpty().withMessage('Prompt is required'),
  body('type').optional().isIn(['blog-post', 'social-media', 'email', 'product-description', 'ad-copy', 'press-release']).withMessage('Invalid content type')
], generateAIContent)

// @route   POST /api/ai/transcribe
// @desc    Transcribe audio file
// @access  Private
router.post('/transcribe', upload.single('audio'), [
  body('language').optional().isIn(['en', 'tw', 'ga', 'ew', 'ha']).withMessage('Invalid language'),
  body('responseFormat').optional().isIn(['text', 'json', 'srt', 'vtt']).withMessage('Invalid response format')
], transcribeAudio)

// @route   POST /api/ai/image
// @desc    Generate image with DALL-E
// @access  Private
router.post('/image', [
  body('prompt').notEmpty().withMessage('Prompt is required'),
  body('size').optional().isIn(['1024x1024', '1792x1024', '1024x1792']).withMessage('Invalid image size'),
  body('style').optional().isIn(['vivid', 'natural']).withMessage('Invalid style')
], generateImage)

export default router
