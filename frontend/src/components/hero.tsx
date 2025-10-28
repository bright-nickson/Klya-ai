'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Star } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
            >
              <Star className="h-4 w-4 fill-current" />
              <span>Made for Ghana 🇬🇭</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              Empower Your Business with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                AI
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              Ghana-first SaaS platform that empowers small businesses and digital creators 
              through localized AI tools. Build, grow, and scale with confidence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/register"
                className="btn btn-primary text-lg px-8 py-4 h-auto group btn-enhanced hover-glow"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/detect"
                className="btn btn-outline text-lg px-8 py-4 h-auto group btn-enhanced hover-scale"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Try Language Detection
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t"
            >
              <div className="text-center hover-scale cursor-pointer group">
                <div className="text-2xl font-bold text-primary group-hover:text-gradient transition-all duration-300">500+</div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Active Users</div>
              </div>
              <div className="text-center hover-scale cursor-pointer group">
                <div className="text-2xl font-bold text-primary group-hover:text-gradient transition-all duration-300">50+</div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">AI Tools</div>
              </div>
              <div className="text-center hover-scale cursor-pointer group">
                <div className="text-2xl font-bold text-primary group-hover:text-gradient transition-all duration-300">5</div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Languages</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Visual with animated mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 backdrop-blur-sm border shadow-2xl hover-lift">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <motion.div 
                  className="space-y-3"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="h-4 bg-primary/30 rounded w-3/4 animate-shimmer"></div>
                  <div className="h-4 bg-secondary/30 rounded w-1/2 animate-shimmer" style={{ animationDelay: '0.3s' }}></div>
                  <div className="h-4 bg-accent/30 rounded w-2/3 animate-shimmer" style={{ animationDelay: '0.6s' }}></div>
                </motion.div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <motion.div 
                    className="bg-background/50 rounded-lg p-4 space-y-2 hover-scale cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="h-3 bg-primary/40 rounded w-full"></div>
                    <div className="h-3 bg-primary/20 rounded w-3/4"></div>
                  </motion.div>
                  <motion.div 
                    className="bg-background/50 rounded-lg p-4 space-y-2 hover-scale cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="h-3 bg-secondary/40 rounded w-full"></div>
                    <div className="h-3 bg-secondary/20 rounded w-2/3"></div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover-glow"
            >
              <Star className="h-6 w-6" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [360, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground p-3 rounded-full shadow-lg hover-glow"
            >
              <Play className="h-6 w-6" />
            </motion.div>
            
            {/* Decorative gradient orbs */}
            <div className="absolute top-1/4 -left-12 w-24 h-24 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 -right-12 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
