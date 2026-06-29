import React, { useState } from 'react';
import { CyberCard } from '../ui/CyberCard';

interface RobotNode {
  id: string;
  name: string;
  status: 'ACTIVE' | 'OFFLINE' | 'MAINTENANCE';
  sector: string;
  battery: number;
  speed: string;
  currentTask: string;
  lastResponse: string;
}

/**
 * Componente que renderiza el panel de gestión de flota de robots (FleetPanel).
 * Libre de emojis, optimizado con iconos vectoriales SVG de diseño premium.
 */
export function FleetPanel() {
  const [robots, setRobots] = useState<RobotNode[]>([
    {
      id: 'NODE_01',
      name: 'Chronos-Bot Core',
      status: 'ACTIVE',
      sector: 'SECTOR_7G',
      battery: 94,
      speed: '18 ms',
      currentTask: 'Autopilot Navigation Loop',
      lastResponse: '0.01s ago',
    },
    {
      id: 'NODE_02',
      name: 'Chronos-Bot Alpha',
      status: 'MAINTENANCE',
      sector: 'SECTOR_4A',
      battery: 48,
      speed: 'N/A',
      currentTask: 'LiDAR Sensor Calibration',
      lastResponse: '2.5m ago',
    },
    {
      id: 'NODE_03',
      name: 'Chronos-Bot Beta',
      status: 'OFFLINE',
      sector: 'SECTOR_12F',
      battery: 0,
      speed: 'N/A',
      currentTask: 'System Shutdown State',
      lastResponse: '14h ago',
    },
  ]);

  const toggleRobotStatus = (id: string) => {
    setRobots((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = 
            r.status === 'ACTIVE' 
              ? 'OFFLINE' 
              : r.status === 'OFFLINE' 
              ? 'MAINTENANCE' 
              : 'ACTIVE';
          return {
            ...r,
            status: nextStatus,
            battery: nextStatus === 'OFFLINE' ? 0 : nextStatus === 'MAINTENANCE' ? 48 : 100,
            speed: nextStatus === 'ACTIVE' ? '18 ms' : 'N/A',
            currentTask: nextStatus === 'ACTIVE' ? 'Standby Command Mode' : nextStatus === 'MAINTENANCE' ? 'Sensor Calibration' : 'Shutdown State',
          };
        }
        return r;
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 font-mono text-xs w-full">
      <CyberCard className="w-full">
        <div className="flex justify-between items-center border-b border-indigo-500/10 pb-3 mb-4">
          <h2 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase flex items-center gap-2">
            {/* Red de nodos/flota SVG */}
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Fleet Overview & Node Monitoring</span>
          </h2>
          <span className="px-2 py-0.5 border border-indigo-500/30 text-indigo-400 text-[10px] uppercase">
            3 Active Registries
          </span>
        </div>

        {/* Grid de Nodos de Flota */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {robots.map((robot) => {
            let statusColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/45';
            let dotColor = 'bg-emerald-400';
            if (robot.status === 'OFFLINE') {
              statusColor = 'text-red-400 border-red-500/30 bg-red-950/45';
              dotColor = 'bg-red-400';
            } else if (robot.status === 'MAINTENANCE') {
              statusColor = 'text-amber-400 border-amber-500/30 bg-amber-950/45';
              dotColor = 'bg-amber-400';
            }

            return (
              <div
                key={robot.id}
                className="border border-[#6366f133] bg-white/[0.01] p-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">{robot.id}</h3>
                    <p className="text-[10px] text-slate-500">{robot.name}</p>
                  </div>
                  <span className={`px-2 py-0.5 border text-[9px] flex items-center gap-1.5 ${statusColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-none ${dotColor} ${robot.status === 'ACTIVE' ? 'animate-pulse' : ''}`}></span>
                    {robot.status}
                  </span>
                </div>

                <div className="space-y-2 text-[10px] text-slate-400 border-t border-slate-900/60 pt-3">
                  <div className="flex justify-between">
                    <span>Sector:</span>
                    <span className="text-slate-200 font-semibold">{robot.sector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="text-emerald-400 font-semibold">{robot.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Uplink:</span>
                    <span className="text-slate-300">{robot.lastResponse}</span>
                  </div>
                  
                  {/* Barra de Batería Segmentada */}
                  <div className="flex flex-col gap-1 pt-1">
                    <div className="flex justify-between text-[9px]">
                      <span>Power Cell:</span>
                      <span className={robot.battery > 20 ? 'text-slate-200' : 'text-red-400 animate-pulse'}>
                        {robot.battery}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 flex gap-0.5 p-0.5 border border-slate-800">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-full flex-1 ${
                            idx < Math.ceil(robot.battery / 10)
                              ? robot.battery > 20
                                ? 'bg-[#3b82f6]'
                                : 'bg-red-500'
                              : 'bg-transparent'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 border-t border-slate-900/40 pt-2 mt-2">
                    <span className="text-[9px] text-slate-500 uppercase">Current Subtask:</span>
                    <span className="text-slate-300 text-[10px] italic truncate">{robot.currentTask}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleRobotStatus(robot.id)}
                  style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
                  className="w-full mt-4 py-1.5 bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-[10px] uppercase hover:bg-indigo-900/50 hover:border-indigo-400 transition-all active:scale-95 cursor-pointer"
                >
                  Cambiar Estatus
                </button>
              </div>
            );
          })}
        </div>
      </CyberCard>
    </div>
  );
}
