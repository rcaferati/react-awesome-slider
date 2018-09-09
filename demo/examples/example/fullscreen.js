import React from 'react';
import AwsSliderStyles from '../../../src/components/styled/fold-out-animation/styles.scss';
import LetteringStyles from '../../../src/components/hoc/animated-lettering/styles.scss';
import FullScreen from '../../../src/components/wrapper/full-screen';
import AwesomeFrame from '../../../src/components/wrapper/awesome-frame';
import Lettering from '../../../src/components/hoc/animated-lettering';
import AwsFrameStyles from '../../../src/components/wrapper/awesome-frame/styles.scss';
import { shadeRGBColor } from '../../helpers/examples';
import {
  features,
  properties,
  // examples,
} from '../common';

const screens = [
  {
    backgroundColor: 'INDIANRED',
    children: [
      'On the first part of the journey ♪',
      'I was looking at all the life',
    ],
  },
  {
    backgroundColor: 'LIGHTSTEELBLUE',
    children: [
      'There were plants and birds and rocks and things',
      'There was sand and hills and rings ♪',
    ],
  },
  {
    backgroundColor: 'LIGHTGREEN',
    children: [
      'The first thing I met was a fly with a buzz',
      'And the sky with no clouds ♪',
    ],
  },
  {
    backgroundColor: 'PALETURQUOISE',
    children: [
      'The heat was hot and the ground was dry',
      'But the air was full of sound',
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
  slider.element.style.setProperty('--slider-transition-duration', '525ms');
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
  <div style={{ backgroundColor: 'ALICEBLUE' }}>
    <span style={{ fontSize: '72px', color: 'rgba(0, 0, 0, 0.25)' }}>♪</span>
  </div>
);

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      startup,
    } = this.props;

    return (
      <FullScreen
        onEnter={() => {
          document.documentElement.style.setProperty('--customiser-transform', '500px');
        }}
        onExit={() => {
          document.documentElement.style.setProperty('--customiser-transform', '0px');
        }}
        title="Netflix &mdash; Stranger Things"
      >
        <AwesomeFrame
          cssModule={AwsFrameStyles}
          title="Netflix &mdash; Bojack Horseman"
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
      </FullScreen>
    );
  }
}

const example = {
  title: 'Full Screen',
  items: [
    {
      title: 'Full Screen Wrapper Component',
      description: 'The animation out styling is pretty simple. We just apply the folding with translate + rotation on exit moveLeft and exit moveRight classes. Checkout this component\'s source <a target="_blank" href="https://github.com/rcaferati/react-awesome-slider/tree/master/src/components/fold-out-animation">here</a>.',
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
