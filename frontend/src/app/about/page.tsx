'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Users, Globe, Sparkles } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Ghana-first • Mobile-first • AI-powered</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Built for Ghanaian businesses, creators, and changemakers
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                KLYA AI empowers creators and businesses with intelligent tools that enhance
                productivity and creativity — from content generation to data analysis,
                and everything in between.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12">
          <div className="container mx-auto px-4 grid gap-8 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold">Our mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Make AI accessible and relevant to Ghanaian small businesses — reducing time,
                cost, and complexity so owners can focus on customers and growth.
              </p>

              <h2 className="text-2xl font-semibold">Our vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading platform powering digital growth across Africa — starting with
                Ghana — by combining modern AI with local insight.
              </p>

              <div className="flex gap-4 mt-4">
                <a href="/register" className="btn btn-primary">
                  Start Free Trial
                </a>
                <a href="/pricing" className="btn btn-outline">
                  View Plans
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
                <Image
                  src="/screenshots/screenshot.png"
                  alt="KLYA AI platform interface"
                  width={1200}
                  height={800}
                  className="w-full h-[320px] object-cover sm:h-[420px]"
                  priority
                />
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold">Core values</h3>
              <p className="text-muted-foreground mt-2">What guides us every day</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="card p-6 text-center"
              >
                <div className="mx-auto inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="font-medium">Community First</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  We build for people — understanding local needs, language and culture.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-6 text-center"
              >
                <div className="mx-auto inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h4 className="font-medium">Reliable & Local</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Optimized for Ghanaian networks, payments and business flows.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="card p-6 text-center"
              >
                <div className="mx-auto inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="font-medium">Practical Innovation</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  We ship solutions that save time, cut costs and increase revenue for users.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team (placeholders) */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold">Team</h3>
              <p className="text-muted-foreground mt-2">Small, focused, and community-driven</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Shhh', role: 'Founder & CEO', img: '/images/lock.jpg' },
                { name: 'Hehe Boi', role: 'Product Designer', img: '/images/hehe.jpg' },
                { name: 'Character development', role: 'Lead Engineer', img: '/images/hehehe.jpg' },
                { name: 'Well well well', role: 'Growth & Ops', img: '/images/see.jpeg' },
                { name: 'Korku Yie', role: 'AI engineer', img: '/images/kishhhh.jpg' },
                { name: 'You feel me', role: 'Security Engineer', img: '/images/Bobo.jpg' },
                { name: 'Cera des...', role: 'Devops engineer', img: '/images/Maybe_Cera.jpg' },
                { name: 'Gister', role: 'Data Analyst', img: '/images/yiee.jpg' },
                { name: 'Senyo Kekeli', role: 'Business Development Lead', img: '/images/team3.jpg' },
                { name: 'Siame Kelvin', role: 'Backend Engineer', img: '/images/team4.jpg' }
              ].map((m) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="card p-4 text-center"
                >
                  <div className="w-28 h-28 mx-auto rounded-full overflow-hidden mb-4">
                    <Image src={m.img} alt={m.name} width={112} height={112} className="object-cover" />
                  </div>
                  <h5 className="font-medium">{m.name}</h5>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl p-10 text-center"
            >
              <h3 className="text-2xl font-semibold mb-3">Ready to create with KLYA?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Start a free trial and see how AI can transform your marketing, sales and operations.
              </p>
              <a href="/register" className="btn btn-primary btn-lg">Start Free Trial</a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
