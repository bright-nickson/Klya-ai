'use client'

import React, { useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { User, Lock, Bell, CreditCard, Save, Share2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Settings() {
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    businessName: user?.businessName || '',
    businessType: user?.businessType || '',
    phoneNumber: user?.phoneNumber || '',
    location: {
      country: user?.location?.country || 'Ghana',
      city: user?.location?.city || '',
    },
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'social-accounts', label: 'Social Accounts', icon: Share2 },
  ]

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (data.success) {
        updateUser(data.user)
        toast.success('Profile updated successfully!')
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Password updated successfully!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        toast.error(data.error || 'Failed to update password')
      }
    } catch (error) {
      console.error('Password change error:', error)
      toast.error('Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'city') {
      setProfileData(prev => ({
        ...prev,
        location: { ...prev.location, city: value }
      }))
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  
                  const handleClick = () => {
                    if (tab.id === 'social-accounts') {
                      router.push('/dashboard/settings/social-accounts')
                    } else {
                      setActiveTab(tab.id)
                    }
                  }
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={handleClick}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Profile Information
                    </h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Email cannot be changed. Contact support if needed.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Business Name
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          value={profileData.businessName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Business Type
                        </label>
                        <select
                          name="businessType"
                          value={profileData.businessType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                          <option value="">Select business type</option>
                          <option value="startup">Startup</option>
                          <option value="small-business">Small Business</option>
                          <option value="enterprise">Enterprise</option>
                          <option value="freelancer">Freelancer</option>
                          <option value="creator">Content Creator</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={profileData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profileData.location.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Security Settings
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                      >
                        <Lock className="w-4 h-4" />
                        <span>{loading ? 'Updating...' : 'Update Password'}</span>
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Notification Preferences
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your account and AI generations</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Marketing Emails</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Get tips, updates, and special offers</p>
                        </div>
                        <input type="checkbox" className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Usage Alerts</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Notifications when approaching usage limits</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Billing & Subscription
                    </h2>
                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Current Plan</h3>
                        <p className="text-2xl font-bold text-primary mb-1">Free Plan</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">100 AI generations per month</p>
                      </div>
                      
                      <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Usage This Month</h3>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">25/100</span>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Upgrade Options</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <h4 className="font-medium text-gray-900 dark:text-white">Pro Plan</h4>
                            <p className="text-2xl font-bold text-primary">₵99/month</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">1,000 generations</p>
                          </div>
                          <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <h4 className="font-medium text-gray-900 dark:text-white">Business Plan</h4>
                            <p className="text-2xl font-bold text-primary">₵299/month</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Unlimited generations</p>
                          </div>
                        </div>
                        <button className="mt-4 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                          Upgrade Plan
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
