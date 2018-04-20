import React, { Component } from 'react';
import AwesomeSlider from '../../index';
import Styles from './styles.scss';

export default class AnimateOutScaling extends Component {
  state = {};
  render() {
    return (
      <AwesomeSlider
        cssModules={Styles}
        {...this.props}
      />
    );
  }
}
