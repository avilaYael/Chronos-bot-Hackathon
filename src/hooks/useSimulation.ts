import { useState, useEffect, useRef, useCallback } from 'react';
import { AgentLogMessage, TelemetryMetrics, EstrategaDecision } from '../types';
import { calculateAStarPath, getDirectionFromCoords } from '../lib/astar';

interface UseSimulationProps {
  voiceEnabled: boolean;
  speakText: (text: string) => void;
  mitigationEnabled: boolean;
  addLogMessage?: (agent: AgentLogMessage['agent'], text: string) => void;
}

/**
 * Custom Hook que centraliza y orquesta el estado del simulador Chronos-Bot.
 * Maneja coordenadas, obstáculos, métricas en vivo, autoplay y la mitigación A*.
 */
export function useSimulation({
  voiceEnabled,
  speakText,
  mitigationEnabled,
}: UseSimulationProps) {
  const canvasRef = useRef<any>(null);

  // Estados locales de simulación
  const [base64Image, setBase64Image] = useState<string>('');
  const [obstacles, setObstacles] = useState<[number, number][]>([]);
  const [robotPos, setRobotPos] = useState<[number, number]>([0, 0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [gpuLoading, setGpuLoading] = useState<boolean>(false);
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const autoplayRef = useRef<boolean>(false);
  
  const [gridSize, setGridSize] = useState<number>(10);
  const [history, setHistory] = useState<string[]>([]);
  const [predictedPath, setPredictedPath] = useState<[number, number][]>([]);
  const [agentLogs, setAgentLogs] = useState<AgentLogMessage[]>([]);
  const [metricsLoaded, setMetricsLoaded] = useState<boolean>(false);

  // Métricas dinámicas de telemetría
  const [cerebrasMetrics, setCerebrasMetrics] = useState<TelemetryMetrics>({
    latency: 0,
    ttft: 0,
    tokensPerSecond: 0,
  });

  const [gpuMetrics, setGpuMetrics] = useState<TelemetryMetrics>({
    latency: 0,
    ttft: 0,
    tokensPerSecond: 0,
  });

  // Cálculo dinámico del multiplicador de velocidad
  const speedRatio = gpuMetrics.latency && cerebrasMetrics.latency
    ? (gpuMetrics.latency / cerebrasMetrics.latency).toFixed(1)
    : '';

  // Refs mutables para callbacks asíncronos y autopilot para prevenir closures obsoletos
  const robotPosRef = useRef<[number, number]>([0, 0]);
  const obstaclesRef = useRef<[number, number][]>([]);
  const gridSizeRef = useRef<number>(10);

  useEffect(() => {
    robotPosRef.current = robotPos;
  }, [robotPos]);

  useEffect(() => {
    obstaclesRef.current = obstacles;
  }, [obstacles]);

  useEffect(() => {
    gridSizeRef.current = gridSize;
  }, [gridSize]);

  // Utilidad interna para logs de consola
  const addLog = useCallback((agent: AgentLogMessage['agent'], text: string) => {
    setAgentLogs((prev) => [
      ...prev,
      {
        agent,
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  // Sincronizar cambios de posición del robot desde el canvas
  const handleRobotMove = useCallback((pos: [number, number]) => {
    setRobotPos(pos);
  }, []);

  // Sincronizar cambios de obstáculos desde el canvas
  const handleObstaclesChange = useCallback((obs: [number, number][]) => {
    setObstacles(obs);
    setPredictedPath([]);
  }, []);

  // Sincronizar captura inicial
  const handleCaptureState = useCallback(() => {
    if (canvasRef.current) {
      const dataUri = canvasRef.current.captureSimulationState();
      setBase64Image(dataUri);
      return dataUri;
    }
    return '';
  }, []);

  const handleCopyBase64 = useCallback(() => {
    if (!base64Image) return;
    navigator.clipboard.writeText(base64Image);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [base64Image]);

  // Movimiento del robot con límites y colisiones
  const moveRobotManually = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const [xVal, yVal] = robotPosRef.current;
    let x = xVal;
    let y = yVal;

    if (direction === 'UP' && y > 0) y -= 1;
    if (direction === 'DOWN' && y < gridSizeRef.current - 1) y += 1;
    if (direction === 'LEFT' && x > 0) x -= 1;
    if (direction === 'RIGHT' && x < gridSizeRef.current - 1) x += 1;

    const isObstacle = obstaclesRef.current.some(([ox, oy]) => ox === x && oy === y);
    if (!isObstacle) {
      canvasRef.current?.setRobotPosition([x, y]);
      setPredictedPath([]);
      return true;
    }
    return false;
  }, []);

  // Ejecuta un único paso del enjambre multi-agente
  const executeSingleStep = useCallback(async (): Promise<{ success: boolean; reachedGoal: boolean } | null> => {
    setLoading(true);
    setGpuLoading(true);
    setPredictedPath([]);

    const currentBase64 = handleCaptureState();
    
    addLog('System', 'Iniciando captura de pantalla de la simulación serializada en Base64...');
    addLog('System', 'Lanzando peticiones concurrentes: Cerebras Cloud vs GPU estándar...');

    // Petición paralela de comparación GPU
    const gpuPromise = fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) {
          setGpuMetrics({
            latency: data.metrics.latency,
            ttft: data.metrics.ttft,
            tokensPerSecond: data.metrics.tokensPerSecond,
          });
        }
      })
      .catch((err) => {
        console.error('Error on GPU comparison call in hook:', err);
      })
      .finally(() => {
        setGpuLoading(false);
      });

    // Petición principal al enjambre de Cerebras
    try {
      addLog('System', 'Transmitiendo trama visual al Agente Perceptor en Cerebras Cloud...');
      
      const response = await fetch('/api/swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: currentBase64,
          robotPos: robotPosRef.current,
          gridSize: gridSizeRef.current,
          history: history.slice(-6),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Error desconocido en el servidor.');
      }

      const { perceptorReport, estrategaDecision, metrics } = data;

      addLog('Perceptor', perceptorReport);
      addLog('System', 'Procesando reporte de perceptor en el Agente Estratega (Thinking Mode enabled)...');
      
      const estrategaLogText = `[Razón] ${estrategaDecision.reasoning_summary}\n\n[Trayectoria Predicha] ${JSON.stringify(estrategaDecision.path_coordinates)}`;
      addLog('Estratega', estrategaLogText);

      if (estrategaDecision.path_coordinates && estrategaDecision.path_coordinates.length > 0) {
        setPredictedPath(estrategaDecision.path_coordinates);
      }

      // Procesar métricas Cerebras
      const perceptorMetric = metrics.perceptor;
      const estrategaMetric = metrics.estratega;
      const totalCerebrasLatency = metrics.totalLatency;
      
      const totalCompletionTokens = (perceptorMetric.usage?.completion_tokens || 0) + (estrategaMetric.usage?.completion_tokens || 0);
      const computedTokensPerSec = totalCompletionTokens > 0 && totalCerebrasLatency > 0
        ? Math.round((totalCompletionTokens / (totalCerebrasLatency / 1000)))
        : 280;

      const perceptorTTFT = perceptorMetric.timeInfo?.prompt_time 
        ? Math.round(perceptorMetric.timeInfo.prompt_time * 1000) 
        : Math.round(perceptorMetric.latency * 0.15);

      setCerebrasMetrics({
        latency: totalCerebrasLatency,
        ttft: perceptorTTFT || 5,
        tokensPerSecond: computedTokensPerSec,
      });

      // Ejecutar movimiento inmediato con validación A*
      const nextMove = estrategaDecision.next_move;
      if (nextMove) {
        let finalMove = nextMove;

        // Calcular camino óptimo y primer movimiento esperado de A* local
        const optimalPath = calculateAStarPath(
          robotPosRef.current,
          [gridSizeRef.current - 1, gridSizeRef.current - 1],
          obstaclesRef.current,
          gridSizeRef.current
        );
        const optimalDirection = optimalPath.length > 1 
          ? getDirectionFromCoords(robotPosRef.current, optimalPath[1]) 
          : null;

        // Detectar si el movimiento sugerido por la IA causa colisión o diverge de A*
        const [rx, ry] = robotPosRef.current;
        let targetX = rx;
        let targetY = ry;
        if (nextMove === 'UP') targetY -= 1;
        if (nextMove === 'DOWN') targetY += 1;
        if (nextMove === 'LEFT') targetX -= 1;
        if (nextMove === 'RIGHT') targetX += 1;

        const isOutOfBounds = targetX < 0 || targetX >= gridSizeRef.current || targetY < 0 || targetY >= gridSizeRef.current;
        const isObstacle = obstaclesRef.current.some(([ox, oy]) => ox === targetX && oy === targetY);
        const isCollisionRisk = isOutOfBounds || isObstacle;

        const isDivergence = optimalDirection && nextMove !== optimalDirection;

        // Si la mitigación está activa y el movimiento es peligroso o difiere del óptimo, aplicar corrección
        if (mitigationEnabled && (isCollisionRisk || isDivergence)) {
          if (optimalDirection) {
            finalMove = optimalDirection;
            addLog('Error', `⚠️ MITIGACIÓN LOCAL: Gemma sugirió "${nextMove}" (Inviable/Riesgoso). Ejecutando desvío seguro A*: "${optimalDirection}".`);
            if (voiceEnabled) {
              const speakDir = optimalDirection === 'UP' ? 'Norte' : optimalDirection === 'DOWN' ? 'Sur' : optimalDirection === 'LEFT' ? 'Oeste' : 'Este';
              speakText(`Mitigación activa. Corrigiendo rumbo al ${speakDir}.`);
            }
          } else {
            addLog('Error', '⚠️ MITIGACIÓN LOCAL: No se puede calcular una ruta A* alternativa segura.');
          }
        } else if (isDivergence) {
          addLog('System', `⚠️ Auditoría: Gemma sugirió "${nextMove}", pero el algoritmo clásico A* recomienda "${optimalDirection}".`);
        }

        addLog('System', `Comando estructurado recibido: Moviendo robot hacia ${finalMove}.`);
        
        const moved = moveRobotManually(finalMove);
        if (moved) {
          setHistory((prev) => [...prev, finalMove]);

          // Síntesis de voz del movimiento y su razonamiento
          if (voiceEnabled) {
            const speakDir = finalMove === 'UP' ? 'Norte' : finalMove === 'DOWN' ? 'Sur' : finalMove === 'LEFT' ? 'Oeste' : 'Este';
            speakText(`Robot se mueve al ${speakDir}. Razón: ${estrategaDecision.reasoning_summary}`);
          }
          
          const [newRx, newRy] = robotPosRef.current;
          const maxCoord = gridSizeRef.current - 1;
          if (newRx === maxCoord && newRy === maxCoord) {
            addLog('System', `🎉 ¡Chronos-Bot ha llegado con éxito a la Meta [${maxCoord}, ${maxCoord}]!`);
            if (voiceEnabled) {
              speakText('¡Objetivo alcanzado! Chronos-Bot completó la ruta de rescate.');
            }
            return { success: true, reachedGoal: true };
          }
          return { success: true, reachedGoal: false };
        } else {
          addLog('Error', `El robot colisionó en la dirección ${finalMove}.`);
          if (voiceEnabled) {
            speakText('Fallo de movimiento. Impacto inminente.');
          }
          return { success: false, reachedGoal: false };
        }
      } else {
        addLog('System', 'Advertencia: No se recibió recomendación de movimiento en next_move.');
        return { success: false, reachedGoal: false };
      }

    } catch (err: any) {
      console.error(err);
      addLog('Error', `Fallo de comunicación: ${err.message || 'Error de red.'}`);
      return { success: false, reachedGoal: false };
    } finally {
      setLoading(false);
      await gpuPromise;
    }
  }, [handleCaptureState, addLog, history, speakText, voiceEnabled, mitigationEnabled, moveRobotManually]);

  const handleRunSwarm = useCallback(async () => {
    setAgentLogs([]);
    setMetricsLoaded(true);
    await executeSingleStep();
  }, [executeSingleStep]);

  const handleToggleAutoplay = useCallback(async () => {
    if (autoplay) {
      setAutoplay(false);
      autoplayRef.current = false;
      return;
    }

    setAutoplay(true);
    autoplayRef.current = true;
    setAgentLogs([]);
    setMetricsLoaded(true);

    let success = true;
    let reachedGoal = false;

    while (autoplayRef.current && success && !reachedGoal) {
      const [rx, ry] = robotPosRef.current;
      const maxCoord = gridSizeRef.current - 1;
      if (rx === maxCoord && ry === maxCoord) {
        reachedGoal = true;
        break;
      }

      const res = await executeSingleStep();
      if (!res) {
        success = false;
        break;
      }

      success = res.success;
      reachedGoal = res.reachedGoal;

      if (!success || reachedGoal || !autoplayRef.current) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setAutoplay(false);
    autoplayRef.current = false;
  }, [autoplay, executeSingleStep]);

  const handleGridSizeChange = useCallback((size: number) => {
    setGridSize(size);
    setHistory([]);
    setPredictedPath([]);
    setRobotPos([0, 0]);
    setObstacles([]);
    setAgentLogs([
      {
        agent: 'System',
        text: `Entorno reconfigurado a cuadrícula de ${size}x${size}. Robot reset en [0,0].`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    if (voiceEnabled) speakText(`Entorno reconfigurado a ${size} por ${size}.`);
    
    setTimeout(() => {
      if (canvasRef.current) {
        const dataUri = canvasRef.current.captureSimulationState();
        setBase64Image(dataUri);
      }
    }, 100);
  }, [voiceEnabled, speakText]);

  // Sincronizar captura inicial al montar
  useEffect(() => {
    handleCaptureState();
  }, [handleCaptureState]);

  return {
    canvasRef,
    base64Image,
    obstacles,
    robotPos,
    copied,
    loading,
    gpuLoading,
    autoplay,
    gridSize,
    history,
    predictedPath,
    agentLogs,
    metricsLoaded,
    cerebrasMetrics,
    gpuMetrics,
    speedRatio,
    handleRobotMove,
    handleObstaclesChange,
    handleCaptureState,
    handleCopyBase64,
    moveRobotManually,
    handleRunSwarm,
    handleToggleAutoplay,
    handleGridSizeChange,
    addLog,
  };
}
