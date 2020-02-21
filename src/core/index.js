import React from 'react';
import PropTypes from 'prop-types';
import {
  onceNextCssLayout,
  onceTransitionEnd,
  onceAnimationEnd,
} from 'web-animation-club';
import { getClassName, MediaLoader } from '../helpers/components';
import {
  getRootClassName,
  setupClassNames,
  transformChildren,
  mergeStyles,
  getAnyClassName,
  classListAdd,
  classListRemove,
} from './helpers';
import Bullets from './bullets';
import Buttons from './buttons';
import Media from './media';

const ROOTELM = 'awssld';
const mediaLoader = new MediaLoader();

export default class AwesomeSlider extends React.Component {
  static propTypes = {
    animation: PropTypes.string,
    bullets: PropTypes.bool,
    buttonContentLeft: PropTypes.node,
    buttonContentRight: PropTypes.node,
    buttons: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    controlsReturnDelay: PropTypes.number,
    cssModule: PropTypes.any,
    customContent: PropTypes.node,
    onLoadStart: PropTypes.func,
    disabled: PropTypes.bool,
    fillParent: PropTypes.bool,
    infinite: PropTypes.bool,
    media: PropTypes.array,
    name: PropTypes.string,
    onFirstMount: PropTypes.func,
    onResetSlider: PropTypes.func,
    onStartupRelease: PropTypes.func,
    onTransitionEnd: PropTypes.func,
    onTransitionRequest: PropTypes.func,
    onTransitionStart: PropTypes.func,
    organicArrows: PropTypes.bool,
    rootElement: PropTypes.string,
    selected: PropTypes.any,
    startup: PropTypes.bool,
    startupDelay: PropTypes.number,
    startupScreen: PropTypes.object,
    style: PropTypes.object,
    transitionDelay: PropTypes.number,
    mobileTouch: PropTypes.bool,
  };

  static defaultProps = {
    animation: null,
    bullets: true,
    buttonContentLeft: null,
    buttonContentRight: null,
    buttons: true,
    children: null,
    className: null,
    controlsReturnDelay: 0,
    cssModule: null,
    customContent: null,
    onLoadStart: null,
    disabled: false,
    fillParent: false,
    infinite: true,
    media: [],
    name: 'awesome-slider',
    onFirstMount: null,
    onResetSlider: null,
    onStartupRelease: null,
    onTransitionEnd: null,
    onTransitionRequest: null,
    onTransitionStart: null,
    organicArrows: true,
    rootElement: ROOTELM,
    selected: 0,
    startup: true,
    startupDelay: 0,
    startupScreen: null,
    style: {},
    transitionDelay: 0,
    mobileTouch: true,
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
    this.started = false;
    this.touchEnabled = false;
    this.setupStartup(props);
  }

