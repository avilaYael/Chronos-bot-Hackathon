import React from 'react';
import { CyberCard } from '../ui/CyberCard';

interface SettingsPanelProps {
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  mitigationEnabled: boolean;
  onToggleMitigation: () => void;
  showAStarPath: boolean;
  onToggleAStarPath: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  loading: boolean;
  gpuLoading: boolean;
  autoplay: boolean;
}

/**
 * Componente de panel de configuración para la Fase 5.
 * Optimizado sin emojis, reemplazados por iconos vectoriales SVG limpios de diseño premium.
 */
export function SettingsPanel({
  gridSize,
  onGridSizeChange,
  mitigationEnabled,
  onToggleMitigation,
  showAStarPath,
  onToggleAStarPath,
  voiceEnabled,
  onToggleVoice,
  isRecording,
  onStartRecording,
  onStopRecording,
  loading,
  gpuLoading,
  autoplay,
}: SettingsPanelProps) {
  const disableControls = loading || gpuLoading || autoplay;

  return (
    <CyberCard className="flex flex-col gap-4 font-mono">
      <h2 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase border-b border-indigo-500/10 pb-2 flex items-center gap-2">
        {/* Icono de Ajustes Vectorial SVG */}
        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span>Configuración de Sistema (Fase 5)</span>
      </h2>

      {/* Selector de Escala de Entorno */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-slate-400 uppercase">
          Tamaño del Entorno (Grilla Dinámica)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[10, 15, 20].map((size) => (
            <button
              key={size}
              onClick={() => onGridSizeChange(size)}
              disabled={disableControls}
              className={`py-1.5 rounded-none text-xs font-mono border transition-all cursor-pointer active:scale-95 ${
                gridSize === size
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 disabled:opacity-50'
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>
      </div>

      {/* Interruptores de Control y Seguridad */}
      <div className="flex flex-col gap-3 mt-1 text-xs">
        
        {/* Mitigación de fallos A* */}
        <div className="flex items-center justify-between">
          <span className="text-slate-300 flex flex-col">
            <span>Mitigación de fallos (A*)</span>
            <span className="text-[9px] text-slate-500">Corrige desvíos o colisiones de la IA</span>
          </span>
          <button
            onClick={onToggleMitigation}
            className={`px-3 py-1.5 rounded-none border transition-all cursor-pointer font-bold ${
              mitigationEnabled
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {mitigationEnabled ? 'ACTIVO' : 'INACTIVO'}
          </button>
        </div>

        {/* Visualizar Ruta A* */}
        <div className="flex items-center justify-between">
          <span className="text-slate-300 flex flex-col">
            <span>Visualizar Ruta A*</span>
            <span className="text-[9px] text-slate-500">Muestra la línea óptima clásica</span>
          </span>
          <button
            onClick={onToggleAStarPath}
            className={`px-3 py-1.5 rounded-none border transition-all cursor-pointer font-bold ${
              showAStarPath
                ? 'bg-orange-950/60 border-orange-500/50 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {showAStarPath ? 'VISIBLE' : 'OCULTO'}
          </button>
        </div>

        {/* Feedback de voz */}
        <div className="flex items-center justify-between">
          <span className="text-slate-300 flex flex-col">
            <span>Feedback por Voz</span>
            <span className="text-[9px] text-slate-500">Narración sintética de movimientos</span>
          </span>
          <button
            onClick={onToggleVoice}
            className={`px-3 py-1.5 rounded-none border transition-all cursor-pointer font-bold ${
              voiceEnabled
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {voiceEnabled ? 'VOZ ON' : 'MUTED'}
          </button>
        </div>
      </div>

      {/* Grabador de Video Canvas */}
      <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-slate-300 flex flex-col">
          <span>Grabador de Simulación</span>
          <span className="text-[9px] text-slate-500">Captura el lienzo en formato WebM</span>
        </span>
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
          className={`px-4 py-2 rounded-none font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
            isRecording
              ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]'
              : 'bg-slate-900 border border-red-500/30 text-red-400 hover:bg-red-500/10'
          }`}
        >
          {/* Círculo grabador SVG */}
          <svg className={`w-3.5 h-3.5 ${isRecording ? 'text-white animate-ping' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" />
          </svg>
          {isRecording ? 'DETENER GRABACIÓN' : 'REC DEMO'}
        </button>
      </div>
    </CyberCard>
  );
}
