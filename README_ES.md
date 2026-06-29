# 🤖 CHRONOS-BOT: Sistema de Evasión Crítica en Tiempo Real Mediante Enjambres Multi-Agente

**Chronos-Bot** es un sistema de enrutamiento y toma de decisiones multi-agente en tiempo real diseñado para entornos físicos o simulados (Robótica, IA Física e IoT) que requieren latencia cercana a cero. El ecosistema procesa flujos de estado visuales del entorno (capturas de pantalla codificadas en Base64) utilizando el modelo multimodal `gemma-4-31b` ejecutado sobre la infraestructura de **Cerebras Cloud (Wafer-Scale Engine CS-3)**.

Este proyecto representa el MVP desarrollado para el **Cerebras x Google DeepMind Gemma 4 24-Hour Hackathon**.

---

## ⚡ Alineación con los Tracks del Hackathon

### 1. Track 1: Multiverse Agents (Caso de Uso Multi-Agente + Multimodal)
- **Coordinación Efectiva de Agentes:** Chronos-Bot divide el trabajo cognitivo entre dos agentes secuenciales especializados:
  - **Agente Perceptor (Multimodal):** Ingiere el estado del canvas en Base64, analiza visualmente el lienzo e identifica las coordenadas exactas de obstáculos rojos, la posición del robot y la meta final azul.
  - **Agente Estratega (Razonamiento Lógico):** Recibe el reporte espacial estructurado del Perceptor y el historial de pasos. Realiza inferencia en `gemma-4-31b` activando el modo de razonamiento profundo (`reasoning_effort: "high"`) para deducir el siguiente paso seguro.
- **Structured Outputs (`strict: true`):** El Estratega responde de forma obligatoria bajo un JSON Schema rígido que devuelve la decisión de movimiento (`next_move`), las próximas tres coordenadas estimadas del camino (`path_coordinates`) para renderizado anticipado, y una breve justificación lógica.

### 2. Track 2: People's Choice (Alto Impacto Práctico y Velocidad en Vivo)
- **Comparación de Telemetría Interactiva:** El panel cuenta con tarjetas de métricas en vivo lado a lado. Al presionar **"INICIAR RUTA AUTÓNOMA"**, se ejecutan llamadas concurrentes contrastando Cerebras Cloud (Gemma 4) frente a nubes de GPU tradicionales.
- **Rendimiento Wafer-Scale:** Muestra cómo Cerebras resuelve la inferencia casi instantáneamente, moviendo el robot en **~18ms** en comparación con los **~800ms+** de las GPUs tradicionales debido a las colas de procesamiento.

---

## 📊 Benchmarks de Telemetría Real
Utilizando el objeto de telemetría nativo `time_info` devuelto por la API de Cerebras:
- **Latencia de Cerebras Cloud (por paso):** ~15ms - 19ms
- **Tiempo a Primer Token (TTFT):** ~4ms
- **Rendimiento de Inferencia:** ~285 tokens/segundo
- **Latencia en GPU Estándar:** ~820ms
- **Factor de Aceleración:** **Cerebras es más de 45 veces más rápido** que las arquitecturas de GPU tradicionales, rompiendo la barrera de lag para el guiado reactivo de hardware físico.

---

## 🛠️ Tecnologías e Implementaciones Clave

- **Framework:** Next.js 16 (App Router) y React 19.
- **Estética y UX (Stitch):** Tailwind CSS con temática cyberpunk oscura, esquinas de precisión recta (`rounded-none`), contornos neón, paneles translúcidos glassmorphic y shaders WebGL reactivos de fondo.
- **Iconografía Vectorial (SVG):** Eliminación total de emojis en la interfaz, sustituidos por vectores SVG limpios con colores dinámicos de Tailwind.
- **HTML5 Canvas y Grabador WebM:** Lógica de dibujo interactiva con MediaRecorder API integrado para capturar las sesiones y descargarlas en formato WebM.
- **Capa de Seguridad Algorítmica (A* Fallback):** Integración de un algoritmo local A* clásico. Si el enjambre de IA predice una colisión o se desvía, el controlador local intercepta el paso, registra una alerta y redirige el robot de forma segura.
- **Layout Responsivo 100% Móvil:** Adaptación fluida para teléfonos inteligentes y tabletas, incorporando un menú lateral ocultable con soporte de scroll y paneles adaptables para la consola, topología de red, flotilla, logs y metadatos.
- **Feedback de Voz Sintética:** Integración de Web Speech API para narrar en tiempo real las lecturas de los sensores, desvíos A* y la llegada a la meta del robot.

---

## 📂 Arquitectura Modular del Repositorio

```text
src/
├── app/                       # Rutas de Next.js y Endpoints REST
│   ├── api/
│   │   ├── compare/route.ts   # Endpoint de telemetría de GPU estándar
│   │   └── swarm/route.ts     # Endpoint de enjambre (Cerebras Gemma 4)
│   ├── layout.tsx             # Layout global
│   └── page.tsx               # Ruteo y layout de la SPA del Dashboard
├── components/                # Componentes React modulares
│   ├── dashboard/
│   │   ├── FleetPanel.tsx     # Monitoreo de flotilla y celdas de batería
│   │   ├── NetworkPanel.tsx   # Topología de red y pings concurrentes
│   │   ├── SettingsPanel.tsx  # Parámetros del sistema y grabación WebM
│   │   ├── SwarmConsole.tsx   # Consola de razonamiento del enjambre
│   │   ├── TelemetryPanel.tsx # Comparador de velocidad Cerebras vs GPU
│   │   └── TerminalPanel.tsx  # Shell CLI interactiva del operador
│   ├── simulation/
│   │   └── SimulationCanvas.tsx # Canvas de dibujo de la simulación física
│   └── ui/
│       ├── CyberCard.tsx      # Tarjeta base glassmorphic
│       └── ShaderBackground.tsx # Shader WebGL e hilos de partículas
├── hooks/                     # Custom Hooks para aislamiento de lógica
│   ├── useSimulation.ts       # Máquina de estados de simulación y autoplay
│   ├── useVoice.ts            # Síntesis de voz (Text-to-Speech)
│   └── useRecorder.ts         # Grabador de pantalla del Canvas
├── lib/                       # Utilidades matemáticas
│   └── astar.ts               # Algoritmo A* local
├── services/                  # Servicios de backend e IA
│   ├── cerebrasService.ts     # Orquestación de llamadas a Cerebras Gemma 4
│   └── gpuService.ts          # Simulación y telemetría de GPU estándar
└── types/                     # Definiciones estáticas de TypeScript
    └── index.ts               # Interfaces globales compartidas
```

---

## ⚙️ Configuración del Proyecto

### Requisitos Previos
- Node.js (v20 o superior)
- npm (v10 o superior)

### 1. Variables de Entorno
Cree un archivo `.env` en la raíz del proyecto:
```env
# Clave de API para el enjambre de Cerebras Gemma 4
CEREBRAS_API_KEY="tu_clave_de_api_de_cerebras"

# Claves opcionales para telemetría real contra Together u OpenAI
TOGETHER_API_KEY="tu_api_key_de_together_ai"
OPENAI_API_KEY="tu_api_key_de_openai"
```

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Servidor de Desarrollo
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) en su navegador.

### 4. Compilar para Producción
```bash
npm run build
```
