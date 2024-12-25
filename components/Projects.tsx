import Image from 'next/image'
import { ExternalLinkIcon } from 'lucide-react'

const projects = [
  {
    title: 'Project 1',
    description: 'A brief description of your first project.',
    image: '/placeholder.svg?height=200&width=300',
    link: '#',
  },
  {
    title: 'Project 2',
    description: 'A brief description of your second project.',
    image: '/placeholder.svg?height=200&width=300',
    link: '#',
  },
  // Add more projects as needed
]

export default function Projects() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              width={300}
              height={200}
              layout="responsive"
              className="object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <a
                href={project.link}
                className="inline-flex items-center text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project
                <ExternalLinkIcon size={16} className="ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
