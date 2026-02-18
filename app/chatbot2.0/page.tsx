"use client";

import MermaidDiagram from '@/components/MermaidDiagram';
import { tinesDiagram } from '@/components/diagrams/tines-diagram';

export default function Chatbot2Page() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Tines — Valentine&apos;s RAG Chatbot</h1>
          <p className="text-muted-foreground">
            A personalized Valentine&apos;s chatbot built with RAG, trained on 13,342 iMessages and deployed on Railway
          </p>
        </div>

        {/* Project Description */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Project Overview</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Tines is a Valentine&apos;s-themed RAG chatbot that mimics my texting style using 13,342 real
              iMessages as its knowledge base. The app features a hearts-animated landing page with password
              authentication, an iMessage-style chat interface with prompt chips, and a few playful Easter
              eggs — including a &quot;Horse Meal Mode&quot; that generates absurd food suggestions and a
              &quot;Boss Mode&quot; that dishes out tasks to complete.
            </p>
            <p>
              Built as a follow-up to my first RAG chatbot, this iteration swaps the Node.js/Pinecone
              stack for a Flask backend with ChromaDB, uses lighter all-MiniLM-L6-v2 embeddings, and
              ships the whole thing to Railway with auto-deploy from GitHub. The two-step avatar selection
              flow (mood, then character) personalizes the conversation before it even starts.
            </p>
          </div>
        </div>

        {/* System Architecture */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">System Architecture</h2>
          <div className="mb-4 overflow-x-auto">
            <MermaidDiagram
              chart={tinesDiagram}
              className="w-full"
            />
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>
              The system spans a browser frontend, a Flask API, a RAG pipeline, and an offline data
              ingestion process:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Frontend:</strong> Hearts.js canvas landing page with password auth, hub navigation, and an iMessage-style chat UI with prompt chips</li>
              <li><strong>Backend:</strong> Flask server with endpoints for authentication, chat, task management, and password-protected conversation logs</li>
              <li><strong>RAG Pipeline:</strong> ChromaDB vector store (618 chunks, all-MiniLM-L6-v2 embeddings), cosine similarity retrieval, and Kate-style extraction for personalized prompts</li>
              <li><strong>AI:</strong> Anthropic Claude (claude-sonnet-4-5-20250929) via HTTP/1.1 with 60s timeout and 3-retry initialization</li>
              <li><strong>Data Pipeline:</strong> Apple iMessage DB (~938MB, handle 2820) extracted via NSKeyedArchiver deserializer, chunked by 30-min gaps, indexed into ChromaDB</li>
              <li><strong>Deployment:</strong> GitHub (k8eyler/tines) auto-deploys to Railway via gunicorn + nixpacks</li>
            </ul>
          </div>
        </div>

        {/* Features and Capabilities */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-card-foreground">iMessage-Style Chat</h3>
              <p className="text-sm text-muted-foreground">
                A familiar chat interface with prompt chips for quick interactions, session tracking,
                and per-user conversation logging.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-card-foreground">Two-Step Avatar Flow</h3>
              <p className="text-sm text-muted-foreground">
                Users pick a mood (Harry or Horse), then a character variant (Kate or Bald), creating
                a personalized experience before the conversation begins.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-card-foreground">Special Prompt Modes</h3>
              <p className="text-sm text-muted-foreground">
                Horse Meal Mode generates absurd food suggestions. Boss Mode assigns random tasks from
                a task list and tracks completion status.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-card-foreground">Lightweight RAG Stack</h3>
              <p className="text-sm text-muted-foreground">
                ChromaDB with all-MiniLM-L6-v2 embeddings keeps the stack simple and self-contained —
                no external vector database service required.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Technical Details</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Key differences from the first RAG chatbot iteration:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Switched from Node.js/Express to Flask for a more lightweight backend</li>
              <li>Replaced Pinecone + Voyage AI with ChromaDB + all-MiniLM-L6-v2 for fully self-contained vector storage</li>
              <li>Added multi-user password authentication (Harry, Kate, Other) with per-user chat logging</li>
              <li>Built a custom offline pipeline: iMessage extraction via NSKeyedArchiver, 30-minute gap chunking, and batch indexing</li>
              <li>Deployed to Railway with GitHub auto-deploy, gunicorn, and nixpacks</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
