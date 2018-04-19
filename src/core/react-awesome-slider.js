import React from 'react';
import PropTypes from 'prop-types';
import {
  classToModules,
  getClassName,
  DOMBreather,
  setCssEndEvent,
  MediaLoader,
} from '../helpers/components';
import Bullets from './bullets';
import Buttons from './buttons';

const mediaLoader = new MediaLoader();
const ROOTELM = 'aws-sld';

export default class AwesomeSlider extends React.Component {
  static propTypes = {
    cssModule: PropTypes.object,
    rootElement: PropTypes.string,
    name: PropTypes.string,
    style: PropTypes.object,
    media: PropTypes.array,
    className: PropTypes.string,
    startupScreen: PropTypes.object,
    transitionDelay: PropTypes.number,
    controlsReturnDelay: PropTypes.number,
    selected: PropTypes.number,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    organicArrows: PropTypes.bool,
    firstMount: PropTypes.func,
    transitionStart: PropTypes.func,
    transitionEnd: PropTypes.func,
    onResetSlider: PropTypes.func,
  };
  static defaultProps = {
    cssModule: null,
    rootElement: ROOTELM,
    name: 'awesome-slider',
    startupScreen: null,
    style: {},
    media: [],
    transitionDelay: 0,
    selected: 0,
    controlsReturnDelay: 0,
    className: null,
    children: null,
    disabled: false,
    organicArrows: false,
    firstMount: null,
    transitionStart: null,
    transitionEnd: null,
    onResetSlider: null,
  };

  constructor(props) {
    super(props);
    this.rootElement = props.rootElement || ROOTELM;
    this.boxA = null;
    this.boxB = null;
    this.loaded = [];
    this.active = 'boxA';
    this.loader = 'boxB';
    this.nextIndex = null;
    this.loading = false;
    this.media = null;
    this.checkChildren(props);
    if (props.startupScreen) {
      this.index = null;
      this.state = {
        index: null,
        boxA: {
          className: getClassName(`${this.rootElement}__startUp`, props.cssModule),
          children: props.startupScreen,
        },
        boxB: null,
      };
    } else {
      this.index = 0;
      this.state = {
        index: 0,
        boxA: this.media[this.props.selected] || null,
        boxB: null,
      };
    }
  }

  componentDidMount() {
    const {
      cssModule,
    } = this.props;
    this.boxA.classList.add(getClassName(`${this.rootElement}--active`, cssModule));
    if (this.props.startupScreen) {
      this.buttons.element.classList.add(getClassName(`${this.rootElement}__controls--active`, this.props.cssModule));
      setTimeout(() => {
        this.goTo({ index: 0, direction: true, touch: false });
      }, 250);
    }
    if (this.props.firstMount) {
      this.props.firstMount({
        currentIndex: this.index,
        currentSlide: this[this.active],
        element: this.slider,
      });
    }
  }

  componentWillReceiveProps(newProps) {
    this.checkChildren(newProps);
    if (newProps.name !== this.props.name) {
      this.resetSlider(newProps.selected);
      return;
    }
    if (newProps.selected !== this.props.selected) {
      const index = newProps.selected;
      this.goTo({
        index,
        direction: !(this.index > index),
      });
    }
  }

  getRootClassName() {
    const { rootElement } = this;
    const {
      cssModule,
      disabled,
      organicArrows,
    } = this.props;
    const className = [
      this.rootElement,
    ];
    if (organicArrows === true) {
      className.push(`${rootElement}--organic-arrows`);
    }
    if (disabled === true) {
      className.push(`${rootElement}--disabled`);
    }
    if (this.props.className) {
      className.push(...this.props.className.split(' '));
    }
    if (cssModule && cssModule[this.rootElement]) {
      return classToModules(className, cssModule);
    }
    return className.join(' ').trim().replace(/[\s]+/ig, ' ');
  }

  getBar() {
    const {
      cssModule,
    } = this.props;
    const bar = document.createElement('div');
    bar.className = getClassName(`${this.rootElement}__bar`, cssModule);
    return bar;
  }

