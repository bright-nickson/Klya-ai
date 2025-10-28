import mongoose, { Document, Schema } from 'mongoose'
import crypto from 'crypto'

export interface IApiKey extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  name: string
  key: string
  hashedKey: string
  permissions: string[]
  isActive: boolean
  lastUsed?: Date
  usageCount: number
  rateLimit: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ApiKeySchema = new Schema<IApiKey>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'API key name cannot be more than 100 characters']
  },
  key: {
    type: String,
    required: true,
    unique: true,
    select: false // Don't return the actual key in queries
  },
  hashedKey: {
    type: String,
    required: true,
    unique: true
  },
  permissions: [{
    type: String,
    enum: [
      'content:generate',
      'audio:transcribe',
      'image:generate',
      'analytics:read',
      'user:read',
      'user:update'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date
  },
  usageCount: {
    type: Number,
    default: 0
  },
  rateLimit: {
    requestsPerMinute: {
      type: Number,
      default: 60
    },
    requestsPerHour: {
      type: Number,
      default: 1000
    },
    requestsPerDay: {
      type: Number,
      default: 10000
    }
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Indexes
ApiKeySchema.index({ userId: 1 })
ApiKeySchema.index({ hashedKey: 1 })
ApiKeySchema.index({ isActive: 1 })
ApiKeySchema.index({ expiresAt: 1 })

// Pre-save middleware to hash the API key
ApiKeySchema.pre('save', function(next) {
  if (this.isModified('key')) {
    this.hashedKey = crypto.createHash('sha256').update(this.key).digest('hex')
  }
  next()
})

// Method to generate a new API key
ApiKeySchema.statics.generateApiKey = function(): string {
  const prefix = 'ag_'
  const randomBytes = crypto.randomBytes(32).toString('hex')
  return prefix + randomBytes
}

// Method to verify API key
ApiKeySchema.statics.verifyApiKey = async function(apiKey: string) {
  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex')
  
  const keyDoc = await this.findOne({
    hashedKey,
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  }).populate('userId')
  
  if (keyDoc) {
    // Update usage statistics
    keyDoc.lastUsed = new Date()
    keyDoc.usageCount += 1
    await keyDoc.save()
  }
  
  return keyDoc
}

// Method to check if API key has permission
ApiKeySchema.methods.hasPermission = function(permission: string): boolean {
  return this.permissions.includes(permission) || this.permissions.includes('*')
}

// Method to check rate limits
ApiKeySchema.methods.checkRateLimit = async function(timeWindow: 'minute' | 'hour' | 'day'): Promise<boolean> {
  const now = new Date()
  let startTime: Date
  let limit: number
  
  switch (timeWindow) {
    case 'minute':
      startTime = new Date(now.getTime() - 60 * 1000)
      limit = this.rateLimit.requestsPerMinute
      break
    case 'hour':
      startTime = new Date(now.getTime() - 60 * 60 * 1000)
      limit = this.rateLimit.requestsPerHour
      break
    case 'day':
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      limit = this.rateLimit.requestsPerDay
      break
    default:
      return false
  }
  
  // This would typically be implemented with Redis for better performance
  // For now, we'll use a simple counter approach
  const Usage = mongoose.model('Usage')
  const recentUsage = await Usage.countDocuments({
    userId: this.userId,
    createdAt: { $gte: startTime }
  })
  
  return recentUsage < limit
}

export const ApiKey = mongoose.model<IApiKey>('ApiKey', ApiKeySchema)
