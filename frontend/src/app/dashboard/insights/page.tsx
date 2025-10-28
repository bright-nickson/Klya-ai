'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, MapPin, Users, Calendar, Zap, Target, BarChart3, PieChart as PieChartIcon } from 'lucide-react'

// Dummy data for charts
const engagementOverTime = [
  { week: 'Week 1', engagement: 2400 },
  { week: 'Week 2', engagement: 1398 },
  { week: 'Week 3', engagement: 9800 },
  { week: 'Week 4', engagement: 3908 },
  { week: 'Week 5', engagement: 4800 },
  { week: 'Week 6', engagement: 3800 },
  { week: 'Week 7', engagement: 4300 },
  { week: 'Week 8', engagement: 5200 }
]

const platformData = [
  { platform: 'Facebook', engagement: 4200 },
  { platform: 'Instagram', engagement: 3800 },
  { platform: 'TikTok', engagement: 5100 },
  { platform: 'X (Twitter)', engagement: 2900 }
]

const regionalData = [
  { region: 'Accra', engagement: 3500, percentage: 35 },
  { region: 'Kumasi', engagement: 2800, percentage: 28 },
  { region: 'Takoradi', engagement: 1500, percentage: 15 },
  { region: 'Tamale', engagement: 1200, percentage: 12 },
  { region: 'Cape Coast', engagement: 1000, percentage: 10 }
]

const contentTypeData = [
  { type: 'Video', engagement: 85 },
  { type: 'Image', engagement: 72 },
  { type: 'Text', engagement: 65 },
  { type: 'Audio', engagement: 58 },
  { type: 'Mixed', engagement: 78 }
]

const aiInsights = [
  {
    icon: TrendingUp,
    title: "Instagram Growth Surge",
    description: "Instagram engagement increased by 24% this week.",
    trend: "+24%",
    color: "text-green-500"
  },
  {
    icon: MapPin,
    title: "Kumasi Connection",
    description: "Your audience in Kumasi engages most with short video posts.",
    trend: "Top Region",
    color: "text-blue-500"
  },
  {
    icon: Calendar,
    title: "Friday Power Hours",
    description: "Friday evenings generate 30% higher engagement than weekdays.",
    trend: "+30%",
    color: "text-purple-500"
  },
  {
    icon: Target,
    title: "Consistency Boost",
    description: "Posting consistency improved by 18% month-over-month.",
    trend: "+18%",
    color: "text-orange-500"
  }
]

// Chart colors
const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

export default function InsightsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [contentFilter, setContentFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<'7d' | '14d' | '30d'>('30d')

  useEffect(() => {
    // Trigger fade-in animation
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Simulate filtered datasets (in real app, fetch from backend with these params)
  const filteredLineData = useMemo(() => {
    const limit = dateRange === '7d' ? 7 : dateRange === '14d' ? 14 : 8 // we have 8 dummy points
    return engagementOverTime.slice(-limit)
  }, [dateRange])

  const filteredBarData = useMemo(() => {
    if (platformFilter === 'all') return platformData
    return platformData.filter(p => p.platform.toLowerCase().includes(platformFilter))
  }, [platformFilter])

  const filteredPieData = useMemo(() => regionalData, [])
  const filteredRadarData = useMemo(() => {
    if (contentFilter === 'all') return contentTypeData
    return contentTypeData.filter(c => c.type.toLowerCase() === contentFilter)
  }, [contentFilter])

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Page Header */}
        <div className="mb-6 md:mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Where You're Booming 📊
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                See where your content thrives across Ghana and beyond.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <BarChart3 className="w-4 h-4" />
              <span>Live Analytics</span>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7d' | '14d' | '30d')}
              className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="14d">Last 14 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Platform</label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">X (Twitter)</option>
            </select>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Content Type</label>
            <select
              value={contentFilter}
              onChange={(e) => setContentFilter(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="text">Text</option>
              <option value="audio">Audio</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/70 dark:border-blue-800/40 rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Filters active</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {dateRange.toUpperCase()} · {platformFilter === 'all' ? 'All Platforms' : platformFilter} · {contentFilter === 'all' ? 'All Types' : contentFilter}
              </p>
            </div>
            <button
              onClick={() => { setDateRange('30d'); setPlatformFilter('all'); setContentFilter('all') }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset
            </button>
          </div>
        </div>
        {/* Charts Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Engagement Over Time */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Engagement Over Time
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Last 8 weeks</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredLineData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="week" 
                    className="text-xs text-gray-600 dark:text-gray-400"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    className="text-xs text-gray-600 dark:text-gray-400"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#374151'
                    }}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performing Platforms */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
                Top Performing Platforms
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">This month</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredBarData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="platform" 
                    className="text-xs text-gray-600 dark:text-gray-400"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    className="text-xs text-gray-600 dark:text-gray-400"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#374151'
                    }}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey="engagement" 
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Heat Representation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-500" />
                Regional Performance
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Ghana regions</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ region, percentage }) => `${region} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="engagement"
                  >
                    {regionalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#374151'
                    }}
                    labelStyle={{ color: '#374151' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Content Type Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <PieChartIcon className="w-5 h-5 mr-2 text-orange-500" />
                Content Type Performance
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Engagement intensity</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={filteredRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="type" 
                    className="text-xs text-gray-600 dark:text-gray-400"
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    className="text-xs text-gray-600 dark:text-gray-400"
                  />
                  <Radar
                    name="Engagement"
                    dataKey="engagement"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#374151'
                    }}
                    labelStyle={{ color: '#374151' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-500" />
              AI-Powered Insights
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Smart recommendations based on your content performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiInsights.map((insight, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <insight.icon className={`w-5 h-5 ${insight.color}`} />
                  </div>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${insight.color}`}>
                    {insight.trend}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Zap className="w-4 h-4 text-blue-500 mr-2" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Analytics powered by KLYA AI. Data shown is for demonstration purposes only.
            </span>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
