import React from 'react';
import Hoc from './hoc';
import AwesomeSlider from '../../../index';

const LetteringComponent = Hoc(AwesomeSlider);

export default function (props) {
  return (
    <LetteringComponent
      transitionDelay={100}
      {...props}
    />
  );
}
