import React from 'react';
import AwesomeSlider from '../../../src/index';
import AwesomeFrame from '../../../src/components/react-awesome-frame';
import AwsSliderStyles from '../../../src/core/react-awesome-slider.scss';
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
  slider.element.style.setProperty('--slider-transition-duration', '700ms');
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
  <div style={{ backgroundColor: '#EFEFEF' }}>
    <img
      alt="bojack"
      src="/images/series/bojack-loader.png"
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
          style={{ backgroundColor: '#2d5182' }}
          data-src="/images/series/bojack-0.png"
        />
        <div
          style={{ backgroundColor: '#5fb7b2' }}
          data-src="/images/series/bojack-2.png"
        />
        <div
          style={{ backgroundColor: '#fcd0a8' }}
          data-src="/images/series/bojack-4.jpg"
        />
      </AwesomeSlider>
    </AwesomeFrame>
  </div>);

const example = {
  title: 'Basic Usage',
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
