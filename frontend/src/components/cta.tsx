'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-8"
          >
            <Sparkles className="h-4 w-4" />
            <span>Limited Time Offer</span>
          </motion.div>

          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join hundreds of Ghanaian businesses already using AfriGrowth AI to scale their operations, 
            create better content, and connect with their customers in meaningful ways.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button className="btn btn-enhanced bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 h-auto group hover-scale">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="btn btn-enhanced border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4 h-auto hover-glow">
              Schedule a Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">14 Days</div>
              <div className="text-white/80">Free Trial</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">No Setup</div>
              <div className="text-white/80">Fees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">Cancel</div>
              <div className="text-white/80">Anytime</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
