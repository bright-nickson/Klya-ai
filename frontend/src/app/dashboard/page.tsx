'use client'

import React, { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatCard } from '@/components/dashboard/StatCard'
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { useAuth } from '@/contexts/AuthContext'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { analyticsApi, subscriptionApi, contentApi, audioApi } from '@/lib/api'
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
  // Define types for our data
  interface DashboardData {
    totalContent?: number;
    totalAudioTranscriptions?: number;
    totalImageGenerations?: number;
  }

  interface SubscriptionData {
    status?: string;
    plan?: string;
    trialDaysRemaining?: number;
    usage?: {
      contentGenerations?: { used: number; limit: number };
      audioTranscriptions?: { used: number; limit: number };
      imageGenerations?: { used: number; limit: number };
      apiCalls?: { used: number; limit: number };
    };
    features?: string[];
  }

  interface ChartData {
    usage: Array<{
      name: string;
      content: number;
      audio: number;
      images: number;
    }>;
    contentTypes: any[];
    languages: any[];
  }

  type ActivityType = 'content' | 'audio' | 'image' | 'api';
  
  interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    status: 'success' | 'pending' | 'failed';
    timestamp: string;
    metadata: Record<string, any>;
  }

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [chartData, setChartData] = useState<ChartData>({
    usage: [],
    contentTypes: [],
    languages: []
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiErrors, setApiErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Check if user needs onboarding
    if (user && !user.onboardingCompleted) {
      setShowOnboarding(true)
    }
    // Only fetch dashboard data if user is authenticated
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setApiErrors({});
      
      // Define a type for our API responses
      type ApiResponse<T> = {
        data?: {
          success: boolean;
          data: T;
          message?: string;
        };
        error?: boolean;
        message?: string;
      };

      // Define a proper type for API responses with error handling
      type ApiResponseWrapper<T> = {
        data?: {
          success: boolean;
          data: T;
          message?: string;
        };
        error?: boolean;
        message?: string;
      };

      // Helper function to wrap API calls with error handling
      const wrapApiCall = async <T,>(
        promise: Promise<{ data: T }>,
        errorMessage: string
      ): Promise<{ data?: T; error?: boolean; message?: string }> => {
        try {
          const res = await promise;
          return { data: res.data };
        } catch (error: any) {
          return {
            error: true,
            message: error.response?.data?.message || errorMessage
          };
        }
      };

      // Fetch all data in parallel with proper typing
      const [
        dashboardResponse,
        subscriptionResponse,
        usageAnalyticsResponse,
        contentAnalyticsResponse,
        contentHistoryResponse,
        audioHistoryResponse
      ] = await Promise.all([
        wrapApiCall(analyticsApi.getDashboardStats(), 'Failed to load dashboard stats'),
        wrapApiCall(subscriptionApi.getSubscription(), 'Failed to load subscription data'),
        wrapApiCall(analyticsApi.getUsageAnalytics('week'), 'Failed to load usage analytics'),
        wrapApiCall(analyticsApi.getContentAnalytics('month'), 'Failed to load content analytics'),
        wrapApiCall(contentApi.getHistory(1, 5), 'Failed to load content history'),
        wrapApiCall(audioApi.getTranscriptions(1, 5), 'Failed to load audio transcriptions')
      ]);

      // Helper function to process API responses
      const processResponse = (
        response: PromiseSettledResult<ApiResponse<any>>, 
        setter: (data: any) => void, 
        errorKey: string
      ): boolean => {
        if (response.status === 'fulfilled' && !response.value.error && response.value.data?.success) {
          setter(response.value.data.data);
          return true;
        } else {
          const errorMessage = response.status === 'rejected' 
            ? response.reason?.message || 'Unknown error occurred'
            : response.value?.message || 'Failed to load data';
          
          setApiErrors(prev => ({
            ...prev,
            [errorKey]: errorMessage
          }));
          return false;
        }
      };

      // Process dashboard and subscription responses
      if (!dashboardResponse.error && dashboardResponse.data) {
        setDashboardData(dashboardResponse.data as DashboardData);
      } else if (dashboardResponse.error) {
        setApiErrors(prev => ({
          ...prev,
          dashboard: dashboardResponse.message || 'Failed to load dashboard data'
        }));
      }

      if (!subscriptionResponse.error && subscriptionResponse.data) {
        setSubscriptionData(subscriptionResponse.data as SubscriptionData);
      } else if (subscriptionResponse.error) {
        setApiErrors(prev => ({
          ...prev,
          subscription: subscriptionResponse.message || 'Failed to load subscription data'
        }));
      }
      
      // Process usage analytics with fallback to empty array
      if (!usageAnalyticsResponse.error && usageAnalyticsResponse.data?.data) {
        const dashboardData = usageAnalyticsResponse.data.data;
        
        // Convert the usage data to the format expected by the chart
        const usageChartData = [{
          name: 'Usage',
          content: dashboardData.usage?.contentGenerations || 0,
          audio: dashboardData.usage?.audioTranscriptions || 0,
          images: dashboardData.usage?.imageGenerations || 0
        }];
        
        setChartData(prev => ({
          ...prev,
          usage: usageChartData
        }));
      } else if (usageAnalyticsResponse.error) {
        setApiErrors(prev => ({
          ...prev,
          usageAnalytics: usageAnalyticsResponse.message || 'Failed to load usage analytics'
        }));
      }

      // Process content analytics with fallback to empty arrays
      if (!contentAnalyticsResponse.error && contentAnalyticsResponse.data?.data) {
        const contentData = contentAnalyticsResponse.data.data;
        
        // Use the data from the dashboard endpoint for content types and languages
        const contentTypes = contentData.overview?.contentTypes || [];
        const languages = contentData.overview?.languages || [];
        
        // Convert to chart format
        const contentTypesChartData = Array.isArray(contentTypes) 
          ? contentTypes.map((item: any) => ({
              name: item._id || 'Unknown',
              value: item.count || 0
            }))
          : [];
          
        const languagesChartData = Array.isArray(languages)
          ? languages.map((item: any) => ({
              name: item._id || 'Unknown',
              value: item.count || 0
            }))
          : [];
        
        setChartData((prev: any) => ({
          ...prev,
          contentTypes: contentTypesChartData,
          languages: languagesChartData
        }));
      }

      // Process recent activity
      const recentActivities = [];
      
      // Process content history with fallback to empty array
      if (!contentHistoryResponse.error && contentHistoryResponse.data) {
        const contentItems = Array.isArray(contentHistoryResponse.data) 
          ? contentHistoryResponse.data 
          : [];
        if (Array.isArray(contentItems)) {
          recentActivities.push(
            ...contentItems.map((item: any) => ({
              id: item.id || Math.random().toString(36).substr(2, 9),
              type: 'content' as const,
              title: `Generated: ${item.type || 'Content'}`,
              description: item.title || 'New content generated',
              status: 'success' as const,
              timestamp: item.createdAt || new Date().toISOString(),
              metadata: {
                language: item.language || 'en',
                wordCount: item.wordCount || 0,
                tokens: item.tokenCount || 0
              }
            }))
          );
        }
      }

      // Process audio history with fallback to empty array
      if (!audioHistoryResponse.error && audioHistoryResponse.data) {
        const audioItems = Array.isArray(audioHistoryResponse.data)
          ? audioHistoryResponse.data
          : [];
        if (Array.isArray(audioItems)) {
          recentActivities.push(
            ...audioItems.map((item: any) => ({
              id: item.id || Math.random().toString(36).substr(2, 9),
              type: 'audio' as const,
              title: 'Audio Transcribed',
              description: item.filename || 'Audio file processed',
              status: item.status === 'success' ? 'success' as const : 'failed' as const,
              timestamp: item.createdAt || new Date().toISOString(),
              metadata: {
                language: item.language || 'en',
                duration: item.duration || 0
              }
            }))
          );
        }
      }
      
      // Add fallback data if no activities found
      if (recentActivities.length === 0) {
        recentActivities.push({
          id: '1',
          type: 'content' as const,
          title: 'Welcome to Klya AI',
          description: 'Get started by creating your first content',
          status: 'success' as const,
          timestamp: new Date().toISOString(),
          metadata: {}
        });
      }

      // Sort activities by timestamp and take the 5 most recent
      const sortedActivities = recentActivities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      setRecentActivity(sortedActivities);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setApiErrors({
        general: 'Failed to load dashboard data. Please try again later.'
      });
    } finally {
      setLoading(false);
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
      description: 'Create AI-powered content',
      disabled: false
    },
    { 
      label: 'Transcribe Audio', 
      href: '/dashboard/audio', 
      icon: Mic, 
      color: 'bg-blue-500',
      description: 'Convert speech to text',
      disabled: !subscriptionData?.features?.includes('audio_transcription')
    },
    { 
      label: 'View Analytics', 
      href: '/dashboard/analytics', 
      icon: BarChart3, 
      color: 'bg-green-500',
      description: 'Track your performance',
      disabled: false
    },
    { 
      label: subscriptionData?.status === 'active' ? 'Manage Subscription' : 'Upgrade', 
      href: '/dashboard/subscription', 
      icon: CreditCard, 
      color: 'bg-orange-500',
      description: subscriptionData?.status === 'active' ? 'Manage your plan' : 'Upgrade your plan',
      disabled: false
    },
  ]

  const achievements = [
    { 
      label: 'First Generation', 
      unlocked: (dashboardData?.totalContent || 0) > 0, 
      icon: Award,
      description: 'Created your first piece of content'
    },
    { 
      label: 'Content Creator', 
      unlocked: (dashboardData?.totalContent || 0) >= 10, 
      icon: Award,
      description: 'Created 10+ pieces of content'
    },
    { 
      label: 'Power User', 
      unlocked: (dashboardData?.totalContent || 0) >= 50, 
      icon: Award,
      description: 'Created 50+ pieces of content'
    },
    { 
      label: 'Audio Expert', 
      unlocked: (dashboardData?.totalAudioTranscriptions || 0) >= 5, 
      icon: Award,
      description: 'Transcribed 5+ audio files'
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
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      href={action.href}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      onClick={(e) => action.disabled ? e.preventDefault() : null}
                    >
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {action.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {action.description}
                        </p>
                      </div>
                      {!action.disabled && (
                        <ArrowUpRight className="w-4 h-4 text-gray-400" />
                      )}
                    </Link>
                  );
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
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subscriptionData?.status === 'trial' && subscriptionData?.trialDaysRemaining 
                    ? `${subscriptionData.trialDaysRemaining} days left in trial`
                    : `Status: ${subscriptionData?.status}`
                  }
                </p>
              </div>
              <Link
                href="/dashboard/subscription"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Manage Plan
              </Link>
              {subscriptionData?.usage && Object.entries(subscriptionData.usage).map(([type, usage]: [string, any]) => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span>
                      {usage.used}/{usage.limit === -1 ? '∞' : usage.limit}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
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
