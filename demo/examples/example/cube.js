import React from 'react';
import AwesomeSlider from 'src';
import AwesomeFrame from 'src/components/react-awesome-frame';
import AwsSliderStyles from 'src/styled/cube-animation';
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
  <div style={{ backgroundColor: '#5fc0ae' }}>
    <img
      style={{ width: '18%' }}
      alt="bojack"
      src="/images/series/ricknmorty-loader.png"
    />
  </div>
);

function Component({ startup }) {
  return (
    <GeneralContext.Consumer>
      {context => {
        return (
          <AwesomeFrame
            cssModule={AwsFrameStyles}
            title="Adult Swim &mdash; Rick and Morty"
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
                style={{ backgroundColor: '#65c1ab' }}
                data-src="/images/series/ricknmorty-3.png"
              />
              <div
                style={{ backgroundColor: '#0095a9' }}
                data-src="/images/series/ricknmorty-6.jpg"
              />
              <div
                style={{ backgroundColor: '#ddff2d' }}
                data-src="/images/series/ricknmorty-5.png"
              />
            </AwesomeSlider>
          </AwesomeFrame>
        );
      }}
    </GeneralContext.Consumer>
  );
}

const example = {
  title: 'Cube Animation',
  items: [
    {
      title: 'Cube Animation Styles',
      description:
        "For this example we're importing the cube-animation style modules.",
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import AwesomeSliderStyles from 'react-awesome-slider/src/styled/cube-animation.scss';

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
      title: 'Styling the cube animation',
      description:
        'The animation exit styling on the <b>cube-animation</b> .scss file is not that straight forward but you can easily customize it using the <b>--cube</b> CSS properties. Checkout the full style source <a target="_blank" href="https://github.com/rcaferati/react-awesome-slider/tree/master/src/styled/cube-animation.scss">here</a>.',
      scss: `
.aws-sld {
  --cube-animation-duration: 675ms;
  --cube-animation-perspective: 1800px;
  --cube-animation-ease-in: cubic-bezier(0.8, 0, 1, 0.8);
  --cube-animation-ease-out: cubic-bezier(0, 0.2, 0.2, 1);
  --cube-translateZ-distance: -225px;

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
