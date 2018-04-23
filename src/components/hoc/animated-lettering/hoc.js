import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function LetteringHoc(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      screens: PropTypes.array.isRequired,
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
        <WrappedComponent {...this.props}>
          {this.renderScreens()}
        </WrappedComponent>
      );
    }
  };
}
