'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

export default function Header() {
  const [projectsOpen, setProjectsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProjectsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold text-foreground hover:opacity-90 transition-opacity">
          Kate Eyler
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">About</Link>
          <Link href="/contact" className="text-foreground/80 hover:text-foreground transition-colors">Contact</Link>
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
            >
              Projects
              <svg className={`w-4 h-4 transition-transform ${projectsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {projectsOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-background/70 backdrop-blur-xl border border-white/10 shadow-lg py-1">
                <Link
                  href="/crosswords"
                  onClick={() => setProjectsOpen(false)}
                  className="block px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/10 transition-colors"
                >
                  Crossword Stuff
                </Link>
                <Link
                  href="/chatbot"
                  onClick={() => setProjectsOpen(false)}
                  className="block px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/10 transition-colors"
                >
                  Chatbot 1.0
                </Link>
                <Link
                  href="/chatbot2.0"
                  onClick={() => setProjectsOpen(false)}
                  className="block px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-white/10 transition-colors"
                >
                  Chatbot 2.0 (and then some)
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}