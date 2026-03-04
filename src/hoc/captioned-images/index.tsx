// src/hoc/captioned-images/index.tsx (drop-in replacement)
import React from 'react';
import AwesomeSlider from '../../index';
import Hoc from './hoc';

const CaptionedComponent = Hoc(AwesomeSlider);

type Props = React.ComponentProps<typeof CaptionedComponent>;

export default function CaptionedImages(props: Props) {
  return <CaptionedComponent transitionDelay={100} {...props} />;
}
