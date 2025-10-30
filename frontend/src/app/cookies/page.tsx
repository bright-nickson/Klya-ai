'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { motion } from 'framer-motion'

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Cookie Policy
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="prose dark:prose-invert max-w-none"
            >
              <p className="text-muted-foreground mb-6">Last updated: October 22, 2025</p>

              <h2 className="text-2xl font-semibold mb-4 mt-8">What Are Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you use our service.
              </p>

              <h2 className="text-2xl font-semibold mb-4 mt-8">How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">We use cookies for:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Authentication and security</li>
                <li>Remembering your preferences</li>
                <li>Analytics and performance monitoring</li>
                <li>Improving our services</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground">
                    Required for the website to function properly. These cannot be disabled.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Preference Cookies</h3>
                  <p className="text-muted-foreground">
                    Remember your settings and preferences for a better experience.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies through your browser settings. However, 
                disabling cookies may affect the functionality of our website.
              </p>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about our cookie policy, please contact us at{' '}
                <a href="mailto:privacy@KLYA.ai" className="text-primary hover:underline">
                  privacy@KLYA.ai
                </a>
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
