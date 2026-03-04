import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// ✅ Import the wrapper component (hoc/animated-lettering/index.*)
import Lettering from '../hoc/animated-lettering';

// ✅ Base slider styles (includes default “side” animation) + lettering styles
import AwsSliderStyles from '../core/styles.scss';
import LetteringStyles from '../hoc/animated-lettering/styles.scss';

// ✅ Optional custom animations (override the default “side” animation)
import CubeAnimationStyles from '../styled/cube-animation';
import FallAnimationStyles from '../styled/fall-animation';
import FoldOutAnimationStyles from '../styled/fold-out-animation';
import OpenAnimationStyles from '../styled/open-animation';
import ScaleOutAnimationStyles from '../styled/scale-out-animation';

// "side" = default animation that comes from AwsSliderStyles
const ANIMATION_STYLES: Record<string, any | null> = {
  side: null,
  cubeAnimation: CubeAnimationStyles,
  fallAnimation: FallAnimationStyles,
  foldOutAnimation: FoldOutAnimationStyles,
  openAnimation: OpenAnimationStyles,
  scaleOutAnimation: ScaleOutAnimationStyles,
};

const meta: Meta<typeof Lettering> = {
  title: 'HOC/Animated Lettering',
  component: Lettering,
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

  // ✅ Animation is the first configurable option
  argTypes: {
    animation: {
      name: 'animation',
      control: { type: 'select' },
      options: Object.keys(ANIMATION_STYLES),
      description:
        'Select the animation preset. "side" uses the default animation from AwsSliderStyles.',
      table: { category: 'Controls', order: 0 },
    },

    // cssModule is derived from animation; keep it out of the controls
    cssModule: { control: false, table: { disable: true } },
  },

  args: {
    name: 'lettering',

    // ✅ default to the built-in side animation from AwsSliderStyles
    animation: 'side',

    // keep consistent with your other stories
    startup: false,
    buttons: true,
    bullets: true,
    infinite: true,

    // ✅ REQUIRED by the HOC
    screens: [
      {
        backgroundColor: '#ffffff',
        children: [
          'React Awesome Slider',
          'Animated Lettering',
          'Each line is a <p>',
          'Delays are staggered by CSS',
        ],
      },
      {
        backgroundColor: '#f5f5f5',
        children: [
          'Transitions are slide-based',
          'Text moves left/right on change',
          'This is rendered as children',
        ],
      },
      {
        backgroundColor: '#e9eef5',
        children: [
          'No `media` prop needed',
          'Slider transforms children internally',
          'into media entries',
        ],
      },
    ],
  },

  // ✅ Compute cssModule from the selected animation at render-time.
  // If animation === "side", we DO NOT include any custom animation stylesheet.
  render: (args) => {
    const animStyles = ANIMATION_STYLES[String(args.animation)] || null;

    const cssModule = animStyles
      ? [AwsSliderStyles, animStyles, LetteringStyles]
      : [AwsSliderStyles, LetteringStyles];

    return <Lettering {...args} cssModule={cssModule} />;
  },
};

export default meta;

type Story = StoryObj<typeof Lettering>;

export const Basic: Story = {};
