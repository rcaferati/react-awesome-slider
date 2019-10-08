import React from 'react';
import AwesomeSlider from 'src';
import AwsSliderStyles from 'src/styled/fall-animation';
import AwesomeFrame from 'src/components/react-awesome-frame';
import AwsFrameStyles from 'src/components/react-awesome-frame/styles.scss';
import { transitionStart, transitionEnd, resetSlider } from 'helpers/examples';
import { GeneralContext } from 'context/GeneralContext';
import { features, properties, globalProps } from 'examples/common';

function reset(slider) {
  resetSlider(slider, function() {
    slider.element.style.setProperty(
      '--transition-bezier',
      'cubic-bezier(0.45, 0, 0.2, 1)'
    );
    slider.element.style.setProperty('--slider-transition-duration', '770ms');
  });
}

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
              cssModule={AwsSliderStyles}
              startup={startup}
              // fillParent
              startupScreen={startupScreen}
              onFirstMount={reset}
              onResetSlider={reset}
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
        "For this example we're importing the fall-animation style modules.",
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import AwesomeSliderStyles from 'react-awesome-slider/src/styled/fall-animation.scss';

const Slider = (
  <AwesomeSlider cssModule={AwesomeSliderStyles}>
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
        'The animation exit styling on the <b>fall-animation</b> .scss file is not that straight forward but you can easily customize it using the <b>--fall</b> CSS custom properties. Checkout the full style source <a target="_blank" href="https://github.com/rcaferati/react-awesome-slider/tree/master/src/styled/fall-animation.scss">here</a>.',
      scss: `
.aws-sld {
  --fall-animation-duration: 700ms;
  --fall-animation-angle: 16deg;
  --fall-scaling-in-from: 0.9;

  ...
}
      `,
    },
  ],
  Component,
  componentClass: AwsSliderStyles['aws-sld'],
};

export default {
  globalProps,
  features,
  example,
  module,
  properties,
};
