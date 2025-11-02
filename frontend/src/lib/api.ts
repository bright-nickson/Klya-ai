import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// API Configuration
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined!");
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? 
  `${process.env.NEXT_PUBLIC_API_URL}/api` : 
  'http://localhost:3001/api';

// Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  emailVerified: boolean;
  profilePicture?: string;
  phoneNumber?: string;
  businessName?: string;
  businessType?: string;
  onboardingCompleted: boolean;
  location?: {
    city?: string;
    region?: string;
    country: string;
  };
  preferences?: {
    language: string;
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  subscription?: {
    plan: string;
    status: 'active' | 'inactive' | 'cancelled' | 'trial' | 'pending_payment';
    startDate: string;
    endDate?: string;
    usage?: {
      contentGenerations: number;
      audioTranscriptions: number;
      imageGenerations: number;
      apiCalls: number;
    };
  };
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: Array<{ msg: string; param?: string }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (error.response?.status && error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.data?.details) {
      // Handle validation errors
      error.response.data.details.forEach((detail) => {
        toast.error(detail.msg);
      });
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data, {
      withCredentials: true,
    }),
  
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    businessName?: string;
    businessType?: string;
    phoneNumber?: string;
    location?: {
      city?: string;
      region?: string;
      country: string;
    };
  }) => api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData, {
    withCredentials: true,
  }),
  
  logout: () =>
    api.post<ApiResponse>('/auth/logout', {}, { withCredentials: true }),
  
  me: () =>
    api.get<ApiResponse<{ user: User }>>('/auth/me', { withCredentials: true }),
  
  forgotPassword: (email: string) =>
    api.post<ApiResponse>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse>('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) =>
    api.post<ApiResponse>('/auth/verify-email', { token }),
  
  updateProfile: (userData: Partial<User>) =>
    api.put<ApiResponse<{ user: User }>>('/auth/profile', userData, { withCredentials: true }),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put<ApiResponse>(
      '/auth/change-password',
      { currentPassword, newPassword },
      { withCredentials: true }
    ),
};

// User API
export const userApi = {
  getProfile: () =>
    api.get<ApiResponse<{ user: User }>>('/users/me', { withCredentials: true }),
  
  updateProfile: (data: Partial<User>) =>
    api.put<ApiResponse<{ user: User }>>('/users/me', data, { withCredentials: true }),
  
  updatePassword: (currentPassword: string, newPassword: string) =>
    api.put<ApiResponse>(
      '/users/me/password',
      { currentPassword, newPassword },
      { withCredentials: true }
    ),
  
  deleteAccount: () =>
    api.delete<ApiResponse>('/users/me', { withCredentials: true }),
  
  getUsageStats: (days?: number) =>
    api.get<ApiResponse<{ usage: any }>>(
      `/users/me/usage${days ? `?days=${days}` : ''}`,
      { withCredentials: true }
    ),
};

// Content API
export const contentApi = {
  generate: (data: {
    prompt: string;
    type: string;
    language: string;
    tone?: string;
    length?: string;
  }) => api.post<ApiResponse<{ content: string }>>('/content/generate', data, { withCredentials: true }),
  
  getHistory: (page = 1, limit = 10, type?: string) =>
    api.get<PaginatedResponse<any>>(
      `/content/history?page=${page}&limit=${limit}${type ? `&type=${type}` : ''}`,
      { withCredentials: true }
    ),
  
  getContent: (id: string) =>
    api.get<ApiResponse<any>>(`/content/${id}`, { withCredentials: true }),
  
  updateContent: (id: string, data: any) =>
    api.put<ApiResponse<any>>(`/content/${id}`, data, { withCredentials: true }),
  
  deleteContent: (id: string) =>
    api.delete<ApiResponse>(`/content/${id}`, { withCredentials: true }),
  
  saveContent: (data: any) =>
    api.post<ApiResponse<{ id: string }>>('/content', data, { withCredentials: true }),
};

