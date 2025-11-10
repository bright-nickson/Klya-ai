'use client'

import React, { useState, useEffect, Fragment } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  FileText,
  Globe,
  Zap,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Loader2
} from 'lucide-react'
import { analyticsApi } from '@/lib/api'
import { toast } from 'sonner'

interface AnalyticsData {
  totalContent: number
  successRate: number
  totalLanguages: number
  weeklyUsage: number
  weeklyChange: number
  contentByType: Array<{ _id: string; count: number }>
  contentByLanguage: Array<{ _id: string; count: number }>
  weeklyTrend: Array<{ date: string; count: number }>
}

const initialAnalyticsData: AnalyticsData = {
  totalContent: 0,
  successRate: 0,
  totalLanguages: 0,
  weeklyUsage: 0,
  weeklyChange: 0,
  contentByType: [],
  contentByLanguage: [],
  weeklyTrend: []
}

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(initialAnalyticsData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [dashboardResponse, contentHistoryResponse] = await Promise.all([
          analyticsApi.getDashboardStats(),
          analyticsApi.getContentAnalytics(selectedPeriod as 'week' | 'month' | 'year')
        ])

        if (!dashboardResponse.data) {
          throw new Error('Failed to load dashboard data')
        }

        if (!contentHistoryResponse.data) {
          throw new Error('Failed to load content history')
        }

        const dashboardData = dashboardResponse.data.data || {}
        const contentData = contentHistoryResponse.data.data || {}

        // Map the API response to our AnalyticsData interface
        const mappedData: AnalyticsData = {
          totalContent: dashboardData.totalContent || 0,
          successRate: dashboardData.successRate || 0,
          totalLanguages: dashboardData.languages?.length || 0,
          weeklyUsage: dashboardData.weeklyUsage || 0,
          weeklyChange: dashboardData.weeklyChange || 0,
          contentByType: contentData.contentByType || [],
          contentByLanguage: contentData.contentByLanguage || [],
          weeklyTrend: contentData.weeklyTrend || []
        }

        setAnalyticsData(mappedData)
      } catch (err) {
        console.error('Error fetching analytics data:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        toast.error('Failed to load analytics data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [selectedPeriod])

  // Generate chart data from the API response
  const chartData = {
    labels: (analyticsData.weeklyTrend || []).map(item => 
      item?.date ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }) : ''
    ) || [],
    contentGenerations: (analyticsData.weeklyTrend || []).map(item => item?.count || 0) || [],
    successRate: Array(analyticsData.weeklyTrend?.length || 0).fill(analyticsData.successRate || 0)
  }

  // Map content type data for the UI
  const contentTypeStats = (analyticsData.contentByType || []).map((item, index) => ({
    type: (item && item._id) ? String(item._id) : 'Unknown',
    count: (item && typeof item.count === 'number') ? item.count : 0,
    color: [
      'bg-purple-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500'
    ][index % 6] || 'bg-gray-500'
  }))

  // Use Fragment to ensure proper JSX structure
  return (
    <Fragment>
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 md:mb-8"
            >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"
                >
                  <Activity className="w-7 h-7 text-primary animate-pulse" />
                  Analytics Dashboard
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
                >
                  Track your content performance and usage metrics
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center space-x-3"
              >
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Time Period Selector */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            {['7days', '30days', '90days', 'custom'].map((period, index) => (
              <motion.button
                key={period}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {period === '7days' && 'Last 7 Days'}
                {period === '30days' && 'Last 30 Days'}
                {period === '90days' && 'Last 90 Days'}
                {period === 'custom' && 'Custom Range'}
              </motion.button>
            ))}
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Loading analytics data...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
              <p>Error loading analytics data: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Key Metrics */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 md:mb-8">
              {[
                { 
                  icon: FileText, 
                  value: analyticsData.totalContent.toLocaleString(), 
                  label: 'Total Content Generated', 
                  change: `${analyticsData.weeklyChange >= 0 ? '+' : ''}${analyticsData.weeklyChange.toFixed(1)}%`, 
                  positive: analyticsData.weeklyChange >= 0, 
                  color: 'purple', 
                  delay: 0.9 
                },
                { 
                  icon: TrendingUp, 
                  value: `${analyticsData.successRate.toFixed(1)}%`, 
                  label: 'Average Success Rate', 
                  change: `${analyticsData.weeklyChange >= 0 ? '+' : ''}${analyticsData.weeklyChange.toFixed(1)}%`, 
                  positive: analyticsData.weeklyChange >= 0, 
                  color: 'blue', 
                  delay: 1.0 
                },
                { 
                  icon: Globe, 
                  value: analyticsData.totalLanguages.toString(), 
                  label: 'Languages Used', 
                  change: `${analyticsData.contentByLanguage.length} Languages`, 
                  positive: null, 
                  color: 'green', 
                  delay: 1.1 
                },
                { 
                  icon: Zap, 
                  value: analyticsData.weeklyUsage.toString(), 
                  label: 'This Week', 
                  change: `${analyticsData.weeklyChange >= 0 ? '+' : ''}${analyticsData.weeklyChange.toFixed(1)}%`, 
                  positive: analyticsData.weeklyChange >= 0, 
                  color: 'orange', 
                  delay: 1.2 
                }
              ].map((metric, index) => {
                const Icon = metric.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: metric.delay }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`p-3 bg-${metric.color}-100 dark:bg-${metric.color}-900/30 rounded-lg`}
                      >
                        <Icon className={`w-6 h-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                      </motion.div>
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: metric.delay + 0.2 }}
                        className={`text-xs font-medium flex items-center gap-1 ${
                          metric.positive === true ? 'text-green-600 dark:text-green-400' : 
                          metric.positive === false ? 'text-red-600 dark:text-red-400' : 
                          'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {metric.positive === true && <ArrowUpRight className="w-3 h-3" />}
                        {metric.positive === false && <ArrowDownRight className="w-3 h-3" />}
                        {metric.change}
                      </motion.span>
                    </div>
                    <motion.h3 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: metric.delay + 0.3 }}
                      className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1"
                    >
                      {metric.value}
                    </motion.h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                  </motion.div>
                )
              })}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Content Generation Trend */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5 text-primary" />
                Content Generation Trend
              </motion.h2>
              <div className="h-64 flex items-end justify-between space-x-2">
                {chartData.contentGenerations.map((value, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg relative" style={{ height: '200px' }}>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(value / Math.max(...chartData.contentGenerations)) * 100}%` }}
                        transition={{ duration: 0.8, delay: 1.5 + index * 0.1, type: 'spring' }}
                        whileHover={{ scale: 1.05 }}
                        className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-primary/70 rounded-t-lg transition-all hover:from-primary/90 hover:to-primary/60 cursor-pointer"
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {chartData.labels[index]}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Language Distribution */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
              >
                <Globe className="w-5 h-5 text-primary" />
                Language Distribution
              </motion.h2>
              <div className="space-y-4">
                {analyticsData.contentByLanguage.slice(0, 4).map((lang, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 2.2 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {lang._id || 'Unknown'}
                      </span>
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 2.3 + index * 0.1 }}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        {lang.count} ({Math.round((lang.count / Math.max(1, analyticsData.contentByLanguage.reduce((sum, l) => sum + l.count, 0))) * 100)}%)
                      </motion.span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.round((lang.count / Math.max(1, analyticsData.contentByLanguage.reduce((sum, l) => sum + l.count, 0))) * 100)}%`
                        }}
                        transition={{ duration: 1, delay: 2.4 + index * 0.1, type: 'spring' }}
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Content Type Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6 mb-6 md:mb-8"
          >
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.7 }}
              className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
            >
              <FileText className="w-5 h-5 text-primary" />
              Content Type Breakdown
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {contentTypeStats.slice(0, 4).map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 2.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-3 h-3 rounded-full ${item.color} ${isLoading ? 'animate-pulse' : ''}`} />
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 2.9 + index * 0.1 }}
                      className="text-xs font-medium flex items-center gap-1 text-gray-600 dark:text-gray-400"
                    >
                      {item.count}
                    </motion.span>
                  </div>
                  <motion.h3 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 3.0 + index * 0.1 }}
                    className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1"
                  >
                    {item.type}
                  </motion.h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate" title={item.type}>
                    {item.type}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6"
          >
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 3.3 }}
              className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5 text-primary" />
              Peak Usage Times
            </motion.h2>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Peak usage data will be available after more usage data is collected.</p>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                <span>Low</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary/25 rounded" />
                <span>Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded" />
                <span>High</span>
              </div>
            </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </Fragment>
  )
}
