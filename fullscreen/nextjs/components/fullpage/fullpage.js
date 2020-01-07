import React, { useRef, useState } from 'react';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/custom-animations/fold-out-animation.css';
import { withNavigationHandlers } from 'react-awesome-slider/dist/navigation';
import { media } from './media';
import Startup from '../startup/startup';
// DATA/MEDIA

const Slider = withNavigationHandlers(AwesomeSlider);

export default () => {
  const isFirstLoad = useRef(true);

  return (
    <Slider
      startupScreen={<Startup />}
      startupDelay={300}
      className="awesome-slider"
      onTransitionEnd={() => {
        // HANDLE THE PAGE ELEMENTS ANIMATION ON FIRST TRANSITION END
        if (isFirstLoad.current === true) {
          document.querySelector('body').classList.add('visible');
        }
      }}
      media={media}
    />
  );
};
