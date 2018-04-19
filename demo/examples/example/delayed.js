import React from 'react';
import AwesomeSlider from '../../../src/components/delayed-out-animation';
import AwsSliderStyles from '../../../src/components/delayed-out-animation/styles.scss';
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
  slider.element.style.setProperty('--transition-bezier', 'cubic-bezier(0.45, 0, 0.2, 1)');
  slider.element.style.setProperty('--slider-transition-duration', '770ms');
  slider.element.style.setProperty('--organic-arrow-color', shadeRGBColor(color, -0.2));
  slider.element.style.setProperty('--control-bullet-active-color', shadeRGBColor(color, -0.2));
  slider.element.style.setProperty('--control-bullet-color', color);
  window.setElement(slider.element);
}

function transitionStart(slider) {
  const divs = slider.nextSlide.querySelectorAll('div');
  const color = getComputedStyle(divs[0]).backgroundColor;
  window.transitionUpdateTimer = setTimeout(() => {
    slider.element.style.setProperty('--control-bullet-active-color', shadeRGBColor(color, -0.15));
    slider.element.style.setProperty('--control-bullet-color', color);
  }, 400);
}

function transitionEnd(slider) {
  const divs = slider.currentSlide.querySelectorAll('div');
  const color = getComputedStyle(divs[0]).backgroundColor;
  slider.element.style.setProperty('--organic-arrow-color', shadeRGBColor(color, -0.15));
  window.setElement(slider.element);
}

const startupScreen = (
  <div style={{ backgroundColor: '#000' }}>
    <img
      alt="bojack"
      src="/images/series/stranger-things-loader.jpg"
    />
  </div>
);

const component = (
  <div>
    <AwesomeFrame
      cssModule={AwsFrameStyles}
      title="Netflix's Bojack Horseman"
    >
      <AwesomeSlider
        name="images"
        cssModule={AwsSliderStyles}
        organicArrows
        startupScreen={startupScreen}
        firstMount={resetSlider}
        onResetSlider={resetSlider}
        transitionStart={transitionStart}
        transitionEnd={transitionEnd}
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
  </div>);

const example = {
  title: 'Fold Animation',
  items: [],
  component,
  componentClass: AwsSliderStyles['aws-sld'],
};

export default {
  features,
  example,
  module,
  properties,
};
