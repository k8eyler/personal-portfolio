export const ragChatbotDiagram = `
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
