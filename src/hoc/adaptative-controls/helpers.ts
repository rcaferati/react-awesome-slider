import type { AdaptiveControlsVars } from './types';

// -----------------------------
// Color helpers (pure)
// -----------------------------

export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export const parseCssColorToRgb = (
  input: string
): { r: number; g: number; b: number; a: number } | null => {
  const s = String(input || '').trim();
  if (!s) return null;

  // rgb/rgba
  const m =
    s.match(
      /^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)$/i
    ) || null;

  if (m) {
    const r = Number(m[1]);
    const g = Number(m[2]);
    const b = Number(m[3]);
    const a = m[4] == null ? 1 : Number(m[4]);
    if ([r, g, b, a].some((x) => Number.isNaN(x))) return null;
    return { r, g, b, a: clamp01(a) };
  }

  // hex (#rgb, #rrggbb)
  const hx = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hx) {
    const hex = hx[1].toLowerCase();
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex;
    const r = Number.parseInt(full.slice(0, 2), 16);
    const g = Number.parseInt(full.slice(2, 4), 16);
    const b = Number.parseInt(full.slice(4, 6), 16);
    return { r, g, b, a: 1 };
  }

  // Unsupported formats (hsl, named colors, gradients) — handled upstream.
  return null;
};

export const relativeLuminance = (rgb: {
  r: number;
  g: number;
  b: number;
}): number => {
  // WCAG relative luminance
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const R = lin(rgb.r);
  const G = lin(rgb.g);
  const B = lin(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

export const chooseThemeFromLuminance = (lum: number): 'light' | 'dark' => {
  // Higher luminance => light background => use dark controls
  return lum > 0.55 ? 'dark' : 'light';
};

// -----------------------------
// CSS variable presets
// -----------------------------

export const varsForTheme = (theme: 'light' | 'dark'): AdaptiveControlsVars => {
  if (theme === 'dark') {
    // dark arrows/bullets on light backgrounds
    return {
      '--organic-arrow-color': 'rgba(0, 0, 0, 0.85)',
      '--control-bullet-color': 'rgba(0, 0, 0, 0.35)',
      '--control-bullet-active-color': 'rgba(0, 0, 0, 0.85)',
    };
  }

  // light arrows/bullets on dark backgrounds
  return {
    '--organic-arrow-color': 'rgba(255, 255, 255, 0.9)',
    '--control-bullet-color': 'rgba(255, 255, 255, 0.35)',
    '--control-bullet-active-color': 'rgba(255, 255, 255, 0.9)',
  };
};

export const applyCssVars = (el: HTMLElement, vars: AdaptiveControlsVars) => {
  for (const [k, v] of Object.entries(vars)) {
    if (!v) continue;
    el.style.setProperty(k, v);
  }
};

export const clearCssVars = (el: HTMLElement, vars: AdaptiveControlsVars) => {
  for (const k of Object.keys(vars)) {
    el.style.removeProperty(k);
  }
};
