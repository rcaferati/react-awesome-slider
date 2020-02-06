import React, { useState, useEffect } from 'react';
import AwesomeFrame from 'src/components/react-awesome-frame';
import AwesomeSlider from 'src';
import AutoplayHoc from 'src/hoc/autoplay/hoc';
import AwsSliderStyles from 'src/core/styles.scss';
import AwsFrameStyles from 'src/components/react-awesome-frame/styles.scss';
import { transitionEnd, transitionStart, resetSlider } from 'helpers/examples';
import { features, properties, globalProps } from 'examples/common';
import { GeneralContext } from 'context/GeneralContext';

const AutoplaySlider = AutoplayHoc(AwesomeSlider);

const slides = [
  {
    backgroundColor: '#2d5182',
    src: '/images/series/bojack-0.png',
  },
  {
    backgroundColor: '#5fb7b2',
    src: '/images/series/bojack-2.png',
  },
  {
    backgroundColor: '#fcd0a8',
    src: '/images/series/bojack-5.jpg',
  },
];

const startupScreen = (
  <div style={{ backgroundColor: '#0095B7' }}>
    <span style={{ fontSize: '72px', color: 'rgba(0, 0, 0, 0.25)' }}>♪</span>
  </div>
);

function Component({ startup }) {
  const [render, setRender] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRender(true);
    }, 250);
  }, []);

  const renderSlides = () => {
    return slides.map(slide => {
      return (
        <div
          key={slide.src}
          style={{ backgroundColor: slide.backgroundColor }}
          data-src={slide.src}
        />
      );
    });
  };
  return (
    <GeneralContext.Consumer>
      {context => {
        return (
          <AwesomeFrame cssModule={AwsFrameStyles} title="Autoplay Component">
            <AutoplaySlider
              name="autoplay"
              play
              cancelOnInteraction={false}
              interval={6000}
              startup={startup}
              cssModule={AwsSliderStyles}
              animation="cubeAnimation"
              startupScreen={startupScreen}
              onFirstMount={resetSlider}
              onResetSlider={resetSlider}
              onTransitionStart={transitionStart}
              onTransitionEnd={transitionEnd}
              organicArrows={context.general['--organicArrows']}
              bullets={context.general['--bullets']}
              fillParent={context.general['--fillParent']}
            >
              {render && renderSlides()}
            </AutoplaySlider>
          </AwesomeFrame>
        );
      }}
    </GeneralContext.Consumer>
  );
}

const example = {
  title: 'Autoplay HOC',
  items: [
    {
      title: 'Autoplay HOC',
      description: `For this example we're importing the Autplay HOC that can be imported from de HOC folder. You can checkout it's full source <a target="_blank" href="https://github.com/rcaferati/react-awesome-slider/tree/master/src/hoc/autoplay/hoc.js">here</a>.`,
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';

const AutoplaySlider = withAutoplay(AwesomeSlider);

const Slider = (
  <AutoplaySlider
    play={true}
    cancelOnInteraction={false}
    interval={6000}
  >
    <div data-src="/path/to/image-0.jpg" />
    <div data-src="/path/to/image-1.jpg" />
    <div data-src="/path/to/image-2.jpg" />
    <div data-src="/path/to/image-3.jpg" />
  </AutoplaySlider>
);
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