// Audio API
export const audioApi = {
  transcribe: (file: File, language?: string) => {
    const formData = new FormData();
    formData.append('audio', file);
    if (language) {
      formData.append('language', language);
    }
    return api.post<ApiResponse<{ text: string }>>(
      '/audio/transcribe',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );
  },
  
  getTranscriptions: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<any>>(
      `/audio/transcriptions?page=${page}&limit=${limit}`,
      { withCredentials: true }
    ),
};

// Image API
export const imageApi = {
  generate: (prompt: string, style?: string) =>
    api.post<ApiResponse<{ url: string }>>(
      '/images/generate',
      { prompt, style },
      { withCredentials: true }
    ),
  
  getImages: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<any>>(
      `/images?page=${page}&limit=${limit}`,
      { withCredentials: true }
    ),
};

// Subscription API
export const subscriptionApi = {
  getSubscription: () =>
    api.get<ApiResponse<any>>('/subscription', { withCredentials: true }),
  
  getPlans: () =>
    api.get<ApiResponse<{ plans: any[] }>>('/subscription/plans', { withCredentials: true }),
  
  subscribe: (planId: string, paymentMethod: string, paymentDetails?: any) =>
    api.post<ApiResponse<{ subscription: any }>>(
      '/subscription/subscribe',
      { planId, paymentMethod, ...paymentDetails },
      { withCredentials: true }
    ),
  
  cancelSubscription: () =>
    api.post<ApiResponse>('/subscription/cancel', {}, { withCredentials: true }),
  
  getBillingHistory: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<any>>(
      `/subscription/billing?page=${page}&limit=${limit}`,
      { withCredentials: true }
    ),
};

// Analytics API
export const analyticsApi = {
  getDashboardStats: () =>
    api.get<ApiResponse<any>>('/analytics/dashboard', { withCredentials: true }),
  
  getUsageAnalytics: (period: 'week' | 'month' | 'year' = 'month') =>
    api.get<ApiResponse<any>>(
      `/analytics/usage?period=${period}`,
      { withCredentials: true }
    ),
  
  getContentAnalytics: (period: 'week' | 'month' | 'year' = 'month') =>
    api.get<ApiResponse<any>>(
      `/analytics/content?period=${period}`,
      { withCredentials: true }
    ),
};

// Payment API
export const paymentApi = {
  initiateMomoPayment: (amount: number, phoneNumber: string, network: 'mtn' | 'airteltigo') => {
    return api.post<ApiResponse<{ transactionId: string }>>(
      '/payments/momo/initiate',
      { amount, phoneNumber, network },
      { withCredentials: true }
    );
  },
  
  verifyMomoPayment: (transactionId: string) =>
    api.post<ApiResponse<any>>(
      '/payments/momo/verify',
      { transactionId },
      { withCredentials: true }
    ),
  
  initiatePaystackPayment: (amount: number, email: string) =>
    api.post<ApiResponse<{ reference: string; authorizationUrl: string }>>(
      '/payments/paystack/initiate',
      { amount, email },
      { withCredentials: true }
    ),
  
  verifyPaystackPayment: (reference: string) =>
    api.post<ApiResponse<any>>(
      '/payments/paystack/verify',
      { reference },
      { withCredentials: true }
    ),
};

// API Keys API
export const apiKeysApi = {
  getApiKeys: () =>
    api.get<ApiResponse<{ apiKeys: any[] }>>('/api-keys', { withCredentials: true }),
  
  createApiKey: (name: string, permissions: string[]) =>
    api.post<ApiResponse<{ apiKey: string }>>(
      '/api-keys',
      { name, permissions },
      { withCredentials: true }
    ),
  
  deleteApiKey: (id: string) =>
    api.delete<ApiResponse>(`/api-keys/${id}`, { withCredentials: true }),
  
  updateApiKey: (id: string, data: any) =>
    api.put<ApiResponse<{ apiKey: any }>>(
      `/api-keys/${id}`,
      data,
      { withCredentials: true }
    ),
};

export default api;
