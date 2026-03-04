import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// ✅ Use the wrapper component the package exports/ships for autoplay
import Autoplay from '../hoc/autoplay'; // adjust path if your story file lives elsewhere

// ✅ Core + animation styles (same pattern as your working AwesomeSlider story)
import AwsSliderStyles from '../core/styles.scss';
import FallAnimationStyles from '../styled/fall-animation';

// Optional: if you have a timer scss file for autoplay, import it.
// (If you don’t, the timer can still work via CSS variables + whatever styles you already ship.)
// import AutoplayStyles from '../hoc/autoplay/styles.scss';

const meta: Meta<typeof Autoplay> = {
  title: 'HOC/Autoplay',
  component: Autoplay,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    name: 'autoplay-demo',
    // ✅ the slider expects cssModule to include the core styles + the animation styles
    cssModule: [AwsSliderStyles, FallAnimationStyles /*, AutoplayStyles */],
    animation: 'fallAnimation',

    // autoplay props
    play: true,
    interval: 1800,
    cancelOnInteraction: false,
    timerHeight: '6px',
    timerBackgroundColor: 'rgba(0, 0, 0, 0.15)',

    // slider props
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
};
export default meta;

type Story = StoryObj<typeof Autoplay>;

export const Basic: Story = {};

export const CancelOnInteraction: Story = {
  args: {
    cancelOnInteraction: true,
    interval: 2000,
  },
};

export const Paused: Story = {
  args: {
    play: false,
  },
};

export const FastTimer: Story = {
  args: {
    interval: 800,
    timerHeight: '4px',
  },
};

export const CustomTimerStyle: Story = {
  args: {
    interval: 2500,
    timerHeight: '10px',
    timerBackgroundColor: 'rgba(255, 0, 0, 0.20)',
  },
};
