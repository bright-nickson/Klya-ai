'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  Mic,
  FileText,
  Image as ImageIcon,
  Globe,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

interface OnboardingData {
  purpose: string[]
  ageRange: string
  businessSize: string
  industry: string
  goals: string[]
  preferredLanguages: string[]
  contentTypes: string[]
}

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { user, updateUser } = useAuth()

  const [data, setData] = useState<OnboardingData>({
    purpose: [],
    ageRange: '',
    businessSize: '',
    industry: '',
    goals: [],
    preferredLanguages: [],
    contentTypes: []
  })

  const totalSteps = 6

  const purposes = [
    { id: 'business', label: 'Grow My Business', icon: TrendingUp, description: 'Scale and expand your business' },
    { id: 'content', label: 'Create Content', icon: FileText, description: 'Generate engaging content' },
    { id: 'education', label: 'Learn & Educate', icon: GraduationCap, description: 'Educational purposes' },
    { id: 'marketing', label: 'Marketing & Ads', icon: Sparkles, description: 'Promote products and services' },
    { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag, description: 'Online selling and retail' },
    { id: 'community', label: 'Community Building', icon: Users, description: 'Build and engage communities' },
  ]

  const ageRanges = [
    { value: '18-24', label: '18-24 years' },
    { value: '25-34', label: '25-34 years' },
    { value: '35-44', label: '35-44 years' },
    { value: '45-54', label: '45-54 years' },
    { value: '55+', label: '55+ years' },
  ]

  const businessSizes = [
    { value: 'solo', label: 'Solo Entrepreneur', description: 'Just me' },
    { value: 'small', label: 'Small Team', description: '2-10 people' },
    { value: 'medium', label: 'Medium Business', description: '11-50 people' },
    { value: 'large', label: 'Large Enterprise', description: '50+ people' },
  ]

  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'fashion', label: 'Fashion & Beauty' },
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'creative', label: 'Creative & Arts' },
    { value: 'other', label: 'Other' },
  ]

  const goals = [
    { id: 'increase-sales', label: 'Increase Sales', icon: TrendingUp },
    { id: 'brand-awareness', label: 'Build Brand Awareness', icon: Globe },
    { id: 'content-creation', label: 'Create More Content', icon: FileText },
    { id: 'customer-engagement', label: 'Engage Customers', icon: Users },
    { id: 'multilingual', label: 'Reach Multilingual Audience', icon: Mic },
    { id: 'automation', label: 'Automate Tasks', icon: Sparkles },
  ]

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'tw', label: 'Twi' },
    { value: 'ga', label: 'Ga' },
    { value: 'ew', label: 'Ewe' },
    { value: 'ha', label: 'Hausa' },
  ]

  const contentTypes = [
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'social', label: 'Social Media', icon: Users },
    { id: 'ads', label: 'Advertisements', icon: Sparkles },
    { id: 'product', label: 'Product Descriptions', icon: ShoppingBag },
    { id: 'email', label: 'Email Campaigns', icon: Briefcase },
    { id: 'audio', label: 'Audio Content', icon: Mic },
  ]

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item)
    }
    return [...array, item]
  }

  const handleNext = () => {
    // Validation for each step
    if (step === 1 && data.purpose.length === 0) {
      toast.error('Please select at least one purpose')
      return
    }
    if (step === 2 && !data.ageRange) {
      toast.error('Please select your age range')
      return
    }
    if (step === 3 && !data.businessSize) {
      toast.error('Please select your business size')
      return
    }
    if (step === 4 && !data.industry) {
      toast.error('Please select your industry')
      return
    }
    if (step === 5 && data.goals.length === 0) {
      toast.error('Please select at least one goal')
      return
    }

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    if (data.preferredLanguages.length === 0) {
      toast.error('Please select at least one language')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        updateUser(result.user)
        toast.success('Welcome to KLYA AI! 🎉')
        onComplete()
      } else {
        toast.error(result.error || 'Failed to complete onboarding')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      toast.error('Failed to save your preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What brings you to KLYA AI?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select all that apply - this helps us personalize your experience
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {purposes.map((purpose) => {
                const Icon = purpose.icon
                const isSelected = data.purpose.includes(purpose.id)
                return (
                  <button
                    key={purpose.id}
                    onClick={() => setData({ ...data, purpose: toggleArrayItem(data.purpose, purpose.id) })}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {purpose.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {purpose.description}
                    </p>
                    {isSelected && (
                      <div className="mt-3 flex items-center text-primary">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What's your age range?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This helps us tailor content recommendations
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-3">
              {ageRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setData({ ...data, ageRange: range.value })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    data.ageRange === range.value
                      ? 'border-primary bg-primary/10 dark:bg-primary/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {range.label}
                    </span>
                    {data.ageRange === range.value && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What's your business size?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We'll customize features based on your team size
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {businessSizes.map((size) => {
                const isSelected = data.businessSize === size.value
                return (
                  <button
                    key={size.value}
                    onClick={() => setData({ ...data, businessSize: size.value })}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {size.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {size.description}
                    </p>
                    {isSelected && (
                      <div className="mt-3 flex items-center text-primary">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What industry are you in?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We'll provide industry-specific templates and suggestions
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {industries.map((industry) => (
                <button
                  key={industry.value}
                  onClick={() => setData({ ...data, industry: industry.value })}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    data.industry === industry.value
                      ? 'border-primary bg-primary/10 dark:bg-primary/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {industry.label}
                    </span>
                    {data.industry === industry.value && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                What are your main goals?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select all that apply - we'll help you achieve them
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {goals.map((goal) => {
                const Icon = goal.icon
                const isSelected = data.goals.includes(goal.id)
                return (
                  <button
                    key={goal.id}
                    onClick={() => setData({ ...data, goals: toggleArrayItem(data.goals, goal.id) })}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {goal.label}
                    </h3>
                    {isSelected && (
                      <div className="mt-3 flex items-center text-primary">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Which languages do you want to work with?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select all languages you'll use for content creation
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-3 mb-8">
              {languages.map((lang) => {
                const isSelected = data.preferredLanguages.includes(lang.value)
                return (
                  <button
                    key={lang.value}
                    onClick={() => setData({ ...data, preferredLanguages: toggleArrayItem(data.preferredLanguages, lang.value) })}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {lang.label}
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                What type of content will you create?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Optional - helps us show relevant templates
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {contentTypes.map((type) => {
                const Icon = type.icon
                const isSelected = data.contentTypes.includes(type.id)
                return (
                  <button
                    key={type.id}
                    onClick={() => setData({ ...data, contentTypes: toggleArrayItem(data.contentTypes, type.id) })}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      isSelected
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {type.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>{step === totalSteps ? (loading ? 'Completing...' : 'Complete') : 'Next'}</span>
              {step === totalSteps ? (
                <Check className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Skip Option */}
        {step < totalSteps && (
          <div className="text-center mt-4">
            <button
              onClick={onComplete}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
