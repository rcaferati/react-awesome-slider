import React from 'react';
import AwesomeSlider from 'src';
import AwesomeFrame from 'src/components/react-awesome-frame';
import AwsSliderStyles from 'src/styled/open-animation';
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
  <div style={{ backgroundColor: '#6978b5' }}>
    <img alt="Bojack Horseman" src="/images/series/bojack-loader.svg" />
  </div>
);

function Component({ startup }) {
  return (
    <GeneralContext.Consumer>
      {context => {
        return (
          <AwesomeFrame
            cssModule={AwsFrameStyles}
            title="Netflix &mdash; Bojack Horseman"
          >
            <AwesomeSlider
              name="images"
              cssModule={AwsSliderStyles}
              startup={startup}
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
                style={{ backgroundColor: '#2d5182' }}
                data-src="/images/series/bojack-0.png"
              />
              <div
                style={{ backgroundColor: '#62a4fa' }}
                data-src="/images/series/bojack-5.jpg"
              />
              <div
                style={{ backgroundColor: '#f33d42' }}
                data-src="/images/series/bojack-3.jpg"
              />
              <div
                style={{ backgroundColor: '#e3506f' }}
                data-src="/images/series/bojack-4.jpg"
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
      title: 'Open Animation Styles',
      description:
        "For this example we're importing the open-animation style modules.",
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import AwesomeSliderStyles from 'react-awesome-slider/src/styled/open-animation.scss';

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
      title: 'Styling the open animation',
      description:
        'The animation exit styling on the <b>open-animation</b> .scss file is not that straight forward but you can easily customize it using the <b>--open</b> CSS properties. Checkout the full style source <a target="_blank" href="https://github.com/rcaferati/react-awesome-slider/tree/master/src/styled/open-animation.scss">here</a>.',
      scss: `
.aws-sld {
  --open-animation-perspective: 600px;
  --open-animation-angle: 8deg;
  --open-animation-enter-delay: 85ms;

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
