import React from 'react';
import AwesomeSlider from 'src';
import AwsSliderStyles from 'src/core/styles.scss';
import AnimationStyles from 'src/styled/fall-animation';
import AwesomeFrame from 'src/components/react-awesome-frame';
import AwsFrameStyles from 'src/components/react-awesome-frame/styles.scss';
import { transitionStart, transitionEnd, resetSlider } from 'helpers/examples';
import { GeneralContext } from 'context/GeneralContext';
import { features, properties, globalProps } from 'examples/common';

const startupScreen = (
  <div style={{ backgroundColor: '#353464' }}>
    <img alt="bojack" src="/images/series/south-park-loader.png" />
  </div>
);

function Component({ startup }) {
  return (
    <GeneralContext.Consumer>
      {context => {
        return (
          <AwesomeFrame
            cssModule={AwsFrameStyles}
            title="Comedy Central &mdash; South Park"
          >
            <AwesomeSlider
              name="images"
              cssModule={[AwsSliderStyles, AnimationStyles]}
              startup={startup}
              animation="fallAnimation"
              startupScreen={startupScreen}
              onFirstMount={resetSlider}
              onResetSlider={resetSlider}
              onTransitionStart={transitionStart}
              onTransitionEnd={transitionEnd}
              tranisionDelay={300}
              organicArrows={context.general['--organicArrows']}
              bullets={context.general['--bullets']}
              fillParent={context.general['--fillParent']}
            >
              <div
                style={{ backgroundColor: '#a3b9d0' }}
                data-src="/images/series/south-park-1.jpg"
              />
              <div
                style={{ backgroundColor: '#f46b34' }}
                data-src="/images/series/south-park-3.jpg"
              />
              <div
                style={{ backgroundColor: '#d63b6b' }}
                data-src="/images/series/south-park-4.jpg"
              />
            </AwesomeSlider>
          </AwesomeFrame>
        );
      }}
    </GeneralContext.Consumer>
  );
}

const example = {
  title: 'Fold Animation',
  items: [
    {
      title: 'Fall Animation Styles',
      description:
        "For this example we're injecting the fall-animation styles.",
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/custom-animations/fall-animation.css';

const Slider = (
  <AwesomeSlider animation="fallAnimation">
    <div data-src="/path/to/image-0.jpg" />
    <div data-src="/path/to/image-1.jpg" />
    <div data-src="/path/to/image-2.jpg" />
    <div data-src="/path/to/image-3.jpg" />
  </AwesomeSlider>
);
      `,
    },
    {
      title: 'Styling the fold animation',
      description:
        'The animation exit styling on the <b>fall-animation</b> .scss file is not that straight forward but you can easily customize it using the <b>--fall</b> CSS custom properties. Checkout the full style source <a target="_blank" href="https://github.com/rcaferati/react-awesome-slider/tree/master/src/styled/fall-animation/fall-animation.scss">here</a>.',
      scss: `
.aws-sld {
  --fall-animation-angle: 16deg;
  --fall-scaling-in-from: 0.9;

  ...
}
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
