import React from 'react';
import { AgentLogMessage } from '../../types';
import { CyberCard } from '../ui/CyberCard';

interface SwarmConsoleProps {
  agentLogs: AgentLogMessage[];
  loading: boolean;
  autoplay: boolean;
  predictedPath: [number, number][];
}

/**
 * Componente que renderiza la consola de razonamiento del enjambre (Swarm Reasoning Console).
 * Sin emojis, optimizado con iconos vectoriales SVG de alta definición y estilo cyberpunk.
 */
export function SwarmConsole({
  agentLogs,
  loading,
  autoplay,
  predictedPath,
}: SwarmConsoleProps) {
  const isProcessing = loading || autoplay;

  return (
    <CyberCard className="flex-1 flex flex-col min-h-[300px] font-mono">
      <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2 mb-3">
        <h2 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase flex items-center gap-2">
          {/* Circuito/Cerebro Vectorial SVG */}
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>Swarm Reasoning Console</span>
          {predictedPath.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-none bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 animate-pulse">
              Trajectory Rendered
            </span>
          )}
        </h2>
        <span
          className={`px-2 py-0.5 rounded-none border text-[10px] uppercase transition-colors duration-350 ${
            isProcessing
              ? 'bg-amber-950/50 border-amber-500/30 text-amber-400 animate-pulse'
              : 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
          }`}
        >
          {isProcessing ? 'Procesando' : 'Online'}
        </span>
      </div>

      {/* Área de Visualización de Logs */}
      <div className="flex-1 overflow-y-auto space-y-3 text-xs pr-2 max-h-[300px] scrollbar-thin scrollbar-thumb-indigo-950/80">
        {agentLogs.length === 0 ? (
          <div className="text-slate-600 text-[11px] italic p-2">
            No hay registros en el búfer de telemetría.
          </div>
        ) : (
          agentLogs.map((log, index) => {
            let colorClass = 'text-indigo-400';
            const tag = `[${log.agent}]`;
            
            if (log.agent === 'Perceptor') colorClass = 'text-blue-400';
            if (log.agent === 'Estratega') colorClass = 'text-purple-400';
            if (log.agent === 'System') colorClass = 'text-slate-400';
            if (log.agent === 'Error') colorClass = 'text-red-400';

            return (
              <div key={index} className="flex flex-col gap-1 border-b border-slate-900 pb-2 last:border-0">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className={`${colorClass} font-semibold`}>{tag}</span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed pl-1">
                  {log.text}
                </p>
              </div>
            );
          })
        )}
        
        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-[11px] animate-pulse">
            <span className="h-1.5 w-1.5 rounded-none bg-indigo-400 animate-bounce"></span>
            <span className="h-1.5 w-1.5 rounded-none bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
            <span className="h-1.5 w-1.5 rounded-none bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
            Generando respuesta estructurada en Cerebras Gemma 4...
          </div>
        )}
      </div>
    </CyberCard>
  );
}
