'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
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
  Video
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Content Generation',
    description: 'Generate high-quality content in English, Twi, Ga, and other Ghanaian languages using advanced GPT models.',
    category: 'Content'
  },
  {
    icon: Mic,
    title: 'Voice Transcription',
    description: 'Convert audio to text with Whisper AI, supporting local accents and languages for better accuracy.',
    category: 'Audio'
  },
  {
    icon: Globe,
    title: 'Local Language Support',
    description: 'Built-in support for Ghanaian languages with cultural context and local business terminology.',
    category: 'Localization'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Optimized for mobile devices with offline capabilities, perfect for Ghanaian users on the go.',
    category: 'Mobile'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Collaborate with your team members, assign roles, and manage projects efficiently.',
    category: 'Collaboration'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track your content performance, user engagement, and business growth with detailed analytics.',
    category: 'Analytics'
  },
  {
    icon: MessageSquare,
    title: 'Social Media Tools',
    description: 'Create engaging social media posts, captions, and hashtags tailored for Ghanaian audiences.',
    category: 'Social'
  },
  {
    icon: FileText,
    title: 'Document Processing',
    description: 'AI-powered document analysis, summarization, and translation for business documents.',
    category: 'Documents'
  },
  {
    icon: Image,
    title: 'Image Generation',
    description: 'Create custom images and graphics for your business using AI, with Ghanaian cultural elements.',
    category: 'Visual'
  },
  {
    icon: Video,
    title: 'Video Content',
    description: 'Generate video scripts, subtitles, and descriptions optimized for Ghanaian video platforms.',
    category: 'Video'
  }
]

const categories = ['All', 'Content', 'Audio', 'Localization', 'Mobile', 'Collaboration', 'Analytics', 'Social', 'Documents', 'Visual', 'Video']

export function Features() {
  return (
    <section className="py-24 lg:py-32 bg-muted/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Powerful AI Tools for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Ghanaian Businesses
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to grow your business with AI-powered tools designed specifically 
            for the Ghanaian market and cultural context.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="card p-6 lg:p-8 hover-glow group cursor-pointer relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-gradient transition-all duration-300">{feature.title}</h3>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        {feature.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 hover-lift glass">
            <h3 className="font-display text-2xl font-bold mb-4 text-gradient">
              Ready to Transform Your Business?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join hundreds of Ghanaian businesses already using AfriGrowth AI to scale their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="btn btn-primary btn-enhanced hover-glow">
                  Start Free Trial
                </button>
              </Link>
              <Link
                href="/detect"
                className="btn btn-outline btn-enhanced hover-scale"
              >
                Try Language Detection
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
