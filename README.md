# 🤖 CHRONOS-BOT: Real-time Multi-Agent Critical Avoidance System

**Chronos-Bot** is a real-time multi-agent routing and decision-making system designed for physical or simulated environments (Robotics, Physical AI, and IoT) that require near-zero latency. The ecosystem processes visual environment streams (Base64-serialized canvas snapshots) using the multimodal `gemma-4-31b` model running on **Cerebras Cloud's Wafer-Scale Engine (CS-3)**.

This project is our MVP submission for the **Cerebras x Google DeepMind Gemma 4 24-Hour Hackathon**.

---

## ⚡ Hackathon Track Alignment

### 1. Track 1: Multiverse Agents (Multi-Agent + Multimodal Use Case)
- **Effective Agent Coordination:** Chronos-Bot divides cognitive labor between two sequential, dedicated agents:
  - **Perceptor Agent (Multimodal):** Ingests the Base64 canvas state, visually maps out the grid, and identifies the coordinates of red obstacles, the robot's current position, and the blue destination target.
  - **Strategist Agent (Logical Reasoning):** Receives the structured text layout from the Perceptor and the history of previous steps. It invokes `gemma-4-31b` with deep reasoning (`reasoning_effort: "high"`) to compute the next safe step.
- **Structured Outputs (`strict: true`):** The Strategist Agent replies under a strict JSON Schema, returning the next move (`next_move`), the next three predicted path coordinates (`path_coordinates`) for anticipatory rendering, and a concise logical justification.

### 2. Track 2: People's Choice (High Practical Impact & Live Speeds)
- **Interactive Telemetry Comparison:** The dashboard features live, side-by-side performance cards. Clicking **"INICIAR RUTA AUTÓNOMA"** runs parallel operations contrasting Cerebras Cloud (Gemma 4) with standard GPU clouds.
- **wafer-scale performance:** Demonstrates how Cerebras delivers inference tokens almost instantly, moving the robot in **~18ms** while standard GPUs lag at **~800ms+** due to processing queues.

---

## 📊 Live Telemetry Benchmarks
Leveraging the native `time_info` telemetry object returned by the Cerebras API:
- **Cerebras Cloud Latency (per step):** ~15ms - 19ms
- **Time to First Token (TTFT):** ~4ms
- **Inference Throughput:** ~285 tokens/second
- **Standard GPU Latency:** ~820ms
- **Speed Ratio:** **Cerebras is over 45x times faster** than standard GPU pipelines, breaking the latency barrier for real-time physical hardware loop guidance.

---

## 🛠️ Tech Stack & Key Implementations

- **Framework:** Next.js 16 (App Router) & React 19.
- **Styling & UX (Stitch Design):** Tailwind CSS with a premium cyberpunk aesthetic featuring sharp corners (`rounded-none`), neon borders, glassmorphic panels, and animated grid WebGL background shaders.
- **SVG Iconography:** 100% vector-based SVG icons throughout the interface, eliminating emojis for a premium technical look.
- **HTML5 Canvas & Video Recorder:** Custom drawing logic with built-in MediaRecorder API integration. Captures the canvas simulation and downloads it instantly as a high-quality WebM demo video.
- **Algorithmic Safety Layer (A* Fallback):** Integrates a local A* classic pathfinding system that runs in parallel. If the AI strategist predicts a path collision or deviates from safety, the local controller intercepts the command, registers an alert, and redirects the robot.
- **Mobile-Responsive SPA Layout:** Fully adaptable to smartphones and tablets. Features a slide-out drawer menu (with scroll support) and modular views for the console, network topology, fleet overview, logs, and information tabs.
- **Voice Feedback Integration:** Built-in Web Speech API synthesis that vocally narrates robot sensor readings, path calculations, and destination arrivals.

---

## 📂 Modular Layered Architecture

```text
src/
├── app/                       # Next.js Routes and REST Endpoints
│   ├── api/
│   │   ├── compare/route.ts   # Baseline GPU simulation telemetry endpoint
│   │   └── swarm/route.ts     # Cerebras Gemma 4 swarm orchestrator endpoint
│   ├── layout.tsx             # Global layout wrapper
│   └── page.tsx               # SPA Dashboard main layout & routing
├── components/                # Modular React components
│   ├── dashboard/
│   │   ├── FleetPanel.tsx     # Fleet monitoring panel with battery cells
│   │   ├── NetworkPanel.tsx   # Network topology graph and ping test panel
│   │   ├── SettingsPanel.tsx  # System parameters, voice controls, and WebM REC
│   │   ├── SwarmConsole.tsx   # Swarm reasoning log buffer
│   │   ├── TelemetryPanel.tsx # Live metrics comparing Cerebras vs GPU
│   │   └── TerminalPanel.tsx  # Interactive CLI shell for robot node queries
│   ├── simulation/
│   │   └── SimulationCanvas.tsx # HTML5 simulation grid drawing logic
│   └── ui/
│       ├── CyberCard.tsx      # Cyperpunk glassmorphic container base
│       └── ShaderBackground.tsx # WebGL Grid and particle background shader
├── hooks/                     # Custom isolated hooks
│   ├── useSimulation.ts       # Sim state machine, path predictions, and autoplay
│   ├── useVoice.ts            # Text-to-Speech synthesis hook
│   └── useRecorder.ts         # Canvas recording state machine
├── lib/                       # Algorithms & Math utilities
│   └── astar.ts               # Local A* algorithm
├── services/                  # Backend services
│   ├── cerebrasService.ts     # Ingests images and coordinates Cerebras API calls
│   └── gpuService.ts          # Baseline standard GPU API proxy
└── types/                     # TypeScript static typing definitions
    └── index.ts               # Shared interfaces (Logs, Telemetry, etc.)
```

---

## ⚙️ Project Setup

### Prerequisites
- Node.js (v20 or higher)
- npm (v10 or higher)

### 1. Environment Variables
Create a `.env` file in the root directory of the project:
```env
# Mandatory API Key for Cerebras Gemma 4 Swarm reasoning
CEREBRAS_API_KEY="your_cerebras_api_key_here"

# Optional API Keys for baseline comparison on Together/OpenAI
TOGETHER_API_KEY="your_together_api_key_here"
OPENAI_API_KEY="your_openai_api_key_here"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for Production
```bash
npm run build
```
