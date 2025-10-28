'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { 
  Brain, 
  Mic, 
  Globe, 
  Smartphone, 
  Users, 
  BarChart3,
  MessageSquare,
  FileText,
  Image,
  Video,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Content Generation',
    description: 'Generate high-quality content in English, Twi, Ga, and other Ghanaian languages using advanced GPT models.',
    category: 'Content',
    benefits: ['Multi-language support', 'Cultural context awareness', 'SEO optimization', 'Brand voice consistency']
  },
  {
    icon: Mic,
    title: 'Voice Transcription',
    description: 'Convert audio to text with Whisper AI, supporting local accents and languages for better accuracy.',
    category: 'Audio',
    benefits: ['Accent recognition', 'Real-time processing', 'Multiple formats', 'High accuracy']
  },
  {
    icon: Globe,
    title: 'Local Language Support',
    description: 'Built-in support for Ghanaian languages with cultural context and local business terminology.',
    category: 'Localization',
    benefits: ['5 Ghanaian languages', 'Cultural adaptation', 'Local terminology', 'Regional dialects']
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Optimized for mobile devices with offline capabilities, perfect for Ghanaian users on the go.',
    category: 'Mobile',
    benefits: ['Offline access', 'Touch optimized', 'Fast loading', 'Data efficient']
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Collaborate with your team members, assign roles, and manage projects efficiently.',
    category: 'Collaboration',
    benefits: ['Role management', 'Project tracking', 'Real-time sync', 'Permission controls']
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track your content performance, user engagement, and business growth with detailed analytics.',
    category: 'Analytics',
    benefits: ['Performance metrics', 'User insights', 'Growth tracking', 'Custom reports']
  },
  {
    icon: MessageSquare,
    title: 'Social Media Tools',
    description: 'Create engaging social media posts, captions, and hashtags tailored for Ghanaian audiences.',
    category: 'Social',
    benefits: ['Platform optimization', 'Hashtag suggestions', 'Engagement tracking', 'Content scheduling']
  },
  {
    icon: FileText,
    title: 'Document Processing',
    description: 'AI-powered document analysis, summarization, and translation for business documents.',
    category: 'Documents',
    benefits: ['Smart extraction', 'Auto-summarization', 'Format conversion', 'Version control']
  },
  {
    icon: Image,
    title: 'Image Generation',
    description: 'Create custom images and graphics for your business using AI, with Ghanaian cultural elements.',
    category: 'Visual',
    benefits: ['Cultural elements', 'Brand consistency', 'Multiple formats', 'High resolution']
  },
  {
    icon: Video,
    title: 'Video Content',
    description: 'Generate video scripts, subtitles, and descriptions optimized for Ghanaian video platforms.',
    category: 'Video',
    benefits: ['Script generation', 'Auto-subtitles', 'Platform optimization', 'Engagement hooks']
  }
]

const categories = ['All', 'Content', 'Audio', 'Localization', 'Mobile', 'Collaboration', 'Analytics', 'Social', 'Documents', 'Visual', 'Video']

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-8"
              >
                <Sparkles className="h-4 w-4 fill-current" />
                <span>Comprehensive AI Solutions</span>
              </motion.div>

              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Powerful AI Tools for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Ghanaian Businesses
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Everything you need to grow your business with AI-powered tools designed specifically 
                for the Ghanaian market and cultural context.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="btn btn-primary btn-lg btn-enhanced hover-glow"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/detect"
                  className="btn btn-outline btn-lg btn-enhanced hover-scale"
                >
                  Try Language Detection
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card p-8 hover-lift hover-glow group cursor-pointer h-full"
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-4 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl group-hover:text-gradient transition-all duration-300">{feature.title}</h3>
                        <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          {feature.category}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300 mb-6">
                      {feature.description}
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )
              })}
            </div>
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
                  Ready to Transform Your Business?
                </h3>
                <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                  Join businesses and creators already using KLYA AI to enhance their productivity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/register"
                    className="btn btn-primary btn-lg btn-enhanced hover-glow"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href="/detect"
                    className="btn btn-outline btn-lg btn-enhanced hover-scale"
                  >
                    Try Language Detection
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
