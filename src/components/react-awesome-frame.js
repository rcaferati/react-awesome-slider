import React from 'react';
import PropTypes from 'prop-types';

export default class AwesomeFrame extends React.Component {
  static propTypes = {
    cssModule: PropTypes.object,
    children: PropTypes.node,
  };
  static defaultProps = {
    cssModule: null,
    children: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      fuck: true,
    };
  }
  render() {
    const {
      children,
    } = this.props;
    return (
      <div
        data-whatever={this.state.fuck}
      >
        {children}
      </div>
    );
  }
}
