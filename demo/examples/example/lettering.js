import React from 'react';
import AwesomeFrame from '../../../src/components/react-awesome-frame';
import Lettering from '../../../src/components/hoc/animated-lettering';
import LetteringStyles from '../../../src/components/hoc/animated-lettering/styles.scss';
import AwsFrameStyles from '../../../src/components/react-awesome-frame/styles.scss';
import { shadeRGBColor } from '../../helpers/examples';
import { features, properties } from '../common';

const screens = [
  {
    backgroundColor: 'Tomato',
    children: ['And so it is ♪', 'Just like you said it would be'],
  },
  {
    backgroundColor: 'ForestGreen',
    children: ['Life goes easy on me', 'Most of the time ♪'],
  },
  {
    backgroundColor: 'DarkTurquoise',
    children: ['And so it is the shorter story', 'No love, no glory ♪'],
  },
  {
    backgroundColor: 'Chocolate',
    children: ['No hero in her sky', '♪ ♪ ♪'],
  },
];

function resetSlider(slider) {
  clearTimeout(window.transitionUpdateTimer);
  slider.element.style.setProperty('--slider-transition-duration', '525ms');
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
  <div style={{ backgroundColor: '#0095B7' }}>
    <span style={{ fontSize: '72px', color: 'rgba(0, 0, 0, 0.25)' }}>♪</span>
  </div>
);

function Component({ startup }) {
  return (
    <AwesomeFrame
      cssModule={AwsFrameStyles}
      title="Damien Rice &mdash; Blower's Daughter ♪"
    >
      <Lettering
        name="lettering"
        startup={startup}
        cssModule={LetteringStyles}
        startupScreen={startupScreen}
        onTransitionStart={transitionStart}
        onTransitionEnd={transitionEnd}
        onResetSlider={resetSlider}
        onFirstMount={resetSlider}
        screens={screens}
      />
    </AwesomeFrame>
  );
}

const example = {
  title: 'Smooth Lettering',
  items: [
    {
      title: 'Content Animation',
      description:
        "As with the component's <b>container</b>, the <b>content</b> element also has it's own <b>moveRight</b> and <b>moveLeft</b> animation classes. You can use them to control the behaviour of the entering and exiting children elements.",
      scss: `
.aws-sld {
  &__content {
    p {
      transform: translate3d(0, 0, 0);
      opacity: 1;
      transition: transform 0.45s cubic-bezier(0.15, 0.3, 0.15, 1), opacity 0.35s ease-out;
    }
    p:nth-child(2) {
      transition-delay: 0.05s, 0.05s;
    }
    &--exit {
      p {
        transition: transform 0.225s cubic-bezier(0.85, 0, 0.85, 0.7), opacity 0.4s ease-out;
      }
      p:nth-child(2) {
        transition-delay: 0.05s, 0.05s;
      }
    }
    &--moveLeft {
      p {
        transform: translate3d(-50px, 0, 0);
        opacity: 0;
      }
    }
    &--moveRight {
      p {
        transform: translate3d(50px, 0, 0);
        opacity: 0;
      }
    }
  }
}
      `,
    },
  ],
  Component,
  componentClass: LetteringStyles['aws-sld'],
};

export default {
  features,
  example,
  module,
  properties,
};
