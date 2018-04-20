export const properties = [
  {
    name: 'General',
    props: [
      {
        name: 'slider-height-percentage',
        type: 'range',
        max: 100,
        min: 10,
        suffix: '%',
      },
      {
        name: 'slider-transition-duration',
        type: 'range',
        min: 200,
        max: 1000,
        suffix: 'ms',
      },
    ],
  },
  {
    name: 'Arrows',
    props: [
      {
        name: 'organic-arrow-thickness',
        type: 'range',
        max: 20,
        min: 1,
        suffix: 'px',
      },
      {
        name: 'organic-arrow-border-radius',
        type: 'range',
        max: 30,
        min: 0,
        suffix: 'px',
      },
      {
        name: 'organic-arrow-height',
        type: 'range',
        max: 80,
        min: 10,
        suffix: 'px',
      },
      {
        name: 'organic-arrow-color',
        type: 'color',
      },
    ],
  },
  {
    name: 'Controls',
    props: [
      {
        name: 'control-button-width',
        type: 'range',
        min: 5,
        max: 40,
        suffix: '%',
      },
      {
        name: 'control-button-height',
        type: 'range',
        min: 25,
        max: 80,
        suffix: '%',
      },
      {
        name: 'control-button-background',
        type: 'color',
      },
      {
        name: 'control-bullet-color',
        type: 'color',
      },
      {
        name: 'control-bullet-active-color',
        type: 'color',
      },
    ],
  },
  {
    name: 'Loader Bar',
    props: [
      {
        name: 'loader-bar-color',
        type: 'color',
      },
      {
        name: 'loader-bar-height',
        type: 'range',
        max: 20,
        min: 1,
        suffix: 'px',
      },
    ],
  },
];

export const features = [
  'Look and feel customisable and extendable via SASS variables and lists',
  'Use it with CSSModules or Plain CSS (NO inline-styles)',
  'Render any tag as the component\'s child (text, icon, img, svg)',
  'Animated progress button',
  'OnClick bubble animation',
];

export function examples() {
  return [
    {
      title: 'Installation',
      command: 'npm install --save react-native-awesome-slider',
    },
    {
      title: 'Import',
      jsx: `
import AwesomeSlider from 'react-awesome-slider';
`,
    },
    {
      title: 'Primary Button',
      jsx: '<AwesomeButton type="primary">Primary</AwesomeButton>',
      component: null,
    },
    {
      title: 'Secondary Progress Button',
      jsx: `
<AwesomeButtonProgress
  type="secondary"
  size="medium"
  action={(element, next) => doSomethingThenCall(next)}
>
  Primary
</AwesomeButtonProgress>`,
      component: null,
    },
    {
      title: 'Multiple Sizes',
      jsx: `
<AwesomeButton
  size="icon"
  type="primary"
>
  <i className="fa fa-codepen" />
</AwesomeButton>
<AwesomeButton
  size="small"
  type="primary"
>
  Small
</AwesomeButton>
<AwesomeButton
  size="small"
  type="primary"
>
  Medium
</AwesomeButton>
<AwesomeButton
  size="small"
  type="primary"
>
  Large
</AwesomeButton>`,
      component: null,
    },
    {
      title: 'Styling with - CSS',
      description: 'For styling with CSS you can access all themes on the /dist folder and append it via <link> or import into your .js or .css files.',
      jsx: 'import \'react-awesome-button/dist/themes/theme-blue.css\';',
    },
    {
      title: 'Styling with - CSS Modules',
      description: 'For styling it through CSS Modules, import the file from the themes folder inside the src. You\'ll need a .scss loader in place in order to build it.',
      jsx: `
import AwesomeButton from 'react-awesome-button/src/components/AwesomeButton';
import styles from 'react-awesome-button/src/styles/themes/theme-blue';

...

function Component() {
  return (
    <AwesomeButton
      cssModule={styles}
      type="primary"
    >
      Primary Blue Themed Button
    </AwesomeButton>
  );
}
`,
    },
  ];
}
