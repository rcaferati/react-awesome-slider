import React from 'react';
import AwesomeSlider from '../../index';
import Hoc from './hoc';

const LetteringComponent = Hoc(AwesomeSlider);

export default function(props) {
  return <LetteringComponent transitionDelay={100} {...props} />;
}
