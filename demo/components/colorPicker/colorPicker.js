import React from 'react';
import PropTypes from 'prop-types';
import Styles from './colorPicker.scss';

class ColorPicker extends React.Component {
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

  setTransparency = () => {
    this.props.onChange({
      target: {
        value: 'transparent',
      },
    });
  }

  render() {
    return (
      <div className={Styles.container}>
        <input
          className={Styles.input}
          type="color"
          value={this.props.value}
          onChange={this.props.onChange}
          {...this.props.inputProps}
        />
        <button
          title="Transparent"
          onClick={this.setTransparency}
        />
      </div>
    );
  }
}

export default ColorPicker;
