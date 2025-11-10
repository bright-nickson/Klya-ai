'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Mic, 
  Image, 
  MessageSquare, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'content' | 'audio' | 'image' | 'api'
  title: string
  description: string
  status: 'success' | 'failed' | 'pending'
  timestamp: string
  metadata?: {
    language?: string
    wordCount?: number
    duration?: number
    tokens?: number
  }
}

interface RecentActivityProps {
  activities?: ActivityItem[]
  loading?: boolean
  error?: Error | null
}

const activityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  content: FileText,
  audio: Mic,
  image: Image,
  api: MessageSquare
}

const statusIcons = {
  success: CheckCircle,
  failed: XCircle,
  pending: AlertCircle
}

const statusColors = {
  success: 'text-green-600 dark:text-green-400',
  failed: 'text-red-600 dark:text-red-400',
  pending: 'text-yellow-600 dark:text-yellow-400'
}

function RecentActivityContent({ activities = [], loading = false, error = null }: RecentActivityProps) {
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-red-200 dark:border-red-800">
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Failed to load activities
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {error.message || 'An error occurred while loading recent activities.'}
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No recent activity yet. Start generating content to see your activity here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm text-primary hover:underline"
        >
          Refresh
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => {
          const ActivityIcon = activityIcons[activity.type] || FileText
          const StatusIcon = statusIcons[activity.status]
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <ActivityIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-1">
                    <StatusIcon className={`w-4 h-4 ${statusColors[activity.status]}`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {activity.description}
                </p>
                
                {activity.metadata && (
                  <div className="flex flex-wrap gap-2">
                    {activity.metadata.language && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {getLanguageName(activity.metadata.language)}
                      </span>
                    )}
                    {activity.metadata.wordCount && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {activity.metadata.wordCount} words
                      </span>
                    )}
                    {activity.metadata.duration && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {formatDuration(activity.metadata.duration)}
                      </span>
                    )}
                    {activity.metadata.tokens && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {activity.metadata.tokens} tokens
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Wrap the component with error boundary
export function RecentActivityWithBoundary(props: RecentActivityProps) {
  return (
    <ErrorBoundary>
      <RecentActivity {...props} />
    </ErrorBoundary>
  )
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-red-200 dark:border-red-800">
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main component with error boundary
export function RecentActivity({ activities = [], loading = false, error = null }: RecentActivityProps) {
  const [localActivities, setLocalActivities] = useState<ActivityItem[]>(activities);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setLocalActivities(activities);
  }, [activities]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Refresh activities"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error ? (
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {error.message || 'Failed to load activities'}
            </p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Try Again'}
            </button>
          </div>
        ) : loading || isRefreshing ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : localActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {localActivities.map((activity) => {
              const ActivityIcon = activityIcons[activity.type] || FileText;
              const StatusIcon = statusIcons[activity.status] || Clock;
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 group">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <ActivityIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                    {activity.metadata && (
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        {activity.metadata.language && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            {getLanguageName(activity.metadata.language)}
                          </span>
                        )}
                        {activity.metadata.wordCount && (
                          <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                            {activity.metadata.wordCount} words
                          </span>
                        )}
                        {activity.metadata.duration && (
                          <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                            {formatDuration(activity.metadata.duration)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <StatusIcon 
                      className={`w-4 h-4 ${
                        activity.status === 'success' 
                          ? 'text-green-500' 
                          : activity.status === 'failed' 
                            ? 'text-red-500' 
                            : 'text-yellow-500'
                      }`} 
                    />
                    <span className="mt-1 text-xs text-gray-400">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return date.toLocaleDateString()
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: 'English',
    tw: 'Twi',
    ga: 'Ga',
    ew: 'Ewe',
    ha: 'Hausa'
  }
  return languages[code] || code.toUpperCase()
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
