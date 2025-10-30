import { Subscription, ISubscription } from '../models/Subscription'
import { User, IUser } from '../models/User'
import { Usage } from '../models/Usage'
import { paymentService, PaymentResult } from './paymentService'
import { logger } from '../utils/logger'
import mongoose from 'mongoose'

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  limits: {
    contentGenerations: number
    audioTranscriptions: number
    imageGenerations: number
    apiCalls: number
    storageGB: number
  }
}

export interface SubscriptionUpgradeData {
  planId: string
  paymentMethod: 'paystack' | 'mtn_momo' | 'airteltigo_money'
  paymentDetails?: {
    phoneNumber?: string
    email?: string
  }
}

class SubscriptionService {
  private plans: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      currency: 'GHS',
      interval: 'monthly',
      features: [
        'content_generation',
        'basic_analytics',
        'email_support'
      ],
      limits: {
        contentGenerations: 50,
        audioTranscriptions: 10,
        imageGenerations: 20,
        apiCalls: 1000,
        storageGB: 1
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 99,
      currency: 'GHS',
      interval: 'monthly',
      features: [
        'content_generation',
        'audio_transcription',
        'advanced_analytics',
        'priority_support',
        'api_access'
      ],
      limits: {
        contentGenerations: 500,
        audioTranscriptions: 100,
        imageGenerations: 200,
        apiCalls: 10000,
        storageGB: 10
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      currency: 'GHS',
      interval: 'monthly',
      features: [
        'content_generation',
        'audio_transcription',
        'image_generation',
        'advanced_analytics',
        'priority_support',
        'api_access',
        'custom_integrations',
        'dedicated_support'
      ],
      limits: {
        contentGenerations: 2000,
        audioTranscriptions: 500,
        imageGenerations: 1000,
        apiCalls: 50000,
        storageGB: 100
      }
    }
  ]

  // Get all available plans
  getPlans(): SubscriptionPlan[] {
    return this.plans
  }

  // Get plan by ID
  getPlan(planId: string): SubscriptionPlan | null {
    return this.plans.find(plan => plan.id === planId) || null
  }

  // Get user's current subscription
  async getUserSubscription(userId: string): Promise<ISubscription | null> {
    try {
      const subscription = await Subscription.findOne({ userId })
      return subscription
    } catch (error) {
      logger.error('Error getting user subscription:', error)
      return null
    }
  }

  // Create initial subscription for new user
  async createInitialSubscription(userId: string) {
    try {
      const starterPlan = this.getPlan('starter')
      if (!starterPlan) {
        throw new Error('Starter plan not found')
      }

      const subscription = new Subscription({
        userId,
        plan: 'starter',
        status: 'trial',
        startDate: new Date(),
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        limits: starterPlan.limits,
        features: starterPlan.features,
        autoRenew: true
      })

      await subscription.save()
      return subscription
    } catch (error) {
      logger.error('Error creating initial subscription:', error)
      throw error
    }
  }

  // Upgrade subscription
  async upgradeSubscription(
    userId: string, 
    upgradeData: SubscriptionUpgradeData
  ): Promise<{ success: boolean; paymentResult?: PaymentResult; subscription?: ISubscription }> {
    try {
      const plan = this.getPlan(upgradeData.planId)
      if (!plan) {
        return { success: false }
      }

      const user = await User.findById(userId)
      if (!user) {
        return { success: false }
      }

      let subscription = await Subscription.findOne({ userId })
      if (!subscription) {
        subscription = await this.createInitialSubscription(userId)
      }

      if (!subscription) {
        return { success: false }
      }

      // If it's a free plan, no payment needed
      if (plan.price === 0) {
        subscription.plan = plan.id as any
        subscription.status = 'active'
        subscription.limits = plan.limits
        subscription.features = plan.features
        await subscription.save()

        return { success: true, subscription: subscription.toObject() as ISubscription }
      }

      // Initialize payment
      let paymentResult: PaymentResult

      if (upgradeData.paymentMethod === 'paystack') {
        paymentResult = await paymentService.initiatePaystackPayment({
          amount: plan.price,
          email: user.email,
          callback_url: `${process.env.FRONTEND_URL}/dashboard/subscription/callback`
        })
      } else {
        // Mobile Money payment
        if (!upgradeData.paymentDetails?.phoneNumber) {
          return { success: false }
        }

        paymentResult = await paymentService.initiatePayment(upgradeData.paymentMethod, {
          amount: plan.price,
          phoneNumber: upgradeData.paymentDetails.phoneNumber,
          network: upgradeData.paymentMethod === 'mtn_momo' ? 'mtn' : 'airteltigo',
          description: `KLYA AI ${plan.name} Plan Subscription`
        })
      }

      if (paymentResult.success) {
        // Update subscription with pending payment
        subscription.plan = plan.id as any
        subscription.status = 'pending_payment'
        subscription.paymentMethod = upgradeData.paymentMethod
        subscription.paymentDetails = {
          transactionId: paymentResult.transactionId,
          reference: paymentResult.reference,
          phoneNumber: upgradeData.paymentDetails?.phoneNumber
        }
        subscription.limits = plan.limits
        subscription.features = plan.features

        await subscription.save()
      }

      return { success: paymentResult.success, paymentResult, subscription: subscription.toObject() as ISubscription }
    } catch (error) {
      logger.error('Error upgrading subscription:', error)
      return { success: false }
    }
  }

