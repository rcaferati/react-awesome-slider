import React, { Component } from 'react';
import { onceNextCssLayout, onceTransitionEnd } from 'web-animation-club';
import PropTypes from 'prop-types';
import { getClassName } from '../../helpers/components';
import { mergeStyles, getAnyClassName } from '../../core/helpers';

const ROOTELM = 'awssld';

export default function AutoplayHoc(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      interval: PropTypes.number,
      cssModule: PropTypes.any,
      play: PropTypes.bool,
      cancelOnInteraction: PropTypes.bool,
      timerHeight: PropTypes.string,
      timerBackgroundColor: PropTypes.string,
      showTimer: PropTypes.bool,
      onTransitionStart: PropTypes.func,
      onTransitionEnd: PropTypes.func,
      onTransitionRequest: PropTypes.func,
      rootElement: PropTypes.string,
    };

    static defaultProps = {
      interval: 2000,
      play: false,
      cancelOnInteraction: false,
      timerHeight: '6px',
      cssModule: null,
      timerBackgroundColor: 'rgba(0, 0, 0, 0.15)',
      showTimer: true,
      onTransitionStart: null,
      onTransitionEnd: null,
      onTransitionRequest: null,
      rootElement: ROOTELM,
    };

    constructor(props) {
      super(props);
      this.forceStop = false;
      this.rootElement = props.rootElement || ROOTELM;
      this.mergedStyles = mergeStyles(props.cssModule);
      this.state = {
        selected: 0,
      };
    }

    componentWillReceiveProps(newProps) {
      this.mergedStyles = mergeStyles(newProps.cssModule);
      this.checkStartStatus(newProps);
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
      let bar = element.querySelector(
        `.${getAnyClassName(
          getClassName(`${this.rootElement}__timer`, this.mergedStyles)
        )}`
      );
      const wrapper = element.querySelector('div');
      if (!wrapper) {
        return;
      }
      if (!bar) {
        bar = this.createBarElement();
        wrapper.appendChild(bar);
      }
      bar.classList.remove(
        getClassName(`${this.rootElement}__timer--animated`, this.mergedStyles)
      );
      onceNextCssLayout().then(() => {
        bar.classList.remove(
          getClassName(`${this.rootElement}__timer--run`, this.mergedStyles)
        );
        bar.classList.remove(
          getClassName(`${this.rootElement}__timer--fast`, this.mergedStyles)
        );
        onceNextCssLayout().then(() => {
          bar.classList.add(
            getClassName(
              `${this.rootElement}__timer--animated`,
              this.mergedStyles
            )
          );
          onceNextCssLayout().then(() => {
            bar.classList.add(
              getClassName(`${this.rootElement}__timer--run`, this.mergedStyles)
            );
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
      const bar = slider.querySelector(
        `.${getAnyClassName(
          getClassName(`${this.rootElement}__timer`, this.mergedStyles)
        )}`
      );
      return bar || null;
    }

    checkStartStatus(newProps) {
      if (!this.currentInfo) {
        return;
      }
      if (this.props.play !== newProps.play) {
        if (newProps.play === true && this.currentInfo) {
          this.setTimer(this.currentInfo.currentSlide);
        }
        if (newProps.play === false) {
          this.forceClearBar(this.currentInfo);
        }
      }
    }

    createBarElement() {
      const bar = document.createElement('div');
      bar.classList.add(
        getClassName(`${this.rootElement}__timer`, this.mergedStyles)
      );
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
      if (bar) {
        if (bar.clearCssEndEvent) {
          bar.clearCssEndEvent();
        }
        bar.classList.add(
          getClassName(`${this.rootElement}__timer--fast`, this.mergedStyles)
        );
        onceTransitionEnd(bar).then(() => {
          this.clearBarAnimation(bar);
        });
      }
    }

    clearBarAnimation(bar) {
      bar.classList.remove(
        getClassName(`${this.rootElement}__timer--animated`, this.mergedStyles)
      );
    }

    restartBarAnimation(bar) {
      bar.classList.remove(
        getClassName(`${this.rootElement}__timer--run`, this.mergedStyles)
      );
      bar.classList.remove(
        getClassName(`${this.rootElement}__timer--fast`, this.mergedStyles)
      );
    }

    forceClearBar(info) {
      const bar = this.getBarFromSlide(info.currentSlide);
      this.restartBarAnimation(bar);
    }

    goTonext() {
      const { currentIndex, slides } = this.currentInfo;
      const next = currentIndex + 1;
      const selected = next > slides - 1 ? 0 : next;
      if (selected === this.state.selected) {
        this.forceClearBar(this.currentInfo);
        return;
      }
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
        onFirstMount,
        onTransitionRequest,
        ...extra
      } = this.props;

      return (
        <WrappedComponent
          {...extra}
          selected={this.state.selected}
          onFirstMount={info => {
            if (onFirstMount) {
              onFirstMount(info);
            }
            if (extra.startupScreen) {
              return;
            }
            this.setInfo(info);
            if (play === true) {
              this.setTimer(info.currentSlide);
            }
          }}
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
            if (play === true) {
              this.setTimer(info.currentSlide);
            }
            if (onTransitionEnd) {
              onTransitionEnd(info);
            }
          }}
        />
      );
    }
  };
}
