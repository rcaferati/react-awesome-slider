import React from 'react';
import AwesomeSlider from '../../index';
import Hoc from './hoc';

const CaptionedComponent = Hoc(AwesomeSlider);

export default function(props) {
  return <CaptionedComponent transitionDelay={100} {...props} />;
}