  componentDidMount() {
    classListAdd(this.boxA, this.classNames.active);
    if (this.props.startupScreen) {
      if (this.buttons) {
        classListAdd(this.buttons.element, this.classNames.controlsHidden);
        classListAdd(this.buttons.element, this.classNames.controlsActive);
      }
      if (this.props.startup === true && this.media.length > 0) {
        this.startup();
      }
    }
    if (this.props.onFirstMount) {
      this.props.onFirstMount({
        ...this.getInfo(),
      });
    }
    if (this.buttons) {
      onceNextCssLayout().then(() => {
        if (this.buttons && this.buttons.element) {
          classListRemove(this.buttons.element, this.classNames.controlsHidden);
        }
      });
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.checkChildren(newProps);
    this.setupClassNames(mergeStyles(newProps.cssModule));
    if (newProps.name !== this.props.name) {
      this.resetSlider(newProps.selected);
      return;
    }
    if (newProps.startup === true && this.started === false) {
      this.startup();
      return;
    }
    if (
      newProps.selected !== this.props.selected
      // || newProps.selected !== this.index
    ) {
      const index = this.getIndex(newProps.selected);
      // FORCED RIGHT WING WHEN INFINITE === 0
      const direction =
        newProps.infinite === true &&
        index === 0 &&
        this.index === this.media.length - 1
          ? true
          : !(this.index > index);

      this.goTo({
        index,
        direction,
      });
      return;
    }
    this.refreshSlider();
  }

  onTransitionStart() {
    const currentMedia = this.media[this.index];
    const nextMedia = this.media[this.nextIndex];

    const data = {
      ...this.getInfo(),
      nextSlide: this[this.loader],
      nextIndex: this.nextIndex,
      nextMedia,
    };

    if (this.props.onTransitionStart) {
      this.props.onTransitionStart(data);
    }

    if (currentMedia && currentMedia.onTransitionStartOut) {
      currentMedia.onTransitionStartOut(data);
    }

    if (nextMedia && nextMedia.onTransitionStartIn) {
      nextMedia.onTransitionStartIn(data);
    }
  }

  onTransitionRequest(event, index) {
    const currentMedia = this.media[this.index];
    const nextIndex = this.checkIndex(index);
    const nextMedia = this.media[nextIndex];
    const data = {
      eventName: event,
      ...this.getInfo(),
      nextSlide: null, // next slide hasn't been rendered yet
      nextIndex,
      nextMedia,
    };
    if (this.props.onTransitionRequest) {
      this.props.onTransitionRequest(data);
    }
    if (currentMedia && currentMedia.onTransitionRequestOut) {
      currentMedia.onTransitionRequestOut(data);
    }
    if (nextMedia && nextMedia.onTransitionRequestIn) {
      nextMedia.onTransitionRequestIn(data);
    }
  }

  onTransitionEnd() {
    const currentMedia = this.media[this.index];
    const data = {
      ...this.getInfo(),
    };
    if (this.props.onTransitionEnd) {
      this.props.onTransitionEnd(data);
    }
    if (currentMedia && currentMedia.onTransitionEnd) {
      currentMedia.onTransitionEnd(data);
    }
  }

  getRootClassName() {
    const {
      animation,
      className,
      cssModule,
      disabled,
      fillParent,
      infinite,
      organicArrows,
    } = this.props;

    return getRootClassName({
      animation,
      className,
      cssModule: mergeStyles(cssModule),
      current: this.state.index,
      disabled,
      fillParent,
      infinite,
      organicArrows,
      rootElement: this.rootElement,
      total: this.media.length,
    });
  }

  setupStartup(props) {
    this.checkChildren(props);
    this.setupClassNames(mergeStyles(props.cssModule));
    if (props.startupScreen) {
      const nextIndex = this.getIndex(this.props.selected);
      this.index = null;
      this.state = {
        index: this.index,
        boxA: {
          className: this.classNames.startUp,
          children: props.startupScreen,
        },
        boxB: this.media[nextIndex] || null,
      };
    } else {
      this.started = true;
      this.index = this.getIndex(this.props.selected);
      this.state = {
        index: this.index,
        boxA: this.media[this.index] || null,
        boxB: null,
      };
    }
  }

  getInfo() {
    return {
      slides: this.media.length,
      currentIndex: this.index,
      currentSlide: this[this.active],
      currentMedia: this.media[this.index],
      element: this.slider,
    };
  }

  getProgressBar() {
    if (!document) {
      return {};
    }
    const bar = document.createElement('div');
    bar.className = this.classNames.bar;
    return bar;
  }

  setupClassNames(cssModule) {
    this.classNames = setupClassNames(this.rootElement, cssModule);
  }

  getIndex(index) {
    let nextIndex = 0;
    if (typeof index === 'number') {
      return index;
    }
    if (typeof index === 'string') {
      this.media.forEach(({ slug }, idx) => {
        if (slug === index) {
          nextIndex = idx;
        }
      });
    }
    return nextIndex;
  }

  refreshSlider() {
    if (
      this.loading === true ||
      this.props.startup === false ||
      this.index === null
    ) {
      return;
    }

    const { index } = this;

    this.setState({
      index,
      [this.active]: this.media[this.getIndex(index)],
      [this.loader]: null,
    });
  }

  startup() {
    this.started = true;
    setTimeout(() => {
      this.goTo({
        index: this.props.selected,
        direction: true,
        touch: false,
      });
    }, this.props.startupDelay || 75);
  }

  resetSlider(index = 0) {
    this.index = index;

    this.setState(
      {
        index,
        [this.active]: this.media[this.getIndex(index)],
        [this.loader]: null,
      },
      () => {
        if (this.props.onResetSlider) {
          this.props.onResetSlider({
            ...this.getInfo(),
          });
        }
      }
    );
  }

  checkChildren(props) {
    if (props.children) {
      if (
        props.children !== this.props.children ||
        (this.props.children && !this.media)
      ) {
        this.media = transformChildren(props.children);
        return;
      }
    }
    if (props.media && props.media.length) {
      this.media = props.media;
      return;
    }
    if (!this.media) {
      this.media = [];
    }
  }

  startBarAnimation({ active }) {
    return new Promise(resolve => {
      this.bar = this.getProgressBar();
      active.appendChild(this.bar);
      onceNextCssLayout().then(() => {
        onceNextCssLayout().then(() => {
          classListAdd(this.bar, this.classNames.barActive);
          resolve();
        });
        // STILL WAITING ON THE MULTIPLE LOADING THING
      });
    });
  }

  endBarAnimation(callback) {
    if (this.bar) {
      onceNextCssLayout().then(() => {
        onceTransitionEnd(this.bar).then(() => {
          callback();
        });
        classListAdd(this.bar, this.classNames.barEnd);
      });
    }
  }

  // REVISION
  // -- TINHA QUE UNIFICAR A PROMISE
  // -- O MEDIA PODE TER .URL
  // -- O MEDIA PODE TER .MEDIAS -- ARRAY DE MEDIAS PARA SER CARREGADO

  loadContent(active, media) {
    return new Promise((resolve, reject) => {
      if (this.props.onLoadStart || (media && media.onLoadStart)) {
        const caller = this.props.onLoadStart || (media && media.onLoadStart);
        this.startBarAnimation({ active });
        caller({
          next: () => {
            this.endBarAnimation(() => {
              resolve(this.bar);
            });
          },
          error: reject,
          ...this.getInfo(),
        });
        return;
      }
      if (media && (media.source || media.preload)) {
        const urls = media.preload
          ? media.preload
          : (media.source && [media.source]) || [];

        if (this.checkLoadedUrls(urls) === true) {
          resolve(null);
          return;
        }
        this.startBarAnimation({ active });
        mediaLoader.loadMultiple(urls).then(() => {
          this.pushLoaded(urls);
          this.endBarAnimation(() => {
            resolve(this.bar);
          });
        });
        return;
      }
      resolve(null);
    });
  }

  pushLoaded(urls) {
    this.loaded = [...this.loaded, ...urls];
  }

  checkLoadedUrls(urls) {
    let loaded = true;
    urls.forEach(url => {
      if (!this.loaded.includes(url)) {
        loaded = false;
      }
    });
    return loaded;
  }

  startAnimationMobile() {
    const { direction } = this;
    const active = this[this.active];
    const loader = this[this.loader];
    const contentEnterMoveClass = direction
      ? this.classNames.contentMoveRight
      : this.classNames.contentMoveLeft;
    const contentExitMoveClass = direction
      ? this.classNames.contentMoveLeft
      : this.classNames.contentMoveRight;
    if (this.props.onTransitionStart) {
      this.props.onTransitionStart({
        ...this.getInfo(),
        nextSlide: this[this.loader],
        nextIndex: this.nextIndex,
        nextMedia: this.media[this.nextIndex],
      });
    }
    const activeContent = active.querySelector(
      `.${getAnyClassName(this.classNames.content)}`
    );

    classListAdd(activeContent, contentExitMoveClass);
    classListAdd(activeContent, this.classNames.contentExit);

    const loaderContent = loader.querySelector(
      `.${getAnyClassName(this.classNames.content)}`
    );

    classListAdd(loaderContent, contentEnterMoveClass);
    classListAdd(loaderContent, this.classNames.contentStatic);

    classListAdd(active, this.classNames.animated);
    classListAdd(loader, this.classNames.animated);
  }

  animateMobileEnd(callback) {
    const { direction } = this;
    const active = this[this.active];
    const loader = this[this.loader];
    const exitPosition = direction
      ? this.classNames.moveLeft
      : this.classNames.moveRight;
    const contentEnterMoveClass = direction
      ? this.classNames.contentMoveRight
      : this.classNames.contentMoveLeft;
    const contentExitMoveClass = direction
      ? this.classNames.contentMoveLeft
      : this.classNames.contentMoveRight;
    const loaderContent = loader.querySelector(
      `.${getAnyClassName(this.classNames.content)}`
    );
    const activeContent = active.querySelector(
      `.${getAnyClassName(this.classNames.content)}`
    );

    classListRemove(loaderContent, this.classNames.contentStatic);
    classListAdd(loader, this.classNames.animatedMobile);
    classListAdd(active, this.classNames.animatedMobile);

    onceNextCssLayout().then(() => {
      loader.style.transform = 'translate3d(0, 0, 0)';
      active.style.transform = `translate3d(${
        this.direction ? '-' : ''
      }100%, 0, 0)`;
      onceTransitionEnd(active).then(() => {
        if (!this.loading) {
          return;
        }
        classListRemove(active, this.classNames.animated);
        classListRemove(loader, this.classNames.animated);
        classListAdd(loader, this.classNames.active);
        classListRemove(active, this.classNames.active);
        classListRemove(active, exitPosition);
        classListRemove(loader, this.classNames.animatedMobile);
        classListRemove(active, this.classNames.animatedMobile);
        classListRemove(activeContent, contentExitMoveClass);
        classListRemove(activeContent, this.classNames.contentExit);
        classListRemove(loaderContent, contentEnterMoveClass);

        // loader.style.transform = null;
        // active.style.transform = null;

        if (this.buttons) {
          setTimeout(() => {
            if (this.buttons) {
              classListRemove(
                this.buttons.element,
                this.classNames.controlsActive
              );
            }
          }, this.props.controlsReturnDelay);
        }

        if (this.activeArrow) {
          classListRemove(this.activeArrow, this.activeArrowClass);
          this.activeArrow = null;
          this.activeArrowClass = null;
        }

        /* INVERT BOXES */
        this.active = this.active === 'boxA' ? 'boxB' : 'boxA';
        this.loader = this.active === 'boxA' ? 'boxB' : 'boxA';

        if (callback) {
          callback();
        }
      });
    });
  }

  runAnimation({
    active,
    media,
    contentExitMoveClass,
    contentEnterMoveClass,
    activeContentElement,
    loaderContentElement,
    loader,
    loaderPosition,
    exitPosition,
    callback,
    transitionDelay,
  }) {
    this.loadContent(active, media).then(bar => {
      classListAdd(activeContentElement, contentExitMoveClass);
      classListAdd(activeContentElement, this.classNames.contentExit);
      classListAdd(loaderContentElement, contentEnterMoveClass);
      classListAdd(loaderContentElement, this.classNames.contentStatic);
      setTimeout(() => {
        onceNextCssLayout().then(() => {
          classListAdd(active, this.classNames.animated);
          classListAdd(loader, this.classNames.animated);
          classListRemove(loaderContentElement, this.classNames.contentStatic);
          classListAdd(active, this.classNames.exit);
          classListAdd(loader, loaderPosition);
          classListAdd(active, exitPosition);
          onceAnimationEnd(active).then(() => {
            classListAdd(loader, this.classNames.active);
            classListRemove(loader, loaderPosition);
            classListRemove(loader, this.classNames.animated);
            classListRemove(active, this.classNames.animated);
            classListRemove(active, this.classNames.active);
            classListRemove(active, exitPosition);
            classListRemove(active, this.classNames.exit);
            classListRemove(activeContentElement, contentExitMoveClass);
            classListRemove(activeContentElement, this.classNames.contentExit);
            classListRemove(loaderContentElement, contentEnterMoveClass);
            // removeElement BAR;
            if (bar) {
              active.removeChild(bar);
            }

            if (this.buttons) {
              setTimeout(() => {
                if (this.buttons) {
                  classListRemove(
                    this.buttons.element,
                    this.classNames.controlsActive
                  );
                }
              }, this.props.controlsReturnDelay);
            }

            // * INVERT BOXES *
            this.active = this.active === 'boxA' ? 'boxB' : 'boxA';
            this.loader = this.active === 'boxA' ? 'boxB' : 'boxA';
            const release = !this.activeArrow;

            if (this.activeArrow) {
              onceTransitionEnd(this.activeArrow, {
                tolerance: this.index === null ? 0 : 2,
              }).then(() => {
                this.releaseTransition();
              });
              classListRemove(this.activeArrow, this.activeArrowClass);
              this.activeArrow = null;
              this.activeArrowClass = null;
            }

            callback({
              release,
            });
          });
        });
      }, transitionDelay);
    });
  }

  releaseTransition() {
    this.loading = false;
    // this.onTransitionEnd();
  }

  startAnimation(direction, media, callback) {
    const { transitionDelay } = this.props;
    const active = this[this.active];
    const loader = this[this.loader];
    const loaderPosition = direction
      ? this.classNames.moveRight
      : this.classNames.moveLeft;
    const exitPosition = direction
      ? this.classNames.moveLeft
      : this.classNames.moveRight;
    const contentEnterMoveClass = direction
      ? this.classNames.contentMoveRight
      : this.classNames.contentMoveLeft;
    const contentExitMoveClass = direction
      ? this.classNames.contentMoveLeft
      : this.classNames.contentMoveRight;
    const activeContentElement = active.querySelector(
      `.${getAnyClassName(this.classNames.content)}`
    );
    const loaderContentElement = loader.querySelector(
      `.${getAnyClassName(this.classNames.content)}`
    );

    active.style.removeProperty('transform');
    loader.style.removeProperty('transform');

    this.onTransitionStart();

    const animationObject = {
      active,
      media,
      contentExitMoveClass,
      contentEnterMoveClass,
      activeContentElement,
      loaderContentElement,
      loader,
      loaderPosition,
      exitPosition,
      callback,
      transitionDelay,
    };

    this.runAnimation(animationObject);
  }

  goTo({ index, direction, touch = false }) {
    const nextIndex = this.getIndex(index);
    if (this.loading === true || index === this.index) {
      if (this.props.onTransitionReject) {
        this.props.onTransitionReject({
          ...this.getInfo(),
          forceTransition: () => {
            this.goTo({ index, direction, touch });
          },
        });
      }
      return;
    }

    this.loading = true;
    this.direction = direction;
    if (touch === true) {
      this.chargeIndex(nextIndex, () => {
        this.activateArrows(direction);
        this.startAnimationMobile();
      });
      return;
    }
    this.activateArrows(direction, () => {
      this.chargeIndex(nextIndex, media => {
        this.renderedLoader = true;
        this.startAnimation(direction, media, ({ release = true }) => {
          this.index = this.nextIndex;
          this.setState({ index: this.index }, () => {
            this.onTransitionEnd();
            if (release === true) {
              this.releaseTransition();
            }
          });
        });
      });
    });
  }

  checkIndex(index) {
    return index > this.media.length - 1
      ? 0
      : index < 0
      ? this.media.length - 1
      : index;
  }

  chargeIndex(index, callback) {
    this.nextIndex = this.checkIndex(index);
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
    const dirName = direction ? 'right' : 'left';
    const mergedStyles = mergeStyles(this.props.cssModule);
    const arrowClass = getAnyClassName(
      getClassName(
        `${this.rootElement}__controls__arrow-${dirName}`,
        mergedStyles
      )
    );

    if (this.buttons) {
      const activeArrow = direction ? this.buttons.next : this.buttons.prev;
      this.activeArrow = activeArrow.querySelector(`.${arrowClass}`);
    }

    if (
      !this.activeArrow ||
      (this.buttons &&
        this.buttons.element &&
        this.buttons.element.classList.contains(this.classNames.controlsActive))
    ) {
      if (callback) {
        callback();
      }
      return;
    }

    this.activeArrowClass = getClassName(
      `${this.rootElement}__controls__arrow-${dirName}--active`,
      mergedStyles
    );

    // This is due to the usage of pseudo elements animation
    onceTransitionEnd(this.activeArrow, {
      tolerance: this.index === null ? 0 : 2,
    }).then(() => {
      if (callback) {
        callback();
      }
    });

    if (this.buttons && this.buttons.element) {
      classListAdd(this.buttons.element, this.classNames.controlsActive);
      classListAdd(this.activeArrow, this.activeArrowClass);
    }
    // DEVE CHEGAR AQUI PROBLEMATICAMENTE
  }

  clickNext = () => {
    const next = this.index === null ? 0 : this.index + 1;
    this.onTransitionRequest('next', next);
    this.goTo({
      index: next,
      direction: true,
    });
  };

  clickPrev = () => {
    const prev = this.index - 1;
    this.onTransitionRequest('prev', prev);
    this.goTo({
      index: prev,
      direction: false,
    });
  };

  touchStart = event => {
    if (this.animating) {
      return;
    }
    if (this.index === null) {
      return;
    }
    const native = event.nativeEvent;
    this.touchStartPoint = native.touches[0].clientX;
  };

  touchMove = event => {
    if (this.animating || !this.touchStartPoint) {
      return;
    }
    const native = event.nativeEvent;
    let diff = native.touches[0].clientX - this.touchStartPoint;
    const active = this[this.active];
    const loader = this[this.loader];
    const direction = !(diff > 0);
    const abs = Math.abs(diff);
    if (this.touchEnabled === false) {
      if (abs > 20) {
        this.touchEnabled = true;
        this.touchStartPoint = native.touches[0].clientX;
      }
      return;
    }
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
  };

  touchEnd = () => {
    if (this.animating || !this.touchStartPoint || !this.loading) {
      return;
    }

    this.touchStartPoint = null;
    this.animating = true;
    this.touchEnabled = false;
    this.animateMobileEnd(() => {
      this.index = this.nextIndex;
      this.setState({ index: this.index });
      this.onTransitionEnd();
      this.animating = false;
      this.loading = false;
      this.unchargeIndex();
    });
  };

  bulletClick = event => {
    const button = event.currentTarget;
    const index = parseInt(button.getAttribute('data-index'), 10);
    this.goTo(
      {
        index,
        direction: !(this.index > index),
      },
      () => {
        onceNextCssLayout().then(() => {
          classListAdd(button, this.classNames.bulletsLoading);
        });
      }
    );
  };

  renderBox(box) {
    const { mobileTouch } = this.props;
    const extra = {};

    if (mobileTouch) {
      extra.onTouchStart = this.touchStart;
      extra.onTouchMove = this.touchMove;
      extra.onTouchEnd = this.touchEnd;
    }

    return (
      <div
        ref={el => {
          this[`box${box}`] = el;
        }}
        className={this.classNames.box}
        {...extra}
      >
        {this.state[`box${box}`] && (
          <Media
            media={this.state[`box${box}`]}
            className={this.classNames.content}
          />
        )}
      </div>
    );
  }

  render() {
    const {
      cssModule,
      organicArrows,
      bullets,
      style,
      customContent,
      buttons,
      buttonContentLeft,
      buttonContentRight,
    } = this.props;
    const { rootElement } = this;

    return (
      <div
        ref={slider => {
          this.slider = slider;
        }}
        className={this.getRootClassName()}
        style={style}
      >
        <div
          ref={wrapper => {
            this.wrapper = wrapper;
          }}
          className={this.classNames.wrapper}
        >
          <div
            ref={container => {
              this.container = container;
            }}
            className={this.classNames.container}
          >
            {this.renderBox('A')}
            {this.renderBox('B')}
          </div>
          {buttons && (
            <Buttons
              rootElement={rootElement}
              cssModule={mergeStyles(cssModule)}
              onMount={btns => {
                this.buttons = btns;
              }}
              onNext={this.clickNext}
              onPrev={this.clickPrev}
              organicArrows={organicArrows}
              buttonContentLeft={buttonContentLeft}
              buttonContentRight={buttonContentRight}
            />
          )}
          {customContent}
        </div>
        {bullets && (
          <Bullets
            cssModule={mergeStyles(cssModule)}
            rootElement={rootElement}
            media={this.media}
            selected={this.state.index}
            onClick={info => {
              this.onTransitionRequest('bullet', info.index);
              this.goTo(info);
            }}
          />
        )}
      </div>
    );
  }
}
