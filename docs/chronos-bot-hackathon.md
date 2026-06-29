# 🤖 CHRONOS-BOT: Enjambre de Reacción Crítica para Robótica Reactiva

[cite_start]Documento de especificación técnica y estrategia de desarrollo para el **Cerebras x Google DeepMind Gemma 4 24-Hour Hackathon**[cite: 7].

* [cite_start]**Track Principal:** Track 1 - Multiverse Agents (Best Multi-Agent + Multimodal Use Case)[cite: 11, 44].
* [cite_start]**Track Secundario:** Track 2 - People's Choice (Most Impressions on Social Media)[cite: 11, 47].
* [cite_start]**Core Stack:** Google DeepMind Gemma 4 31B [cite: 7, 87] + [cite_start]Cerebras Ultra-Fast Inference API[cite: 9, 103].

---

## 🌎 1. Descripción General del Proyecto
[cite_start]**Chronos-Bot** es un sistema de multi-agentes en tiempo real diseñado para la toma de decisiones lógicas en entornos físicos o simulados (Robótica, IA Física, IoT) que requieren latencia cercana a cero[cite: 9, 46]. [cite_start]El ecosistema procesa streams visuales del entorno (imágenes en Base64) a través de la API multimodal de Cerebras[cite: 107, 109]. 

[cite_start]Gracias a la velocidad extrema de inferencia de Cerebras [cite: 9, 39][cite_start], un agente estratega activa el modo de razonamiento profundo (`reasoning_effort: "high"`) [cite: 95, 116] y un agente actuador devuelve instrucciones de movimiento estructuradas en formato JSON estricto (`strict: true`) [cite: 112] [cite_start]para ajustar el comportamiento del hardware o simulador en milisegundos, rompiendo la barrera de lag de las GPUs tradicionales[cite: 40].

### [cite_start]Requerimientos de la Demo (60 Segundos) [cite: 38]
* [cite_start]**Demostración de velocidad:** Comparativa interactiva lado a lado (Cerebras vs. Proveedor basado en GPU tradicional) para resaltar la caída drástica en la latencia de respuesta[cite: 40].
* [cite_start]**Privacidad:** Asegurar que ninguna API Key, credencial o notificación del sistema sea visible en la captura del escritorio[cite: 42].

---

## 🛠️ 2. Arquitectura de Tecnologías

* **Frontend (Entorno de Simulación):** React / Next.js (Tailwind CSS) + HTML5 Canvas para el renderizado del mapa de la grilla 2D donde se moverá el robot avatar.
* **Backend (Orquestador de Agentes):** Node.js (TypeScript) / Express o Python (FastAPI).
* [cite_start]**API de Inferencia:** `gemma-4-31b` ejecutado sobre la infraestructura de Cerebras Cloud[cite: 102, 103].
* [cite_start]**Formatos de Comunicación:** Ingesta de imágenes en cadenas de texto URI Base64 [cite: 109] [cite_start]y respuestas validadas mediante JSON Schema estructurado[cite: 112].

---

## 📅 3. Cronograma de Fases a Contrarreloj (24 Horas)

[cite_start]Dada la naturaleza crítica del tiempo en este hackathon (24 horas)[cite: 2, 13], el desarrollo se segmenta en **4 fases intensivas**. Cada fase incluye un **Prompt de Co-Piloto** diseñado para que herramientas de asistencia al desarrollo (como Claude, Gemini o ChatGPT) actúen como un ingeniero senior y aceleren la escritura del código junto a ti.

### ⏱️ Fase 1: Entorno Gráfico y Captura de Pantalla (Duración: 4 Horas)
**Actividades:**
* Configurar el boilerplate en Next.js/Tailwind.
* Diseñar un Canvas HTML5 que represente una grilla lógica. El robot inicia en el punto `(0,0)` e intenta avanzar al punto `(N,N)`.
* Implementar un sistema de clic/arrastre de ratón para colocar obstáculos dinámicos en la pantalla.
* [cite_start]Programar una función interna en JavaScript que extraiga el estado actual del Canvas en una cadena Base64 (`canvas.toDataURL('image/png')`)[cite: 109].

> 🤖 **Prompt de Co-Piloto para IA (Fase 1):**
> *"Actúa como un Ingeniero Frontend experto en React y Canvas API. Necesito un componente de React estructurado con TypeScript y Tailwind CSS que renderice una grilla interactiva de 10x10. Debe haber un nodo 'Robot' (color azul) y un nodo 'Meta' (color verde). El usuario debe poder hacer clic en las celdas vacías para colocar 'Obstáculos' (color rojo). Añade una función exportable llamada `captureSimulationState()` que capture el estado actual del canvas y devuelva estrictamente un string en formato Base64 de datos URI listo para enviarse a una API de visión por computadora. Código limpio, modular y sin bugs."*

---

### ⏱️ Fase 2: Conexión API Cerebras y Multi-Agentes (Duración: 6 Horas)
**Actividades:**
* [cite_start]Establecer la conexión con el SDK compatible con OpenAI usando las credenciales elevadas de Cerebras[cite: 103, 108].
* [cite_start]Configurar el primer flujo de agente: enviar la imagen Base64 para detectar la coordenada del obstáculo[cite: 109].
* [cite_start]Configurar el segundo flujo: encadenar el resultado hacia la lógica de razonamiento lógico (`reasoning_effort: "high"`) utilizando el modelo `gemma-4-31b`[cite: 95, 102, 116].

