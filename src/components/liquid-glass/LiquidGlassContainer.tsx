import React from 'react';
import { useLiquidGlass } from '../../context/LiquidGlassContext';
import { LiquidGlassCanvas } from './LiquidGlassCanvas';

interface LiquidGlassContainerProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number; // default 12px
  glow?: boolean;
  interactive?: boolean;
  variant?: 'panel' | 'card' | 'pill' | 'nav' | 'subtle';
  tint?: 'default' | 'blue' | 'emerald' | 'amber' | 'dark';
  onClick?: () => void;
}

export const LiquidGlassContainer: React.FC<LiquidGlassContainerProps> = ({
  children,
  className = '',
  borderRadius = 12,
  glow = false,
  interactive = true,
  variant = 'panel',
  tint = 'default',
  onClick,
}) => {
  const { config, mousePos } = useLiquidGlass();

  if (!config.enabled) {
    // Graceful fallback to crisp standard panel when disabled
    return (
      <div
        onClick={onClick}
        className={`bg-white border border-slate-300 rounded ${className}`}
      >
        {children}
      </div>
    );
  }

  // Calculate dynamic glass tints based on settings & variant
  const getTintStyle = () => {
    const opacity = config.surfaceOpacity / 100;
    if (tint === 'dark' || config.presetName === 'obsidian') {
      return `rgba(15, 23, 42, ${Math.min(0.92, opacity + 0.15)})`;
    }
    if (tint === 'blue') {
      return `rgba(239, 246, 255, ${opacity})`;
    }
    if (tint === 'emerald') {
      return `rgba(240, 253, 244, ${opacity})`;
    }
    if (tint === 'amber') {
      return `rgba(254, 252, 232, ${opacity})`;
    }
    // Default crisp crystal
    return `rgba(255, 255, 255, ${opacity})`;
  };

  // Compute specular gradient angle based on mouse
  const angle = config.mouseReactive
    ? Math.round((mousePos.x * 60) + (mousePos.y * 60))
    : 135;

  const glassStyle: React.CSSProperties = {
    backgroundColor: getTintStyle(),
    backdropFilter: `blur(${config.blur}px) saturate(180%) contrast(102%)`,
    WebkitBackdropFilter: `blur(${config.blur}px) saturate(180%) contrast(102%)`,
    borderRadius: `${borderRadius}px`,
    boxShadow: `
      0 4px 16px 0 rgba(0, 0, 0, 0.04),
      0 1px 2px 0 rgba(0, 0, 0, 0.02),
      inset 0 1px 1px 0 rgba(255, 255, 255, ${config.rimLight / 100 * 0.75}),
      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.05)
    `,
    border: `1px solid rgba(255, 255, 255, ${Math.min(1, (config.rimLight / 100) * 0.9)})`,
  };

  return (
    <div
      onClick={onClick}
      style={glassStyle}
      className={`relative overflow-hidden transition-all duration-200 ${className} ${
        onClick ? 'cursor-pointer hover:shadow-lg' : ''
      }`}
    >
      {/* Specular Highlight Sheen Layer (Apple Liquid Glass reflection) */}
      {config.specularSheen && (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-40 transition-opacity duration-300"
          style={{
            background: `linear-gradient(${angle}deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.05) 30%, transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* WebGL Refractive Shader Overlay */}
      {config.refraction > 10 && (
        <LiquidGlassCanvas
          borderRadius={borderRadius}
          interactive={interactive}
        />
      )}

      {/* Glow Halo if requested */}
      {glow && (
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-30 blur-sm"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.3), transparent 70%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Actual DOM Content */}
      <div className="relative z-20 h-full w-full">
        {children}
      </div>
    </div>
  );
};
