'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CheckCircle, Sparkles, ArrowRight, Star, TrendingUp } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    description: 'Perfect for individuals exploring AI tools for the first time.',
    features: [
      'Up to 5 AI generations per day',
      'Access to content and translation tools',
      'Basic analytics dashboard',
      'Community support'
    ],
    highlight: false
  },
  {
    name: 'Pro',
    monthly: 199,
    yearly: 1990,
    description: 'For small teams and creators who need consistent AI output.',
    features: [
      'Unlimited content generations',
      'Priority AI processing speed',
      'Full analytics suite',
      'Email & chat support',
      'Voice transcription tools'
    ],
    highlight: true
  },
  {
    name: 'Enterprise',
    monthly: null,
    yearly: null,
    description: 'Tailored for agencies, schools, and large organizations.',
    features: [
      'Dedicated AI models & custom integrations',
      'Unlimited team members',
      '24/7 premium support',
      'Private deployment options',
      'Training & onboarding sessions'
    ],
    highlight: false
  }
]

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-8"
            >
              <Sparkles className="h-4 w-4 fill-current" />
              <span>Flexible pricing for every creator</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Choose the Perfect{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Plan for You
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Simple pricing, no hidden fees. Switch between monthly or yearly billing anytime.
            </p>

            {/* Toggle */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <span className={`${billing === 'monthly' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex items-center h-6 w-12 rounded-full bg-gray-300 dark:bg-gray-700 transition-all duration-300"
              >
                <motion.span
                  layout
                  className="inline-block h-5 w-5 bg-white dark:bg-gray-200 rounded-full shadow transform transition-transform"
                  animate={{ x: billing === 'yearly' ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`${billing === 'yearly' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                Yearly
              </span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {plans.map((plan, index) => {
              const isEnterprise = plan.name === 'Enterprise'
              const price =
                billing === 'monthly'
                  ? plan.monthly
                  : plan.yearly

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`card p-8 rounded-3xl border hover-lift hover-glow transition-all duration-300 ${
                    plan.highlight
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-center mb-6">
                    {plan.highlight ? (
                      <Star className="text-primary h-8 w-8" />
                    ) : (
                      <TrendingUp className="text-secondary h-8 w-8" />
                    )}
                  </div>

                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>

                  {!isEnterprise ? (
                    <div className="text-4xl font-bold mb-6">
                      ₵{price?.toLocaleString()}
                      {plan.monthly !== 0 && (
                        <span className="text-base font-normal text-muted-foreground ml-1">
                          /{billing === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold mb-6">Custom</div>
                  )}

                  <ul className="space-y-3 text-left mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={isEnterprise ? '/contact' : '/register'}
                    className={`btn btn-lg w-full ${
                      plan.highlight ? 'btn-primary hover-glow' : 'btn-outline hover-scale'
                    }`}
                  >
                    {isEnterprise ? 'Contact Sales' : 'Start Now'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12 hover-lift glass max-w-4xl mx-auto">
                <h3 className="font-display text-3xl font-bold mb-6 text-gradient">
                  Ready to create with KLYA AI?
                </h3>
                <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                  Empowering creators and businesses with intelligent AI tools for the modern world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register" className="btn btn-primary btn-lg btn-enhanced hover-glow">
                    Start Free Trial
                  </Link>
                  <Link href="/features" className="btn btn-outline btn-lg btn-enhanced hover-scale">
                    Explore Features
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
