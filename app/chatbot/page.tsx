"use client";

import MermaidDiagram from '@/components/MermaidDiagram';
import Image from 'next/image';

export default function ChatbotPage() {
  const systemArchitectureDiagram = `
    graph TB
        %% Data Sources
        subgraph "Data Sources" 
            PersonalDB[("Personal Text Messages<br/>15,000 messages")]
            TinderApp["Tinder Web App<br/>(Real-time conversations)"]
        end

        %% Web Automation Layer
        subgraph "Web Automation Layer"
            Playwright["Playwright Browser Automation<br/>(Headless Chrome)"]
            ManualLogin["Manual Login Process<br/>(User authenticates)"]
        end

        %% Backend Services
        subgraph "Backend Services (Node.js/Express)"
            MainServer["Main Server<br/>(server.js - Port 3001)"]
            TinderAuto["Tinder Automation Service<br/>(tinder_automation.js)"]
            AuthSession["Authentication &<br/>Session Management"]
        end

        %% AI & ML Services
        subgraph "AI & ML Services"
            ClaudeAPI["Anthropic Claude API<br/>(Claude-3-5-Sonnet)"]
            VoyageAI["Voyage AI Embeddings<br/>(voyage-3 model)"]
            Pinecone["Pinecone Vector Database<br/>(1024-dimensional vectors)"]
        end

        %% Frontend Applications
        subgraph "Frontend Applications"
            ReactApp["React Web App<br/>(Main Interface)"]
            RAGChatbot["RAG Chatbot Interface<br/>(rag-chatbot.html)"]
        end

        %% Local Storage
        subgraph "Local Storage"
            SQLiteDB[("SQLite Database<br/>(Conversation data)")]
        end

        %% Data Processing
        subgraph "Data Processing & Indexing"
            IndexingScripts["Message Indexing Scripts<br/>(Batch processing - 1000 msgs)"]
            PineconeSetup["Pinecone Setup &<br/>Management"]
        end

        %% Data Flow Connections
        PersonalDB --> SQLiteDB
        TinderApp <--> Playwright
        Playwright <--> TinderAuto
        TinderAuto <--> MainServer
        MainServer <--> AuthSession
        ManualLogin --> Playwright

        %% Processing Flow
        SQLiteDB --> IndexingScripts
        IndexingScripts --> VoyageAI
        VoyageAI --> Pinecone
        PineconeSetup --> Pinecone

        %% API Connections
        ReactApp <--> MainServer
        RAGChatbot <--> MainServer
        MainServer <--> ClaudeAPI
        MainServer <--> VoyageAI
        MainServer <--> Pinecone

        %% Real-time data flow
        TinderApp -.->|"Real-time conversations"| SQLiteDB
        SQLiteDB -.->|"Auto-indexing"| VoyageAI

        %% RAG Process Flow
        Pinecone -->|"Context retrieval<br/>(Top 5 similar messages)"| ClaudeAPI
        ClaudeAPI -->|"Generated response"| ReactApp
        ReactApp -->|"Approved messages"| TinderAuto
        TinderAuto -->|"Send to Tinder"| TinderApp

        %% Styling
        classDef dataSource fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
        classDef automation fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
        classDef backend fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
        classDef ai fill:#fff3e0,stroke:#f57c00,stroke-width:2px
        classDef frontend fill:#fce4ec,stroke:#c2185b,stroke-width:2px
        classDef storage fill:#f1f8e9,stroke:#689f38,stroke-width:2px
        classDef processing fill:#e0f2f1,stroke:#00695c,stroke-width:2px

        class PersonalDB,TinderApp dataSource
        class Playwright,ManualLogin automation
        class MainServer,TinderAuto,AuthSession backend
        class ClaudeAPI,VoyageAI,Pinecone ai
        class ReactApp,RAGChatbot frontend
        class SQLiteDB storage
        class IndexingScripts,PineconeSetup processing
  `;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">RAG Chatbot</h1>
          <p className="text-gray-600">
            A chatbot trained on my personal data using Retrieval-Augmented Generation (RAG)
          </p>
        </div>

        {/* chat.jpg */}
        <div className="bg-white rounded-lg shadow-lg p-6">
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
          <div className="space-y-4 text-gray-600">
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">System Architecture</h2>
          <div className="mb-4 overflow-x-auto">
            <MermaidDiagram 
              chart={systemArchitectureDiagram} 
              className="w-full"
            />
          </div>
          <div className="space-y-3 text-gray-600">
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Contextual Understanding</h3>
              <p className="text-sm text-gray-600">
                The chatbot maintains conversation context and can reference previous interactions 
                to provide more coherent and relevant responses.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Personalized Responses</h3>
              <p className="text-sm text-gray-600">
                Leverages personal data and preferences to tailor responses specifically to my 
                background, interests, and communication style.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Real-time Processing</h3>
              <p className="text-sm text-gray-600">
                Fast response times with intelligent caching and optimization for smooth 
                conversational flow.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Privacy-First Design</h3>
              <p className="text-sm text-gray-600">
                Built with privacy in mind, ensuring that personal data is handled securely 
                and conversations remain confidential.
              </p>
            </div>
          </div>
        </div>

        {/* Future Enhancements */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Future Enhancements</h2>
          <div className="space-y-3 text-gray-600">
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
