# ⚡ PROMPTS DE INGENIERÍA DE NIVEL SENIOR - CHRONOS-BOT

---

## 🎯 PROMPT 1: ARQUITECTURA FRONTEND (CANVAS INTERACTIVO & EXPORTADOR BASE64)
**Asignado a:** Claude 3.5 Sonnet / GPT-4o  
**Objetivo:** Crear el entorno web de simulación interactiva con capacidad de serialización visual instantánea.

```text
[CONTEXTO Y ROL]
Actúas como un Ingeniero de Software Frontend Staff con especialidad en interacciones de alto rendimiento en la Web y manejo de la API de Canvas en HTML5. Estamos construyendo "Chronos-Bot", un MVP para un hackathon de tiempo crítico basado en robótica reactiva en tiempo real.

[OBJETIVO DE DESARROLLO]
Diseña un componente de React estructurado con TypeScript moderno y Tailwind CSS que implemente una grilla lógica de simulación interactiva.

[ESPECIFICACIONES TÉCNICAS REQUERIDAS]
1. Grilla Lógica: Una cuadrícula de 10x10 celdas indexadas por coordenadas bidimensionales (X, Y).
2. Estados de Nodos Básicos:
   - Nodo "Robot" (Color Azul): Posición inicial dinámica (default [0,0]).
   - Nodo "Meta" (Color Verde): Posición objetivo estática (default [9,9]).
   - Nodo "Obstáculo" (Color Rojo): Celdas bloqueadas.
3. Interactividad: El usuario debe poder hacer clic y arrastrar el cursor sobre las celdas vacías del Canvas para pintar u omitir "Obstáculos" (Nodos Rojos) dinámicamente en tiempo real.
4. Serializador Multimodal: Implementa una función exportable y optimizada llamada `captureSimulationState()`. Esta función debe capturar sincrónicamente el cuadro actual del Canvas, limpiar cualquier artefacto visual ajeno, y retornar estrictamente una cadena de texto formateada en "data URI Base64" (image/png), lista para ser transmitida a una API de visión por computadora.

[CONSTRICCIONES Y CALIDAD DE CÓDIGO]
- No utilices librerías externas pesadas de gráficos; dependemos de la API nativa de Canvas de HTML5 mediante un hook `useRef` para garantizar la máxima velocidad de renderizado.
- Estrecho manejo de ciclo de vida: evita memory leaks al limpiar los event listeners del mouse en el Canvas.
- Entrega el código modular, completamente tipado, autoexplicativo y listo para producción sin omitir secciones (prohibido colocar comentarios de marcador como "// el código va aquí").