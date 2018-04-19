import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AwesomeSlider from '../../index';
import AwsSliderStyles from './styles.scss';

export default class Lettering extends Component {
  static propTypes = {
    name: PropTypes.string,
    screens: PropTypes.array.isRequired,
    resetSlider: PropTypes.func,
    transitionStart: PropTypes.func,
    transitionEnd: PropTypes.func,
  };
  static defaultProps = {
    name: 'awesome-slider',
    resetSlider: null,
    transitionStart: null,
    transitionEnd: null,
  };

  renderScreens() {
    return this.props.screens.map((screen, index) => (
      <div
        key={`${this.props.name}-screen-${index}`}
        style={{
          backgroundColor: screen.backgroundColor,
        }}
      >
        {screen.children.map((text, tIndex) => <p key={`${this.props.name}${index}-text-${tIndex}`}>{text}</p>)}
      </div>
    ));
  }

  render() {
    return (
      <AwesomeSlider
        name="lettering"
        cssModule={AwsSliderStyles}
        organicArrows
        transitionDelay={100}
        firstMount={this.props.resetSlider}
        onResetSlider={this.props.resetSlider}
        transitionStart={this.props.transitionStart}
        transitionEnd={this.props.transitionEnd}
      >
        {this.renderScreens()}
      </AwesomeSlider>
    );
  }
}
