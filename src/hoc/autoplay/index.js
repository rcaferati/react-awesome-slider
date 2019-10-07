import React from 'react';
import AwesomeSlider from 'src';
import Hoc from './hoc';

const AutoplayComponent = Hoc(AwesomeSlider);

export default function(props) {
  return <AutoplayComponent transitionDelay={100} {...props} />;
}
