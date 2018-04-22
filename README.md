# &lt;AwesomeSlider /&gt;

[![Travis](https://img.shields.io/travis/rcaferati/react-awesome-slider/master.svg)](https://travis-ci.org/rcaferati/react-awesome-slider) ![NPM](https://img.shields.io/npm/v/react-awesome-slider.svg)

`react-awesome-button` is a 60fps, extendable, highly customisable, production ready React Component that renders a media (image/video) gallery slider/carousel.

## Live demo

+ <a title="Live demo" href="https://caferati.me/demo/react-awesome-slider" target="_blank">On my portfolio</a>

[<img width="400" alt="react-awesome-slider demo" src="https://github.com/rcaferati/react-awesome-slider/blob/master/demo/public/images/demo-lettering.gif?raw=true">](https://caferati.me/demo/react-awesome-slider)
[<img width="400" alt="react-awesome-slider demo" src="https://github.com/rcaferati/react-awesome-slider/blob/master/demo/public/images/demo-bojack.gif?raw=true">](https://caferati.me/demo/react-awesome-slider)

[<img width="400" alt="react-awesome-slider demo" src="https://github.com/rcaferati/react-awesome-slider/blob/master/demo/public/images/demo-south-park.gif?raw=true">](https://caferati.me/demo/react-awesome-slider)
[<img width="400" alt="react-awesome-slider demo" src="https://github.com/rcaferati/react-awesome-slider/blob/master/demo/public/images/demo-stranger.gif?raw=true">](https://caferati.me/demo/react-awesome-slider)

### Touch enabled

[<img width="400" alt="react-awesome-slider demo" src="https://github.com/rcaferati/react-awesome-slider/blob/master/demo/public/images/demo-bojack-mobile.gif?raw=true">](https://caferati.me/demo/react-awesome-slider)

## Install

## Examples

### With react-awesome-button and plain CSS
```jsx
  import { AwesomeSlider } from 'react-awesome-slider';
  import 'react-awesome-slider/dist/styles.css';

  function Button() {
    return (
      <AwesomeSlider
        media={[]}
        type="iOS"
      />
    );
  }
```

### With react-awesome-button CSS Modules
```jsx
  import AwesomeButton from 'react-awesome-button';
  import AwesomeButtonStyles from 'react-awesome-button/src/styles.scss'

  function Button() {
    return (
      <AwesomeSlider
        media={[]}
        type="iOS"
      />
    );
  }
```

## Contributions wanted
If you have an idea for a missing feature or animation just craft your own `hoc feature` or `animation style` and send it up via PR to the `src/components` folder.

## Key Features

+ Look and feel customisable and extendable via SASS and CSS Variables (custom-properties) ([scss main file](https://github.com/rcaferati/react-awesome-slider/blob/master/src/styles))
+ Media pre-loader
+ Touch enabled
+ 60fps animations
+ Animated transition recipes
+ Extendable via custom plugin HOC components

## Author
#### Rafael Caferati
+ Checkout my <a href="https://caferati.me" title="Full-Stack Web Developer, UI/UX Javascript Specialist" target="_blank">Full-Stack Web Developer Website</a>
+ Other open source projects @ <a title="Web Software Developer Code Laboratory" target="_blank" href="https://caferati.me/labs">Code Laboratory</a>
+ A scope of my work @ <a title="Web Software Developer Portfolio" target="_blank" href="https://caferati.me/portfolio">Web Portfolio</a>

## License

MIT. Copyright (c) 2017 Rafael Caferati.
