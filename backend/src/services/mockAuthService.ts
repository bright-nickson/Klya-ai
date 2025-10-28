import jwt from 'jsonwebtoken'

// Mock user data for development
const mockUsers = [
  {
    _id: '507f1f77bcf86cd799439011',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user',
    businessName: 'John\'s Business',
    businessType: 'startup',
    phoneNumber: '+233241234567',
    onboardingCompleted: false,
    location: {
      country: 'Ghana',
      city: 'Accra',
      region: 'Greater Accra'
    },
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    subscription: {
      plan: 'starter',
      status: 'active',
      startDate: new Date(),
      usage: {
        contentGenerations: 5,
        audioTranscriptions: 0,
        imageGenerations: 0,
        apiCalls: 10
      }
    },
    isActive: true,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439012',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user',
    businessName: 'Jane\'s Enterprise',
    businessType: 'enterprise',
    phoneNumber: '+233241234568',
    onboardingCompleted: true,
    location: {
      country: 'Ghana',
      city: 'Kumasi',
      region: 'Ashanti'
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    subscription: {
      plan: 'professional',
      status: 'active',
      startDate: new Date(),
      usage: {
        contentGenerations: 25,
        audioTranscriptions: 5,
        imageGenerations: 3,
        apiCalls: 50
      }
    },
    isActive: true,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export class MockAuthService {
  static async findUserByEmail(email: string) {
    return mockUsers.find(user => user.email === email) || null
  }

  static async findUserById(id: string) {
    return mockUsers.find(user => user._id === id) || null
  }

  static async createUser(userData: any) {
    const newUser = {
      _id: `507f1f77bcf86cd7994390${Math.floor(Math.random() * 100)}`,
      ...userData,
      role: 'user',
      isActive: true,
      emailVerified: true,
      onboardingCompleted: false,
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        ...userData.preferences
      },
      subscription: {
        plan: 'starter',
        status: 'trial',
        startDate: new Date(),
        usage: {
          contentGenerations: 0,
          audioTranscriptions: 0,
          imageGenerations: 0,
          apiCalls: 0
        },
        ...userData.subscription
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    mockUsers.push(newUser)
    return newUser
  }

  static async updateUser(id: string, updateData: any) {
    const userIndex = mockUsers.findIndex(user => user._id === id)
    if (userIndex === -1) return null
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updateData, updatedAt: new Date() }
    return mockUsers[userIndex]
  }

  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    // For development, accept 'password' as valid
    return plainPassword === 'password' || plainPassword === '123456'
  }

  static generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'dev-secret-key'
    return jwt.sign({ id: userId }, secret, { expiresIn: '30d' })
  }

  static verifyToken(token: string): any {
    const secret = process.env.JWT_SECRET || 'dev-secret-key'
    return jwt.verify(token, secret)
  }
}
