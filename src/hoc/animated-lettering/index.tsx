// hoc/animated-lettering/index.tsx
import React from 'react';
import AwesomeSlider from '../../index';
import Hoc from './hoc';

const LetteringComponent = Hoc(AwesomeSlider);

type Props = React.ComponentProps<typeof LetteringComponent>;

export default function Lettering(props: Props) {
  return <LetteringComponent transitionDelay={100} {...props} />;
}
