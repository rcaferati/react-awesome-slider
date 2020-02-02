import React from 'react';
import AwesomeSlider from 'src';
import CaptionedHoc from 'src/hoc/captioned-images/hoc';
// import AutoplayHoc from 'src/hoc/autoplay/hoc';
import AwsSliderStyles from 'src/core/styles.scss';
import CaptionedStyles from 'src/hoc/captioned-images/styles.scss';
import AwesomeFrame from 'src/components/react-awesome-frame';
import AwsFrameStyles from 'src/components/react-awesome-frame/styles.scss';
import { shadeRGBColor, transitionEnd, resetSlider } from 'helpers/examples';
import { GeneralContext } from 'context/GeneralContext';
import {
  features,
  properties,
  globalProps,
  // examples,
} from 'examples/common';

// const Slider = AutoplayHoc(AwesomeSlider);
const Captioned = CaptionedHoc(AwesomeSlider);

/**
 * START CUSTOM RESETS
 */
function transitionStart(slider) {
  if (typeof window === 'undefined') {
    return;
  }
  const divs = slider.nextSlide.querySelectorAll('div');
  const color = getComputedStyle(divs[0]).backgroundColor;
  const captionColor = shadeRGBColor(color, -0.2)
    .replace('rgb', 'rgba')
    .replace(')', ', 0.75)');
  const duration =
    parseInt(
      getComputedStyle(slider.element)
        .getPropertyValue('--slider-transition-duration')
        .trim()
        .replace('ms', ''),
      10
    ) - 75;

  window.transitionUpdateTimer = setTimeout(() => {
    slider.element.style.setProperty(
      '--organic-arrow-color',
      shadeRGBColor(color, -0.15)
    );
    slider.element.style.setProperty(
      '--control-bullet-active-color',
      shadeRGBColor(color, -0.15)
    );
    slider.element.style.setProperty(
      '--caption-background-color',
      captionColor
    );
    slider.element.style.setProperty('--control-bullet-color', color);
  }, duration);
}

/**
 * END CUSTOM RESETS
 */

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
    <GeneralContext.Consumer>
      {context => {
        return (
          <AwesomeFrame
            cssModule={AwsFrameStyles}
            title="Adult Swim &mdash; Rick and Morty"
          >
            <Captioned
              startup={startup}
              name="captioned-mixed"
              startupScreen={startupScreen}
              cssModule={[CaptionedStyles, AwsSliderStyles]}
              screens={media}
              onFirstMount={resetSlider}
              onResetSlider={resetSlider}
              onTransitionStart={transitionStart}
              onTransitionEnd={transitionEnd}
              organicArrows={context.general['--organicArrows']}
              bullets={context.general['--bullets']}
              fillParent={context.general['--fillParent']}
            />
          </AwesomeFrame>
        );
      }}
    </GeneralContext.Consumer>
  );
}

const example = {
  title: 'Captioned Images',
  items: [
    {
      title: 'Captioned Component',
      description:
        'For this specific example I\'m using the Captioned component which is a basic styled wrapper hoc that applies a simple caption strategy. You can check out all the available components <a target="_blank" href="https://github.com/rcaferati/react-awesome-slider/tree/master/src/components">here</a>.',
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import withCaption from 'react-awesome-slider/dist/captioned';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/captioned.css';

const CaptionedSlider = withCaption(AwesomeSlider);

const component = (
  <CaptionedSlider
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
    ]}
  />
)
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
