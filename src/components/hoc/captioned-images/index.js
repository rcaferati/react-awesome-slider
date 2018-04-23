import React from 'react';
import Hoc from './hoc';
import AwesomeSlider from '../../../index';

const CaptionedComponent = Hoc(AwesomeSlider);

export default function (props) {
  return (
    <CaptionedComponent
      transitionDelay={100}
      {...props}
    />
  );
}
