'use client'

import React, { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatCard } from '@/components/dashboard/StatCard'
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { useAuth } from '@/contexts/AuthContext'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { analyticsApi, subscriptionApi } from '@/lib/api'
import Link from 'next/link'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Zap, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowUpRight,
  Calendar,
  Target,
  Award,
  Activity,
  BarChart3,
  MessageSquare,
  Globe,
  Sparkles,
  Mic,
  Image,
  CreditCard,
  Settings
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [chartData, setChartData] = useState<any>({
    usage: [],
    contentTypes: [],
    languages: []
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user needs onboarding
    if (user && !user.onboardingCompleted) {
      setShowOnboarding(true)
    }
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard analytics
      const [dashboardResponse, subscriptionResponse] = await Promise.all([
        analyticsApi.getDashboardStats(),
        subscriptionApi.getSubscription()
      ])

      if (dashboardResponse.data.success) {
        setDashboardData(dashboardResponse.data.data)
      }

      if (subscriptionResponse.data.success) {
        setSubscriptionData(subscriptionResponse.data.data)
      }

      // Generate mock chart data (replace with real API calls)
      setChartData({
        usage: [
          { name: 'Mon', content: 12, audio: 3, images: 5 },
          { name: 'Tue', content: 19, audio: 5, images: 8 },
          { name: 'Wed', content: 15, audio: 2, images: 6 },
          { name: 'Thu', content: 25, audio: 8, images: 12 },
          { name: 'Fri', content: 22, audio: 6, images: 9 },
          { name: 'Sat', content: 18, audio: 4, images: 7 },
          { name: 'Sun', content: 16, audio: 3, images: 5 }
        ],
        contentTypes: [
          { name: 'Blog Posts', value: 45 },
          { name: 'Social Media', value: 30 },
          { name: 'Emails', value: 15 },
          { name: 'Product Descriptions', value: 10 }
        ],
        languages: [
          { name: 'English', value: 60 },
          { name: 'Twi', value: 25 },
          { name: 'Ga', value: 10 },
          { name: 'Ewe', value: 5 }
        ]
      })

      // Generate mock recent activity
      setRecentActivity([
        {
          id: '1',
          type: 'content',
          title: 'Blog post generated',
          description: 'Created content about mobile money benefits',
          status: 'success',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          metadata: { language: 'en', wordCount: 850, tokens: 1200 }
        },
        {
          id: '2',
          type: 'audio',
          title: 'Audio transcribed',
          description: 'Transcribed customer interview',
          status: 'success',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          metadata: { language: 'tw', duration: 180 }
        },
        {
          id: '3',
          type: 'content',
          title: 'Social media post',
          description: 'Generated promotional content',
          status: 'success',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          metadata: { language: 'en', wordCount: 120, tokens: 180 }
        }
      ])

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    fetchDashboardData()
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  const quickActions = [
    { 
      label: 'Generate Content', 
      href: '/dashboard/ai-generator', 
      icon: Sparkles, 
      color: 'bg-purple-500',
      description: 'Create AI-powered content'
    },
    { 
      label: 'Transcribe Audio', 
      href: '/dashboard/audio', 
      icon: Mic, 
      color: 'bg-blue-500',
      description: 'Convert speech to text'
    },
    { 
      label: 'View Analytics', 
      href: '/dashboard/analytics', 
      icon: BarChart3, 
      color: 'bg-green-500',
      description: 'Track your performance'
    },
    { 
      label: 'Subscription', 
      href: '/dashboard/subscription', 
      icon: CreditCard, 
      color: 'bg-orange-500',
      description: 'Manage your plan'
    },
  ]

  const achievements = [
    { 
      label: 'First Generation', 
      unlocked: (subscriptionData?.usage?.contentGenerations?.used || 0) > 0, 
      icon: Award 
    },
    { 
      label: '10 Generations', 
      unlocked: (subscriptionData?.usage?.contentGenerations?.used || 0) >= 10, 
      icon: Award 
    },
    { 
      label: '100 Generations', 
      unlocked: (subscriptionData?.usage?.contentGenerations?.used || 0) >= 100, 
      icon: Award 
    },
    { 
      label: 'Audio Expert', 
      unlocked: (subscriptionData?.usage?.audioTranscriptions?.used || 0) >= 5, 
      icon: Award 
    },
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Welcome Header */}
        <div className="mb-6 md:mb-8 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Link
              href="/dashboard/ai-generator"
              className="hidden md:flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span>Create Content</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Content Generated"
            value={subscriptionData?.usage?.contentGenerations?.used || 0}
            change={{ value: 12, type: 'increase', period: 'this week' }}
            icon={FileText}
            color="purple"
            loading={loading}
          />
          <StatCard
            title="Audio Transcribed"
            value={subscriptionData?.usage?.audioTranscriptions?.used || 0}
            change={{ value: 8, type: 'increase', period: 'this week' }}
            icon={Mic}
            color="blue"
            loading={loading}
          />
          <StatCard
            title="Images Created"
            value={subscriptionData?.usage?.imageGenerations?.used || 0}
            change={{ value: 15, type: 'increase', period: 'this week' }}
            icon={Image}
            color="green"
            loading={loading}
          />
          <StatCard
            title="API Calls"
            value={subscriptionData?.usage?.apiCalls?.used || 0}
            icon={Zap}
            color="yellow"
            loading={loading}
          />
        </div>

        {/* Charts and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity activities={recentActivity} loading={loading} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={index}
                      href={action.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className={`p-2 ${action.color} rounded-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {action.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/20 rounded-xl shadow-sm border border-primary/20 p-4 sm:p-5 md:p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-primary" />
                Achievements
              </h2>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}>
                      <Award className="w-4 h-4" />
                    </div>
                    <span className={`text-sm ${
                      achievement.unlocked 
                        ? 'text-gray-900 dark:text-white font-medium' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {achievement.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            data={chartData.usage}
            type="area"
            title="Weekly Usage Trends"
            dataKey="content"
            color="#3b82f6"
            height={300}
          />
          <AnalyticsChart
            data={chartData.contentTypes}
            type="pie"
            title="Content Types Distribution"
            dataKey="value"
            height={300}
          />
        </div>

        {/* Subscription Status */}
        {subscriptionData && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Current Plan: {subscriptionData.currentPlan}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subscriptionData.status === 'trial' && subscriptionData.trialDaysRemaining 
                    ? `${subscriptionData.trialDaysRemaining} days left in trial`
                    : `Status: ${subscriptionData.status}`
                  }
                </p>
              </div>
              <Link
                href="/dashboard/subscription"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Manage Plan
              </Link>
            </div>
            
            {/* Usage Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(subscriptionData.usage || {}).map(([key, usage]: [string, any]) => (
                <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {usage.used}/{usage.limit === -1 ? '∞' : usage.limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: usage.limit === -1 ? '0%' : `${Math.min((usage.used / usage.limit) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
