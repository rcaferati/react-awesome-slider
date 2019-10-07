import React, { Component } from 'react';
import { onceNextCssLayout, onceTransitionEnd } from 'web-animation-club';
import PropTypes from 'prop-types';
import Styles from './styles.scss';

export default function AutoplayHoc(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      interval: PropTypes.number,
      play: PropTypes.bool,
      cancelOnInteraction: PropTypes.bool,
      timerHeight: PropTypes.string,
      timerBackgroundColor: PropTypes.string,
      showTimer: PropTypes.bool,
      onTransitionStart: PropTypes.func,
      onTransitionEnd: PropTypes.func,
      onTransitionRequest: PropTypes.func,
    };

    static defaultProps = {
      interval: 2000,
      play: false,
      cancelOnInteraction: false,
      timerHeight: '6px',
      timerBackgroundColor: 'rgba(0, 0, 0, 0.15)',
      showTimer: true,
      onTransitionStart: null,
      onTransitionEnd: null,
      onTransitionRequest: null,
    };

    constructor(props) {
      super(props);
      this.forceStop = false;
      this.state = {
        selected: 0,
      };
    }

    setInfo(info) {
      this.currentInfo = info;
      if (info.currentIndex !== this.state.selected) {
        this.setState({ selected: info.currentIndex });
      }
    }

    setTimer(element) {
      if (this.forceStop === true) {
        return;
      }
      let bar = element.querySelector(`.${Styles.timer}`);
      if (!bar) {
        bar = this.createBarElement();
        element.querySelector('div').appendChild(bar);
      }
      bar.classList.remove(Styles.animated);
      onceNextCssLayout().then(() => {
        bar.classList.remove(Styles.run);
        bar.classList.remove(Styles.fast);
        onceNextCssLayout().then(() => {
          bar.classList.add(Styles.animated);
          onceNextCssLayout().then(() => {
            bar.classList.add(Styles.run);
            onceTransitionEnd(bar).then(() => {
              this.clearBarAnimation(bar);
              if (this.forceStop === true || this.props.play === false) {
                return;
              }
              this.goTonext();
            });
          });
        });
      });
    }

    getBarFromSlide(slider) {
      const bar = slider.querySelector(`.${Styles.timer}`);
      return bar || null;
    }

    createBarElement() {
      const bar = document.createElement('div');
      bar.classList.add(Styles.timer);
      bar.style.setProperty('--timer-delay', `${this.props.interval}ms`);
      bar.style.setProperty('--timer-height', this.props.timerHeight);
      bar.style.setProperty(
        '--timer-background-color',
        this.props.timerBackgroundColor
      );
      return bar;
    }

    clearBar(info) {
      const bar = this.getBarFromSlide(info.currentSlide);
      bar.clearCssEndEvent();
      bar.classList.add(Styles.fast);
      onceTransitionEnd(bar).then(() => {
        this.clearBarAnimation(bar);
      });
    }

    clearBarAnimation(bar) {
      bar.classList.remove(Styles.animated);
    }

    restartBarAnimation(bar) {
      bar.classList.remove(Styles.run);
      bar.classList.remove(Styles.fast);
    }

    goTonext() {
      const { currentIndex, slides } = this.currentInfo;
      const next = currentIndex + 1;
      const selected = next > slides - 1 ? 0 : next;
      this.setState({ selected });
    }

    render() {
      const {
        inverval,
        play,
        cancelOnInteraction,
        showTimer,
        onTransitionStart,
        onTransitionEnd,
        onTransitionRequest,
        ...extra
      } = this.props;

      return (
        <WrappedComponent
          {...extra}
          selected={this.state.selected}
          onTransitionStart={info => {
            const bar = this.getBarFromSlide(info.nextSlide);
            if (bar) {
              this.restartBarAnimation(bar);
            }
            if (onTransitionStart) {
              onTransitionStart(info);
            }
          }}
          onTransitionRequest={info => {
            this.clearBar(info);
            this.currentInfo = info;
            if (cancelOnInteraction === true) {
              this.forceStop = true;
            }
            if (onTransitionRequest) {
              onTransitionRequest(info);
            }
          }}
          onTransitionEnd={info => {
            this.setInfo(info);
            this.setTimer(info.currentSlide);
            if (onTransitionEnd) {
              onTransitionEnd(info);
            }
          }}
        />
      );
    }
  };
}
