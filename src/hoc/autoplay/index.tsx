// autoplay/index.tsx (drop-in replacement)
import React from 'react';
import AwesomeSlider from '../../index';
import Hoc from './hoc';

const AutoplayComponent = Hoc(AwesomeSlider);

export type AutoplayProps = React.ComponentProps<typeof AutoplayComponent>;

export default function Autoplay(props: AutoplayProps) {
  return <AutoplayComponent transitionDelay={100} {...props} />;
}
