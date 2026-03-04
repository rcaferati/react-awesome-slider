// src/core/AwesomeSlider.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import AwesomeSlider from '../index';

import AwsSliderStyles from '../core/styles.scss';
import CubeAnimationStyles from '../styled/cube-animation';
import FallAnimationStyles from '../styled/fall-animation';
import FoldOutAnimationStyles from '../styled/fold-out-animation';
import OpenAnimationStyles from '../styled/open-animation';
import ScaleOutAnimationStyles from '../styled/scale-out-animation';

type CssModuleMap = Record<string, string>;

const asCssModuleMap = (v: unknown): CssModuleMap | null => {
  if (!v || typeof v !== 'object') return null;
  return v as CssModuleMap;
};

// ✅ sideAnimation uses only AwsSliderStyles (default side animation included there)
const ANIMATION_STYLES: Record<string, unknown | null> = {
  sideAnimation: null,
  cubeAnimation: CubeAnimationStyles,
  fallAnimation: FallAnimationStyles,
  foldOutAnimation: FoldOutAnimationStyles,
  openAnimation: OpenAnimationStyles,
  scaleOutAnimation: ScaleOutAnimationStyles,
};

const meta: Meta<typeof AwesomeSlider> = {
  title: 'Core/AwesomeSlider',
  component: AwesomeSlider,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
          <Story />
        </div>
      </div>
    ),
  ],

  // ✅ animation selection first
  argTypes: {
    animation: {
      control: { type: 'select' },
      options: Object.keys(ANIMATION_STYLES),
    },
    // derived in render
    cssModule: { control: false, table: { disable: true } },
  },

  args: {
    name: 'images',
    animation: 'sideAnimation',
    startup: false,
    buttons: true,
    bullets: true,
    infinite: true,
    media: [
      { source: 'https://picsum.photos/id/1018/1200/600', slug: 'slide-1' },
      { source: 'https://picsum.photos/id/1015/1200/600', slug: 'slide-2' },
      { source: 'https://picsum.photos/id/1019/1200/600', slug: 'slide-3' },
    ],
  },

  render: (args) => {
    const base = asCssModuleMap(AwsSliderStyles);
    const animRaw = ANIMATION_STYLES[String(args.animation)] || null;
    const anim = asCssModuleMap(animRaw);

    // ✅ If sideAnimation, do NOT include an animation stylesheet.
    const cssModule = [base, anim].filter(Boolean) as CssModuleMap[];

    return (
      <AwesomeSlider
        {...args}
        // ✅ only pass if we truly got module maps
        cssModule={cssModule.length ? cssModule : undefined}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof AwesomeSlider>;

export const Basic: Story = {};
