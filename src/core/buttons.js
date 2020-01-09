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
    buttonContentLeft: PropTypes.node,
    buttonContentRight: PropTypes.node,
    organicArrows: PropTypes.bool,
  };

  static defaultProps = {
    cssModule: null,
    organicArrows: true,
    buttonContentLeft: null,
    buttonContentRight: null,
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
      buttonContentLeft,
      buttonContentRight,
      onNext,
      onPrev,
    } = this.props;

    return (
      <div
        ref={controls => {
          this.controls = controls;
          this.props.onMount({
            element: this.controls,
            next: this.next || null,
            prev: this.prev || null,
          });
        }}
        className={[
          getClassName(`${rootElement}__controls`, cssModule),
          getClassName(`${rootElement}__controls--hidden`, cssModule),
        ].join(' ')}
      >
        <button
          ref={next => {
            this.next = next;
          }}
          aria-label="next"
          className={getClassName(`${rootElement}__next`, cssModule)}
          onClick={onNext}
        >
          {organicArrows ? (
            <span
              className={getClassName(
                `${rootElement}__controls__arrow-right`,
                cssModule
              )}
            />
          ) : (
            buttonContentRight
          )}
        </button>
        <button
          ref={prev => {
            this.prev = prev;
          }}
          aria-label="previous"
          className={getClassName(`${rootElement}__prev`, cssModule)}
          onClick={onPrev}
        >
          {organicArrows ? (
            <span
              className={getClassName(
                `${rootElement}__controls__arrow-left`,
                cssModule
              )}
            />
          ) : (
            buttonContentLeft
          )}
        </button>
      </div>
    );
  }
}
