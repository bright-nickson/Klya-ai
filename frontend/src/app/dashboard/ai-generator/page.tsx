'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Bot, Copy, Download, RefreshCw, Send, Sparkles, User, Code, PenTool, BarChart3, Lightbulb, Zap, Shield, Code2, TrendingUp, Globe, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Message {
  id: string
  sender: 'user' | 'ai'
  content: string
  timestamp: Date
}

function AIGenerator() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample suggested prompts
  const suggestedPrompts = [
    {
      icon: <Code className="w-4 h-4 text-blue-400" />,
      title: 'Code Generation',
      description: 'Generate a Python function to analyze sentiment from text'
    },
    {
      icon: <PenTool className="w-4 h-4 text-purple-400" />,
      title: 'Content Writing',
      description: 'Write a compelling product description for a smart home device'
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-pink-400" />,
      title: 'Data Analysis',
      description: 'Analyze this CSV data and provide key insights'
    },
    {
      icon: <Lightbulb className="w-4 h-4 text-amber-400" />,
      title: 'Explanations',
      description: 'Explain quantum computing in simple terms for beginners'
    }
  ]

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        sender: 'ai',
        content: "Hello! I'm KLYA AI. I can help you with code generation, content creation, data analysis, and much more. What would you like to create today?",
        timestamp: new Date()
      }])
    }
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: prompt,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setPrompt('')
    setLoading(true)

    try {
      // Call your API route that handles the OpenAI API
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          // You can add more parameters here as needed
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: data.choices[0].message.content,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response. Please check your API key and try again.');
      
      // Add error message to chat
      const errorResponse: Message = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        content: 'Sorry, I encountered an error. Please make sure your OpenAI API key is properly set up in the .env.local file.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSuggestedPrompt = (promptText: string) => {
    setPrompt(promptText)
    document.getElementById('promptInput')?.focus()
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                KLYA AI Generator
              </motion.h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Create Now. Lead Tomorrow. - Intelligent tools for creators, innovators, and businesses.
              </p>
            </div>

            <Card className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col h-[calc(100dvh-10rem)] sm:h-auto">
              {/* Chat Messages Area */}
              <div 
                className="chat-container flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900/80 dark:to-slate-900"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent',
                  WebkitOverflowScrolling: 'touch',
                  msOverflowStyle: 'none',
                }}
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={cn(
                      'flex gap-3 sm:gap-4 items-start group',
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={cn(
                      'max-w-[90%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4',
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-50 border border-gray-200 text-gray-800 dark:bg-white/5 dark:border-white/10 dark:text-white/90',
                      'break-words overflow-hidden',
                      message.sender === 'user' ? 'ml-auto' : 'mr-auto'
                    )}>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {message.content.split('\n').map((line, i) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {loading && (
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-sm text-white/60">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
                
                {messages.length <= 1 && !loading && (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {suggestedPrompts.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedPrompt(item.description)}
                        className="text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-1 sm:p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition flex-shrink-0 mt-0.5">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">{item.title}</div>
                            <div className="text-xs text-white/60">{item.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-3 sm:p-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
                <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 items-center">
                  <div className="flex-1 relative">
                    <Textarea
                      id="promptInput"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything or describe what you want to create..."
                      className="min-h-[40px] max-h-32 resize-none pr-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-white/40 focus-visible:ring-blue-500 focus-visible:ring-offset-0 text-sm sm:text-base"
                      style={{ scrollbarWidth: 'thin' }}
                    />
                    <button
                      type="button"
                      onClick={() => setPrompt('')}
                      className={cn(
                        'absolute right-2 bottom-2 p-1 rounded-full text-gray-400 hover:text-gray-700 dark:text-white/40 dark:hover:text-white/80 transition',
                        !prompt && 'hidden'
                      )}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading || !prompt.trim()}
                    className="h-10 w-10 p-0 flex-shrink-0"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-between mt-3 text-[11px] sm:text-xs text-gray-500 dark:text-white/40">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Powered by GPT-4</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Your data is encrypted</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-white/5 dark:to-white/0 p-6 text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">99.99%</div>
                    <div className="text-sm text-gray-600 dark:text-white/60">Uptime SLA</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-white/5 dark:to-white/0 p-6 text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">&lt;100ms</div>
                    <div className="text-sm text-gray-600 dark:text-white/60">Response Time</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default AIGenerator