  resetSlider(index = 0) {
    this.index = index;
    this.setState({
      index,
      boxA: this.media[index],
      boxB: this.media[index],
    }, () => {
      if (this.props.onResetSlider) {
        this.props.onResetSlider({
          currentIndex: this.index,
          currentSlide: this[this.active],
          element: this.slider,
        });
      }
    });
  }

  checkChildren(props) {
    if (props.children) {
      if (props.children !== this.props.children || !this.media) {
        this.media = this.transformChildren(props.children);
      }
    } else if (props.media !== this.props.media) {
      this.media = props.media;
    }
  }

  loadContent(active, url, callback) {
    const {
      cssModule,
    } = this.props;
    if (this.loaded.includes(url) || !url) {
      callback(null);
      return;
    }
    const bar = this.getBar();
    active.appendChild(bar);
    DOMBreather().then(() => {
      DOMBreather().then(() => {
        bar.classList.add(getClassName(`${this.rootElement}__bar--active`, cssModule));
      });
      mediaLoader.load(url).then(() => {
        this.loaded.push(url);
        DOMBreather().then(() => {
          setCssEndEvent(bar, 'transition').then(() => {
            callback(bar);
          });
          bar.classList.add(getClassName(`${this.rootElement}__bar--end`, cssModule));
        });
      });
    });
  }

  animateMobileStart() {
    const {
      cssModule,
    } = this.props;
    const { direction } = this;
    const active = this[this.active];
    const loader = this[this.loader];
    const contentClass = getClassName(`${this.rootElement}__content`, cssModule);
    const contentEnterMoveClass = direction ?
      getClassName(`${this.rootElement}__content--moveLeft`, cssModule) :
      getClassName(`${this.rootElement}__content--moveRight`, cssModule);
    const contentExitMoveClass = direction ?
      getClassName(`${this.rootElement}__content--moveRight`, cssModule) :
      getClassName(`${this.rootElement}__content--moveLeft`, cssModule);
    const contentStaticClass = getClassName(`${this.rootElement}__content--static`, cssModule);
    const contentExitClass = getClassName(`${this.rootElement}__content--exit`, cssModule);
    if (this.props.transitionStart) {
      this.props.transitionStart({
        currentIndex: this.index,
        currentSlide: this[this.active],
        nextSlide: this[this.loader],
        nextIndex: this.nextIndex,
        element: this.slider,
      });
    }
    active.querySelector(`.${contentClass}`).classList.add(contentExitMoveClass);
    active.querySelector(`.${contentClass}`).classList.add(contentExitClass);
    loader.querySelector(`.${contentClass}`).classList.add(contentEnterMoveClass);
    loader.querySelector(`.${contentClass}`).classList.add(contentStaticClass);
  }

  animateMobileEnd(callback) {
    const {
      cssModule,
    } = this.props;
    const { direction } = this;
    const active = this[this.active];
    const loader = this[this.loader];
    const contentClass = getClassName(`${this.rootElement}__content`, cssModule);
    const animated = getClassName(`${this.rootElement}--animated`, cssModule);
    const exitPosition = direction ?
      getClassName(`${this.rootElement}--moveLeft`, cssModule) :
      getClassName(`${this.rootElement}--moveRight`, cssModule);
    const contentEnterMoveClass = direction ?
      getClassName(`${this.rootElement}__content--moveLeft`, cssModule) :
      getClassName(`${this.rootElement}__content--moveRight`, cssModule);
    const contentExitMoveClass = direction ?
      getClassName(`${this.rootElement}__content--moveRight`, cssModule) :
      getClassName(`${this.rootElement}__content--moveLeft`, cssModule);
    const contentStaticClass = getClassName(`${this.rootElement}__content--static`, cssModule);
    const contentExitClass = getClassName(`${this.rootElement}__content--exit`, cssModule);
    loader.querySelector(`.${contentClass}`).classList.remove(contentStaticClass);
    DOMBreather().then(() => {
      loader.classList.add(animated);
      active.classList.add(animated);
      DOMBreather().then(() => {
        loader.style.transform = 'translate3d(0, 0, 0)';
        active.style.transform = `translate3d(${this.direction ? '-' : ''}100%, 0, 0)`;
        setCssEndEvent(active, 'transition').then(() => {
          if (!this.loading) {
            return;
          }
          loader.classList.add(getClassName(`${this.rootElement}--active`, cssModule));
          active.classList.remove(getClassName(`${this.rootElement}--active`, cssModule));
          active.classList.remove(exitPosition);
          loader.classList.remove(animated);
          active.classList.remove(animated);
          active.querySelector(`.${contentClass}`).classList.remove(contentExitMoveClass);
          active.querySelector(`.${contentClass}`).classList.remove(contentExitClass);
          loader.querySelector(`.${contentClass}`).classList.remove(contentEnterMoveClass);
          setTimeout(() => {
            DOMBreather().then(() => {
              this.buttons.element.classList.remove(getClassName(`${this.rootElement}__controls--active`, this.props.cssModule));
            });
          }, this.props.controlsReturnDelay);

          if (this.activeArrow) {
            this.activeArrow.classList.remove(this.activeArrowClass);
            this.activeArrow = null;
            this.activeArrowClass = null;
          }
          // THIS THING *
          this.active = this.active === 'boxA' ? 'boxB' : 'boxA';
          this.loader = this.active === 'boxA' ? 'boxB' : 'boxA';
          if (callback) {
            callback();
          }
        });
      });
    });
  }

