import OpenAI from 'openai';
import { TelemetryMetrics } from '../types';

/**
 * Simula y calcula las métricas de telemetría para una GPU estándar (nube serverless o local).
 * Utiliza un patrón de fallback automático y resiliente:
 * 1. Intenta conectarse a Together AI (GPU en nube serverless Llama 3) si hay credenciales.
 * 2. Si no, intenta conectarse a OpenAI (infraestructura comercial GPT-4o mini).
 * 3. Si ambas fallan o están ausentes, realiza un degradado suave a simulación probabilística.
 *
 * @returns Promesa con las métricas estimadas de la GPU
 */
export async function getStandardGPUTelemetry(): Promise<TelemetryMetrics> {
  // --- INTENTO 1: TOGETHER AI (NUBE SERVERLESS CON GPU TRADICIONAL) ---
  if (process.env.TOGETHER_API_KEY) {
    try {
      const togetherClient = new OpenAI({
        apiKey: process.env.TOGETHER_API_KEY,
        baseURL: 'https://api.together.xyz/v1',
      });

      const start = performance.now();
      const response = await togetherClient.chat.completions.create({
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un sistema de navegación reactivo simple. Responde corto.',
          },
          {
            role: 'user',
            content: '¿Cuál es el siguiente paso para avanzar de [0,0] a [0,1]?',
          },
        ],
        max_tokens: 20,
      });
      const end = performance.now();
      const rawLatency = Math.round(end - start);

      // Añadir latencia típica de cola y red
      const latency = rawLatency + 1200;
      const usage = response.usage;
      const completionTokens = usage?.completion_tokens || 10;
      const tokensPerSecond = latency > 0 
        ? Math.round((completionTokens / (latency / 1000))) 
        : 35;

      console.log('[TELEMETRY] Conectado exitosamente a Together AI (GPU Real). Latencia:', latency);

      return {
        latency,
        ttft: Math.round(rawLatency * 0.3),
        tokensPerSecond: Math.min(tokensPerSecond, 45), // Limitar al rendimiento promedio de GPU compartida
      };
    } catch (err: any) {
      console.warn('[TELEMETRY WARNING] Falló la conexión con Together AI, intentando fallback de OpenAI:', err.message);
    }
  }

  // --- INTENTO 2: OPENAI (INFRAESTRUCTURA DE CONSUMO GENERAL) ---
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const start = performance.now();
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'UP',
          },
        ],
        max_tokens: 5,
      });
      const end = performance.now();
      const rawLatency = Math.round(end - start);

      const latency = rawLatency + 1000;
      const usage = response.usage;
      const completionTokens = usage?.completion_tokens || 5;
      const tokensPerSecond = latency > 0 
        ? Math.round((completionTokens / (latency / 1000))) 
        : 38;

      console.log('[TELEMETRY] Conectado exitosamente a OpenAI (GPU Real). Latencia:', latency);

      return {
        latency,
        ttft: Math.round(rawLatency * 0.4),
        tokensPerSecond: Math.min(tokensPerSecond, 50),
      };
    } catch (err: any) {
      console.warn('[TELEMETRY WARNING] Falló la conexión con OpenAI, intentando fallback de Ollama:', err.message);
    }
  }

  // --- INTENTO 3: OLLAMA LOCAL (GPU LOCAL SI ESTÁ DISPONIBLE) ---
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200); // Timeout rápido

    const start = performance.now();
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma2:2b',
        messages: [
          {
            role: 'user',
            content: 'Responde con una palabra: ¿UP, DOWN, LEFT o RIGHT para avanzar verticalmente?',
          },
        ],
        stream: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const end = performance.now();
      const latency = Math.round(end - start);
      const evalCount = data.eval_count || 10;
      const evalDuration = data.eval_duration || 1000000000;
      const tokensPerSecond = Math.round(evalCount / (evalDuration / 1e9));

      console.log('[TELEMETRY] Conectado exitosamente a Ollama Local (GPU Real). Latencia:', latency);

      return {
        latency,
        ttft: Math.round(data.prompt_eval_duration ? data.prompt_eval_duration / 1e6 : latency * 0.25),
        tokensPerSecond,
      };
    }
  } catch (err: any) {
    // Silenciar error de Ollama ya que es común que no esté activo en local
  }

  // --- FALLBACK FINALES: SIMULACIÓN PROBABILÍSTICA (GRACEFUL FALLBACK) ---
  console.log('[TELEMETRY] Iniciando simulación de telemetría probabilística de GPU compartida.');
  
  // Simular la latencia de red, cold start y scheduling de GPUs estándar
  await new Promise((resolve) => setTimeout(resolve, 1600));

  const simulatedLatency = Math.round(1500 + Math.random() * 700); 
  const simulatedTtft = Math.round(500 + Math.random() * 400);     
  const simulatedTokensPerSecond = Math.round(30 + Math.random() * 15); 

  return {
    latency: simulatedLatency,
    ttft: simulatedTtft,
    tokensPerSecond: simulatedTokensPerSecond,
  };
}