  // Confirm payment and activate subscription
  async confirmPayment(userId: string, transactionId: string, paymentMethod: string): Promise<boolean> {
    try {
      const subscription = await Subscription.findOne({ userId })
      if (!subscription) {
        return false
      }

      const paymentResult = await paymentService.verifyPayment(
        paymentMethod as any,
        transactionId
      )

      if (paymentResult.success && paymentResult.status === 'success') {
        // Activate subscription
        subscription.status = 'active'
        subscription.startDate = new Date()
        subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

        // Add to billing history
        const plan = this.getPlan(subscription.plan)
        if (plan) {
          subscription.billingHistory.push({
            date: new Date(),
            amount: plan.price,
            currency: plan.currency,
            status: 'paid',
            transactionId,
            paymentMethod
          })
        }

        await subscription.save()
        return true
      }

      return false
    } catch (error) {
      logger.error('Error confirming payment:', error)
      return false
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await Subscription.findOne({ userId })
      if (!subscription) {
        return false
      }

      subscription.status = 'cancelled'
      subscription.autoRenew = false
      await subscription.save()

      logger.info(`Subscription cancelled for user: ${userId}`)
      return true
    } catch (error) {
      logger.error('Error cancelling subscription:', error)
      return false
    }
  }

  // Check if user has reached usage limits
  async checkUsageLimit(
    userId: string, 
    type: 'contentGenerations' | 'audioTranscriptions' | 'imageGenerations' | 'apiCalls'
  ): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    try {
      const subscription = await Subscription.findOne({ userId })
      if (!subscription) {
        return { allowed: false, remaining: 0, limit: 0 }
      }

      // Get current month usage
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const usage = await Usage.find({
        userId,
        date: { $gte: startOfMonth }
      })

      let totalUsage = 0
      usage.forEach(u => {
        switch (type) {
          case 'contentGenerations':
            totalUsage += (u as any).getTotalContentGenerations()
            break
          case 'audioTranscriptions':
            totalUsage += (u as any).getTotalAudioTranscriptions()
            break
          case 'imageGenerations':
            totalUsage += (u as any).getTotalImageGenerations()
            break
          case 'apiCalls':
            totalUsage += (u as any).getTotalApiCalls()
            break
        }
      })

      const limit = subscription.limits[type]
      const remaining = Math.max(0, limit - totalUsage)
      const allowed = totalUsage < limit

      return { allowed, remaining, limit }
    } catch (error) {
      logger.error('Error checking usage limit:', error)
      return { allowed: false, remaining: 0, limit: 0 }
    }
  }

  // Get subscription analytics
  async getSubscriptionAnalytics(userId: string): Promise<{
    currentPlan: string
    status: string
    daysRemaining?: number
    trialDaysRemaining?: number
    usage: {
      contentGenerations: { used: number; limit: number }
      audioTranscriptions: { used: number; limit: number }
      imageGenerations: { used: number; limit: number }
      apiCalls: { used: number; limit: number }
    }
    billingHistory: any[]
  } | null> {
    try {
      const subscription = await Subscription.findOne({ userId })
      if (!subscription) {
        return null
      }

      // Calculate days remaining
      let daysRemaining: number | undefined
      let trialDaysRemaining: number | undefined

      if (subscription.status === 'trial' && subscription.trialEndDate) {
        trialDaysRemaining = (subscription as any).getTrialDaysRemaining()
      } else if (subscription.endDate) {
        const now = new Date()
        const diffTime = subscription.endDate.getTime() - now.getTime()
        daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
      }

      // Get usage data
      const contentUsage = await this.checkUsageLimit(userId, 'contentGenerations')
      const audioUsage = await this.checkUsageLimit(userId, 'audioTranscriptions')
      const imageUsage = await this.checkUsageLimit(userId, 'imageGenerations')
      const apiUsage = await this.checkUsageLimit(userId, 'apiCalls')

      return {
        currentPlan: subscription.plan,
        status: subscription.status,
        daysRemaining,
        trialDaysRemaining,
        usage: {
          contentGenerations: { used: contentUsage.limit - contentUsage.remaining, limit: contentUsage.limit },
          audioTranscriptions: { used: audioUsage.limit - audioUsage.remaining, limit: audioUsage.limit },
          imageGenerations: { used: imageUsage.limit - imageUsage.remaining, limit: imageUsage.limit },
          apiCalls: { used: apiUsage.limit - apiUsage.remaining, limit: apiUsage.limit }
        },
        billingHistory: subscription.billingHistory
      }
    } catch (error) {
      logger.error('Error getting subscription analytics:', error)
      return null
    }
  }

  // Check and update expired subscriptions (should be run as a cron job)
  async processExpiredSubscriptions(): Promise<void> {
    try {
      const now = new Date()
      
      // Find expired trial subscriptions
      const expiredTrials = await Subscription.find({
        status: 'trial',
        trialEndDate: { $lt: now }
      })

      for (const subscription of expiredTrials) {
        subscription.status = 'inactive'
        await subscription.save()
        logger.info(`Trial expired for subscription: ${subscription._id}`)
      }

      // Find expired paid subscriptions
      const expiredSubscriptions = await Subscription.find({
        status: 'active',
        endDate: { $lt: now }
      })

      for (const subscription of expiredSubscriptions) {
        if (subscription.autoRenew) {
          // Try to renew automatically
          // This would involve charging the payment method again
          logger.info(`Auto-renewal needed for subscription: ${subscription._id}`)
        } else {
          subscription.status = 'inactive'
          await subscription.save()
          logger.info(`Subscription expired: ${subscription._id}`)
        }
      }
    } catch (error) {
      logger.error('Error processing expired subscriptions:', error)
    }
  }
}

export const subscriptionService = new SubscriptionService()
