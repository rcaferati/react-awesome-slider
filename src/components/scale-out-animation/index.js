import React from 'react';
import AwesomeSlider from '../../index';
import AwsSliderStyles from './styles.scss';

export default function FoldOutAnimation(props) {
  return (
    <AwesomeSlider
      cssModules={AwsSliderStyles}
      {...props}
    />
  );
}
