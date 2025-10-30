'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Play, Sparkles, Mic, FileText, Image as ImageIcon, Globe, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const demos = [
  {
    id: 'content-generation',
    title: 'AI Content Generation',
    description: 'Watch how KLYA AI generates high-quality blog posts, social media content, and marketing copy in seconds.',
    icon: Sparkles,
    videoUrl: 'https://www.youtube.com/embed/VPRSBzXzavo',
    demoLink: '/dashboard/ai-generator',
    features: ['Multi-language support', 'SEO optimized', 'Brand voice matching', 'Instant generation'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'voice-transcription',
    title: 'Voice Transcription',
    description: 'See our AI transcribe audio with high accuracy, supporting Ghanaian accents and local languages.',
    icon: Mic,
    videoUrl: 'https://www.youtube.com/embed/x7X9w_GIm1s',
    demoLink: '/dashboard/ai-generator',
    features: ['Local accent support', 'Real-time transcription', 'Speaker identification', 'Export options'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'document-processing',
    title: 'Document Processing',
    description: 'Transform documents with AI-powered summarization, translation, and analysis.',
    icon: FileText,
    videoUrl: 'https://www.youtube.com/embed/NYSWn1ipbgg',
    demoLink: '/dashboard/ai-generator',
    features: ['Smart summarization', 'Multi-format support', 'Data extraction', 'Batch processing'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'image-generation',
    title: 'Image Generation',
    description: 'Create stunning visuals and graphics with AI, featuring Ghanaian cultural elements.',
    icon: ImageIcon,
    videoUrl: 'https://www.youtube.com/embed/qhv6j0hLz2M',
    demoLink: '/dashboard/ai-generator',
    features: ['Cultural context', 'Brand consistency', 'Multiple styles', 'High resolution'],
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'language-detection',
    title: 'Language Detection',
    description: 'Automatically detect and translate between English and Ghanaian languages.',
    icon: Globe,
    videoUrl: 'https://www.youtube.com/embed/nGIreXiE0d0',
    demoLink: '/detect',
    features: ['5+ languages', 'Context-aware', 'Instant detection', 'Batch translation'],
    color: 'from-indigo-500 to-purple-500'
  }
]

export function ProductDemo() {
  const [activeDemo, setActiveDemo] = useState(demos[0])
  const [isPlaying, setIsPlaying] = useState(false)

  const handleDemoChange = (demo: typeof demos[0]) => {
    setActiveDemo(demo)
    setIsPlaying(false)
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Play className="h-4 w-4" />
            <span>See It In Action</span>
          </motion.div>
          
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
            Experience the Power of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary">
              AI-Driven Solutions
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Watch real demonstrations of how KLYA AI transforms your workflow with 
            cutting-edge AI technology tailored for African businesses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Demo Selection Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-2 sm:space-y-3"
          >
            {demos.map((demo, index) => {
              const Icon = demo.icon
              const isActive = activeDemo.id === demo.id
              
              return (
                <motion.button
                  key={demo.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => handleDemoChange(demo)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r ' + demo.color + ' text-white border-transparent shadow-lg scale-105'
                      : 'bg-card hover:bg-muted border-border hover:border-primary/50 hover:scale-102'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-primary/10 group-hover:bg-primary/20'
                    }`}>
                      <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg mb-1 ${
                        isActive ? 'text-white' : 'text-foreground group-hover:text-primary'
                      }`}>
                        {demo.title}
                      </h3>
                      <p className={`text-sm ${
                        isActive ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                        {demo.features.length} features
                      </p>
                    </div>
                    <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${
                      isActive ? 'text-white translate-x-1' : 'text-muted-foreground group-hover:translate-x-1'
                    }`} />
                  </div>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Video Demo Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Video Player */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift group">
              <div className={`aspect-video bg-gradient-to-br ${activeDemo.color} p-1`}>
                <div className="w-full h-full bg-gray-900 rounded-xl relative overflow-hidden">
                  {isPlaying ? (
                    /* Embedded YouTube Video */
                    <iframe
                      key={activeDemo.id}
                      className="w-full h-full rounded-xl"
                      src={`${activeDemo.videoUrl}?autoplay=1&rel=0`}
                      title={activeDemo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    /* Video Preview */
                    <div className="w-full h-full flex items-center justify-center relative">
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse-slow"></div>
                      
                      {/* Play button overlay */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPlaying(true)}
                        className="relative z-10 bg-white text-gray-900 p-6 rounded-full shadow-2xl hover-glow group-hover:scale-110 transition-all duration-300"
                      >
                        <Play className="h-12 w-12 fill-current" />
                      </motion.button>
                      
                      {/* Icon placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="text-white/20 text-center"
                        >
                          <activeDemo.icon className="h-32 w-32 mx-auto mb-4" />
                          <p className="text-2xl font-semibold">{activeDemo.title}</p>
                        </motion.div>
                      </div>
                      
                      {/* Demo badge */}
                      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                        Watch Demo
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Demo Details */}
            <motion.div
              key={activeDemo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-xl p-6 border shadow-sm"
            >
              <h3 className="text-2xl font-bold mb-3 text-gradient">{activeDemo.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{activeDemo.description}</p>
              
              <div className="grid grid-cols-2 gap-3">
                {activeDemo.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activeDemo.color}`}></div>
                    <span className="text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Link href={activeDemo.demoLink}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`mt-6 w-full btn btn-primary btn-enhanced hover-glow bg-gradient-to-r ${activeDemo.color}`}
                >
                  Try {activeDemo.title} Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 text-muted-foreground mb-4">
            <span className="text-sm">Want to see more?</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="btn btn-primary btn-lg btn-enhanced hover-glow">
                Start Free Trial
              </button>
            </Link>
            <Link href="/features">
              <button className="btn btn-outline btn-lg btn-enhanced hover-scale">
                View All Features
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
