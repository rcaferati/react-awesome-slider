import React from 'react';
import AwesomeSlider from 'src';
import AwesomeFrame from 'src/components/react-awesome-frame';
import withLettering from 'src/hoc/animated-lettering/hoc';
import AwsSliderStyles from 'src/core/styles.scss';
import LetteringStyles from 'src/hoc/animated-lettering/styles.scss';
import AwsFrameStyles from 'src/components/react-awesome-frame/styles.scss';
import { resetSlider, transitionStart, transitionEnd } from 'helpers/examples';
import { GeneralContext } from 'context/GeneralContext';
import { features, properties, globalProps } from 'examples/common';

const LetteringSlider = withLettering(AwesomeSlider);

const screens = [
  {
    backgroundColor: 'Tomato',
    children: ['And so it is ♪', 'Just like you said it would be'],
  },
  {
    backgroundColor: 'ForestGreen',
    children: ['Life goes easy on me', 'Most of the time ♪'],
  },
  {
    backgroundColor: 'DarkTurquoise',
    children: ['And so it is the shorter story', 'No love, no glory ♪'],
  },
  {
    backgroundColor: 'Chocolate',
    children: ['No hero in her sky', '♪ ♪ ♪'],
  },
];

const startupScreen = (
  <div style={{ backgroundColor: '#0095B7' }}>
    <span style={{ fontSize: '72px', color: 'rgba(0, 0, 0, 0.25)' }}>♪</span>
  </div>
);

function Component({ startup }) {
  return (
    <GeneralContext.Consumer>
      {context => {
        return (
          <AwesomeFrame
            cssModule={AwsFrameStyles}
            title="Damien Rice &mdash; Blower's Daughter ♪"
          >
            <LetteringSlider
              name="lettering"
              startup={startup}
              startupDelay={625}
              cssModule={[AwsSliderStyles, LetteringStyles]}
              startupScreen={startupScreen}
              onTransitionStart={transitionStart}
              onTransitionEnd={transitionEnd}
              onResetSlider={resetSlider}
              onFirstMount={resetSlider}
              screens={screens}
              organicArrows={context.general['--organicArrows']}
              bullets={context.general['--bullets']}
              fillParent={context.general['--fillParent']}
            />
          </AwesomeFrame>
        );
      }}
    </GeneralContext.Consumer>
  );
}

const example = {
  title: 'Smooth Lettering',
  items: [
    {
      title: 'Content Animation',
      description:
        "As with the component's <b>container</b>, the <b>content</b> element also has it's own <b>moveRight</b> and <b>moveLeft</b> animation classes. You can use them to control the behaviour of the entering and exiting children elements.",
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import withLettering from 'react-awesome-slider/dist/lettering';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/lettering.css';

const LetteringSlider = withLettering(AwesomeSlider);

const Slider = (
  <LetteringSlider
    screens={
      [
        {
          backgroundColor: 'Tomato',
          children: ['And so it is ♪', 'Just like you said it would be'],
        },
        {
          backgroundColor: 'ForestGreen',
          children: ['Life goes easy on me', 'Most of the time ♪'],
        },
      ]
    }
  />
);
      `,
    },
  ],
  Component,
  componentClass: AwsSliderStyles.awssld,
};

export default {
  globalProps,
  features,
  example,
  module,
  properties,
};
