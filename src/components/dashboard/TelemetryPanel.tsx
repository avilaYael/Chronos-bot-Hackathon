import React from 'react';
import { TelemetryMetrics } from '../../types';
import { CyberCard } from '../ui/CyberCard';

interface TelemetryPanelProps {
  metricsLoaded: boolean;
  loading: boolean;
  gpuLoading: boolean;
  cerebrasMetrics: TelemetryMetrics;
  gpuMetrics: TelemetryMetrics;
  speedRatio: string;
}

/**
 * Componente que renderiza las tarjetas de telemetría comparativa en tiempo real (TelemetryPanel).
 * Reemplaza los emojis por SVGs vectoriales optimizados.
 */
export function TelemetryPanel({
  metricsLoaded,
  loading,
  gpuLoading,
  cerebrasMetrics,
  gpuMetrics,
  speedRatio,
}: TelemetryPanelProps) {
  const isCerebrasUltraFast = metricsLoaded && !loading && cerebrasMetrics.latency > 0 && cerebrasMetrics.latency < 300;

  return (
    <CyberCard className="font-mono">
      <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2 mb-4">
        <h2 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase flex items-center gap-2">
          {/* Rayo de telemetría SVG */}
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Real-time Telemetry (Cerebras Cloud vs GPU standard)</span>
        </h2>
        <div className="px-2 py-0.5 rounded-none bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase">
          {metricsLoaded ? 'API Live Data' : 'Default Values'}
        </div>
      </div>

      {/* Grid de Tarjetas Comparativas Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tarjeta de Cerebras */}
        <div
          style={isCerebrasUltraFast ? { boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)' } : {}}
          className={`relative border rounded-none bg-white/[0.02] p-5 transition-all duration-300 ${
            isCerebrasUltraFast ? 'border-emerald-500/40' : 'border-[#6366f133]'
          }`}
        >
          {/* Indicador de estado parpadeante */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-none h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
              REAL-TIME SPEEDS
            </span>
          </div>

          <div className="text-xs text-slate-400 uppercase mb-1">Cerebras Gemma 4 31B</div>
          
          {loading ? (
            <div className="h-10 flex items-center text-indigo-400 text-sm animate-pulse">
              {/* Cargador/Reloj de arena giratorio SVG */}
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              MIDIENDO...
            </div>
          ) : (
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-emerald-400">
                {metricsLoaded ? cerebrasMetrics.latency : '18'}
              </span>
              <span className="text-xs text-emerald-500 font-semibold">ms</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div>
              <div>TTFT:</div>
              <div className="text-slate-200 font-bold font-mono">
                {loading ? '...' : metricsLoaded ? `${cerebrasMetrics.ttft} ms` : '4 ms'}
              </div>
            </div>
            <div>
              <div>Rendimiento:</div>
              <div className="text-slate-200 font-bold font-mono">
                {loading ? '...' : metricsLoaded ? `${cerebrasMetrics.tokensPerSecond} t/s` : '285 t/s'}
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de GPU Estándar */}
        <div
          className={`relative border rounded-none p-5 transition-all duration-300 ${
            gpuLoading
              ? 'border-amber-500/40 bg-white/[0.01] shadow-[0_0_15px_rgba(245,158,11,0.15)]'
              : 'border-slate-800 bg-[#05070f]'
          }`}
        >
          {/* Indicador de retraso */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {/* Peligro/Atención SVG */}
            <svg className={`w-3.5 h-3.5 ${gpuLoading ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className={`text-[9px] font-bold uppercase tracking-wider ${gpuLoading ? 'text-amber-400' : 'text-slate-500'}`}>
              {gpuLoading ? 'BUFFERING / COLD START' : 'LAGGING'}
            </span>
          </div>

          <div className="text-xs text-slate-400 uppercase mb-1">GPU Cloud Estándar</div>
          
          {gpuLoading ? (
            <div className="h-10 flex items-center gap-2 text-amber-400 text-sm">
              <span className="animate-spin h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-none"></span>
              PROCESANDO...
            </div>
          ) : (
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-slate-400">
                {metricsLoaded ? gpuMetrics.latency : '820'}
              </span>
              <span className="text-xs text-slate-600 font-semibold">ms</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div>
              <div>TTFT:</div>
              <div className="text-slate-200 font-bold font-mono">
                {gpuLoading ? '...' : metricsLoaded ? `${gpuMetrics.ttft} ms` : '340 ms'}
              </div>
            </div>
            <div>
              <div>Rendimiento:</div>
              <div className="text-slate-200 font-bold font-mono">
                {gpuLoading ? '...' : metricsLoaded ? `${gpuMetrics.tokensPerSecond} t/s` : '42 t/s'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Matemático Autocalculado */}
      <div className="mt-4 p-4 rounded-none bg-indigo-950/20 border border-[#6366f133] text-center flex items-center justify-center gap-2">
        {/* Fuego de aceleración SVG */}
        <svg className="w-4 h-4 text-emerald-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
        <span className="text-sm text-indigo-200 tracking-wide">
          {gpuLoading ? (
            <span className="flex items-center justify-center gap-2 animate-pulse">
              Calculando factor de velocidad en tiempo real...
            </span>
          ) : (
            <>
              Cerebras es{' '}
              <strong className="text-emerald-400 text-base font-bold font-mono">
                {speedRatio || '45.5'} veces
              </strong>{' '}
              más rápido que las arquitecturas GPU estándar.
            </>
          )}
        </span>
      </div>
    </CyberCard>
  );
}
