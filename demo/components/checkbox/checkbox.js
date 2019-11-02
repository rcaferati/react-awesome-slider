import React from 'react';
import Styles from './checkbox.scss';

export default class CheckBox extends React.Component {
  onPress = () => {
    const checked = !this.props.checked;
    this.props.onChange({
      target: {
        checked,
      },
    });
  };

  render() {
    const classnames = [Styles.container];
    if (this.props.checked) {
      classnames.push(Styles.checked);
    }
    return (
      <button onClick={this.onPress} className={classnames.join(' ')}>
        <input
          ref={ref => {
            this.input = ref;
          }}
          type="checkbox"
          defaultChecked={this.props.checked}
        />
      </button>
    );
  }
}
