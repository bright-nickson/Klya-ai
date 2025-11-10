'use client'

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import Link from 'next/link'
import { pricingPlans } from '@/config/pricing'

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
          {pricingPlans.map((plan, index) => (
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
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold mb-2">
                  {plan.monthly === null ? 'Custom' : `₵${plan.monthly}`}
                  <span className="text-lg font-normal text-muted-foreground">
                    {plan.monthly !== null ? '/month' : ''}
                  </span>
                </p>
                {plan.yearly !== null && plan.monthly !== null && plan.monthly > 0 && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Save {Math.round((1 - plan.yearly / (plan.monthly * 12)) * 100)}% annually
                  </p>
                )}
                <p className="text-muted-foreground mb-6">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={
                  plan.id === 'enterprise' 
                    ? '/contact' 
                    : `/checkout?plan=${plan.id}&price=${plan.monthly}&billing=monthly`
                }
                className={`btn w-full ${
                  plan.popular ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {plan.cta}
              </Link>
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
