import React from 'react';

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: string; // Color hexadecimal o rgba para la sombra neón
}

/**
 * Componente contenedor reutilizable que aplica una tarjeta con estética Cyberpunk oscura.
 * Utiliza clases utilitarias de Tailwind CSS y soporta sombras de brillo perimetral (glow) dinámicas.
 */
export function CyberCard({
  children,
  className = '',
  glow = false,
  glowColor = 'rgba(99,102,241,0.15)',
}: CyberCardProps) {
  const glowStyle = glow 
    ? { boxShadow: `0 0 20px ${glowColor}` } 
    : {};

  return (
    <div 
      style={glowStyle}
      className={`border border-[#6366f133] rounded-none bg-white/[0.04] backdrop-blur-[20px] p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
