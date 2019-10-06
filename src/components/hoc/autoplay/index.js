import React from 'react';
import Hoc from './hoc';
import AwesomeSlider from '../../../index';

const AutoplayComponent = Hoc(AwesomeSlider);

export default function(props) {
  return <AutoplayComponent transitionDelay={100} {...props} />;
}