> 🤖 **Prompt de Co-Piloto para IA (Fase 2):**
> *"Actúa como un Desarrollador Backend experto en Node.js y arquitecturas de IA. Necesito crear un servicio que interactúe con la API de Cerebras usando su compatibilidad con OpenAI. El servicio debe implementar una cadena de dos agentes lógicos con el modelo `gemma-4-31b`:
> 1. Agente Perceptor: Recibe un string Base64 que contiene una imagen del mapa, analiza visualmente las posiciones y retorna un texto plano describiendo dónde se encuentran las amenazas u obstáculos.
> 2. Agente Estratega: Toma la descripción del perceptor y el historial de posiciones del robot, e invoca una llamada con el parámetro `reasoning_effort: "medium"` o `"high"` para calcular de forma analítica el camino de escape ideal.
> Escribe la función asíncrona integrando el manejo correcto de errores y optimización de llamadas de red."*

---

### ⏱️ Fase 3: Salidas Estructuradas y Control en Tiempo Real (Duración: 5 Horas)
**Actividades:**
* Diseñar un JSON Schema que limite estrictamente las respuestas válidas que la simulación web pueda interpretar (ej. comandos de dirección: `UP`, `DOWN`, `LEFT`, `RIGHT`).
* [cite_start]Configurar el parámetro `strict: true` dentro de la llamada de chat completion de Cerebras para asegurar que Gemma 4 nunca rompa el formato de datos esperado[cite: 112].
* Conectar el payload JSON recibido con el estado del Frontend para mover al robot de forma inmediata y automática en la grilla.

> 🤖 **Prompt de Co-Piloto para IA (Fase 3):**
> *"Actúa como un Ingeniero de Software Senior. Necesito refinar la última capa de salida de mi agente de IA usando la API de Cerebras. Configura una llamada de Chat Completions usando Structured Outputs con `strict: true`. El modelo debe forzar su salida a cumplir exactamente con un JSON Schema que contenga: `next_move` (un enum de opciones fijas: 'UP', 'DOWN', 'LEFT', 'RIGHT') y `reason_summary` (un string corto que explique por qué eligió ese movimiento). Devuelve el código completo del backend que exporte esta función lista para integrarse con una API de Express que escuche al frontend."*

---

### ⏱️ Fase 4: Comparativa de Latencia y Grabación de Demo (Duración: 5 Horas)
**Actividades:**
* [cite_start]Duplicar la llamada de inferencia para que, de forma paralela opcional, se dispare a un proveedor secundario estándar (como Gemini o una instancia lenta en GPU tradicional) para calcular la diferencia de tiempos en milisegundos[cite: 40, 133].
* [cite_start]Utilizar el objeto `time_info` devuelto por el completion de Cerebras para renderizar métricas exactas en la pantalla de la aplicación: TTFT (Time to First Token) y tokens/seg[cite: 117, 118].
* [cite_start]Grabar el video demo de un máximo de 60 segundos exponiendo cómo el robot choca o se congela con el lag de la GPU tradicional, pero esquiva de inmediato el obstáculo usando Cerebras[cite: 38, 39, 40].

> 🤖 **Prompt de Co-Piloto para IA (Fase 4):**
> *"Actúa como un experto en UI/UX y optimización de rendimiento. Necesito crear un componente visual de analíticas para mi dashboard del hackathon. El componente debe recibir dos objetos de rendimiento: uno de Cerebras (utilizando sus datos nativos de `time_info` como prompt tokens, total tokens y latencia de punta a punta) y otro de una API de comparación. Debe dibujar dos tarjetas comparativas muy visuales con Tailwind CSS que resalten de manera obvia los milisegundos de retraso frente a los microsegundos de Cerebras. Agrega animaciones sutiles que parpadeen en verde para denotar la velocidad más rápida."*

---

## 🗂️ 4. Formato de Entrega Final para Discord y Twitter [cite: 16, 21]

Al concluir el desarrollo, las directrices oficiales dictan que debemos estructurar el post de entrega de la siguiente manera exacta en los canales públicos `#g4hackathon-multiverse-agents` y `#g4hackathon-people-choice`[cite: 19, 20, 25]:

```text
• Project Name: Chronos-Bot
• Team Members: @TuUsuarioDiscord, @MiembrosDeTuEquipo
• Project Description: Chronos-Bot es un enjambre de agentes lógicos diseñado para la toma de decisiones en robótica reactiva e IA física en tiempo real. Utilizando la inferencia multimodal ultra-rápida de Gemma 4 en Cerebras, el sistema procesa imágenes consecutivas del entorno para evadir obstáculos dinámicos con latencia cercana a cero, calculando rutas óptimas a la velocidad del pensamiento.
• GitHub Repository: [Enlace a tu repositorio público]
• Demo Video: (Adjuntar archivo de video de 60 segundos de forma nativa)