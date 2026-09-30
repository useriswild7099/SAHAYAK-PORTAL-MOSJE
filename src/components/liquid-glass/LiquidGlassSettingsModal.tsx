import React from 'react';
import { X, Sparkles, Sliders, Eye, RefreshCw, Layers, Droplets } from 'lucide-react';
import { useLiquidGlass, LiquidGlassConfig } from '../../context/LiquidGlassContext';
import { LiquidGlassContainer } from './LiquidGlassContainer';

export const LiquidGlassSettingsModal: React.FC = () => {
  const {
    config,
    updateConfig,
    applyPreset,
    toggleEnabled,
    isSettingsOpen,
    closeSettings,
  } = useLiquidGlass();

  if (!isSettingsOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="liquid-glass-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto"
    >
      <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden text-xs text-slate-800 my-8">
        {/* Header */}
        <div className="bg-[#0B2545] text-white p-4.5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h2 id="liquid-glass-title" className="text-sm font-bold text-white flex items-center gap-2">
                <span>Apple Liquid Glass UI/UX Engine</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  dashersw/liquid-glass-js WebGL
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Real-time optical refraction, chromatic dispersion, specular sheen &amp; backdrop filtration
              </p>
            </div>
          </div>
          <button
            onClick={closeSettings}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Liquid Glass Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Master Enable & Live Preview Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-100/70 border border-slate-200">
            <div>
              <div className="font-bold text-slate-900 text-xs">Liquid Glass Optical Engine</div>
              <p className="text-[11px] text-slate-500">
                Turn on Apple-inspired refraction shaders across the entire portal interface.
              </p>
            </div>
            <button
              onClick={toggleEnabled}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                config.enabled
                  ? 'bg-cyan-600 text-white shadow-cyan-500/30'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {config.enabled ? 'Engine Active ✓' : 'Engine Disabled'}
            </button>
          </div>

          {/* Interactive Live Glass Preview Tile */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Live Refraction &amp; Dispersion Preview (Hover mouse to see sheen)
            </label>
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center relative overflow-hidden">
              {/* Pattern lines behind to show refraction distortion */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              <LiquidGlassContainer
                borderRadius={16}
                glow
                className="p-5 max-w-sm text-center space-y-1.5 shadow-2xl"
              >
                <div className="font-mono text-[10px] font-bold tracking-wider text-[#0B2545] uppercase">
                  Refractive Lens Sample
                </div>
                <div className="text-base font-extrabold text-slate-900 tracking-tight">
                  Optical Liquid Glass
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Sampling underlying DOM raster layer with real-time normal distortion &amp; RGB chromatic aberration.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0B2545] text-white">
                    Refraction: {config.refraction}%
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-800 border border-slate-300">
                    Blur: {config.blur}px
                  </span>
                </div>
              </LiquidGlassContainer>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Curated Liquid Glass Presets:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'apple_liquid', label: 'Apple Liquid', desc: 'Real-time refraction' },
                { id: 'clear_crystal', label: 'Clear Crystal', desc: 'High transparency' },
                { id: 'frosted_quartz', label: 'Frosted Quartz', desc: 'Heavy diffusion' },
                { id: 'obsidian', label: 'Dark Obsidian', desc: 'Deep smoky glass' },
                { id: 'minimalist', label: 'Clean Glass', desc: 'Subtle institutional' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id as any)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    config.presetName === p.id
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-bold ring-2 ring-cyan-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-semibold">{p.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Fine Tuning Parameter Sliders */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span>Fine-Tuning Physical Parameters (Live GL Shaders)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Refraction Depth */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Refraction Depth:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {config.refraction}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={config.refraction}
                  onChange={(e) => updateConfig({ refraction: Number(e.target.value) })}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">Controls optical ray bending at glass border bevels.</div>
              </div>

              {/* Chromatic Aberration */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Chromatic Aberration:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {config.chromaticAberration}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={8}
                  step={0.5}
                  value={config.chromaticAberration}
                  onChange={(e) => updateConfig({ chromaticAberration: Number(e.target.value) })}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">Simulates lens wavelength dispersion (RGB prism edge separation).</div>
              </div>

              {/* Specular Rim Light */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Rim Light Highlight:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {config.rimLight}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={config.rimLight}
                  onChange={(e) => updateConfig({ rimLight: Number(e.target.value) })}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">Edge bevel luminosity and 1px crisp specular outline.</div>
              </div>

              {/* Backdrop Blur Radius */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Backdrop Blur Radius:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {config.blur}px
                  </span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={40}
                  value={config.blur}
                  onChange={(e) => updateConfig({ blur: Number(e.target.value) })}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">Gaussian blur kernel size for background diffusion.</div>
              </div>

              {/* Surface Glass Opacity */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Glass Tint Opacity:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {config.surfaceOpacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={95}
                  value={config.surfaceOpacity}
                  onChange={(e) => updateConfig({ surfaceOpacity: Number(e.target.value) })}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">Balance between translucent crystal and readability contrast.</div>
              </div>

              {/* Toggles: Mouse Reactivity & Specular Sheen */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-slate-700">Mouse-Reactive Lighting</span>
                  <input
                    type="checkbox"
                    checked={config.mouseReactive}
                    onChange={(e) => updateConfig({ mouseReactive: e.target.checked })}
                    className="w-4 h-4 accent-cyan-600 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-slate-700">Apple Specular Sheen</span>
                  <input
                    type="checkbox"
                    checked={config.specularSheen}
                    onChange={(e) => updateConfig({ specularSheen: e.target.checked })}
                    className="w-4 h-4 accent-cyan-600 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            dashersw/liquid-glass-js integration · Zero Dependencies
          </span>
          <button
            onClick={closeSettings}
            className="px-4 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#12335C] text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
