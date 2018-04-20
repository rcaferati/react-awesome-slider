import React, { Component } from 'react';
import AwesomeSlider from '../../index';
import AwsSliderStyles from './styles.scss';

export default class FoldOutAnimation extends Component {
  state = {};
  render() {
    return (
      <AwesomeSlider
        cssModules={AwsSliderStyles}
        {...this.props}
      />
    );
  }
}
