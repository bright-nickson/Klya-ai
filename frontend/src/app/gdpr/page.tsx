'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { motion } from 'framer-motion'

export default function GDPRPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              GDPR Compliance
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="prose dark:prose-invert max-w-none"
            >
              <p className="text-muted-foreground mb-6">Last updated: October 22, 2025</p>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Our Commitment to GDPR</h2>
              <p className="text-muted-foreground mb-4">
                KLYA AI is committed to protecting your personal data and respecting your privacy rights 
                in accordance with the General Data Protection Regulation (GDPR).
              </p>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Your Rights Under GDPR</h2>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Right to Access:</strong> You can request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> You can request corrections to your data</li>
                <li><strong>Right to Erasure:</strong> You can request deletion of your data</li>
                <li><strong>Right to Restrict Processing:</strong> You can limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> You can request your data in a portable format</li>
                <li><strong>Right to Object:</strong> You can object to certain types of processing</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Exercising Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                To exercise any of your GDPR rights, please contact our Data Protection Officer at{' '}
                <a href="mailto:dpo@klya.ai" className="text-primary hover:underline">
                  dpo@klya.ai
                </a>
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
