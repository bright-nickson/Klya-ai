import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import toast from 'react-hot-toast'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError<any>) => {
    const message = error.response?.data?.error || error.message || 'An error occurred'
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
      return Promise.reject(error)
    }
    
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action')
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.')
    } else if (error.response?.status && error.response.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: any; token: string }>>('/auth/login', { email, password }),
  
  register: (userData: any) =>
    api.post<ApiResponse<{ user: any; token: string }>>('/auth/register', userData),
  
  logout: () =>
    api.post<ApiResponse>('/auth/logout'),
  
  me: () =>
    api.get<ApiResponse<{ user: any }>>('/auth/me'),
  
  forgotPassword: (email: string) =>
    api.post<ApiResponse>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse>('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) =>
    api.post<ApiResponse>('/auth/verify-email', { token }),
}

// User API
export const userApi = {
  getProfile: () =>
    api.get<ApiResponse<any>>('/user/profile'),
  
  updateProfile: (data: any) =>
    api.put<ApiResponse<any>>('/user/profile', data),
  
  updatePassword: (currentPassword: string, newPassword: string) =>
    api.put<ApiResponse>('/user/password', { currentPassword, newPassword }),
  
  deleteAccount: () =>
    api.delete<ApiResponse>('/user/account'),
  
  getUsageStats: (days?: number) =>
    api.get<ApiResponse<any>>('/user/usage-stats', { params: { days } }),
}

// Content API
export const contentApi = {
  generate: (data: {
    prompt: string
    type: string
    language: string
    tone?: string
    length?: string
  }) =>
    api.post<ApiResponse<{ content: string; tokensUsed: number }>>('/content/generate', data),
  
  getHistory: (page = 1, limit = 10, type?: string) =>
    api.get<PaginatedResponse<any>>('/content/history', {
      params: { page, limit, type }
    }),
  
  getContent: (id: string) =>
    api.get<ApiResponse<any>>(`/content/${id}`),
  
  updateContent: (id: string, data: any) =>
    api.put<ApiResponse<any>>(`/content/${id}`, data),
  
  deleteContent: (id: string) =>
    api.delete<ApiResponse>(`/content/${id}`),
  
  saveContent: (data: any) =>
    api.post<ApiResponse<any>>('/content/save', data),
}

// Audio API
export const audioApi = {
  transcribe: (file: File, language?: string) => {
    const formData = new FormData()
    formData.append('audio', file)
    if (language) formData.append('language', language)
    
    return api.post<ApiResponse<{ transcription: string; duration: number }>>('/audio/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  getTranscriptions: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<any>>('/audio/transcriptions', {
      params: { page, limit }
    }),
}

// Image API
export const imageApi = {
  generate: (prompt: string, style?: string) =>
    api.post<ApiResponse<{ imageUrl: string; prompt: string }>>('/image/generate', { prompt, style }),
  
  getImages: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<any>>('/image/history', {
      params: { page, limit }
    }),
}

// Subscription API
export const subscriptionApi = {
  getSubscription: () =>
    api.get<ApiResponse<any>>('/subscription'),
  
  getPlans: () =>
    api.get<ApiResponse<any[]>>('/subscription/plans'),
  
  subscribe: (planId: string, paymentMethod: string, paymentDetails?: any) =>
    api.post<ApiResponse<any>>('/subscription/subscribe', { planId, paymentMethod, paymentDetails }),
  
  cancelSubscription: () =>
    api.post<ApiResponse>('/subscription/cancel'),
  
  getBillingHistory: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<any>>('/subscription/billing-history', {
      params: { page, limit }
    }),
}

// Analytics API
export const analyticsApi = {
  getDashboardStats: () =>
    api.get<ApiResponse<any>>('/analytics/dashboard'),
  
  getUsageAnalytics: (period: 'week' | 'month' | 'year' = 'month') =>
    api.get<ApiResponse<any>>('/analytics/usage', { params: { period } }),
  
  getContentAnalytics: (period: 'week' | 'month' | 'year' = 'month') =>
    api.get<ApiResponse<any>>('/analytics/content', { params: { period } }),
}

// Payment API
export const paymentApi = {
  initiateMomoPayment: (amount: number, phoneNumber: string, network: 'mtn' | 'airteltigo') =>
    api.post<ApiResponse<{ transactionId: string; reference: string }>>('/payment/momo/initiate', {
      amount,
      phoneNumber,
      network
    }),
  
  verifyMomoPayment: (transactionId: string) =>
    api.get<ApiResponse<{ status: string; amount: number }>>(`/payment/momo/verify/${transactionId}`),
  
  initiatePaystackPayment: (amount: number, email: string) =>
    api.post<ApiResponse<{ authorizationUrl: string; reference: string }>>('/payment/paystack/initiate', {
      amount,
      email
    }),
  
  verifyPaystackPayment: (reference: string) =>
    api.get<ApiResponse<{ status: string; amount: number }>>(`/payment/paystack/verify/${reference}`),
}

// API Keys API
export const apiKeysApi = {
  getApiKeys: () =>
    api.get<ApiResponse<any[]>>('/api-keys'),
  
  createApiKey: (name: string, permissions: string[]) =>
    api.post<ApiResponse<{ key: string; name: string }>>('/api-keys', { name, permissions }),
  
  deleteApiKey: (id: string) =>
    api.delete<ApiResponse>(`/api-keys/${id}`),
  
  updateApiKey: (id: string, data: any) =>
    api.put<ApiResponse<any>>(`/api-keys/${id}`, data),
}

export default api
