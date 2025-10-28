'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Akosua Mensah',
    role: 'Founder, Kente Digital',
    location: 'Accra, Ghana',
    content: 'KLYA AI has transformed how we create content for our clients. The language support is incredible - it understands our context perfectly.',
    rating: 5,
    avatar: 'AM'
  },
  {
    name: 'Kwame Asante',
    role: 'Marketing Manager, TechHub Ghana',
    location: 'Kumasi, Ghana',
    content: 'The AI features are a game-changer for our team. It accurately captures our needs and saves us hours of manual work.',
    rating: 5,
    avatar: 'KA'
  },
  {
    name: 'Ama Serwaa',
    role: 'Content Creator',
    location: 'Tamale, Ghana',
    content: 'As a content creator, I love how the AI generates culturally relevant content. It helps me connect better with my Ghanaian audience.',
    rating: 5,
    avatar: 'AS'
  },
  {
    name: 'Emmanuel Osei',
    role: 'CEO, AgriTech Solutions',
    location: 'Cape Coast, Ghana',
    content: 'The analytics dashboard gives us insights we never had before. We can now track which content resonates with our customers across different regions.',
    rating: 5,
    avatar: 'EO'
  },
  {
    name: 'Fatima Ibrahim',
    role: 'Social Media Manager, Fashion Forward',
    location: 'Accra, Ghana',
    content: 'The social media tools are perfect for our fashion brand. The AI understands Ghanaian fashion trends and creates engaging posts in multiple languages.',
    rating: 5,
    avatar: 'FI'
  },
  {
    name: 'Kofi Nkrumah',
    role: 'Small Business Owner, Nkrumah Enterprises',
    location: 'Takoradi, Ghana',
    content: 'Finally, an AI tool that understands our business needs in Ghana. The pricing is fair, and the support team is always helpful.',
    rating: 5,
    avatar: 'KN'
  }
]

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Loved by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Ghanaian Businesses
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how AfriGrowth AI is helping businesses across Ghana grow and succeed 
            with AI-powered tools designed for our market.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-6 hover-lift hover-glow transition-all duration-300"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-sm text-primary">{testimonial.location}</div>
                </div>
              </div>
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
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
            <h3 className="font-display text-2xl font-bold mb-4">
              Join 500+ Happy Customers
            </h3>
            <p className="text-muted-foreground mb-6">
              Start your journey with AfriGrowth AI today and see why Ghanaian businesses trust us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary btn-enhanced hover-glow">
                Start Free Trial
              </button>
              <button className="btn btn-outline btn-enhanced hover-scale">
                Read More Reviews
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
