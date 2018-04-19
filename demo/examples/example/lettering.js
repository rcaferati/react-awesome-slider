import React from 'react';
import AwesomeFrame from '../../../src/components/react-awesome-frame';
import Lettering from '../../../src/components/animated-lettering';
import LetteringStyles from '../../../src/components/animated-lettering/styles.scss';
import AwsFrameStyles from '../../../src/components/react-awesome-frame/styles.scss';
import { shadeRGBColor } from '../../helpers/examples';
import {
  features,
  properties,
} from '../common';

const screens = [
  {
    backgroundColor: 'Tomato',
    children: [
      'And so it is ♪',
      'Just like you said it would be',
    ],
  },
  {
    backgroundColor: 'ForestGreen',
    children: [
      'Life goes easy on me',
      'Most of the time ♪',
    ],
  },
  {
    backgroundColor: 'DarkTurquoise',
    children: [
      'And so it is the shorter story',
      'No love, no glory ♪',
    ],
  },
  {
    backgroundColor: 'Chocolate',
    children: [
      'No hero in her sky',
      '♪ ♪ ♪',
    ],
  },
];

function resetSlider(slider) {
  clearTimeout(window.transitionUpdateTimer);
  const divs = slider.currentSlide.querySelectorAll('div');
  const color = getComputedStyle(divs[0]).backgroundColor;
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

const component = (
  <div>
    <AwesomeFrame
      cssModule={AwsFrameStyles}
      title="Blower's Daughter ♪"
    >
      <Lettering
        cssModyle={LetteringStyles}
        transitionStart={transitionStart}
        transitionEnd={transitionEnd}
        resetSlider={resetSlider}
        screens={screens}
      />
    </AwesomeFrame>
  </div>
);

const example = {
  title: 'Smooth Lettering',
  items: [],
  component,
  componentClass: LetteringStyles['aws-sld'],
};

export default {
  features,
  example,
  module,
  properties,
};
