/**
 * Definiciones de tipos TypeScript globales para el proyecto Chronos-Bot.
 * Desarrollado bajo las directivas de EINNOVACION MX.
 */

export interface AgentLogMessage {
  agent: 'Perceptor' | 'Estratega' | 'System' | 'Error';
  text: string;
  timestamp: string;
}

export interface TelemetryMetrics {
  latency: number;
  ttft: number;
  tokensPerSecond: number;
}

export interface EstrategaDecision {
  next_move: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | '';
  path_coordinates: [number, number][];
  reasoning_summary: string;
}

export interface AgentMetricsDetail {
  latency: number;
  usage: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  } | null;
  timeInfo: {
    prompt_time?: number;
    completion_time?: number;
    total_time?: number;
  } | null;
}

export interface SwarmResponse {
  perceptorReport: string;
  estrategaDecision: EstrategaDecision;
  metrics: {
    perceptor: AgentMetricsDetail;
    estratega: AgentMetricsDetail;
    totalLatency: number;
  };
}
