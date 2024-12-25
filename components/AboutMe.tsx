import Image from 'next/image'
import { Linkedin, Github } from 'lucide-react'

export default function AboutMe() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="w-72 h-72 relative rounded-full overflow-hidden shadow-lg">
          <Image
            src="/headshot.jpg"
            alt="Profile photo"
            layout="fill"
            objectFit="cover"
          />
        </div>
        
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <p className="text-gray-600 text-lg">Hello, I'm</p>
            <h1 className="text-5xl font-bold text-gray-900">Kate Eyler</h1>
          </div>
          
    
          
          <div className="flex gap-4">
            <a href="https://linkedin.com/kate-eyler" className="text-gray-900 hover:text-gray-600 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com/k8eyler" className="text-gray-900 hover:text-gray-600 transition-colors">
              <Github size={24} />
            </a>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">About Me</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              With 5+ years in Enterprise Customer Success Management and Sales Operations, I'm experienced in building strategic client relationships and identifying growth opportunities throughout the sales cycle as a trusted advisor to Fortune 500 companies. Outside of customer-facing responsibilities I've acted as a mentor, cross-functional liaison, and (perhaps most importantly) company intramural kickball captain.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}