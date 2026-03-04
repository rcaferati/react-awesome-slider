import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import CaptionedImages from '../hoc/captioned-images'; // hoc/captioned-images/index.(ts|js)

// ✅ Base slider styles (includes default “side” animation) + captioned HOC styles
import AwsSliderStyles from '../core/styles.scss';
import CaptionedStyles from '../hoc/captioned-images/styles.scss';

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

const meta: Meta<typeof CaptionedImages> = {
  title: 'HOC/Captioned Images',
  component: CaptionedImages,
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

    // cssModule is derived from animation; keep it out of controls
    cssModule: { control: false, table: { disable: true } },
  },

  args: {
    name: 'captioned',

    // ✅ default to built-in side animation (from AwsSliderStyles)
    animation: 'side',

    startup: false,
    bullets: true,
    buttons: true,
    infinite: true,

    // Captioned HOC expects "screens"
    screens: [
      {
        media: 'https://picsum.photos/id/1018/1200/600',
        caption: 'The first captioned slide',
        backgroundColor: '#ffffff',
      },
      {
        media: 'https://picsum.photos/id/1015/1200/600',
        caption: 'Second slide — caption overlay',
        backgroundColor: '#ffffff',
      },
      {
        media: 'https://picsum.photos/id/1019/1200/600',
        caption: 'Third slide — still 60fps',
        backgroundColor: '#ffffff',
      },
    ],
  },

  // ✅ Compute cssModule from the selected animation at render-time.
  // If animation === "side", we DO NOT include any custom animation stylesheet.
  render: (args) => {
    const animStyles = ANIMATION_STYLES[String(args.animation)] || null;

    const cssModule = animStyles
      ? [AwsSliderStyles, animStyles, CaptionedStyles]
      : [AwsSliderStyles, CaptionedStyles];

    return <CaptionedImages {...args} cssModule={cssModule} />;
  },
};

export default meta;

type Story = StoryObj<typeof CaptionedImages>;

export const Basic: Story = {};
