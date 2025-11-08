'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Sun, Moon, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover-scale group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">KLYA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/detect" 
              className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors duration-200 relative group"
            >
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-accent/50">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
                <span>Language Detection</span>
              </div>
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-[calc(100%-1.5rem)] group-hover:left-3"></span>
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-accent transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
              suppressHydrationWarning
            >
              {mounted && (
                <>
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 hover:rotate-180 transition-transform duration-500" />
                  ) : (
                    <Moon className="h-5 w-5 hover:rotate-180 transition-transform duration-500" />
                  )}
                </>
              )}
              {!mounted && <div className="h-5 w-5" />}
            </button>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="btn btn-outline btn-enhanced hover-scale"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="btn btn-outline btn-enhanced hover-scale"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-primary btn-enhanced hover-glow"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="flex flex-col space-y-2 py-4">
              <Link
                href="/features"
                className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/detect"
                className="px-4 py-2.5 text-sm font-medium text-foreground/90 hover:text-primary transition-colors duration-200 flex items-center space-x-2 hover:bg-accent/50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
                <span>Language Detection</span>
              </Link>
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="btn btn-outline w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="btn btn-outline w-full"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="btn btn-outline w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="btn btn-primary w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
