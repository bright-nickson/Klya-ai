'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { motion } from 'framer-motion'
import { Code, Key, Zap, Shield } from 'lucide-react'

export default function APIPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              KLYA AI API
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Integrate powerful AI capabilities into your applications with our RESTful API
            </motion.p>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Code className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">RESTful API</h3>
                <p className="text-sm text-muted-foreground">Simple and intuitive API design</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Key className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">API Keys</h3>
                <p className="text-sm text-muted-foreground">Secure authentication with API keys</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fast Response</h3>
                <p className="text-sm text-muted-foreground">Low latency and high performance</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Secure</h3>
                <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">API Documentation</h2>
            <div className="bg-background rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
              <p className="text-muted-foreground mb-6">
                Our API documentation is coming soon. Sign up to get early access and be notified when it&apos;s available.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm">
                  curl -X POST https://api.klya.ai/v1/generate \<br />
                  &nbsp;&nbsp;-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \<br />
                  &nbsp;&nbsp;-H &quot;Content-Type: application/json&quot; \<br />
                  &nbsp;&nbsp;-d &apos;{`{`}&quot;prompt&quot;: &quot;Your text here&quot;{`}`}&apos;
                </code>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
