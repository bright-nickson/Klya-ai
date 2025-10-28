import mongoose, { Document, Schema } from 'mongoose'

export interface ISubscription extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'inactive' | 'cancelled' | 'trial' | 'pending_payment'
  startDate: Date
  endDate?: Date
  trialEndDate?: Date
  paymentMethod?: 'mtn_momo' | 'airteltigo_money' | 'paystack' | 'bank_transfer'
  paymentDetails?: {
    transactionId?: string
    phoneNumber?: string
    reference?: string
  }
  billingHistory: {
    date: Date
    amount: number
    currency: string
    status: 'paid' | 'pending' | 'failed'
    transactionId?: string
    paymentMethod: string
  }[]
  limits: {
    contentGenerations: number
    audioTranscriptions: number
    imageGenerations: number
    apiCalls: number
    storageGB: number
  }
  features: string[]
  autoRenew: boolean
  createdAt: Date
  updatedAt: Date
  
  // Methods
  getTrialDaysRemaining(): number
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['starter', 'professional', 'enterprise'],
    required: true,
    default: 'starter'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'trial', 'pending_payment'],
    required: true,
    default: 'trial'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  trialEndDate: {
    type: Date,
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
  },
  paymentMethod: {
    type: String,
    enum: ['mtn_momo', 'airteltigo_money', 'paystack', 'bank_transfer']
  },
  paymentDetails: {
    transactionId: String,
    phoneNumber: String,
    reference: String
  },
  billingHistory: [{
    date: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true,
      default: 'GHS'
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'failed'],
      required: true
    },
    transactionId: String,
    paymentMethod: {
      type: String,
      required: true
    }
  }],
  limits: {
    contentGenerations: {
      type: Number,
      default: function() {
        switch (this.plan) {
          case 'starter': return 50
          case 'professional': return 500
          case 'enterprise': return 2000
          default: return 10
        }
      }
    },
    audioTranscriptions: {
      type: Number,
      default: function() {
        switch (this.plan) {
          case 'starter': return 10
          case 'professional': return 100
          case 'enterprise': return 500
          default: return 5
        }
      }
    },
    imageGenerations: {
      type: Number,
      default: function() {
        switch (this.plan) {
          case 'starter': return 20
          case 'professional': return 200
          case 'enterprise': return 1000
          default: return 5
        }
      }
    },
    apiCalls: {
      type: Number,
      default: function() {
        switch (this.plan) {
          case 'starter': return 1000
          case 'professional': return 10000
          case 'enterprise': return 50000
          default: return 100
        }
      }
    },
    storageGB: {
      type: Number,
      default: function() {
        switch (this.plan) {
          case 'starter': return 1
          case 'professional': return 10
          case 'enterprise': return 100
          default: return 0.5
        }
      }
    }
  },
  features: {
    type: [String],
    default: function() {
      const baseFeatures = ['content_generation', 'basic_analytics']
      switch (this.plan) {
        case 'starter':
          return [...baseFeatures, 'email_support']
        case 'professional':
          return [...baseFeatures, 'audio_transcription', 'advanced_analytics', 'priority_support', 'api_access']
        case 'enterprise':
          return [...baseFeatures, 'audio_transcription', 'image_generation', 'advanced_analytics', 'priority_support', 'api_access', 'custom_integrations', 'dedicated_support']
        default:
          return baseFeatures
      }
    }
  },
  autoRenew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Index for efficient queries
SubscriptionSchema.index({ userId: 1 })
SubscriptionSchema.index({ status: 1 })
SubscriptionSchema.index({ endDate: 1 })

// Method to check if subscription is active
SubscriptionSchema.methods.isActive = function(): boolean {
  return this.status === 'active' && (!this.endDate || this.endDate > new Date())
}

// Method to check if trial is expired
SubscriptionSchema.methods.isTrialExpired = function(): boolean {
  return this.status === 'trial' && this.trialEndDate && this.trialEndDate < new Date()
}

// Method to get remaining trial days
SubscriptionSchema.methods.getTrialDaysRemaining = function(): number {
  if (this.status !== 'trial' || !this.trialEndDate) return 0
  const now = new Date()
  const diffTime = this.trialEndDate.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema)
