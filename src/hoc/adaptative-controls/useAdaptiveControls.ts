// src/hoc/adaptive-controls/useAdaptiveControls.ts (drop-in replacement)
import { useEffect, useMemo, useRef } from 'react';
import type { AdaptiveControlsOptions, AdaptiveControlsVars } from './types';
import {
  applyCssVars,
  clearCssVars,
  chooseThemeFromLuminance,
  parseCssColorToRgb,
  relativeLuminance,
  varsForTheme,
} from './helpers';

const noop = () => {};

const isMeaningfulBg = (bg: string) =>
  !!bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';

const readBgColorBestEffort = (el: HTMLElement | null): string => {
  if (!el || typeof window === 'undefined') return '';
  const cs = window.getComputedStyle(el);

  const bg = cs.backgroundColor || '';
  if (isMeaningfulBg(bg)) return bg;

  // Walk up a couple levels for a meaningful background.
  let cur: HTMLElement | null = el.parentElement;
  for (let i = 0; i < 3 && cur; i++) {
    const cs2 = window.getComputedStyle(cur);
    const bg2 = cs2.backgroundColor || '';
    if (isMeaningfulBg(bg2)) return bg2;
    cur = cur.parentElement;
  }

  return bg || '';
};

type Args = {
  rootEl: HTMLElement | null;
  // "active slide" element if you can provide it; if not, we fall back to root.
  activeSlideEl?: HTMLElement | null;
  options?: AdaptiveControlsOptions;
};

// NOTE:
// - This hook is safe to call every render; it only touches DOM inside effects.
// - It can either apply vars as a side-effect OR be used as a "compute" hook by returning vars.
//   Our current HOC supports both patterns by reading the return value (if any).
export function useAdaptiveControls({
  rootEl,
  activeSlideEl,
  options,
}: Args): { vars: AdaptiveControlsVars; theme: 'light' | 'dark' } | void {
  const {
    mode = 'auto',
    strategy = 'current-slide',
    throttleMs = 50,
    onApplied = noop,
    // optional (future): caller can override vars returned by varsForTheme
    // cssVars?: Record<string, string | number | null | undefined>
  } = options || {};

  const lastAppliedRef = useRef<AdaptiveControlsVars | null>(null);
  const lastThemeRef = useRef<'light' | 'dark'>('light');
  const lastRunAtRef = useRef<number>(0);
  const scheduledRef = useRef<number | null>(null);

  // We clear only the vars we might set (use a stable list).
  const varsToClear = useMemo<AdaptiveControlsVars>(
    () => varsForTheme('light'),
    []
  );

  useEffect(() => {
    if (!rootEl) return;

    // hard-off => clear our vars and exit
    if (mode === 'off') {
      if (lastAppliedRef.current) {
        clearCssVars(rootEl, varsToClear);
        lastAppliedRef.current = null;
      }
      return;
    }

    const computeTheme = (): 'light' | 'dark' => {
      const forcedTheme =
        mode === 'light' ? 'light' : mode === 'dark' ? 'dark' : null;

      if (forcedTheme) return forcedTheme;

      const target =
        strategy === 'current-slide'
          ? activeSlideEl || rootEl
          : rootEl || activeSlideEl || null;

      const bg = readBgColorBestEffort(target);
      const rgb = parseCssColorToRgb(bg);

      // If we can’t parse (gradients, etc.), default to light theme (white-ish controls).
      if (!rgb) return 'light';

      const lum = relativeLuminance(rgb);
      return chooseThemeFromLuminance(lum);
    };

    const computeAndApply = (reason: string) => {
      if (!rootEl) return;

      const now = Date.now();
      if (now - lastRunAtRef.current < throttleMs) return;
      lastRunAtRef.current = now;

      const theme = computeTheme();
      const vars = varsForTheme(theme);

      applyCssVars(rootEl, vars);

      lastAppliedRef.current = vars;
      lastThemeRef.current = theme;

      onApplied({ mode, theme, vars, reason });
    };

    const schedule = (reason: string) => {
      if (scheduledRef.current != null) return;
      scheduledRef.current = window.setTimeout(() => {
        scheduledRef.current = null;
        computeAndApply(reason);
      }, 0);
    };

    // Initial apply
    schedule('mount');

    // Recompute on resize
    const onResize = () => schedule('resize');
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (scheduledRef.current != null) {
        clearTimeout(scheduledRef.current);
        scheduledRef.current = null;
      }
      if (lastAppliedRef.current) {
        clearCssVars(rootEl, varsToClear);
        lastAppliedRef.current = null;
      }
    };
  }, [
    rootEl,
    activeSlideEl,
    mode,
    strategy,
    throttleMs,
    onApplied,
    varsToClear,
  ]);

  // Optional return (useful for the HOC to read + merge):
  // If rootEl is not ready yet, return a deterministic default.
  const theme = lastThemeRef.current || 'light';
  const vars = lastAppliedRef.current || varsForTheme(theme);
  return { vars, theme };
}
