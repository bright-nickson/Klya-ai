import mongoose, { Document, Schema } from 'mongoose'

export interface IUsage extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  date: Date
  contentGenerations: {
    count: number
    tokens: number
    language: string
    type: 'blog_post' | 'social_media' | 'email' | 'product_description' | 'other'
  }[]
  audioTranscriptions: {
    count: number
    duration: number // in seconds
    language: string
    fileSize: number // in bytes
  }[]
  imageGenerations: {
    count: number
    prompt: string
    style: string
  }[]
  apiCalls: {
    endpoint: string
    method: string
    responseTime: number
    status: number
  }[]
  totalTokensUsed: number
  totalStorageUsed: number // in bytes
  createdAt: Date
  updatedAt: Date
  
  // Methods
  getTotalContentGenerations(): number
  getTotalAudioTranscriptions(): number
  getTotalImageGenerations(): number
  getTotalApiCalls(): number
}

const UsageSchema = new Schema<IUsage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return today
    }
  },
  contentGenerations: [{
    count: {
      type: Number,
      default: 0
    },
    tokens: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      enum: ['en', 'tw', 'ga', 'ew', 'ha'],
      default: 'en'
    },
    type: {
      type: String,
      enum: ['blog_post', 'social_media', 'email', 'product_description', 'other'],
      default: 'other'
    }
  }],
  audioTranscriptions: [{
    count: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      enum: ['en', 'tw', 'ga', 'ew', 'ha'],
      default: 'en'
    },
    fileSize: {
      type: Number,
      default: 0
    }
  }],
  imageGenerations: [{
    count: {
      type: Number,
      default: 0
    },
    prompt: {
      type: String,
      required: true
    },
    style: {
      type: String,
      default: 'realistic'
    }
  }],
  apiCalls: [{
    endpoint: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true
    },
    responseTime: {
      type: Number,
      required: true
    },
    status: {
      type: Number,
      required: true
    }
  }],
  totalTokensUsed: {
    type: Number,
    default: 0
  },
  totalStorageUsed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Compound index for efficient queries
UsageSchema.index({ userId: 1, date: -1 })
UsageSchema.index({ userId: 1, createdAt: -1 })

// Method to get total content generations for the day
UsageSchema.methods.getTotalContentGenerations = function(): number {
  return this.contentGenerations.reduce((total: number, gen: any) => total + gen.count, 0)
}

// Method to get total audio transcriptions for the day
UsageSchema.methods.getTotalAudioTranscriptions = function(): number {
  return this.audioTranscriptions.reduce((total: number, trans: any) => total + trans.count, 0)
}

// Method to get total image generations for the day
UsageSchema.methods.getTotalImageGenerations = function(): number {
  return this.imageGenerations.reduce((total: number, img: any) => total + img.count, 0)
}

// Method to get total API calls for the day
UsageSchema.methods.getTotalApiCalls = function(): number {
  return this.apiCalls.length
}

// Static method to get or create usage record for today
UsageSchema.statics.getOrCreateToday = async function(userId: mongoose.Types.ObjectId) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let usage = await this.findOne({ userId, date: today })
  
  if (!usage) {
    usage = new this({
      userId,
      date: today,
      contentGenerations: [],
      audioTranscriptions: [],
      imageGenerations: [],
      apiCalls: []
    })
    await usage.save()
  }
  
  return usage
}

// Static method to get usage statistics for a user
UsageSchema.statics.getUserStats = async function(userId: mongoose.Types.ObjectId, days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)
  
  const usage = await this.find({
    userId,
    date: { $gte: startDate }
  }).sort({ date: -1 })
  
  const stats = {
    totalContentGenerations: 0,
    totalAudioTranscriptions: 0,
    totalImageGenerations: 0,
    totalApiCalls: 0,
    totalTokensUsed: 0,
    totalStorageUsed: 0,
    dailyStats: usage.map((u: any) => ({
      date: u.date,
      contentGenerations: u.getTotalContentGenerations(),
      audioTranscriptions: u.getTotalAudioTranscriptions(),
      imageGenerations: u.getTotalImageGenerations(),
      apiCalls: u.getTotalApiCalls(),
      tokensUsed: u.totalTokensUsed,
      storageUsed: u.totalStorageUsed
    }))
  }
  
  // Calculate totals
  usage.forEach((u: any) => {
    stats.totalContentGenerations += u.getTotalContentGenerations()
    stats.totalAudioTranscriptions += u.getTotalAudioTranscriptions()
    stats.totalImageGenerations += u.getTotalImageGenerations()
    stats.totalApiCalls += u.getTotalApiCalls()
    stats.totalTokensUsed += u.totalTokensUsed
    stats.totalStorageUsed += u.totalStorageUsed
  })
  
  return stats
}

export const Usage = mongoose.model<IUsage>('Usage', UsageSchema)