  animateStuff(direction, media, callback) {
    const {
      cssModule,
      transitionDelay,
    } = this.props;
    const active = this[this.active];
    const loader = this[this.loader];
    active.style.removeProperty('transform');
    loader.style.removeProperty('transform');
    const contentClass = getClassName(`${this.rootElement}__content`, cssModule);
    const animated = getClassName(`${this.rootElement}--animated`, cssModule);
    const exitClass = getClassName(`${this.rootElement}--exit`, cssModule);
    const loaderPosition = direction ?
      getClassName(`${this.rootElement}--moveRight`, cssModule) :
      getClassName(`${this.rootElement}--moveLeft`, cssModule);
    const exitPosition = direction ?
      getClassName(`${this.rootElement}--moveLeft`, cssModule) :
      getClassName(`${this.rootElement}--moveRight`, cssModule);
    const contentEnterMoveClass = direction ?
      getClassName(`${this.rootElement}__content--moveLeft`, cssModule) :
      getClassName(`${this.rootElement}__content--moveRight`, cssModule);
    const contentExitMoveClass = direction ?
      getClassName(`${this.rootElement}__content--moveRight`, cssModule) :
      getClassName(`${this.rootElement}__content--moveLeft`, cssModule);
    const contentStaticClass = getClassName(`${this.rootElement}__content--static`, cssModule);
    const contentExitClass = getClassName(`${this.rootElement}__content--exit`, cssModule);

    if (this.props.transitionStart) {
      this.props.transitionStart({
        currentIndex: this.index,
        currentSlide: this[this.active],
        nextSlide: this[this.loader],
        nextIndex: this.nextIndex,
        element: this.slider,
      });
    }
    this.loadContent(active, media.url, (bar) => {
      loader.querySelector(`.${contentClass}`).classList.remove(contentStaticClass);
      active.querySelector(`.${contentClass}`).classList.add(contentExitMoveClass);
      active.querySelector(`.${contentClass}`).classList.add(contentExitClass);
      loader.querySelector(`.${contentClass}`).classList.add(contentEnterMoveClass);
      setTimeout(() => {
        DOMBreather().then(() => {
          loader.classList.add(loaderPosition);
          DOMBreather().then(() => {
            loader.classList.add(animated);
            active.classList.add(animated);
            DOMBreather().then(() => {
              loader.classList.remove(loaderPosition);
              active.classList.add(exitClass);
              active.classList.add(exitPosition);
              setCssEndEvent(active, 'transition').then(() => {
                loader.classList.add(getClassName(`${this.rootElement}--active`, cssModule));
                active.classList.remove(getClassName(`${this.rootElement}--active`, cssModule));
                active.classList.remove(exitPosition);
                active.classList.remove(exitClass);
                loader.classList.remove(animated);
                active.classList.remove(animated);
                active.querySelector(`.${contentClass}`).classList.remove(contentExitMoveClass);
                active.querySelector(`.${contentClass}`).classList.remove(contentExitClass);
                loader.querySelector(`.${contentClass}`).classList.remove(contentEnterMoveClass);
                // removeElement BAR;
                if (bar) {
                  active.removeChild(bar);
                }
                setTimeout(() => {
                  DOMBreather().then(() => {
                    this.buttons.element.classList.remove(getClassName(`${this.rootElement}__controls--active`, this.props.cssModule));
                  });
                }, this.props.controlsReturnDelay);
                if (this.activeArrow) {
                  DOMBreather().then(() => {
                    this.activeArrow.classList.remove(this.activeArrowClass);
                    this.activeArrow = null;
                    this.activeArrowClass = null;
                  });
                }
                // THIS THING *
                this.active = this.active === 'boxA' ? 'boxB' : 'boxA';
                this.loader = this.active === 'boxA' ? 'boxB' : 'boxA';
                if (callback) {
                  callback();
                }
              });
            });
          });
        });
      }, transitionDelay);
    });
  }

