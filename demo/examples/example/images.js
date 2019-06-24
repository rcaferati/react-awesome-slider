import React from 'react';
import AwesomeSlider from '../../../src/index';
import AwesomeFrame from '../../../src/components/react-awesome-frame';
import AwsSliderStyles from '../../../src/core/styles.scss';
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
  slider.element.style.setProperty('--slider-transition-duration', '700ms');
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
    <img alt="bojack" src="/images/series/bojack-loader.png" />
  </div>
);

function Component({ startup }) {
  return (
    <AwesomeFrame
      cssModule={AwsFrameStyles}
      title="Netflix &mdash; Bojack Horseman"
    >
      <AwesomeSlider
        name="images"
        startup={startup}
        cssModule={AwsSliderStyles}
        startupScreen={startupScreen}
        onFirstMount={resetSlider}
        onResetSlider={resetSlider}
        onTransitionStart={transitionStart}
        onTransitionEnd={transitionEnd}
      >
        <div
          style={{ backgroundColor: '#2d5182' }}
          data-src="/images/series/bojack-0.png"
        />
        <div
          style={{ backgroundColor: '#5fb7b2' }}
          data-src="/images/series/bojack-2.png"
        />
        <div
          style={{ backgroundColor: '#fcd0a8' }}
          data-src="/images/series/bojack-5.jpg"
        />
      </AwesomeSlider>
    </AwesomeFrame>
  );
}

const example = {
  title: 'Basic Usage',
  items: [
    {
      title: 'Installation',
      command: 'npm install --save react-awesome-slider',
    },
    {
      title: 'Basic Image Example',
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import AwsSliderStyles from 'react-awesome-slider/src/styles.scss';

const slider = (
  <AwesomeSlider cssModule={styles}>
    <div data-src="/path/to/image-0.png" />
    <div data-src="/path/to/image-1.png" />
    <div data-src="/path/to/image-2.jpg" />
  </AwesomeSlider>
);
`,
    },
    {
      title: 'Startup Screen',
      description:
        "The <b>startupScreen</b> prop defines the first screen that's rendered when the component mounts, it works like a pre-load screen. If not defined the component will default to the first child screen or to the screen defined on the <b>selected</b> prop.",
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import AwsSliderStyles from 'react-awesome-slider/src/styles.scss';

const startupScreen = (
  <div>
    <img src="/path/to/image-loader.png" />
  </div>
);

const slider = (
  <AwesomeSlider
    startupScreen={startupScreen}
    cssModule={styles}
  >
    /* ... */
  </AwesomeSlider>
);
      `,
    },
    {
      title: 'Animation hooks',
      description:
        "The three main hooks are <b>onFirstMount</b>, <b>onAnimationStart</b> and <b>onAnimationEnd</b>. They're called with an object containing the component main <b>element</b>, <b>currentIndex</b>, <b>nextIndex</b>, <b>currentScreen</b> and <b>nextScreen</b>",
      jsx: `
const onAnimationStart = ({
  element,
  currentIndex,
  nextIndex,
  currentScreen,
  nextScreen,
}) => {
  /*
    ... do Something
  */
}

/* ... */

const slider = (
  <AwesomeSlider
    cssModule={styles}
    onFirstMount={onFirstMount}
    onAnimationStart={onAnimationStart}
    onAnimationEnd={onAnimationEnd}
  >
    <div data-src="/path/to/image-0.png" />
    <div data-src="/path/to/image-1.png" />
    <div data-src="/path/to/image-2.jpg" />
  </AwesomeSlider>
);
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
