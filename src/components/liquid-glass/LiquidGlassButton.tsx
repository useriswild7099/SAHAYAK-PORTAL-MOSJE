import React from 'react';
import { useLiquidGlass } from '../../context/LiquidGlassContext';

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emerald' | 'amber' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const { config } = useLiquidGlass();

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5 rounded-md',
    md: 'px-3.5 py-1.5 text-xs gap-2 rounded-lg font-semibold',
    lg: 'px-4 py-2 text-sm gap-2.5 rounded-xl font-bold',
  }[size];

  if (!config.enabled) {
    const fallbackStyles = {
      primary: 'bg-[#0B2545] hover:bg-[#12335C] text-white border border-[#0B2545]',
      secondary: 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300',
      emerald: 'bg-emerald-800 hover:bg-emerald-900 text-white border border-emerald-800',
      amber: 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-600',
      danger: 'bg-red-700 hover:bg-red-800 text-white border border-red-700',
    }[variant];

    return (
      <button
        disabled={disabled}
        className={`inline-flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer ${sizeClasses} ${fallbackStyles} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }

  // Dynamic Liquid Glass Button styling
  const variantStyles = {
    primary: 'bg-[#0B2545]/85 hover:bg-[#0B2545]/95 text-white border-white/30 shadow-sm shadow-[#0B2545]/20',
    secondary: 'bg-white/70 hover:bg-white/90 text-slate-800 border-white/50 shadow-sm shadow-slate-200/50',
    emerald: 'bg-emerald-700/80 hover:bg-emerald-700/95 text-white border-emerald-300/40 shadow-sm shadow-emerald-700/20',
    amber: 'bg-amber-600/80 hover:bg-amber-600/95 text-white border-amber-300/40 shadow-sm shadow-amber-600/20',
    danger: 'bg-red-700/80 hover:bg-red-700/95 text-white border-red-300/40 shadow-sm shadow-red-700/20',
  }[variant];

  return (
    <button
      disabled={disabled}
      style={{
        backdropFilter: `blur(${Math.min(config.blur, 20)}px) saturate(180%)`,
        WebkitBackdropFilter: `blur(${Math.min(config.blur, 20)}px) saturate(180%)`,
        boxShadow: `
          inset 0 1px 1px 0 rgba(255, 255, 255, ${config.rimLight / 100 * 0.8}),
          inset 0 -1px 1px 0 rgba(0, 0, 0, 0.1),
          0 2px 6px 0 rgba(0, 0, 0, 0.08)
        `,
      }}
      className={`relative overflow-hidden inline-flex items-center justify-center border transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer ${sizeClasses} ${variantStyles} ${className}`}
      {...props}
    >
      {/* Specular sheen beam */}
      <span
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      {icon && <span className="relative z-10 shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
