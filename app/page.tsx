import { useState, useEffect } from "react";
import AboutMe from '@/components/AboutMe'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import Projects from '@/components/Projects'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-24">
        <AboutMe />
        <ExperienceTimeline />
        <Projects />
      </div>
    </main>
  )
}