  goTo({ index, direction, touch = false }) {
    if (this.loading === true || index === this.index) {
      return;
    }
    this.loading = true;
    this.direction = direction;
    if (touch === false) {
      this.activateArrows(direction, () => {
        this.chargeIndex(index, (media) => {
          this.renderedLoader = true;
          this.animateStuff(direction, media, () => {
            this.index = this.nextIndex;
            this.setState({ index: this.index });
            if (this.props.transitionEnd) {
              this.props.transitionEnd({
                currentIndex: this.index,
                currentSlide: this[this.active],
                element: this.slider,
              });
            }
            DOMBreather().then(() => {
              this.loading = false;
            });
          });
        });
      });
    } else {
      this.chargeIndex(index, () => {
        this.activateArrows(direction);
        this.animateMobileStart();
      });
    }
  }

  chargeIndex(index, callback) {
    this.nextIndex = index > (this.media.length - 1) ?
      0 : index < 0 ? (this.media.length - 1) : index;
    const state = {};
    const media = this.media[this.nextIndex];
    state[this.loader] = {
      loader: true,
      ...media,
    };
    this.setState(state, () => {
      callback(media);
    });
  }

  unchargeIndex() {
    const state = {};
    state[this.loader] = null;
    this.setState(state, () => {});
  }

  activateArrows(direction, callback) {
    const activeArrow = direction ? this.buttons.next : this.buttons.prev;
    const dirName = direction ? 'right' : 'left';
    this.activeArrow = activeArrow.querySelector('span');
    this.activeArrowClass = getClassName(`${this.rootElement}__controls__arrow-${dirName}--active`, this.props.cssModule);
    // This needs to be done due to the usage of the pseudo animated elements
    setCssEndEvent(this.activeArrow, 'transition', this.index === null ? 0 : 2).then(() => {
      if (callback) {
        callback();
      }
    });
    this.buttons.element.classList.add(getClassName(`${this.rootElement}__controls--active`, this.props.cssModule));
    this.activeArrow.classList.add(this.activeArrowClass);
  }

  clickNext = () => {
    this.goTo({
      index: this.index + 1,
      direction: true,
    });
  }

  clickPrev = () => {
    this.goTo({
      index: this.index - 1,
      direction: false,
    });
  }

  touchStart = (event) => {
    if (this.animating) {
      return;
    }
    const native = event.nativeEvent;
    this.touchStartPoint = native.touches[0].clientX;
  }

