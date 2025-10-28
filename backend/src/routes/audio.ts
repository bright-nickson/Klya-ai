import express from 'express'
import multer from 'multer'
import { body } from 'express-validator'
import { 
  transcribeAudio, 
  getTranscriptionHistory,
  deleteTranscription
} from '../controllers/audioController'
import { protect } from '../middleware/auth'

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true)
    } else {
      cb(new Error('Only audio files are allowed'))
    }
  }
})

const router = express.Router()

// @route   POST /api/audio/transcribe
// @desc    Transcribe audio file
// @access  Private
router.post('/transcribe', protect, upload.single('audio'), [
  body('language').optional().isIn(['en', 'tw', 'ga', 'ew', 'ha']),
  body('responseFormat').optional().isIn(['json', 'text', 'srt', 'verbose_json', 'vtt'])
], transcribeAudio)

// @route   GET /api/audio/history
// @desc    Get user's transcription history
// @access  Private
router.get('/history', protect, getTranscriptionHistory)

// @route   DELETE /api/audio/:id
// @desc    Delete transcription
// @access  Private
router.delete('/:id', protect, deleteTranscription)

export default router
