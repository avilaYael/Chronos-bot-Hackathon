# Chronos-Bot - 2-Minute Demo Video Pitch Script

This script outlines the video structure, visual cues, and narration (in English) for the hackathon submission.

---

## **Video Metadata**
* **Duration:** 2 Minutes (Max)
* **Goal:** Showcase Chronos-Bot's real-time multimodal Swarm routing powered by Cerebras Cloud Wafer-Scale Engine (CS-3) and Gemma 4, highlighting the massive speed contrast against standard GPUs.

---

## **Scene 1: Introduction & The Problem (0:00 - 0:30)**
* **Visual:** Close-up of the Chronos-Bot Dashboard running with the animated interactive indigo grid shader. Start with a slow-moving grid showing high-latency standard GPU metrics (e.g., 820ms lag).
* **Audio / Dialogue (Voiceover):**
  > "Autonomous robots operating in dynamic, real-world environments require split-second decision-making. Traditional AI routing relies on cloud-based GPUs with cold starts and processing queues. In critical scenarios, a latency of over 800 milliseconds means collision, failure, and lost resources. Introducing Chronos-Bot: a multi-agent system designed for low-latency obstacle avoidance."

---

## **Scene 2: The Solution - Cerebras Wafer-Scale Engine (0:30 - 1:00)**
* **Visual:** Screen recording of the operator clicking "INICIAR RUTA AUTÓNOMA (LOOP)" with Cerebras active. Show the green telemetry card flashing "18 ms" latency and "285 tokens/second" in real-time. Show the robot navigating smoothly through obstacles.
* **Audio / Dialogue (Voiceover):**
  > "By running our Multimodal Swarm on Cerebras Cloud's CS-3 wafer-scale engine, we eliminate standard GPU bottlenecks. Chronos-Bot achieves an average reasoning latency of just 18 milliseconds—making it over 45 times faster than traditional GPU pipelines. Our double-agent structure parses the physical grid as a Base64 image and outputs safe, structured steering commands instantly."

---

## **Scene 3: Swarm Architecture & Safety Fallback (1:00 - 1:30)**
* **Visual:** Navigate to the "AGENTS" section to show the Perceptor and Strategist flowchart, then switch back to "SIMULATION". Paint red obstacles in front of the robot. Show the A* path visualizing in orange, and show the console outputting: `[System] Collision Mitigated Local. Corrected by A*`.
* **Audio / Dialogue (Voiceover):**
  > "Chronos-Bot operates with a dual-agent swarm: the Multimodal Perceptor translates visual canvas inputs into structured text, while the Strategist decides the next optimal move. For absolute mission safety, we integrated a classic A* pathfinding mitigation layer. If the AI predicts a path deviation, the system instantly overrides the command, ensuring 100% collision avoidance."

---

## **Scene 4: Live Demo Features & Conclusion (1:30 - 2:00)**
* **Visual:** Show the mobile-responsive view, open the slide-out menu, toggle the Voice Feedback button (which narrates a step: *"Moving UP, 18 milliseconds"*), and stop the canvas recorder to download the WebM demo video.
* **Audio / Dialogue (Voiceover):**
  > "Featuring full mobile responsiveness, synthetic voice telemetry feedback, and built-in canvas session recording, Chronos-Bot is fully equipped for operators in the field. Powered by Cerebras CS-3 and Gemma 4, Chronos-Bot proves that real-time robot reasoning is no longer a bottleneck. Thank you."
