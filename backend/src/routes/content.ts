import express from 'express'
import { body } from 'express-validator'
import { 
  generateContent, 
  generateImage, 
  summarizeText, 
  analyzeSentiment,
  getContentHistory,
  deleteContent
} from '../controllers/contentController'
import { protect } from '../middleware/auth'

const router = express.Router()

// @route   POST /api/content/generate
// @desc    Generate AI content
// @access  Private
router.post('/generate', protect, [
  body('prompt').notEmpty().withMessage('Prompt is required'),
  body('type').isIn(['blog', 'social', 'email', 'ad', 'product', 'custom']).withMessage('Invalid content type'),
  body('language').optional().isIn(['en', 'tw', 'ga', 'ew', 'ha']),
  body('tone').optional().isIn(['professional', 'casual', 'friendly', 'formal']),
  body('maxTokens').optional().isInt({ min: 50, max: 2000 }),
  body('temperature').optional().isFloat({ min: 0, max: 2 })
], generateContent)

// @route   POST /api/content/image
// @desc    Generate AI image
// @access  Private
router.post('/image', protect, [
  body('prompt').notEmpty().withMessage('Image prompt is required'),
  body('size').optional().isIn(['256x256', '512x512', '1024x1024']),
  body('quality').optional().isIn(['standard', 'hd']),
  body('style').optional().isIn(['vivid', 'natural'])
], generateImage)

// @route   POST /api/content/summarize
// @desc    Summarize text
// @access  Private
router.post('/summarize', protect, [
  body('text').notEmpty().withMessage('Text to summarize is required'),
  body('maxLength').optional().isInt({ min: 30, max: 500 })
], summarizeText)

// @route   POST /api/content/sentiment
// @desc    Analyze text sentiment
// @access  Private
router.post('/sentiment', protect, [
  body('text').notEmpty().withMessage('Text to analyze is required'),
  body('language').optional().isIn(['en', 'tw', 'ga', 'ew', 'ha'])
], analyzeSentiment)

// @route   GET /api/content/history
// @desc    Get user's content generation history
// @access  Private
router.get('/history', protect, getContentHistory)

// @route   DELETE /api/content/:id
// @desc    Delete content item
// @access  Private
router.delete('/:id', protect, deleteContent)

export default router
