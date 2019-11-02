import React from 'react';
import AwesomeSlider from 'src/index';
import AwesomeFrame from 'src/components/react-awesome-frame';
import AwsSliderStyles from 'src/core/styles.scss';
import AwsFrameStyles from 'src/components/react-awesome-frame/styles.scss';
import { transitionStart, transitionEnd, resetSlider } from 'helpers/examples';
import { GeneralContext } from 'context/GeneralContext';
import { features, properties, globalProps } from 'examples/common';

function reset(slider) {
  resetSlider(slider, function() {
    slider.element.style.setProperty(
      '--transition-bezier',
      'cubic-bezier(0.45, 0, 0.2, 1)'
    );
    slider.element.style.setProperty('--slider-transition-duration', '700ms');
  });
}

const startupScreen = (
  <div style={{ backgroundColor: '#6978b5' }}>
    <img alt="bojack" src="/images/series/bojack-loader.svg" />
  </div>
);

function Component({ startup }) {
  return (
    <GeneralContext.Consumer>
      {context => {
        return (
          <AwesomeFrame
            cssModule={AwsFrameStyles}
            title="Netflix &mdash; Bojack Horseman"
          >
            <AwesomeSlider
              name="images"
              startup={startup}
              cssModule={AwsSliderStyles}
              startupScreen={startupScreen}
              onFirstMount={reset}
              onResetSlider={reset}
              onTransitionStart={transitionStart}
              onTransitionEnd={transitionEnd}
              organicArrows={context.general['--organicArrows']}
              bullets={context.general['--bullets']}
              fillParent={context.general['--fillParent']}
            >
              <div
                style={{ backgroundColor: '#2d5182' }}
                data-src="/images/series/bojack-0.png"
                onClick={() => {
                  alert('dope')
                }}
              />
              <div
                style={{ backgroundColor: '#62a4fa' }}
                data-src="/images/series/bojack-5.jpg"
              />
              <div
                style={{ backgroundColor: '#f33d42' }}
                data-src="/images/series/bojack-3.jpg"
              />
              <div
                style={{ backgroundColor: '#fafafa' }}
                data-src="/images/series/bojack-4.jpg"
              />
            </AwesomeSlider>
          </AwesomeFrame>
        );
      }}
    </GeneralContext.Consumer>
  );
}

const example = {
  title: 'Basic Usage',
  items: [
    {
      title: 'Installation',
      command: 'npm install --save react-awesome-slider',
    },
    {
      title: 'Basic Image Example',
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import AwsSliderStyles from 'react-awesome-slider/src/styles.scss';

const slider = (
  <AwesomeSlider cssModule={styles}>
    <div data-src="/path/to/image-0.png" />
    <div data-src="/path/to/image-1.png" />
    <div data-src="/path/to/image-2.jpg" />
  </AwesomeSlider>
);
`,
    },
    {
      title: 'Startup Screen',
      description:
        "The <b>startupScreen</b> prop defines the first screen that's rendered when the component mounts, it works like a pre-load screen. If not defined the component will default to the first child screen or to the screen defined on the <b>selected</b> prop.",
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
import AwsSliderStyles from 'react-awesome-slider/src/styles.scss';

const startupScreen = (
  <div>
    <img src="/path/to/image-loader.png" />
  </div>
);

const slider = (
  <AwesomeSlider
    startupScreen={startupScreen}
    cssModule={styles}
  >
    /* ... */
  </AwesomeSlider>
);
      `,
    },
    {
      title: 'Animation hooks',
      description:
        "The three main hooks are <b>onFirstMount</b>, <b>onAnimationStart</b> and <b>onAnimationEnd</b>. They're called with an object containing the component main <b>element</b>, <b>currentIndex</b>, <b>nextIndex</b>, <b>currentScreen</b> and <b>nextScreen</b>",
      jsx: `
const onAnimationStart = ({
  element,
  currentIndex,
  nextIndex,
  currentScreen,
  nextScreen,
}) => {
  /*
    ... do Something
  */
}

/* ... */

const slider = (
  <AwesomeSlider
    cssModule={styles}
    onFirstMount={onFirstMount}
    onAnimationStart={onAnimationStart}
    onAnimationEnd={onAnimationEnd}
  >
    <div data-src="/path/to/image-0.png" />
    <div data-src="/path/to/image-1.png" />
    <div data-src="/path/to/image-2.jpg" />
  </AwesomeSlider>
);
      `,
    },
  ],
  Component,
  componentClass: AwsSliderStyles['aws-sld'],
};

export default {
  globalProps,
  features,
  example,
  module,
  properties,
};
