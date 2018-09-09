import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export default class FullScreen extends React.Component {
  static propTypes = {
    onEnter: PropTypes.func,
    onExit: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    children: null,
    className: null,
    disabled: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  getRootClassName() {
    const className = [styles.container];
    if (this.state.active) {
      className.push(styles.active);
    }
    return className.join(' ');
  }

  toggle = () => {
    const state = {};
    if (!this.state.active) {
      if (this.props.onEnter) {
        this.props.onEnter();
      }
      state.active = true;
    }
    if (this.state.active) {
      if (this.props.onExit) {
        this.props.onExit();
      }
      state.active = false;
    }
    this.setState(state);
  }

  render() {
    const {
      children,
    } = this.props;
    return (
      <div
        className={this.getRootClassName()}
      >
        <div className={styles.controls}>
          <button
            onClick={this.toggle}
          >
            {this.state.active ? 'Exit Full-Screen' : 'Enter Full-Screen'}
          </button>
        </div>
        {children}
      </div>
    );
  }
}
