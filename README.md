# 🤖 CHRONOS-BOT: Enjambre de Reacción Crítica para Robótica Reactiva

Este proyecto es nuestro MVP para el **Cerebras x Google DeepMind Gemma 4 24-Hour Hackathon**. 

**Chronos-Bot** es un sistema de toma de decisiones multi-agente en tiempo real diseñado para entornos físicos o simulados (Robótica, IA Física, IoT) que requieren latencia cercana a cero. El ecosistema procesa streams visuales del entorno (capturas de pantalla serializadas en Base64) a través del modelo multimodal `gemma-4-31b` ejecutado sobre la infraestructura de Cerebras Cloud.

---

## ⚡ Alineación con los Tracks del Hackathon

### 1. Track 1: Multiverse Agents (Caso de Uso Multi-Agente + Multimodal)
- **Coordinación efectiva de agentes:** Implementa una secuencia lógica de dos agentes que dividen el trabajo:
  - **Agente Perceptor (Multimodal):** Ingiere la cuadrícula de simulación en Base64, analiza visualmente el lienzo e identifica las coordenadas exactas de obstáculos rojos, el robot y la meta.
  - **Agente Estratega (Razonamiento Lógico):** Recibe el reporte espacial de Perceptor y el historial reciente de pasos. Invoca a `gemma-4-31b` activando el modo de razonamiento profundo (`reasoning_effort: "high"`) para deducir el siguiente paso óptimo.
- **Structured Outputs (`strict: true`):** El Estratega responde estrictamente bajo un JSON Schema predefinido que devuelve la decisión de movimiento (`next_move`), las próximas 3 coordenadas predichas (`path_coordinates`) para renderizado anticipado, y una breve justificación de menos de 15 palabras (`reasoning_summary`).

### 2. Track 2: People's Choice (Mayor Impacto Social)
- **Visualización de velocidad interactiva:** El panel incluye tarjetas de telemetría comparativas lado a lado en tiempo real. Al presionar **🚀 EJECUTAR ENJAMBRE**, se inician dos llamadas paralelas: una a Cerebras Cloud (Gemma 4) y otra a un simulador de GPU tradicional. 
- La demo muestra cómo Cerebras resuelve casi instantáneamente (~150ms), moviendo el robot y renderizando su trazado en la grilla, mientras la GPU tradicional se queda colgada en estado de buffering durante 1.6 segundos adicionales.

---

## 📊 Resultados de Telemetría Real
Utilizando el objeto nativo de telemetría `time_info` devuelto por la API de Cerebras, capturamos el rendimiento real de punta a punta:

- **Latencia de Cerebras Cloud (2 llamadas secuenciales):** ~150ms - 190ms
- **Tiempo de Respuesta a Primer Token (TTFT):** ~4ms - 6ms
- **Rendimiento de Inferencia:** ~280 tokens por segundo
- **Latencia GPU Estándar (Simulada):** ~1800ms
- **Diferencia de Velocidad:** **Cerebras es más de 12x veces más rápido** (y hasta 45x veces más rápido en tareas individuales), rompiendo la barrera de lag para el control físico de hardware en tiempo real.

---

## 🛠️ Tecnologías Utilizadas
- **Framework:** Next.js 15+ (App Router) & React 19
- **Estilos:** Tailwind CSS v4 con una interfaz cyberpunk oscura
- **Canvas:** HTML5 Canvas API nativa (mediante hooks de React) para garantizar la máxima velocidad de renderizado libre de memory leaks.
- **IA:** OpenAI SDK oficial apuntando a `gemma-4-31b` en Cerebras Cloud.

---

## 🚀 Mejoras Propuestas (Para las últimas horas del Hackathon)

Para llevar el proyecto al siguiente nivel antes de la entrega final, proponemos las siguientes mejoras de implementación rápida:

1. **Agente de Audio Multimodal (Voice Feedback):**
   - Integrar un tercer agente en la cadena o usar la Web Speech API del navegador para que el sistema "hable" en voz alta anunciando las decisiones estratégicas de Gemma 4 (ej. *"Obstáculo detectado en [4,5], recalculando ruta hacia el sur"*).
2. **Validación Algorítmica Local (Híbrido IA/A*):**
   - Comparar el camino predicho por Gemma 4 (`path_coordinates`) contra un algoritmo local clásico como A* o Dijkstra. Si la IA comete un error, el sistema local corrige el paso de forma inmediata, demostrando una arquitectura de control robusto para robótica comercial.
3. **Grabador Nactivo de Video Demo (Screen Recording Integration):**
   - Agregar un botón de grabación de pantalla integrado en la interfaz usando la MediaStream Recording API de HTML5. Esto permitiría a cualquier usuario capturar su interacción de 60 segundos y descargarla en MP4 al instante para subirla a Twitter/X o Discord.
4. **Modificación Dinámica del Mapa y Tamaño:**
   - Permitir cambiar el tamaño de la cuadrícula a `15x15` o `20x20` y aumentar dinámicamente el número de robots o metas en juego para probar la escalabilidad del análisis visual multimodal de Gemma 4.

---

## ⚙️ Configuración del Proyecto

### Requisitos Previos
- Node.js (v20 o superior)
- npm (v10 o superior)

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y agrega tu API Key de Cerebras:
```bash
CEREBRAS_API_KEY="tu_clave_de_api_de_cerebras"
```

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Ejecutar en Servidor de Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver e interactuar con el simulador.

### 4. Compilar para Producción
```bash
npm run build
```
