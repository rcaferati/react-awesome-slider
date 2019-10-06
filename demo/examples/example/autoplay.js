import React from 'react';
import AwesomeFrame from 'src/components/react-awesome-frame';
import AwsSliderStyles from 'src/components/styled/scale-out-animation/styles.scss';
import AutoplaySlider from 'src/components/hoc/autoplay';
import LetteringStyles from 'src/components/hoc/animated-lettering/styles.scss';
import AwsFrameStyles from 'src/components/react-awesome-frame/styles.scss';
import { transitionEnd, transitionStart, resetSlider } from 'helpers/examples';
import { features, properties, globalProps } from 'examples/common';
import { GeneralContext } from 'context/GeneralContext';

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
              cssModule={AwsSliderStyles}
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
  Component,
  componentClass: LetteringStyles['aws-sld'],
};

export default {
  globalProps,
  features,
  example,
  module,
  properties,
};
