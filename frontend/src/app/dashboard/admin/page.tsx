'use client'

import React, { useState, useEffect } from 'react'
import { adminApi, SignupStats } from '@/lib/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, TrendingUp, UserCheck, Activity } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState<SignupStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminApi.getSignupStats()
      if (response.data.success && response.data.data) {
        setStats(response.data.data)
      } else {
        setError('Failed to load stats')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch stats'
      setError(errorMessage)
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">Error loading admin dashboard</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">No data available</p>
        </div>
      </div>
    )
  }

  // Prepare data for charts
  const subscriptionData = [
    { name: 'Starter', value: stats.subscriptionStats.starter },
    { name: 'Professional', value: stats.subscriptionStats.professional },
    { name: 'Enterprise', value: stats.subscriptionStats.enterprise }
  ]

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Track user signups and platform analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* New Users Last 7 Days */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">New Users (7 Days)</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.newUsersLast7Days.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeUsers.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserCheck className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Paid Plans</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {(stats.subscriptionStats.professional + stats.subscriptionStats.enterprise).toLocaleString()}
                </p>
              </div>
              <div className="bg-pink-100 p-3 rounded-lg">
                <Activity className="text-pink-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Signup Trends Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Signup Trends (30 Days)</h2>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailySignups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Signups"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subscription Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Subscription Plans</h2>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Subscription Details */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Starter
                </span>
                <span className="font-semibold text-slate-900">{stats.subscriptionStats.starter}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  Professional
                </span>
                <span className="font-semibold text-slate-900">{stats.subscriptionStats.professional}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                  Enterprise
                </span>
                <span className="font-semibold text-slate-900">{stats.subscriptionStats.enterprise}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Conversion Rate</h3>
            <p className="text-2xl font-bold text-slate-900">
              {stats.totalUsers > 0 
                ? ((stats.subscriptionStats.professional + stats.subscriptionStats.enterprise) / stats.totalUsers * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Paid plans / Total users</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Weekly Growth</h3>
            <p className="text-2xl font-bold text-slate-900">
              {stats.newUsersLast7Days > 0 ? '+' : ''}{stats.newUsersLast7Days}
            </p>
            <p className="text-xs text-slate-500 mt-1">New users this week</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Engagement</h3>
            <p className="text-2xl font-bold text-slate-900">
              {stats.totalUsers > 0 
                ? (stats.activeUsers / stats.totalUsers * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-xs text-slate-500 mt-1">Active users this week</p>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={fetchStats}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}
