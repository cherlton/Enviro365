/**
 * Theme Color Tokens Registry
 * Provides central color values and Tailwind class mapping for components.
 */
export const colors = {
  primary: {
    bg: 'bg-emerald-600 hover:bg-emerald-500',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    light: 'bg-emerald-500/10',
    gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500',
  },
  secondary: {
    bg: 'bg-blue-600 hover:bg-blue-500',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    light: 'bg-blue-500/10',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600',
  },
  danger: {
    bg: 'bg-rose-600 hover:bg-rose-500',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    light: 'bg-rose-500/10',
    gradient: 'bg-gradient-to-r from-rose-600 to-red-600',
  },
  warning: {
    bg: 'bg-amber-600 hover:bg-amber-500',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    light: 'bg-amber-500/10',
  },
  surface: {
    base: 'bg-slate-950',
    card: 'bg-slate-900/80 border-slate-800',
    elevated: 'bg-slate-800/90',
  },
  text: {
    main: 'text-slate-100',
    muted: 'text-slate-400',
    subtle: 'text-slate-500',
  }
};
