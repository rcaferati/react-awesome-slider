import React from 'react';
import AwesomeFrame from 'src/components/react-awesome-frame';
import 'dist/custom-animations/cube-animation.css';
import AwesomeSlider from 'src';
import AutoplayHoc from 'src/hoc/autoplay/hoc';
import AwsFrameStyles from 'src/components/react-awesome-frame/styles.scss';
import { transitionEnd, transitionStart, resetSlider } from 'helpers/examples';
import { features, properties, globalProps } from 'examples/common';
import { GeneralContext } from 'context/GeneralContext';

const AutoplaySlider = AutoplayHoc(AwesomeSlider);

const startupScreen = (
  <div style={{ backgroundColor: '#0095B7' }}>
    <span style={{ fontSize: '72px', color: 'rgba(0, 0, 0, 0.25)' }}>♪</span>
  </div>
);

function Component({ startup }) {
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
              startupScreen={startupScreen}
              onFirstMount={resetSlider}
              onResetSlider={resetSlider}
              onTransitionStart={transitionStart}
              onTransitionEnd={transitionEnd}
              organicArrows={context.general['--organicArrows']}
              bullets={context.general['--bullets']}
              fillParent={context.general['--fillParent']}
            >
              {/* <div style={{ backgroundColor: '#fff' }}>123</div>
              <div style={{ backgroundColor: '#fff' }}>456</div>
              <div style={{ backgroundColor: '#fff' }}>789</div> */}
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
import AutoplaySlider from 'react-awesome-slider/hoc/autoplay';
import AwesomeSliderStyles from 'react-awesome-slider/src/styled/fold-out-animation.scss';

const Slider = (
  <AutoplaySlider
    play={true}
    cancelOnInteraction={false}
    interval={6000}
    cssModule={AwesomeSliderStyles}
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
  // componentClass: AwsSliderStyles['aws-sld'],
};

export default {
  globalProps,
  features,
  example,
  module,
  properties,
};
