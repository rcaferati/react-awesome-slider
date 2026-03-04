// src/hoc/adaptive-controls/AdaptiveControls.stories.tsx (drop-in replacement)
import React, { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import AwesomeSlider from '../index';
import AdaptiveControlsHoc from '../hoc/adaptative-controls';

// ✅ base styles include default side animation
import AwsSliderStyles from '../core/styles.scss';

// ✅ other animations (css modules)
import CubeAnimationStyles from '../styled/cube-animation';
import FallAnimationStyles from '../styled/fall-animation';
import FoldOutAnimationStyles from '../styled/fold-out-animation';
import OpenAnimationStyles from '../styled/open-animation';
import ScaleOutAnimationStyles from '../styled/scale-out-animation';

type CssModuleMap = Record<string, string>;

const asCssModuleMap = (v: unknown): CssModuleMap | null =>
  v && typeof v === 'object' ? (v as CssModuleMap) : null;

const ANIMATIONS = [
  { value: 'sideAnimation', label: 'Side (default)' },
  { value: 'cubeAnimation', label: 'Cube' },
  { value: 'fallAnimation', label: 'Fall' },
  { value: 'foldOutAnimation', label: 'Fold Out' },
  { value: 'openAnimation', label: 'Open' },
  { value: 'scaleOutAnimation', label: 'Scale Out' },
] as const;

type AnimationKey = (typeof ANIMATIONS)[number]['value'];

const animationCssByKey: Record<AnimationKey, CssModuleMap | null> = {
  sideAnimation: null, // ✅ side animation is in AwsSliderStyles
  cubeAnimation: asCssModuleMap(CubeAnimationStyles),
  fallAnimation: asCssModuleMap(FallAnimationStyles),
  foldOutAnimation: asCssModuleMap(FoldOutAnimationStyles),
  openAnimation: asCssModuleMap(OpenAnimationStyles),
  scaleOutAnimation: asCssModuleMap(ScaleOutAnimationStyles),
};

const AwesomeSliderWithAdaptiveControls = AdaptiveControlsHoc(AwesomeSlider);

type StoryProps = React.ComponentProps<
  typeof AwesomeSliderWithAdaptiveControls
> & {
  // story-only control
  animationChoice: AnimationKey;
};

const StoryComponent: React.FC<StoryProps> = (props) => {
  const { animationChoice, cssModule, ...rest } = props;

  const mergedCss = useMemo(() => {
    const base = asCssModuleMap(AwsSliderStyles);
    const animCss = animationCssByKey[animationChoice];

    const extra = Array.isArray(cssModule)
      ? (cssModule as unknown[]).map(asCssModuleMap).filter(Boolean)
      : [];

    // ✅ Always include AwsSliderStyles
    // ✅ Only include extra animation stylesheet when not sideAnimation
    return [base, animCss, ...extra].filter(Boolean) as CssModuleMap[];
  }, [animationChoice, cssModule]);

  // ✅ For sideAnimation, omit `animation` prop entirely (core defaults).
  const animationProp =
    animationChoice === 'sideAnimation' ? undefined : (animationChoice as any);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <AwesomeSliderWithAdaptiveControls
          {...(rest as any)}
          cssModule={mergedCss.length ? mergedCss : undefined}
          animation={animationProp}
        />
      </div>
    </div>
  );
};

const meta: Meta<typeof StoryComponent> = {
  title: 'HOC/Adaptive Controls',
  component: StoryComponent,
  parameters: { layout: 'fullscreen' },

  // ✅ Animation must be the first configurable option
  argTypes: {
    animationChoice: {
      name: 'animation',
      control: { type: 'select' },
      options: ANIMATIONS.map((a) => a.value),
      description:
        'Select the slider animation. "sideAnimation" uses the default styles from AwsSliderStyles.',
    },
    bulletsPosition: {
      name: 'bulletsPosition',
      control: { type: 'inline-radio' },
      options: ['inside', 'outside'],
      description:
        'Controls the CSS variable --control-bullets-bottom (inside=40px, outside=-40px).',
    },
    adaptiveControls: {
      control: 'object',
      description:
        'Adaptive controls options (mode/strategy/throttle/onApplied).',
    },
  },

  args: {
    // ✅ first control
    animationChoice: 'sideAnimation',

    name: 'adaptive-controls',

    // ✅ default to INSIDE
    bulletsPosition: 'inside',

    // slider behavior
    startup: false,
    buttons: true,
    bullets: true,
    infinite: true,

    // adaptive controls default
    adaptiveControls: {
      mode: 'auto',
      strategy: 'current-slide',
      throttleMs: 50,
    },

    // Use obvious backgrounds to see contrast flips.
    children: [
      <div key="s1" style={{ backgroundColor: '#0b0f18', height: '100%' }}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          Dark background → light controls
        </div>
      </div>,
      <div key="s2" style={{ backgroundColor: '#f4f6fb', height: '100%' }}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111',
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          Light background → dark controls
        </div>
      </div>,
      <div key="s3" style={{ backgroundColor: '#1f6feb', height: '100%' }}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          Blue background → light controls
        </div>
      </div>,
    ],
  },
};

export default meta;

type Story = StoryObj<typeof StoryComponent>;

export const Basic: Story = {};
