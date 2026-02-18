"use client";

import MermaidDiagram from '@/components/MermaidDiagram';
import { ragChatbotDiagram } from '@/components/diagrams/rag-chatbot-diagram';
import Image from 'next/image';

export default function ChatbotPage() {

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">RAG Chatbot</h1>
          <p className="text-muted-foreground">
            A chatbot trained on my personal data using Retrieval-Augmented Generation (RAG)
          </p>
        </div>

        {/* chat.jpg */}
        <div className="bg-card rounded-lg shadow-md border border-border p-6">
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/chat.jpg"
              alt="RAG Chatbot Interface"
              width={800}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Project Overview</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              I continuously set out to push the limits of what I can accomplish technically. One way I decided to test my strengths (and learn as much as I could along the way) was by building my own RAG chatbot to engage with dating app matches. 
              </p>
              <p>
              Before we get to the good stuff, I want to add a disclaimer that this bot was only created for experimentation purposes, and was always used under my own human supervision.
              My goals with this project were to get an understanding of RAG processes, including indexing and training, as well as to create something with my own real data.
            </p>
            <p>
              The system combines the power of LLMs with an additional retrieval 
              mechanism that can access and reference specific information from my personal dataset, 
              making conversations more accurate and personalized while both saving me time and having fun!
            </p>
          </div>
        </div>

        {/* Technical Implementation Screenshot */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">System Architecture</h2>
          <div className="mb-4 overflow-x-auto">
            <MermaidDiagram 
              chart={ragChatbotDiagram} 
              className="w-full"
            />
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>
              The system is built using a modern, scalable architecture that includes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Data Sources:</strong> Personal text messages (15,000+ messages) and real-time Tinder conversations</li>
              <li><strong>Web Automation:</strong> Playwright for browser automation and session management</li>
              <li><strong>Backend Services:</strong> Node.js/Express server with authentication and automation services</li>
              <li><strong>AI & ML:</strong> Claude-3-5-Sonnet API, Voyage AI embeddings, and Pinecone vector database</li>
              <li><strong>Frontend:</strong> React web app and dedicated RAG chatbot interface</li>
              <li><strong>Storage:</strong> SQLite database for conversation data and local processing</li>
            </ul>
          </div>
        </div>

        {/* Features and Capabilities */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-card-foreground">Contextual Understanding</h3>
              <p className="text-sm text-muted-foreground">
                The chatbot maintains conversation context and can reference previous interactions 
                to provide more coherent and relevant responses.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-card-foreground">Personalized Responses</h3>
              <p className="text-sm text-muted-foreground">
                Leverages personal data and preferences to tailor responses specifically to my 
                background, interests, and communication style.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-card-foreground">Real-time Processing</h3>
              <p className="text-sm text-muted-foreground">
                Fast response times with intelligent caching and optimization for smooth 
                conversational flow.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-card-foreground">Privacy-First Design</h3>
              <p className="text-sm text-muted-foreground">
                Built with privacy in mind, ensuring that personal data is handled securely 
                and conversations remain confidential.
              </p>
            </div>
          </div>
        </div>

        {/* Future Enhancements */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Future Enhancements</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              This project serves as a foundation for more advanced AI applications. Future 
              iterations could include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Multi-modal capabilities (text, voice, image processing)</li>
              <li>Integration with Match's profile information</li>
              <li>Scoring likelihood of a good match</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
