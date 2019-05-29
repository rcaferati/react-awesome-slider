import React from 'react';
import AwesomeSlider from '../../../src';
import AwsSliderStyles from '../../../src/components/styled/scale-out-animation/styles.scss';
import AwesomeFrame from '../../../src/components/react-awesome-frame';
import AwsFrameStyles from '../../../src/components/react-awesome-frame/styles.scss';
import { shadeRGBColor } from '../../helpers/examples';
import { features, properties } from '../common';

function resetSlider(slider) {
  clearTimeout(window.transitionUpdateTimer);
  slider.element.style.setProperty(
    '--transition-bezier',
    'cubic-bezier(0.45, 0, 0.2, 1)'
  );
  slider.element.style.setProperty('--slider-transition-duration', '670ms');
  slider.element.style.setProperty('--organic-arrow-thickness', '6px');
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
  <div style={{ backgroundColor: '#EFEFEF' }}>
    <img alt="south park" src="/images/series/south-park-loader.png" />
  </div>
);

function Component({ startup }) {
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
        onFirstMount={resetSlider}
        onResetSlider={resetSlider}
        onTransitionStart={transitionStart}
        onTransitionEnd={transitionEnd}
      >
        <div
          style={{ backgroundColor: '#a3b9d0' }}
          data-src="/images/series/south-park-1.jpg"
        />
        <div
          style={{ backgroundColor: '#f46b34' }}
          data-src="/images/series/south-park-2.jpg"
        />
        <div
          style={{ backgroundColor: '#d63b6b' }}
          data-src="/images/series/south-park-3.jpg"
        />
        <div
          style={{ backgroundColor: '#d63b6b' }}
          data-src="/images/series/south-park-0.jpg"
        />
      </AwesomeSlider>
    </AwesomeFrame>
  );
}

const example = {
  title: 'Scale Animation',
  items: [
    {
      title: 'Scale Animation Styles',
      description:
        "For this example I'm using the ScaleOutAnimation component ",
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import AwesomeSliderStyles from 'react-awesome-slider/src/components/scale-out-animation/styles.scss';

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
      title: 'ScaleOutAnimation Styles',
      description:
        'The animation out styling on the <b>scale-out-animation</b> .scss file is pretty simple. We just apply the scaling down on exit moveLeft and exit moveRight classes of the current box container.',
      scss: `
.aws-slr {
  &--exit {
    &.aws-slr--moveLeft {
      transform: scale(0.85);
    }
    &.aws-slr--moveRight {
      transform: scale(0.85);
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
