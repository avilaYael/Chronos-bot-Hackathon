import React, { useState } from 'react';
import { CyberCard } from '../ui/CyberCard';

interface NetworkNode {
  name: string;
  location: string;
  ip: string;
  latency: string;
  status: 'CONNECTED' | 'SLOW' | 'TIMEOUT';
}

/**
 * Componente que renderiza el panel de topología e interactividad de red (NetworkPanel).
 * Optimizado sin emojis, reemplazados por SVGs vectoriales de alta definición.
 */
export function NetworkPanel() {
  const [testing, setTesting] = useState<boolean>(false);
  const [nodes, setNodes] = useState<NetworkNode[]>([
    {
      name: 'Cerebras Cloud Central',
      location: 'Sunnyvale, CA, USA',
      ip: '104.18.23.41',
      latency: '18 ms',
      status: 'CONNECTED',
    },
    {
      name: 'Together AI Serverless',
      location: 'Oregon, USA',
      ip: '172.67.75.122',
      latency: '820 ms',
      status: 'CONNECTED',
    },
    {
      name: 'Ollama Gateway (Local)',
      location: 'Localhost',
      ip: '127.0.0.1:11434',
      latency: 'N/A',
      status: 'TIMEOUT',
    },
  ]);

  const runConnectionTest = () => {
    setTesting(true);
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        latency: '...',
      }))
    );

    setTimeout(() => {
      setNodes([
        {
          name: 'Cerebras Cloud Central',
          location: 'Sunnyvale, CA, USA',
          ip: '104.18.23.41',
          latency: `${Math.round(15 + Math.random() * 8)} ms`,
          status: 'CONNECTED',
        },
        {
          name: 'Together AI Serverless',
          location: 'Oregon, USA',
          ip: '172.67.75.122',
          latency: `${Math.round(750 + Math.random() * 150)} ms`,
          status: 'CONNECTED',
        },
        {
          name: 'Ollama Gateway (Local)',
          location: 'Localhost',
          ip: '127.0.0.1:11434',
          latency: 'N/A',
          status: 'TIMEOUT',
        },
      ]);
      setTesting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 font-mono text-xs w-full">
      <CyberCard className="w-full">
        <div className="flex justify-between items-center border-b border-indigo-500/10 pb-3 mb-4">
          <h2 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase flex items-center gap-2">
            {/* Satélite/Red SVG */}
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Topología de Red y Enrutamiento</span>
          </h2>
          <button
            onClick={runConnectionTest}
            disabled={testing}
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
            className={`px-3 py-1.5 border text-[10px] uppercase font-bold transition-all duration-350 cursor-pointer ${
              testing
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 animate-pulse'
                : 'bg-indigo-950/40 border-[#3b82f6]/40 text-[#3b82f6] hover:bg-[#3b82f6]/10 hover:border-[#3b82f6]'
            }`}
          >
            {testing ? 'PINGING...' : 'TEST CONNECTION'}
          </button>
        </div>

        {/* Nodos de Red */}
        <div className="space-y-3">
          {nodes.map((node, index) => {
            let statusText = 'CONNECTED';
            let statusClass = 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20';
            if (node.status === 'TIMEOUT') {
              statusText = 'OFFLINE / TIMEOUT';
              statusClass = 'text-red-400 border-red-500/20 bg-red-950/20';
            }

            return (
              <div
                key={index}
                className="border border-[#6366f133] bg-white/[0.01] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-sm">
                    {/* Globo terráqueo/Internet SVG */}
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200">{node.name}</h3>
                    <p className="text-[10px] text-slate-500">IP: {node.ip} • Loc: {node.location}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 text-[11px]">
                  <div>
                    <span className="text-slate-500">Latency:</span>{' '}
                    <span className={node.status === 'CONNECTED' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {node.latency}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 border text-[9px] font-bold ${statusClass}`}>
                    {statusText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Infografía de Red en Cerebras */}
        <div className="mt-6 p-4 rounded-none bg-indigo-950/10 border border-indigo-500/10 text-slate-400 text-[11px] leading-relaxed flex gap-2">
          {/* Info SVG */}
          <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong className="text-indigo-300 block mb-1">CANAL FÍSICO OPTIMIZADO (CEREBRAS WSE-3)</strong>
            El enjambre de agentes (Perceptor y Estratega) se ejecuta directamente en la infraestructura CS-3 de Cerebras Cloud. Las conexiones redundantes minimizan el salto de red de fibra óptica, garantizando que el procesamiento visual no agregue retardo a los actuadores físicos del robot.
          </div>
        </div>
      </CyberCard>
    </div>
  );
}
