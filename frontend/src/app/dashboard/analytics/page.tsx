'use client'

import React, { useState } from 'react'
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
  Activity
} from 'lucide-react'

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    contentGenerations: [12, 19, 15, 25, 22, 30, 28],
    successRate: [95, 92, 98, 94, 96, 93, 97]
  }

  const languageStats = [
    { language: 'English', count: 145, percentage: 48 },
    { language: 'Twi', count: 89, percentage: 30 },
    { language: 'Ga', count: 42, percentage: 14 },
    { language: 'Ewe', count: 24, percentage: 8 }
  ]

  const contentTypeStats = [
    { type: 'Blog Posts', count: 78, color: 'bg-purple-500' },
    { type: 'Social Media', count: 124, color: 'bg-blue-500' },
    { type: 'Product Descriptions', count: 56, color: 'bg-green-500' },
    { type: 'Email Campaigns', count: 42, color: 'bg-orange-500' }
  ]

  return (
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

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 md:mb-8">
            {[
              { icon: FileText, value: '300', label: 'Total Content Generated', change: '+12.5%', positive: true, color: 'purple', delay: 0.9 },
              { icon: TrendingUp, value: '95.3%', label: 'Average Success Rate', change: '+8.2%', positive: true, color: 'blue', delay: 1.0 },
              { icon: Globe, value: languageStats.reduce((sum, lang) => sum + lang.count, 0), label: 'Multi-language Content', change: '4 Languages', positive: null, color: 'green', delay: 1.1 },
              { icon: Zap, value: '42', label: 'This Week', change: '+15.3%', positive: true, color: 'orange', delay: 1.2 }
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
                {languageStats.map((lang, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 2.2 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {lang.language}
                      </span>
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 2.3 + index * 0.1 }}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        {lang.count} ({lang.percentage}%)
                      </motion.span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${lang.percentage}%` }}
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
              {contentTypeStats.map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 2.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      className={`w-3 h-3 rounded-full ${item.color}`} 
                    />
                    <motion.span 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 2.9 + index * 0.1, type: 'spring' }}
                      className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      {item.count}
                    </motion.span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{item.type}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Peak Usage Times */}
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
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
                <div key={dayIndex} className="text-center">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {day}
                  </div>
                  <div className="space-y-1">
                    {[...Array(24)].map((_, hourIndex) => {
                      const intensity = Math.random()
                      return (
                        <div
                          key={hourIndex}
                          className={`h-2 rounded ${
                            intensity > 0.7 ? 'bg-primary' :
                            intensity > 0.4 ? 'bg-primary/50' :
                            intensity > 0.2 ? 'bg-primary/25' :
                            'bg-gray-200 dark:bg-gray-700'
                          }`}
                          title={`${hourIndex}:00 - ${intensity > 0.5 ? 'High' : 'Low'} activity`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
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
  )
}
