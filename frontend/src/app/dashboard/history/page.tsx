'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  Copy,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface HistoryItem {
  id: string;
  action: string;
  type: 'blog_post' | 'social_media' | 'email' | 'product_description' | 'invoice' | 'other';
  language: 'en' | 'tw' | 'ga' | 'ew' | 'ha';
  status: 'success' | 'failed' | 'processing';
  timestamp: string;
  wordCount?: number;
  preview?: string;
}

const typeMap = {
  blog_post: 'Blog Post',
  social_media: 'Social Media',
  email: 'Email',
  product_description: 'Product Description',
  invoice: 'Invoice',
  other: 'Other'
} as const;

const languageMap = {
  en: 'English',
  tw: 'Twi',
  ga: 'Ga',
  ew: 'Ewe',
  ha: 'Hausa'
} as const;

export default function History() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])

  // Fetch history data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // In a real app, you would fetch this from your API
        // const response = await fetch('/api/history')
        // if (!response.ok) throw new Error('Failed to fetch history')
        // const data = await response.json()
        // setHistoryItems(data)
        
        // For now, we'll set an empty array
        setHistoryItems([])
      } catch (err) {
        console.error('Error fetching history:', err)
        setError('Failed to load history. Please try again.')
        toast.error('Failed to load history')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
                         item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.preview && item.preview.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesType
  })

  const contentTypes = ['all', ...Object.values(typeMap)]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content History</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and manage your generated content history
              </p>
            </div>
            {historyItems.length > 0 && (
              <div className="mt-4 md:mt-0">
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={isLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export History
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && historyItems.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Clock className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No history yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Your generated content will appear here
              </p>
              <button
                onClick={() => router.push('/dashboard/generate')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Generate Content
              </button>
            </div>
          )}

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                disabled={isLoading}
              >
                {contentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">More Filters</span>
              </button>
            </div>
          </div>

          {/* History List */}
          {!isLoading && !error && historyItems.length > 0 && (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="relative w-full sm:w-64 mb-4 sm:mb-0 sm:mr-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Search history..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="type-filter" className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                      Filter by type:
                    </label>
                    <select
                      id="type-filter"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="all">All Types</option>
                      <option value="blog_post">Blog Post</option>
                      <option value="social_media">Social Media</option>
                      <option value="email">Email</option>
                      <option value="product_description">Product Description</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`p-2 rounded-lg ${
                            item.status === 'success' 
                              ? 'bg-green-100 dark:bg-green-900/30' 
                              : 'bg-red-100 dark:bg-red-900/30'
                          }`}>
                            {item.status === 'success' ? (
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.action}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {item.timestamp}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                {item.type}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                {item.language}
                              </span>
                              {item.wordCount && item.wordCount > 0 ? (
                                <span>{item.wordCount} words</span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {item.preview}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {item.status === 'success' && (
                          <>
                            <button 
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              title="Copy"
                            >
                              <Copy className="w-5 h-5" />
                            </button>
                            <button 
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              title="Download"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button 
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredItems.length} of {historyItems.length} items
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
