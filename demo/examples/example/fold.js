import React from 'react';
import AwesomeSlider from '../../../src';
import AwsSliderStyles from '../../../src/components/styled/fold-out-animation/styles.scss';
import AwesomeFrame from '../../../src/components/react-awesome-frame';
import AwsFrameStyles from '../../../src/components/react-awesome-frame/styles.scss';
import { shadeRGBColor } from '../../helpers/examples';

import {
  features,
  properties,
  // examples,
} from '../common';

function resetSlider(slider) {
  clearTimeout(window.transitionUpdateTimer);
  slider.element.style.setProperty(
    '--transition-bezier',
    'cubic-bezier(0.45, 0, 0.2, 1)'
  );
  slider.element.style.setProperty('--slider-transition-duration', '770ms');
  window.setElement(slider.element);
}

function transitionStart(slider) {
  const divs = slider.nextSlide.querySelectorAll('div');
  const color = getComputedStyle(divs[0]).backgroundColor;

  window.transitionUpdateTimer = setTimeout(() => {
    slider.element.style.setProperty(
      '--control-bullet-active-color',
      shadeRGBColor(color, -0.15)
    );
    slider.element.style.setProperty('--control-bullet-color', color);
  }, 400);
}

function transitionEnd(slider) {
  const divs = slider.currentSlide.querySelectorAll('div');
  const color = getComputedStyle(divs[0]).backgroundColor;

  slider.element.style.setProperty(
    '--organic-arrow-color',
    shadeRGBColor(color, -0.15)
  );
  window.setElement(slider.element);
}

const startupScreen = (
  <div style={{ backgroundColor: '#000' }}>
    <img alt="bojack" src="/images/series/stranger-things-loader.jpg" />
  </div>
);

function Component({ startup }) {
  return (
    <AwesomeFrame
      cssModule={AwsFrameStyles}
      title="Netflix &mdash; Stranger Things"
    >
      <AwesomeSlider
        name="images"
        cssModule={AwsSliderStyles}
        startup={startup}
        // fillParent
        startupScreen={startupScreen}
        onFirstMount={resetSlider}
        onResetSlider={resetSlider}
        onTransitionStart={transitionStart}
        onTransitionEnd={transitionEnd}
      >
        <div
          style={{ backgroundColor: '#fad0ce' }}
          data-src="/images/series/stranger-things-4.jpg"
        />
        <div
          style={{ backgroundColor: '#5ed6ff' }}
          data-src="/images/series/stranger-things-3.jpg"
        />
        <div
          style={{ backgroundColor: '#f09297' }}
          data-src="/images/series/stranger-things-2.jpg"
        />
      </AwesomeSlider>
    </AwesomeFrame>
  );
}

const example = {
  title: 'Fold Animation',
  items: [
    {
      title: 'Styling the fold animation',
      description:
        'The animation out styling is pretty simple. We just apply the folding with translate + rotation on exit moveLeft and exit moveRight classes. Checkout this component\'s source <a target="_blank" href="https://github.com/rcaferati/react-awesome-slider/tree/master/src/components/fold-out-animation">here</a>.',
      scss: `
.aws-sld {
  &__container {
    perspective: 2000px;
  }
  &--exit {
    &.aws-sld--moveLeft, &.aws-sld--moveRight {
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }
    &.aws-sld--moveLeft {
      transform-origin: 100% 50%;
      transform: translate3d(-100%, 0, 0) rotateY(-90deg);
    }
    &.aws-sld--moveRight {
      transform-origin: 0% 50%;
      transform: translate3d(100%, 0, 0) rotateY(90deg);
    }
  }
}
      `,
    },
  ],
  Component,
  componentClass: AwsSliderStyles['aws-sld'],
};

export default {
  features,
  example,
  module,
  properties,
};
