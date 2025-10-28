import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'user' | 'admin' | 'moderator'
  isActive: boolean
  emailVerified: boolean
  profilePicture?: string
  phoneNumber?: string
  businessName?: string
  businessType?: string
  onboardingCompleted: boolean
  onboardingData?: {
    purpose: string[]
    ageRange: string
    businessSize: string
    industry: string
    goals: string[]
    preferredLanguages: string[]
    contentTypes: string[]
  }
  location?: {
    city: string
    region: string
    country: string
  }
  preferences: {
    language: 'en' | 'tw' | 'ga' | 'ew' | 'ha'
    theme: 'light' | 'dark' | 'auto'
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise'
    status: 'active' | 'inactive' | 'cancelled' | 'trial' | 'pending_payment'
    startDate: Date
    endDate?: Date
    usage: {
      contentGenerations: number
      audioTranscriptions: number
      imageGenerations: number
      apiCalls: number
    }
  }
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    match: [/^\+233[0-9]{9}$/, 'Please provide a valid Ghanaian phone number']
  },
  businessName: {
    type: String,
    trim: true,
    maxlength: [100, 'Business name cannot be more than 100 characters']
  },
  businessType: {
    type: String,
    enum: [
      'retail',
      'restaurant',
      'technology',
      'healthcare',
      'education',
      'finance',
      'agriculture',
      'manufacturing',
      'services',
      'other'
    ]
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  onboardingData: {
    purpose: [String],
    ageRange: String,
    businessSize: String,
    industry: String,
    goals: [String],
    preferredLanguages: [String],
    contentTypes: [String]
  },
  location: {
    city: {
      type: String,
      trim: true
    },
    region: {
      type: String,
      enum: [
        'Greater Accra',
        'Ashanti',
        'Western',
        'Central',
        'Volta',
        'Eastern',
        'Northern',
        'Upper East',
        'Upper West',
        'Brong-Ahafo',
        'Western North',
        'Ahafo',
        'Bono',
        'Bono East',
        'Oti',
        'Savannah',
        'North East'
      ]
    },
    country: {
      type: String,
      default: 'Ghana'
    }
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'tw', 'ga', 'ew', 'ha'],
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['starter', 'professional', 'enterprise'],
      default: 'starter'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'trial', 'pending_payment'],
      default: 'trial'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    usage: {
      contentGenerations: {
        type: Number,
        default: 0
      },
      audioTranscriptions: {
        type: Number,
        default: 0
      },
      imageGenerations: {
        type: Number,
        default: 0
      },
      apiCalls: {
        type: Number,
        default: 0
      }
    }
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
})

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match user entered password to hashed password in database
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Update last login
UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date()
  return this.save()
}

export const User = mongoose.model<IUser>('User', UserSchema)
