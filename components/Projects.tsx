"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const projects = [
  {
    title: 'NYT Crossword Stats',
    description: 'Interactive dashboard tracking my New York Times crossword solving progress over the years.',
    image: '/crossword_project_clip.jpg',
    link: '/crosswords',
  },
  {
    title: 'RAG Chatbot',
    description: 'A chatbot trained on my own data using Retrieval-Augmented Generation.',
    image: '/rag-chatbot-thumbnail.svg',
    link: '/chatbot',
  },
  {
    title: "Tines — Valentine's RAG Chatbot",
    description: 'A personalized Valentine\'s chatbot built with RAG, trained on 13,342 iMessages and deployed on Railway.',
    image: '/tines.png',
    link: '/chatbot2.0',
  },
  {
    title: 'Lava Lamps — AI Video Loop',
    description: 'Generating an AI video based on the lava lamps in my living room that can effectively loop.',
    image: '/lavathumbnail.png',
    link: '/lavalamps',
  },
];

export default function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.scrollWidth / projects.length;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, projects.length - 1));
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', updateActiveIndex, { passive: true });
    return () => container.removeEventListener('scroll', updateActiveIndex);
  }, [updateActiveIndex]);

  const scrollTo = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.scrollWidth / projects.length;
    container.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  };

  const prev = () => scrollTo(Math.max(activeIndex - 1, 0));
  const next = () => scrollTo(Math.min(activeIndex + 1, projects.length - 1));

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-foreground">My Projects</h2>

      <div className="relative group">
        {/* Left arrow */}
        <button
          onClick={prev}
          aria-label="Previous project"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
                     w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border
                     flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity
                     disabled:hidden"
          disabled={activeIndex === 0}
        >
          <ChevronLeft size={20} className="text-foreground" />
        </button>

        {/* Right arrow */}
        <button
          onClick={next}
          aria-label="Next project"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
                     w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border
                     flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity
                     disabled:hidden"
          disabled={activeIndex === projects.length - 1}
        >
          <ChevronRight size={20} className="text-foreground" />
        </button>

        {/* Scrolling container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {projects.map((project, index) => {
            const isSvg = project.image.endsWith('.svg');
            return (
              <Link
                key={index}
                href={project.link}
                className="flex-none w-full snap-center group/card"
              >
                <div className="bg-card rounded-lg border border-border overflow-hidden shadow-md
                                transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                  <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden">
                    {isSvg ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
                      />
                    ) : (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to project ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-6 bg-primary'
                : 'w-2 bg-muted hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
