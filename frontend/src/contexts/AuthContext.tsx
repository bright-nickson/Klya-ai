'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  businessName?: string
  businessType?: string
  phoneNumber?: string
  onboardingCompleted?: boolean
  location?: {
    country: string
    city?: string
  }
  preferences?: {
    theme?: string
    language?: string
  }
  subscription?: {
    plan: string
    status: string
    usage?: {
      contentGenerations: number
      audioTranscriptions: number
      imageGenerations: number
      apiCalls: number
    }
  }
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  businessName?: string
  businessType?: string
  phoneNumber?: string
  location?: {
    country: string
    city?: string
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
        const response = await fetch('https://klya-ai-backend.onrender.com/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include' // Important for cookies
        });
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setUser(data.user)
      } else {
        // If not authenticated, clear any existing user data
        setUser(null)
        // Clear any invalid tokens
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await fetch('https://klya-ai-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      if (data.success && data.token) {
        // Store the token in a secure, HTTP-only cookie
        document.cookie = `token=${data.token}; Path=/; Secure; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Domain=klya-ai.vercel.app' : ''}`
        
        // Set the user data
        setUser(data.user)
        
        // Set the Authorization header for subsequent requests
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token)
        }
        
        toast.success('Welcome back!')
        router.push('/dashboard')
        return true
      } else {
        // Handle validation errors
        if (data.details && Array.isArray(data.details)) {
          data.details.forEach((detail: any) => {
            toast.error(detail.msg || detail.message)
          })
        } else {
          toast.error(data.error || 'Login failed. Please check your credentials and try again.')
        }
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Unable to connect to server. Please check your connection.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await fetch('https://klya-ai-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        // Store token if provided
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('token', data.token)
        }
        setUser(data.user)
        toast.success('Account created successfully!')
        router.push('/dashboard')
        return true
      } else {
        // Handle validation errors
        if (data.details && Array.isArray(data.details)) {
          data.details.forEach((detail: any) => {
            toast.error(detail.msg || detail.message)
          })
        } else {
          toast.error(data.error || 'Registration failed. Please try again.')
        }
        return false
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Unable to connect to server. Please check your connection.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('https://klya-ai-backend.onrender.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/')
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
