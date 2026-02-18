export const tinesDiagram = `
  graph TB
      subgraph "Browser - Frontend"
          LP["Landing Page\\nhearts.js canvas + password auth"]
          HUB["Hub Page\\n3 destinations"]
          VAL["Valentine Note"]
          MOOD["Mood Selection\\nHarry or Horse avatar"]
          KATE["Kate Selection\\nKate or Bald avatar"]
          LAVA["Lava Watch\\nlava.mp4 video"]
          CHAT["Chat Interface\\niMessage-style + prompt chips"]

          LP -->|"password verified"| HUB
          HUB --> VAL
          HUB --> MOOD
          HUB --> LAVA
          MOOD --> KATE
          KATE --> CHAT
          VAL -->|"Back"| HUB
          LAVA -->|"Back"| HUB
          CHAT -->|"Back"| HUB
      end

      subgraph "Flask Backend - server.py"
          VERIFY["/api/verify-password\\n3 users: Harry, Kate, Other"]
          CHATAPI["/api/chat\\nRAG + Anthropic API"]
          TASKS_GET["/api/tasks\\nGET - list tasks"]
          TASKS_DONE["/api/tasks/id/complete\\nPOST - mark done"]
          LOGS["/api/logs?pw=\\npassword-protected history"]
          HEALTH["/api/health\\nDiagnostics + Anthropic connectivity"]
      end

      subgraph "RAG Pipeline"
          QUERY["Query ChromaDB\\ncosine similarity"]
          CONTEXT["Retrieve top 10 chunks"]
          EXTRACT["Extract Kate-only lines\\nkate_style_reference"]
          SPECIAL{"Special prompt?"}
          HORSE["Horse Meal Mode\\nAbsurd food suggestions"]
          BOSS["Boss Mode\\nInstructions + random task"]
          BUILD["Build augmented prompt\\nconversations + kate_style + special"]
      end

      subgraph "Data Stores"
          CHROMA[("ChromaDB\\n618 conversation chunks\\nall-MiniLM-L6-v2 embeddings")]
          TASKSJSON[("tasks.json\\n5 tasks + completion status")]
          CHATLOGSDIR[("chat_logs/\\nsession JSON files\\ntagged by user")]
          MSGS[("messages.json\\n13,342 iMessages\\nKate and Harry")]
      end

      subgraph "External Services"
          ANTHROPIC["Anthropic API\\nclaude-sonnet-4-5-20250929\\nvia requests library, HTTP/1.1\\n60s timeout, 3-retry init"]
      end

      subgraph "Offline Data Pipeline"
          IMSG[("Apple iMessage DB\\nchat.db - handle 2820\\n~938MB SQLite")]
          EXTRACT_PY["extract_messages.py\\nNSKeyedArchiver deserializer"]
          INDEX_PY["index_messages.py\\n30-min gap chunking"]

          IMSG --> EXTRACT_PY --> MSGS --> INDEX_PY --> CHROMA
      end

      subgraph "Deployment"
          GH["GitHub\\nk8eyler/tines"]
          RAILWAY["Railway\\ntines.up.railway.app\\ngunicorn + nixpacks"]
          ENV["ANTHROPIC_API_KEY\\nRailway env var"]

          GH -->|"auto-deploy on push"| RAILWAY
          ENV --> RAILWAY
      end

      %% Frontend to Backend
      LP -->|"POST"| VERIFY
      CHAT -->|"POST + session_id + chat_user"| CHATAPI
      CHAT -->|"POST"| TASKS_DONE
      CHAT -->|"GET"| TASKS_GET

      %% Backend to RAG
      CHATAPI --> QUERY
      QUERY --> CHROMA
      CHROMA --> CONTEXT
      CONTEXT --> EXTRACT
      EXTRACT --> SPECIAL
      SPECIAL -->|"suggest_horse_meal"| HORSE
      SPECIAL -->|"be_my_boss"| BOSS
      SPECIAL -->|"normal"| BUILD
      HORSE --> BUILD
      BOSS --> BUILD
      BUILD --> ANTHROPIC
      ANTHROPIC -->|"generated reply"| CHATAPI

      %% Logging and tasks
      CHATAPI -->|"log exchange"| CHATLOGSDIR
      BOSS -->|"pick random task"| TASKSJSON
      TASKS_DONE --> TASKSJSON
      LOGS --> CHATLOGSDIR

      style LP fill:#ff6b8a,color:#fff
      style CHAT fill:#4a90d9,color:#fff
      style ANTHROPIC fill:#d4a574,color:#fff
      style CHROMA fill:#7bc47f,color:#fff
      style RAILWAY fill:#8b5cf6,color:#fff
      style GH fill:#333,color:#fff
      style SPECIAL fill:#fff3e0,stroke:#f57c00,stroke-width:2px
`;
