# Aria System Architecture & User Flow (Eraser.io Format)

This document contains the exact Diagram-as-Code blocks designed for **Eraser.io** to generate clean, professional diagrams for your hackathon submission.

---

## 1. System Architecture Diagram (Eraser.io Code)

Copy and paste this code into the **Diagram** tab in [Eraser.io](https://app.eraser.io/) to get a clean layout matching your reference:

```text
// System Architecture for Aria

// Grouping by layers
group Infrastructure [color: purple] {
  cloud_run [icon: google-cloud, label: "Google Cloud Run\n(Docker Containers)"]
}

group Data_Layer [color: emerald] {
  convex [icon: database, label: "Convex DB\n(Real-time State)"]
  upstash [icon: redis, label: "Upstash Redis\n(Serverless Checkpointer)"]
}

group Client_Layer [color: blue] {
  nextjs [icon: nextjs, label: "Next.js 16 Server\n(React 19)"]
  clerk [icon: auth, label: "Clerk Auth\n(Identity Provider)"]
  browser [icon: chrome, label: "User Browser\n(Zustand State)"]
}

group Agent_Intelligence [color: orange] {
  fastapi [icon: fastapi, label: "FastAPI Backend"]
  langgraph [icon: langchain, label: "LangGraph Cognitive Engine"]
}

group Integrations [color: amber] {
  composio [icon: api, label: "Composio Integration Router"]
  apps [icon: integrations, label: "Gmail / Slack / GitHub / Jira"]
}

// Connections & Flows
browser > clerk [label: "Auth/JWT Session"]
browser > convex [label: "Reactive State Sync"]
browser > fastapi [label: "HTTP Request Workflow API"]

fastapi > langgraph [label: "Cognitive Loop"]
langgraph > upstash [label: "Read/Write Thread State"]
langgraph > composio [label: "Execute Tool Actions"]
composio > apps [label: "OAuth API Call"]

fastapi > convex [label: "Write execution logs & tasks"]
```

---

## 2. User Flow Diagram (Eraser.io Code)

Copy and paste this code into a new **Diagram** tab in **Eraser.io** to generate a clean timeline-based user flow:

```text
// User Onboarding & Interactive Guide Flow

// Nodes
step_onboarding [icon: user, label: "1. Onboarding Form\n- Occupation & Age inputs\n- Handled by OnboardingDialog"]
step_dashboard [icon: layout, label: "2. Landing Dashboard\n- Reactively loads user state\n- Detects completed onboarding"]
step_tour [icon: compass, label: "3. Interactive Guide Trigger\n- Auto-opens on home/agent page\n- Highlight sequence starts"]
step_preview [icon: panel, label: "4. Workflow Preview Panel\n- Highlights far-right panel\n- Guides user to toggle view"]
step_connectors [icon: plug, label: "5. Active Connectors\n- Guides user to header plug icon\n- Explains app integrations"]
step_agent [icon: robot, label: "6. Agent Toggle Mode\n- Highlights Brain vs Agent toggle\n- Explains workflow creation"]
step_tasks [icon: tasks, label: "7. My Tasks Central\n- Guides user to tasks sidebar item\n- Explains automation logs"]

// Sequence Flow
step_onboarding > step_dashboard [label: "onbording_dialog = true"]
step_dashboard > step_tour [label: "Auto-starts if tour not seen"]
step_tour > step_preview [label: "Focuses right strip button"]
step_preview > step_connectors [label: "Next step"]
step_connectors > step_agent [label: "Next step"]
step_agent > step_tasks [label: "Next step"]
```

---

## 3. High-Level Stack Layers (Stacked Block Diagram)

Copy and paste this into **Eraser.io** for a stacked layer representation:

```text
// Stacked Block Diagram

CDN [icon: cloudfront, label: "Cloudflare CDN\nGlobal Static Delivery"]
Hosting [icon: vercel, label: "Google Cloud Run\nContainerized Scaled Hosting"]
Application [icon: nextjs, label: "Application Layer\nNext.js 16 Web Dashboard"]
Gateway [icon: fastapi, label: "API Gateway\nFastAPI REST Endpoint Manager"]
Service [icon: langchain, label: "Cognitive Service Layer\nLangGraph Workflows & Composio App Connectors"]
Data [icon: database, label: "Data Layer\nConvex Real-time DB & Upstash serverless Redis"]

CDN > Hosting
Hosting > Application
Application > Gateway
Gateway > Service
Service > Data
```
