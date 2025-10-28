'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { subscriptionApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { Lock, Sparkles, TrendingUp, Clock, ArrowRight } from 'lucide-react'

// Dummy predictive datasets
const predictedPlatformLift = [
  { platform: 'TikTok', predictedLift: 18 },
  { platform: 'Instagram', predictedLift: 12 },
  { platform: 'YouTube', predictedLift: 9 },
  { platform: 'Facebook', predictedLift: 6 },
  { platform: 'X', predictedLift: 4 },
]

const projectedEngagement = [
  { period: 'Week 1', engagement: 4200 },
  { period: 'Week 2', engagement: 4650 },
  { period: 'Week 3', engagement: 4920 },
  { period: 'Week 4', engagement: 5200 },
  { period: 'Week 5', engagement: 5480 },
]

export default function PredictiveInsightsPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<'starter' | 'professional' | 'enterprise' | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await subscriptionApi.getSubscription()
        const userPlan = (res.data?.data?.plan || res.data?.data?.subscription?.plan || 'starter') as any
        if (!mounted) return
        setPlan(userPlan)
        setShowUpgrade(userPlan !== 'enterprise')
      } catch (e) {
        setPlan('starter')
        setShowUpgrade(true)
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const bestPlatform = useMemo(() => {
    return predictedPlatformLift.slice().sort((a, b) => b.predictedLift - a.predictedLift)[0]
  }, [])

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <div className="mb-6 md:mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Predictive Insights</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                AI-powered forecasts to guide your next high-impact moves.
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              <span>Enterprise Feature</span>
            </div>
          </div>
        </div>

        {/* Upgrade Gate */}
        {!loading && showUpgrade && (
          <div className={`relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-8 shadow-sm transition-all ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-yellow-50/40 to-blue-50/30 dark:from-yellow-900/10 dark:to-blue-900/10" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
                  <Lock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Unlock Predictive Insights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Upgrade to <span className="font-medium">Enterprise</span> to forecast top platforms, best posting times, and expected engagement lift.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/dashboard/subscription')}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Upgrade to Enterprise
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Simple plan highlights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Forecasted Platform Lift</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Predict where to double-down next week.</p>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Best Posting Times</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Suggested hours by region and platform.</p>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Strategy Tips</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Actionable guidance tailored to your audience.</p>
              </div>
            </div>
          </div>
        )}

        {/* Enterprise Content */}
        {!loading && plan === 'enterprise' && (
          <div className={`space-y-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Predicted Top Platform</h3>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{bestPlatform.platform}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">+{bestPlatform.predictedLift}% engagement expected</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Best Posting Window</h3>
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Fri 6–9 PM</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Historically highest weekend uplift</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Strategy Tip</h3>
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Lean into <span className="font-medium">short-form video</span> with regional hooks for Kumasi; cross-post clips to TikTok and Instagram Reels.</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Predicted Platform Lift (Next 4 Weeks)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={predictedPlatformLift}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="platform" className="text-xs text-gray-600 dark:text-gray-400" axisLine={false} tickLine={false} />
                      <YAxis className="text-xs text-gray-600 dark:text-gray-400" axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                      <Legend />
                      <Bar dataKey="predictedLift" fill="#3B82F6" radius={[4,4,0,0]} name="Predicted % Lift" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Projected Engagement (Next 5 Weeks)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectedEngagement}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="period" className="text-xs text-gray-600 dark:text-gray-400" axisLine={false} tickLine={false} />
                      <YAxis className="text-xs text-gray-600 dark:text-gray-400" axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                      <Legend />
                      <Line type="monotone" dataKey="engagement" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-10 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm text-blue-700 dark:text-blue-300">Predictions are experimental and for guidance only.</span>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
