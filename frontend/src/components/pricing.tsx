'use client'

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '₵0',
    period: '/month',
    description: 'Perfect for individual creators and small businesses',
    features: [
      '5 AI content generations per day',
      'Basic voice transcription (1 hour/month)',
      'English and Twi language support',
      'Mobile app access',
      'Email support',
      'Basic analytics'
    ],
    popular: false,
    cta: 'Start Free Trial'
  },
  {
    name: 'Professional',
    price: '₵150',
    period: '/month',
    description: 'Ideal for growing businesses and teams',
    features: [
      'Unlimited AI content generation',
      'Advanced voice transcription (10 hours/month)',
      'All Ghanaian languages support',
      'Team collaboration (up to 5 members)',
      'Priority support',
      'Advanced analytics & insights',
      'Custom templates',
      'API access'
    ],
    popular: true,
    cta: 'Start Free Trial'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with specific needs',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Custom AI model training',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'On-premise deployment',
      'SLA guarantee'
    ],
    popular: false,
    cta: 'Contact Sales'
  }
]

export function Pricing() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Simple, Transparent{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core AI tools 
            with no hidden fees or long-term contracts.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`card p-8 relative ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'hover:shadow-lg'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="font-display text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full btn btn-enhanced ${
                  plan.popular 
                    ? 'btn-primary hover-glow' 
                    : 'btn-outline hover-scale'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-muted/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl font-bold mb-4">
              All Plans Include
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Mobile app access</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Data security & privacy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Regular updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Community support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Ghanaian payment methods</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
