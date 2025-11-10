'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

type SocialProvider = 'google' | 'github' | 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'snapchat' | 'threads'

interface SocialAccount {
  provider: SocialProvider
  connected: boolean
  email?: string
  name?: string
  avatar?: string
}

export function SocialAccounts() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { provider: 'google', connected: false },
    { provider: 'github', connected: false },
    { provider: 'twitter', connected: false },
    { provider: 'linkedin', connected: false },
    { provider: 'facebook', connected: false },
    { provider: 'instagram', connected: false },
    { provider: 'snapchat', connected: false },
    { provider: 'threads', connected: false }
  ])
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      try {
        const response = await fetch('/api/auth/accounts')
        if (!response.ok) throw new Error('Failed to fetch accounts')
        const data = await response.json()
        
        setAccounts(prev => 
          prev.map(account => ({
            ...account,
            ...data.find((a: SocialAccount) => a.provider === account.provider)
          }))
        )
      } catch (error) {
        console.error('Error fetching connected accounts:', error)
        toast.error('Failed to load connected accounts')
      }
    }

    fetchConnectedAccounts()
  }, [])

  const updateLoading = (provider: string, loading: boolean) => {
    setIsLoading(prev => ({
      ...prev,
      [provider]: loading
    }))
  }

  const handleConnect = async (provider: SocialProvider) => {
    try {
      updateLoading(provider, true)
      // This will redirect to the provider's OAuth page
      window.location.href = `/api/auth/connect/${provider}?returnTo=/dashboard/settings/social-accounts`
    } catch (error) {
      toast.error(`Failed to connect ${provider}`)
      console.error(`Error connecting ${provider}:`, error)
      updateLoading(provider, false)
    }
  }

  const handleDisconnect = async (provider: SocialProvider) => {
    if (!confirm(`Are you sure you want to disconnect ${provider}?`)) return
    
    try {
      updateLoading(provider, true)
      const response = await fetch(`/api/auth/accounts/${provider}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success(`Disconnected ${provider} account`)
        setAccounts(prev => 
          prev.map(acc => 
            acc.provider === provider 
              ? { ...acc, connected: false, email: undefined, name: undefined }
              : acc
          )
        )
      } else {
        throw new Error('Failed to disconnect')
      }
    } catch (error) {
      toast.error(`Failed to disconnect ${provider}`)
      console.error(`Error disconnecting ${provider}:`, error)
    } finally {
      updateLoading(provider, false)
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )
      case 'github':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.34c.85.01 1.71.12 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.93.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
            />
          </svg>
        )
      case 'twitter':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#1DA1F2"
              d="M23.953 4.57a10 10 0 01-2.825.775 4.96 4.96 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
            />
          </svg>
        )
      case 'linkedin':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#0077B5"
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            />
          </svg>
        )
      case 'facebook':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#1877F2"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.797v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
        )
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center">
            {provider.charAt(0).toUpperCase()}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Connected Accounts</h1>
        <p className="text-muted-foreground">
          Manage your connected social accounts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Social Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.provider}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-muted">
                  {getProviderIcon(account.provider)}
                </div>
                <div>
                  <p className="font-medium capitalize">
                    {account.provider}
                  </p>
                  {account.connected && account.email && (
                    <p className="text-sm text-muted-foreground">
                      {account.email}
                    </p>
                  )}
                </div>
              </div>
              {account.connected ? (
                <Button
                  variant="outline"
                  onClick={() => handleDisconnect(account.provider)}
                  disabled={isLoading[account.provider]}
                >
                  {isLoading[account.provider] ? 'Disconnecting...' : 'Disconnect'}
                </Button>
              ) : (
                <Button 
                  onClick={() => handleConnect(account.provider)}
                  disabled={isLoading[account.provider]}
                >
                  {isLoading[account.provider] ? 'Connecting...' : 'Connect'}
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
