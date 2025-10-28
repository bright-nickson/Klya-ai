'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MapPin, Clock, Users, Heart, Zap, Globe } from 'lucide-react'

export default function CareersPage() {
  const openPositions = [
    {
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Accra, Ghana',
      type: 'Full-time',
      description: 'Join our engineering team to build scalable AI-powered solutions for African businesses.',
      requirements: ['5+ years experience', 'React/Node.js', 'AI/ML knowledge', 'Remote work experience']
    },
    {
      title: 'AI/ML Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help us develop cutting-edge AI models and improve our content generation capabilities.',
      requirements: ['3+ years ML experience', 'Python/TensorFlow', 'NLP expertise', 'Research background']
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Accra, Ghana',
      type: 'Full-time',
      description: 'Drive product strategy and work with cross-functional teams to deliver exceptional user experiences.',
      requirements: ['3+ years PM experience', 'SaaS background', 'User research', 'Analytics skills']
    },
    {
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help us grow our brand and reach more African entrepreneurs with our AI solutions.',
      requirements: ['2+ years marketing', 'Digital marketing', 'Content creation', 'Analytics tools']
    }
  ]

  const benefits = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance and wellness programs'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Learning & Development',
      description: 'Annual learning budget and conference attendance'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Remote Work',
      description: 'Flexible remote work options and home office stipend'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Team Culture',
      description: 'Collaborative environment with regular team events'
    }
  ]

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
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Join Our Mission to Empower African Businesses
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Be part of a team that's building the future of AI-powered business tools for Africa. 
                We're looking for passionate individuals who want to make a real impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#positions" className="btn btn-primary btn-enhanced hover-glow">
                  View Open Positions
                </a>
                <a href="#culture" className="btn btn-outline btn-enhanced hover-scale">
                  Learn About Our Culture
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Work With Us */}
        <section id="culture" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Work With Us?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're building something special at AfriGrowth AI. Here's what makes us different.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-6 text-center"
                >
                  <div className="mx-auto inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ready to make an impact? Check out our current openings and join our growing team.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {openPositions.map((position, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </span>
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                          {position.department}
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-primary mt-4 md:mt-0">
                      Apply Now
                    </button>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{position.description}</p>
                  
                  <div>
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="flex flex-wrap gap-2">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="bg-muted/50 text-muted-foreground px-3 py-1 rounded-full text-sm">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Application Process</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We've designed a straightforward process to get to know you and help you understand our team.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { step: '1', title: 'Apply', description: 'Submit your application with resume and cover letter' },
                  { step: '2', title: 'Initial Review', description: 'Our team reviews your application and portfolio' },
                  { step: '3', title: 'Interview', description: 'Video call with team members and technical assessment' },
                  { step: '4', title: 'Decision', description: 'We make our decision and extend an offer' }
                ].map((process, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {process.step}
                    </div>
                    <h3 className="font-semibold mb-2">{process.title}</h3>
                    <p className="text-sm text-muted-foreground">{process.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
              <p className="text-muted-foreground mb-8">
                We're always looking for talented individuals to join our team. 
                Send us your resume and let us know how you'd like to contribute to our mission.
              </p>
              <a href="mailto:careers@afrigrowth.ai" className="btn btn-primary btn-enhanced hover-glow">
                Send Us Your Resume
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}