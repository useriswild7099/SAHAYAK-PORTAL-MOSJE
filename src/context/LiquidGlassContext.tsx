import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LiquidGlassConfig {
  enabled: boolean;
  blur: number; // 0 to 40 px
  refraction: number; // 0 to 100
  chromaticAberration: number; // 0 to 10
  rimLight: number; // 0 to 100 (%)
  surfaceOpacity: number; // 10 to 95 (%)
  specularSheen: boolean;
  mouseReactive: boolean;
  tint: 'neutral' | 'blue' | 'emerald' | 'amber' | 'crystal';
  presetName: 'apple_liquid' | 'frosted_quartz' | 'clear_crystal' | 'obsidian' | 'minimalist';
}

const PRESETS: Record<LiquidGlassConfig['presetName'], Omit<LiquidGlassConfig, 'presetName'>> = {
  apple_liquid: {
    enabled: true,
    blur: 20,
    refraction: 65,
    chromaticAberration: 4,
    rimLight: 85,
    surfaceOpacity: 72,
    specularSheen: true,
    mouseReactive: true,
    tint: 'crystal',
  },
  frosted_quartz: {
    enabled: true,
    blur: 32,
    refraction: 40,
    chromaticAberration: 2,
    rimLight: 60,
    surfaceOpacity: 85,
    specularSheen: false,
    mouseReactive: false,
    tint: 'neutral',
  },
  clear_crystal: {
    enabled: true,
    blur: 12,
    refraction: 90,
    chromaticAberration: 6,
    rimLight: 95,
    surfaceOpacity: 45,
    specularSheen: true,
    mouseReactive: true,
    tint: 'blue',
  },
  obsidian: {
    enabled: true,
    blur: 24,
    refraction: 50,
    chromaticAberration: 3,
    rimLight: 70,
    surfaceOpacity: 88,
    specularSheen: true,
    mouseReactive: true,
    tint: 'neutral',
  },
  minimalist: {
    enabled: true,
    blur: 16,
    refraction: 30,
    chromaticAberration: 1,
    rimLight: 50,
    surfaceOpacity: 92,
    specularSheen: false,
    mouseReactive: false,
    tint: 'neutral',
  },
};

interface LiquidGlassContextType {
  config: LiquidGlassConfig;
  updateConfig: (patch: Partial<LiquidGlassConfig>) => void;
  applyPreset: (name: LiquidGlassConfig['presetName']) => void;
  toggleEnabled: () => void;
  mousePos: { x: number; y: number };
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const DEFAULT_CONFIG: LiquidGlassConfig = {
  ...PRESETS.minimalist,
  enabled: false,
  presetName: 'minimalist',
};

const LiquidGlassContext = createContext<LiquidGlassContextType | null>(null);

export const LiquidGlassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<LiquidGlassConfig>(() => {
    try {
      const saved = localStorage.getItem('mosje_liquid_glass_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CONFIG;
  });

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('mosje_liquid_glass_config', JSON.stringify(config));
    } catch {}
  }, [config]);

  useEffect(() => {
    if (!config.mouseReactive) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [config.mouseReactive]);

  const updateConfig = (patch: Partial<LiquidGlassConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const applyPreset = (name: LiquidGlassConfig['presetName']) => {
    const preset = PRESETS[name];
    if (preset) {
      setConfig({
        ...preset,
        presetName: name,
      });
    }
  };

  const toggleEnabled = () => {
    setConfig((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  return (
    <LiquidGlassContext.Provider
      value={{
        config,
        updateConfig,
        applyPreset,
        toggleEnabled,
        mousePos,
        isSettingsOpen,
        openSettings: () => setIsSettingsOpen(true),
        closeSettings: () => setIsSettingsOpen(false),
      }}
    >
      {children}
    </LiquidGlassContext.Provider>
  );
};

export const useLiquidGlass = () => {
  const ctx = useContext(LiquidGlassContext);
  if (!ctx) {
    throw new Error('useLiquidGlass must be used within LiquidGlassProvider');
  }
  return ctx;
};
