import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AwesomeSlider from '../../index';
import Styles from './styles.scss';

export default class Lettering extends Component {
  static propTypes = {
    name: PropTypes.string,
    screens: PropTypes.array.isRequired,
    onResetSlider: PropTypes.func,
    onTransitionStart: PropTypes.func,
    onTransitionEnd: PropTypes.func,
    startupScreen: PropTypes.node,
  };
  static defaultProps = {
    name: 'awesome-slider',
    onResetSlider: null,
    onTransitionStart: null,
    onTransitionEnd: null,
    startupScreen: null,
  };

  renderScreens() {
    return this.props.screens.map((screen, index) => (
      <div
        key={`${this.props.name}-screen-${index}`}
        data-src={screen.media}
        style={{
          backgroundColor: screen.backgroundColor,
        }}
      >
        <div className={Styles.caption}>
          <p>{screen.caption}</p>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <AwesomeSlider
        name="lettering"
        cssModule={Styles}
        organicArrows
        transitionDelay={100}
        onFirstMount={this.props.onResetSlider}
        onResetSlider={this.props.onResetSlider}
        onTransitionStart={this.props.onTransitionStart}
        onTransitionEnd={this.props.onTransitionEnd}
        startupScreen={this.props.startupScreen}
      >
        {this.renderScreens()}
      </AwesomeSlider>
    );
  }
}
