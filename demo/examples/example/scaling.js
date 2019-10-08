import React from 'react';
import AwesomeSlider from 'src';
import AwsSliderStyles from 'src/styled/scale-out-animation';
import AwesomeFrame from 'src/components/react-awesome-frame';
import AwsFrameStyles from 'src/components/react-awesome-frame/styles.scss';
import { resetSlider, transitionStart, transitionEnd } from 'helpers/examples';
import { GeneralContext } from 'context/GeneralContext';
import { features, properties, globalProps } from 'examples/common';

function reset(slider) {
  resetSlider(slider, function() {
    slider.element.style.setProperty(
      '--transition-bezier',
      'cubic-bezier(0.45, 0, 0.2, 1)'
    );
    slider.element.style.setProperty('--slider-transition-duration', '670ms');
    slider.element.style.setProperty('--organic-arrow-thickness', '6px');
  });
}

const startupScreen = (
  <div style={{ backgroundColor: '#EFEFEF' }}>
    <img alt="south park" src="/images/series/south-park-loader.png" />
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
              startupScreen={startupScreen}
              onFirstMount={reset}
              onResetSlider={reset}
              onTransitionStart={transitionStart}
              onTransitionEnd={transitionEnd}
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
  title: 'Scale Animation',
  items: [
    {
      title: 'Scale Animation Styles',
      description:
        "For this example we're importing the scale-out-animation overwritten style modules.",
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import AwesomeSliderStyles from 'react-awesome-slider/src/styled/scale-out-animation.scss';

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
      title: 'How to extend it',
      description:
        'The animation exit styling on the <b>scale-out-animation</b> .scss file is pretty straight forward. We just apply the scaling down on exit moveLeft and exit moveRight classes of the active box container.',
      scss: `
.aws-sld {
  &--exit {
    &.aws-sld--moveRight, &.aws-sld--moveLeft {
      animation: scaleOut var(--slider-transition-duration) both
        var(--transition-bezier);
    }
  }
}

@keyframes scaleOut {
  to {
    transform: scale(0.85);
  }
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
