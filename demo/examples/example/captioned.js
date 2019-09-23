import React from 'react';
import Captioned from '../../../src/components/hoc/captioned-images';
import CaptionedStyles from '../../../src/components/hoc/captioned-images/styles.scss';
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
  const divs = slider.currentSlide.querySelectorAll('div');
  const color = getComputedStyle(divs[0]).backgroundColor;
  slider.element.style.setProperty(
    '--transition-bezier',
    'cubic-bezier(0.45, 0, 0.2, 1)'
  );
  slider.element.style.setProperty('--slider-transition-duration', '770ms');
  slider.element.style.setProperty('--slider-height-percentage', '60%');
  slider.element.style.setProperty(
    '--caption-background-color',
    shadeRGBColor(color, -0.2)
  );
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
  const captionColor = shadeRGBColor(color, -0.2)
    .replace('rgb', 'rgba')
    .replace(')', ', 0.75)');
  slider.element.style.setProperty(
    '--organic-arrow-color',
    shadeRGBColor(color, -0.15)
  );
  slider.element.style.setProperty('--caption-background-color', captionColor);
  window.setElement(slider.element);
}

const media = [
  {
    backgroundColor: '#4a9c8c',
    media: '/images/series/ricknmorty-3.png',
    caption: 'I want to see what you got.',
  },
  {
    backgroundColor: '#463277',
    media: '/images/series/ricknmorty-1.jpg',
    caption: "The answer is -- Don't think about it.",
  },
  {
    backgroundColor: '#faf3d5',
    media: '/images/series/ricknmorty-4.jpg',
    caption: 'Sometimes science is more art than science.',
  },
  {
    backgroundColor: '#9a9a9a',
    media: '/images/series/ricknmorty-2.jpg',
    caption: 'Love, connection, experience.',
  },
];

const startupScreen = (
  <div style={{ backgroundColor: '#85d4b9' }}>
    <img
      style={{ width: '20%' }}
      alt="Rick and Morty Loader"
      src="/images/series/ricknmorty-loader.png"
    />
  </div>
);

function Component({ startup }) {
  return (
    <div>
      <AwesomeFrame
        cssModule={AwsFrameStyles}
        title="Adult Swim &mdash; Rick and Morty"
      >
        <Captioned
          startup={startup}
          name="captioned-mixed"
          startupScreen={startupScreen}
          cssModule={CaptionedStyles}
          screens={media}
          onFirstMount={resetSlider}
          onResetSlider={resetSlider}
          onTransitionStart={transitionStart}
          onTransitionEnd={transitionEnd}
        />
      </AwesomeFrame>
    </div>
  );
}

const example = {
  title: 'Captioned Images',
  items: [
    {
      title: 'Basic Children Usage',
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import AwsSliderStyles from 'react-awesome-slider/src/styles.scss';

const slider = (
  <AwesomeSlider cssModule={styles}>
    <div data-src="/path/to/image.jpg">
      <p>I want to see what you got.</p>
    </div>
    <div data-src="/path/to/image.jpg">
      <p>The answer is -- Don't think about it.</p>
    </div>
    <div data-src="/path/to/image.jpg">
      <p>Sometimes science is more art than science.</p>
    </div>
    <div data-src="/path/to/image.jpg">
      <p>Love, connection, experience.</p>
    </div>
  </AwesomeSlider>
);
      `,
    },
    {
      title: 'Captioned Component',
      description:
        'For this specific example I\'m using the Captioned component which is a basic styled wrapper hoc that applies a simple caption strategy. You can check out all the available components <a target="_blank" href="https://github.com/rcaferati/react-awesome-slider/tree/master/src/components">here</a>.',
      jsx: `
import Captioned from 'react-awesome-slider/src/components/captioned';
import CaptionedStyles from 'react-awesome-slider/src/components/captioned/styles.scss';

const component = (
  <Captioned
    startupScreen={StartupScreen}
    cssModule={CaptionedStyles}
    screens={[
      {
        backgroundColor: '#4a9c8c',
        media: '/images/series/ricknmorty-3.png',
        caption: 'I want to see what you got.',
      },
      {
        backgroundColor: '#4a9c8c',
        media: '/images/series/ricknmorty-3.png',
        caption: 'The answer is -- Don't think about it.',
      },
      // ...
    ]}
  />
)
      `,
    },
  ],
  Component,
  componentClass: CaptionedStyles['aws-sld'],
};

export default {
  features,
  example,
  module,
  properties,
};
