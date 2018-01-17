import React from 'react';
import PropTypes from 'prop-types';

export default class AwesomeSlider extends React.Component {
  static propTypes = {
    cssModule: PropTypes.object,
  };
  static defaultProps = {
    cssModule: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      fuck: true,
    };
  }
  render() {
    return (
      <div
        data-whatever={this.state.fuck}
      >
        123
      </div>
    );
  }
}