  touchMove = (event) => {
    if (this.animating || !this.touchStartPoint) {
      return;
    }
    const native = event.nativeEvent;
    let diff = this.latestX - this.touchStartPoint;
    const active = this[this.active];
    const loader = this[this.loader];
    const direction = !(diff > 0);
    const abs = Math.abs(diff);
    this.latestX = native.touches[0].clientX;
    if (abs >= 10) {
      if (this.loading === false) {
        this.goTo({
          index: direction ? this.index + 1 : this.index - 1,
          direction,
          touch: true,
        });
      } else if (this.direction === true) {
        diff += 10;
        if (Math.abs(diff) > active.offsetWidth) {
          diff = -active.offsetWidth;
        } else if (diff > 0) {
          diff = 0;
        }
        active.style.transform = `translate3d(${diff}px, 0, 0)`;
        loader.style.transform = `translate3d(calc(100% + ${diff}px), 0, 0)`;
      } else {
        diff -= 10;
        if (Math.abs(diff) > active.offsetWidth) {
          diff = active.offsetWidth;
        } else if (diff < 0) {
          diff = 0;
        }
        active.style.transform = `translate3d(${diff}px, 0, 0)`;
        loader.style.transform = `translate3d(calc(-100% + ${diff}px), 0, 0)`;
      }
    }
  }

  touchEnd = () => {
    if (this.animating || !this.touchStartPoint || !this.loading) {
      return;
    }
    this.touchStartPoint = null;
    this.animating = true;
    this.animateMobileEnd(() => {
      this.index = this.nextIndex;
      this.setState({ index: this.index });
      if (this.props.transitionEnd) {
        this.props.transitionEnd({
          currentIndex: this.index,
          currentSlide: this[this.active],
          element: this.slider,
        });
      }
      this.animating = false;
      this.loading = false;
      this.unchargeIndex();
    });
  }

  bulletClick = (event) => {
    const button = event.currentTarget;
    button.classList.add(getClassName(`${this.rootElement}__bullets--loading`, this.props.cssModule));
    const index = parseInt(button.getAttribute('data-index'), 10);
    const direction = !(this.index > index);
    this.goTo({ index, direction });
  }

  transformChildren(children) {
    const media = [];
    children.forEach((child) => {
      const item = {
        ...child.props,
      };
      if (child.props['data-src']) {
        item.url = child.props['data-src'];
      }
      media.push(item);
    });
    return media;
  }

  renderBox(box) {
    const {
      cssModule,
    } = this.props;
    return (
      <div
        ref={(el) => { this[`box${box}`] = el; }}
        className={getClassName(`${this.rootElement}__box${box}`, cssModule)}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}
        onTouchEnd={this.touchEnd}
      >
        {this.state[`box${box}`] && this.renderMedia(this.state[`box${box}`], cssModule)}
      </div>
    );
  }

  renderMedia(media, cssModule) {
    let background = null;
    const className = [
      getClassName(`${this.rootElement}__content`, cssModule),
    ];
    if (media.url) {
      if (media.url.match(/gif|jpg|png|webp/)) {
        background = (
          <img
            alt={media.alt || media.title || null}
            src={media.url}
          />);
      }
      if (media.url.match(/mp4/)) {
        background = (
          <video
            title={media.title}
            src={media.url}
            type="video/mp4"
            controls
          />
        );
      }
    }
    return (
      <div
        className={className.join(' ')}
        style={media.style || null}
      >
        {background}
        {media.children && (
          <div
            className={media.className || null}
          >
            {media.children}
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      cssModule,
      organicArrows,
    } = this.props;
    const {
      rootElement,
    } = this;

    return (
      <div
        ref={(slider) => { this.slider = slider; }}
        className={this.getRootClassName()}
      >
        <div
          ref={(wrapper) => { this.wrapper = wrapper; }}
          className={getClassName(`${rootElement}__wrapper`, cssModule)}
        >
          <div
            ref={(container) => { this.container = container; }}
            className={getClassName(`${rootElement}__container`, cssModule)}
          >
            {this.renderBox('A')}
            {this.renderBox('B')}
          </div>
          <Buttons
            rootElement={rootElement}
            cssModule={cssModule}
            onMount={(buttons) => { this.buttons = buttons; }}
            onNext={this.clickNext}
            onPrev={this.clickPrev}
            organicArrows={organicArrows}
          />
        </div>
        <Bullets
          cssModule={cssModule}
          rootElement={rootElement}
          media={this.media}
          selected={this.state.index}
          onClick={(info) => {
            this.goTo(info);
          }}
        />
      </div>
    );
  }
}
