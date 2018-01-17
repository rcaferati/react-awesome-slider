import React from 'react';
import {
  AwesomeSlider,
} from '../index';
import AwsSliderStyles from '../styles.scss';

const features = [
  'Look and feel customisable and extendable via SASS variables and lists',
];

const examples = [
  {
    title: 'Awesome Slider',
    description: 'Performant, extendable, highly customisable, production ready React Component that renders a media (image/video) gallery slider/carousel.',
    jsx: `
<AwesomeSlider
  cssModule={AwsSliderStyles}
  media={[
    {
      url: '',
    },
  ]}
/>`,
    button: (
      <div>
        <AwesomeSlider
          cssModule={AwsSliderStyles}
          media={[
            {
              url: '',
            },
          ]}
        />
      </div>),
  },
];

export default {
  name: 'AwesomeButton',
  title: 'React Components are awesome',
  description: 'The AwesomeButton is a performant, extendable, highly customisable, production ready react component that renders an animated basic set of UI buttons.',
  size: '~6KB compressed',
  repository: 'https://github.com/rcaferati/react-awesome-button',
  article: '//caferati.me/labs/awesome-button',
  features,
  examples,
};
