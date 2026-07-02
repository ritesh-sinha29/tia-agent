# Eraser.io AI Diagram Prompts

Here are the optimized copy-paste prompts you can feed into **Eraser.io's AI diagram generator** to create professional, clean visual charts.

---

## 1. User Flow Diagram Prompt (Timeline Style)

### Copy-Paste Prompt:
```text
Create a clean, professional, horizontal/linear user flow timeline diagram for an AI agent platform called "Aria". The style should be modern, developer-oriented, and minimal with clear steps and icons.

Use the following sequence of steps:
1. "Onboarding Wizard" (icon: user, description: "New user fills occupation & age form")
2. "Dashboard Landing" (icon: layout, description: "System detects completed onboarding & starts interactive tour")
3. "Open Preview Panel" (icon: panel-right-close, description: "Step 1 highlights far-right sidebar trigger button")
4. "Available Connectors" (icon: plug, description: "Step 2 highlights header plug icon for app integrations")
5. "AI Agent Toggle" (icon: brain, description: "Step 3 highlights Ask Brain vs Agent mode toggles in chat area")
6. "Help & Guides" (icon: help, description: "Step 4 highlights header question mark icon")
7. "My Tasks Page" (icon: check-square, description: "Step 5 highlights sidebar Tasks link for automation logs")

Show a clear directional arrow flowing sequentially from step 1 to step 7. Keep the palette clean with gray, white, and a single accent purple highlight.
```

---

## 2. System Architecture Diagram Prompt (Box/Block Connections)

### Copy-Paste Prompt:
```text
Create a clean system architecture diagram for a real-time reactive AI Agent application named "Aria" using a box/block connection layout. Group the components into 5 distinct labeled boxes/containers:

1. "Infrastructure": Google Cloud Run hosting Docker containers.
2. "Client Layer (Next.js)": Web Browser dashboard, Clerk Auth for login sessions, and local Zustand state.
3. "Data & Caching": Convex DB (real-time reactive database) and Upstash Redis (serverless LangGraph checkpoint database).
4. "Agent & Cognitive Layer": FastAPI Python server and LangGraph engine (orchestrating Brain and Agent cognitive workflows).
5. "Integrations": Composio API Router connecting to third-party services like Gmail, Slack, GitHub, and Jira.

Define the following connection lines:
- Client Web Browser to Clerk Auth ("JWT/Auth Session")
- Client Web Browser to Convex DB ("Real-time Reactive Sync")
- Client Web Browser to FastAPI Server ("REST Workflow API")
- FastAPI Server to LangGraph Engine ("Cognitive Execution Loop")
- LangGraph Engine to Upstash Redis ("Thread state persistence")
- LangGraph Engine to Composio API Router ("Tool Action Execution")
- Composio API Router to Gmail/Slack/GitHub/Jira ("OAuth API Calls")
- FastAPI Server to Convex DB ("Writes completed tasks & execution logs")

Use clean lines, clear labels on the arrows, and professional tech icons for Next.js, Redis, Google Cloud, Clerk, FastAPI, and Databases.
```

---

## 3. High-Level System Layers Prompt (Stacked Layers)

### Copy-Paste Prompt:
```text
Create a stacked block architecture diagram showing the system tiers of the AI Agent application. The layers should be stacked vertically from top (delivery) to bottom (data layer), shaped like horizontal pointers/blocks pointing to the right:

1. "CDN Layer": Cloudflare CDN (Global Content Delivery)
2. "Hosting Layer": Google Cloud Run (Containerized Next.js & FastAPI deployment)
3. "Application Layer": Next.js 16 Web Dashboard (React 19, Clerk Auth, Zustand)
4. "API Gateway Layer": FastAPI Backend Server (REST API endpoints & CORS routing)
5. "Cognitive Service Layer": LangGraph Engine (Cognitive workflow agents) & Composio API Connectors
6. "Data & Cache Layer": Convex DB (Reactive state) & Upstash Redis (Serverless checkpointer memory)

Make the layout vertical, clean, and minimal. Use distinct but harmonious soft colors (red, orange, yellow, green, blue, purple) for each stack block to make it look premium.
```
