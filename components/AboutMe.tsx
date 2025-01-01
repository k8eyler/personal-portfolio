'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Linkedin, Github } from 'lucide-react'

const TextCarousel = ({ texts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [texts.length]);

  return (
    <div className="h-12">
      <h2 
        className={`text-4xl font-bold tracking-wider text-gray-900 transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {texts[currentIndex]}
      </h2>
    </div>
  );
};

export default function AboutMe() {
  const carouselTexts = [
    "Customer Success Manager",
    "Data Enthusiast",
    "Crossword Aficionado",
    "Cat Lover",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 gap-24">
        {/* Top section with image and intro */}
        <div className="flex flex-col md:flex-row items-start gap-24">
          <div className="w-72 h-72 relative rounded-full overflow-hidden shadow-lg">
            <Image
              src="/headshot.jpg"
              alt="Profile photo"
              layout="fill"
              objectFit="cover"
            />
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <p className="text-gray-600 text-xl tracking-wide">Hi, I'm</p>
              <h1 className="text-6xl font-bold tracking-wider text-gray-900">Kate</h1>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-600 text-xl tracking-wide">I'm a</p>
              <TextCarousel texts={carouselTexts} />
            </div>
          </div>
        </div>

        {/* About Me section */}
        <div className="w-full space-y-4">
          <h2 className="text-2xl font-bold tracking-widest text-gray-900">About Me</h2>
          <p className="text-gray-600 text-xl leading-relaxed tracking-normal">
            With 5+ years in Enterprise Post Sales and Sales Operations, I'm experienced in building strategic client relationships, delivering data-driven insights, and showcasing value throughout the sales cycle. I'm always looking to add new skills (small round of applause for my first Nest.js website). Outside of customer-facing responsibilities I've acted as a mentor, cross-functional liaison, and (perhaps most importantly) company intramural kickball captain. In my spare time you can find me solving a crossword puzzle, taking a stab at creating a crossword, or exploring new tools to analyze my crossword solving data.
          </p>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-8">
          <a href="https://linkedin.com/in/kate-eyler" className="text-gray-900 hover:text-gray-600 transition-colors">
            <Linkedin size={32} />
          </a>
          <a href="https://github.com/k8eyler" className="text-gray-900 hover:text-gray-600 transition-colors">
            <Github size={32} />
          </a>
        </div>
      </div>
    </div>
  )
}