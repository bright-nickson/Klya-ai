import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from './src/models/User'
import bcrypt from 'bcryptjs'

dotenv.config()

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables')
    }

    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connected')

    // Create indexes for better performance
    console.log('\n📊 Creating database indexes...')
    await User.collection.createIndex({ 'createdAt': 1 })
    await User.collection.createIndex({ 'lastLogin': 1 })
    await User.collection.createIndex({ 'subscription.plan': 1 })
    await User.collection.createIndex({ 'role': 1 })
    console.log('✅ Indexes created successfully')

    // Create or update admin user
    console.log('\n👤 Setting up admin user...')
    
    const adminEmail = 'admin@klya.ai'
    const adminPassword = 'Admin@123456' // Change this!

    let adminUser = await User.findOne({ email: adminEmail })

    if (adminUser) {
      console.log(`ℹ️  Admin user exists: ${adminEmail}`)
      console.log(`📝 Updating to ensure admin role...`)
      
      adminUser.role = 'admin'
      adminUser.isActive = true
      adminUser.emailVerified = true
      await adminUser.save()
      console.log('✅ Admin user updated')
    } else {
      console.log(`ℹ️  Creating new admin user: ${adminEmail}`)
      
      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(adminPassword, salt)

      adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        emailVerified: true,
        onboardingCompleted: true,
        subscription: {
          plan: 'enterprise',
          status: 'active',
          startDate: new Date(),
          usage: {
            contentGenerations: 0,
            audioTranscriptions: 0,
            imageGenerations: 0,
            apiCalls: 0
          }
        }
      })
      console.log('✅ Admin user created successfully')
    }

    // Display credentials
    console.log('\n' + '='.repeat(60))
    console.log('📋 ADMIN USER CREDENTIALS')
    console.log('='.repeat(60))
    console.log(`Email:    ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)
    console.log('⚠️  IMPORTANT: Change this password after first login!')
    console.log('='.repeat(60))

    // Get all admins
    console.log('\n📊 Listing all admin users:')
    const admins = await User.find({ role: 'admin' }).select('email firstName lastName')
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.firstName} ${admin.lastName} (${admin.email})`)
    })

    // Get user statistics
    console.log('\n📈 User Statistics:')
    const totalUsers = await User.countDocuments()
    const adminCount = await User.countDocuments({ role: 'admin' })
    const moderatorCount = await User.countDocuments({ role: 'moderator' })
    const regularUsers = await User.countDocuments({ role: 'user' })

    console.log(`Total Users:      ${totalUsers}`)
    console.log(`Admins:           ${adminCount}`)
    console.log(`Moderators:       ${moderatorCount}`)
    console.log(`Regular Users:    ${regularUsers}`)

    console.log('\n✅ Setup completed successfully!')
    console.log('\n🚀 NEXT STEPS:')
    console.log('1. Start the backend:  npm run dev:backend')
    console.log('2. Start the frontend: npm run dev:frontend')
    console.log('3. Login at: http://localhost:3000/login')
    console.log(`4. Use email: ${adminEmail}`)
    console.log(`5. Use password: ${adminPassword}`)
    console.log('6. Access dashboard at: http://localhost:3000/dashboard/admin')

    process.exit(0)
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

setupAdmin()
