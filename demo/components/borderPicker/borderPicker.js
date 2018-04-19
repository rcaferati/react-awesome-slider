import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker } from '../index';
import Styles from './borderPicker.scss';

class CustomiseBorder extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    setTransparency: PropTypes.func,
    inputProps: PropTypes.array,
  };
  static defaultProps = {
    value: '',
    onChange: null,
    inputProps: [],
    setTransparency: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      color: '',
      width: 0,
    };
  }

  componentWillReceiveProps(props) {
    if (props.value !== this.props.value) {
      this.setValue(props.value);
    }
  }

  onRangeChange = (event) => {
    const { value } = event.target;
    this.setState({
      width: value,
    }, this.refreshValues);
  }

  onColorChange = (event) => {
    const { value } = event.target;
    this.setState({
      color: value,
    }, this.refreshValues);
  }

  setValue(value) {
    let color = '#FFFFFF';
    let width = 0;
    if (value.match(/px/)) {
      color = value.replace(/(.*)?(#)(.*)(.*)?/, '$2$3');
      width = parseInt(value.replace(/^([0-9]{1,2})(px)(.*)$/, '$1'), 10);
    }
    this.setState({
      color,
      width,
    });
  }

  refreshValues = () => {
    this.props.onChange({
      target: {
        value: `${this.state.width}px solid ${this.state.color}`,
      },
    });
  }

  render() {
    return (
      <div className={Styles.container}>
        <input
          className={Styles.input}
          type="range"
          value={this.state.width}
          onChange={this.onRangeChange}
          max="8"
          {...this.props.inputProps}
        />
        <ColorPicker
          className={Styles.input}
          type="color"
          value={this.state.color}
          onChange={this.onColorChange}
          setTransparency={this.onColorChange}
          {...this.props.inputProps}
        />
      </div>
    );
  }
}

export default CustomiseBorder;
