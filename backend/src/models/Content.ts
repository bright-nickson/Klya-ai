import mongoose, { Document, Schema } from 'mongoose'

export interface IContent extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  title: string
  content: string
  type: 'blog_post' | 'social_media' | 'email' | 'product_description' | 'invoice' | 'other'
  language: 'en' | 'tw' | 'ga' | 'ew' | 'ha'
  prompt: string
  aiModel: 'gpt-4' | 'gpt-3.5-turbo' | 'huggingface'
  tokensUsed: number
  status: 'draft' | 'published' | 'archived'
  tags: string[]
  metadata: {
    wordCount: number
    readingTime: number
    sentiment?: 'positive' | 'negative' | 'neutral'
    businessContext?: string
  }
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

const ContentSchema = new Schema<IContent>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: true,
    maxlength: [50000, 'Content cannot be more than 50,000 characters']
  },
  type: {
    type: String,
    enum: ['blog_post', 'social_media', 'email', 'product_description', 'invoice', 'other'],
    required: true
  },
  language: {
    type: String,
    enum: ['en', 'tw', 'ga', 'ew', 'ha'],
    required: true,
    default: 'en'
  },
  prompt: {
    type: String,
    required: true,
    maxlength: [2000, 'Prompt cannot be more than 2,000 characters']
  },
  aiModel: {
    type: String,
    enum: ['gpt-4', 'gpt-3.5-turbo', 'huggingface'],
    required: true
  },
  tokensUsed: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot be more than 50 characters']
  }],
  metadata: {
    wordCount: {
      type: Number,
      required: true,
      min: 0
    },
    readingTime: {
      type: Number,
      required: true,
      min: 0
    },
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral']
    },
    businessContext: {
      type: String,
      maxlength: [500, 'Business context cannot be more than 500 characters']
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
ContentSchema.index({ userId: 1, createdAt: -1 })
ContentSchema.index({ userId: 1, type: 1 })
ContentSchema.index({ userId: 1, language: 1 })
ContentSchema.index({ userId: 1, status: 1 })
ContentSchema.index({ tags: 1 })
ContentSchema.index({ isPublic: 1, createdAt: -1 })

// Text search index
ContentSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text' 
})

// Pre-save middleware to calculate metadata
ContentSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Calculate word count
    this.metadata.wordCount = this.content.split(/\s+/).filter(word => word.length > 0).length
    
    // Calculate reading time (average 200 words per minute)
    this.metadata.readingTime = Math.ceil(this.metadata.wordCount / 200)
  }
  next()
})

// Method to get content summary
ContentSchema.methods.getSummary = function(length: number = 150): string {
  if (this.content.length <= length) return this.content
  return this.content.substring(0, length).trim() + '...'
}

// Static method to get user's content statistics
ContentSchema.statics.getUserContentStats = async function(userId: mongoose.Types.ObjectId) {
  const stats = await this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalContent: { $sum: 1 },
        totalWords: { $sum: '$metadata.wordCount' },
        totalTokens: { $sum: '$tokensUsed' },
        contentByType: {
          $push: {
            type: '$type',
            count: 1
          }
        },
        contentByLanguage: {
          $push: {
            language: '$language',
            count: 1
          }
        },
        contentByStatus: {
          $push: {
            status: '$status',
            count: 1
          }
        }
      }
    }
  ])
  
  return stats[0] || {
    totalContent: 0,
    totalWords: 0,
    totalTokens: 0,
    contentByType: [],
    contentByLanguage: [],
    contentByStatus: []
  }
}

export const Content = mongoose.model<IContent>('Content', ContentSchema)
