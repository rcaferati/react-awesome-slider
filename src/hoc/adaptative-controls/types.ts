import type React from 'react';

export type AdaptiveControlsMode = 'auto' | 'light' | 'dark' | 'off';

export type AdaptiveControlsSampleStrategy =
  | 'current-slide' // sample active slide only
  | 'viewport'; // sample the slider root area (best-effort)

export type AdaptiveControlsVars = {
  // arrow styling
  '--organic-arrow-color'?: string;

  // bullets styling
  '--control-bullet-color'?: string;
  '--control-bullet-active-color'?: string;
};

export type AdaptiveControlsOptions = {
  /**
   * auto: compute based on slide background (default)
   * light/dark: force theme
   * off: do nothing
   */
  mode?: AdaptiveControlsMode;

  /**
   * How we pick what to sample.
   * current-slide is deterministic and usually what you want.
   */
  strategy?: AdaptiveControlsSampleStrategy;

  /**
   * Throttle recompute during transitions/resizes.
   */
  throttleMs?: number;

  /**
   * Called after we apply variables (useful for debugging / telemetry).
   */
  onApplied?: (payload: {
    mode: AdaptiveControlsMode;
    theme: 'light' | 'dark';
    vars: AdaptiveControlsVars;
    reason: string;
  }) => void;
};

export type AdaptiveControlsInjectedProps = {
  /**
   * Optional: override which element receives the CSS variables.
   * If omitted, the HOC tries to use the slider root element (via ref/info.element).
   */
  adaptiveControlsRootRef?: React.RefObject<HTMLElement | null>;
};
