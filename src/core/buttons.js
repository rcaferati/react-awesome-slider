import React from 'react';
import PropTypes from 'prop-types';
import { getClassName } from '../helpers/components';

export default class Buttons extends React.Component {
  static propTypes = {
    cssModule: PropTypes.object,
    rootElement: PropTypes.string.isRequired,
    onMount: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    organicArrows: PropTypes.bool,
  };

  static defaultProps = {
    cssModule: null,
    organicArrows: true,
  };

  componentDidMount() {
    this.props.onMount({
      element: this.controls,
      next: this.next,
      prev: this.prev,
    });
  }

  render() {
    const {
      rootElement,
      cssModule,
      organicArrows,
      onNext,
      onPrev,
    } = this.props;

    return (
      <div
        ref={(controls) => { this.controls = controls; }}
        className={getClassName(`${rootElement}__controls`, cssModule)}
      >
        <button
          ref={(next) => { this.next = next; }}
          className={getClassName(`${rootElement}__next`, cssModule)}
          onClick={onNext}
        >
          {organicArrows && <span className={getClassName(`${rootElement}__controls__arrow-right`, cssModule)} />}
        </button>
        <button
          ref={(prev) => { this.prev = prev; }}
          className={getClassName(`${rootElement}__prev`, cssModule)}
          onClick={onPrev}
        >
          {organicArrows && <span className={getClassName(`${rootElement}__controls__arrow-left`, cssModule)} />}
        </button>
      </div>
    );
  }
}
