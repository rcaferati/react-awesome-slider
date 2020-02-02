import React from 'react';
import AwesomeSlider from 'src';
import AwsSliderStyles from 'src/core/styles.scss';
import AnimationStyles from 'src/styled/fold-out-animation';
import AwesomeFrame from 'src/components/react-awesome-frame';
import AwsFrameStyles from 'src/components/react-awesome-frame/styles.scss';
import { transitionStart, transitionEnd, resetSlider } from 'helpers/examples';
import { GeneralContext } from 'context/GeneralContext';
import { features, properties, globalProps } from 'examples/common';

function onFirstMount(slider) {
  resetSlider(slider, function() {
    slider.element.style.setProperty(
      '--transition-bezier',
      'cubic-bezier(0.45, 0, 0.2, 1)'
    );
    slider.element.style.setProperty('--slider-transition-duration', '625ms');
  });
}

const startupScreen = (
  <div style={{ backgroundColor: '#000' }}>
    <img
      alt="bojack"
      style={{ width: '50%' }}
      src="/images/series/stranger-things-loader.svg"
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
            title="Netflix &mdash; Stranger Things"
          >
            <AwesomeSlider
              name="images"
              cssModule={[AwsSliderStyles, AnimationStyles]}
              startup={startup}
              animation="foldOutAnimation"
              startupScreen={startupScreen}
              onFirstMount={onFirstMount}
              onResetSlider={resetSlider}
              onTransitionStart={transitionStart}
              onTransitionEnd={transitionEnd}
              tranisionDelay={300}
              organicArrows={context.general['--organicArrows']}
              bullets={context.general['--bullets']}
              fillParent={context.general['--fillParent']}
              media={[
                {
                  style: { backgroundColor: '#fad0ce' },
                  source: '/images/series/stranger-things-5.jpg',
                },
                {
                  style: { backgroundColor: '#5ed6ff' },
                  source: '/images/series/stranger-things-6.jpg',
                },
                {
                  style: { backgroundColor: '#f09297' },
                  source: '/images/series/stranger-things-7.png',
                },
              ]}
            />
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
      title: 'Fold Animation Styles',
      description:
        "For this example we're importing the fold-out-animation style modules.",
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/custom-animations/fold-out-animation.css';

const Slider = (
  <AwesomeSlider animation="foldOutAnimation">
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
        'The animation exit styling on the <b>fold-animation</b> .scss file is pretty straight forward. We just apply the folding translate + rotation on exit moveLeft and exit moveRight classes. Checkout the full style source <a target="_blank" href="https://github.com/rcaferati/react-awesome-slider/tree/master/src/components/fold-out-animation">here</a>.',
      scss: `
.aws-sld {
  --fold-out-perspective: 2000px;
  --fold-out-angle: 90deg;

  &__container {
    perspective: var(--fold-out-perspective);
  }

  &--exit {
    &.aws-sld--moveLeft,
    &.aws-sld--moveRight {
      transform-style: preserve-3d;
    }
    &.aws-sld--moveLeft {
      transform-origin: 100% 50%;
      animation: foldLeft var(--slider-transition-duration) both
        var(--transition-bezier);
    }
    &.aws-sld--moveRight {
      transform-origin: 0% 50%;
      animation: foldRight var(--slider-transition-duration) both
        var(--transition-bezier);
    }
  }
}

@keyframes foldLeft {
  from {
    transform: translate3d(0, 0, 0) rotateY(0deg);
  }
  to {
    transform: translate3d(-100%, 0, 0)
      rotateY(calc(var(--fold-out-angle) * -1));
  }
}

@keyframes foldRight {
  from {
    transform: translate3d(0, 0, 0) rotateY(0deg);
  }
  to {
    transform: translate3d(100%, 0, 0) rotateY(var(--fold-out-angle));
  }
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
