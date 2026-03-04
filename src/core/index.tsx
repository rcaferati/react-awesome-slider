import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import { onceNextCssLayout } from '@rcaferati/wac';

import type { MediaItem, ClassNames, CssModuleMerged } from './helpers';
import { mergeStyles, classListAdd, classListRemove } from './helpers';

import createEngine from './engine';
import createModel from './model';

import Bullets from './bullets';
import Buttons from './buttons';
import type { ButtonsMountInfo } from './buttons';
import Media from './media';

const ROOTELM = 'awssld';

export type BulletsPosition = 'outside' | 'inside';

export type AwesomeSliderProps = {
  animation?: string | null;
  bullets?: boolean;
  /**
   * Controls where bullets sit relative to the slider box.
   * - outside: default classic behavior (bottom: -40px)
   * - inside: places bullets into the slide area (bottom: 40px)
   */
  bulletsPosition?: BulletsPosition;

  buttonContentLeft?: React.ReactNode;
  buttonContentRight?: React.ReactNode;
  buttons?: boolean;
  children?: React.ReactNode;
  className?: string | null;
  controlsReturnDelay?: number;
  cssModule?: any;
  customContent?: React.ReactNode;
  onLoadStart?: ((payload: any) => void) | null;
  disabled?: boolean;
  fillParent?: boolean;
  infinite?: boolean;
  media?: MediaItem[];
  name?: string;
  onFirstMount?: ((info: any) => void) | null;
  onResetSlider?: ((info: any) => void) | null;
  onStartupRelease?: ((info: any) => void) | null;
  onTransitionEnd?: ((info: any) => void) | null;
  onTransitionRequest?: ((info: any) => void) | null;
  onTransitionStart?: ((info: any) => void) | null;
  organicArrows?: boolean;
  rootElement?: string;
  selected?: any;
  startup?: boolean;
  startupDelay?: number;
  startupScreen?: any;
  style?: React.CSSProperties;
  transitionDelay?: number;
  mobileTouch?: boolean;

  onTransitionReject?: ((info: any) => void) | null;
};

type AwesomeSliderState = {
  index: number | null;
  boxA: any;
  boxB: any;
};

type BoxKey = 'boxA' | 'boxB';

const DEFAULT_PROPS: Required<
  Pick<
    AwesomeSliderProps,
    | 'animation'
    | 'bullets'
    | 'bulletsPosition'
    | 'buttonContentLeft'
    | 'buttonContentRight'
    | 'buttons'
    | 'children'
    | 'className'
    | 'controlsReturnDelay'
    | 'cssModule'
    | 'customContent'
    | 'onLoadStart'
    | 'disabled'
    | 'fillParent'
    | 'infinite'
    | 'media'
    | 'name'
    | 'onFirstMount'
    | 'onResetSlider'
    | 'onStartupRelease'
    | 'onTransitionEnd'
    | 'onTransitionRequest'
    | 'onTransitionStart'
    | 'onTransitionReject'
    | 'organicArrows'
    | 'rootElement'
    | 'selected'
    | 'startup'
    | 'startupDelay'
    | 'startupScreen'
    | 'style'
    | 'transitionDelay'
    | 'mobileTouch'
  >
> = {
  animation: null,
  bullets: true,
  bulletsPosition: 'outside',

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
  onTransitionReject: null,
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

type RuntimeCtx = {
  // reacty
  props: AwesomeSliderProps;
  state: AwesomeSliderState;
  setState: (patch: any, cb?: () => void) => void;

  // runtime
  _mounted: boolean;
  _timeouts: Set<ReturnType<typeof setTimeout>>;
  _setTimeout: (fn: () => void, ms: number) => any;

  rootElement: string;
  classNames: ClassNames;

  // dom
  slider: HTMLDivElement | null;
  wrapper: HTMLDivElement | null;
  container: HTMLDivElement | null;
  boxA: HTMLDivElement | null;
  boxB: HTMLDivElement | null;

  // boxes
  active: BoxKey;
  loader: BoxKey;

  // indices
  index: number | null;
  nextIndex: number | null;

  // flags
  loading: boolean;
  direction: boolean;
  started: boolean;

  // touch
  touchEnabled: boolean;
  animating: boolean;
  touchStartPoint: number | null;

  // media/cache
  media: MediaItem[] | null; // IMPORTANT: stays null until setupStartup runs
  loaded: string[];
  bar: HTMLDivElement | null;

  // controls
  buttons: ButtonsMountInfo | null;
  activeArrow: Element | null;
  activeArrowClass: string | null;

  // engine/model
  engine: any;
  model: any;

  // bridge
  getInfo: () => any;
  releaseTransition: () => void;

  // dynamic: ctx[ctx.active] -> ctx.boxA/ctx.boxB
  [k: string]: any;
};

export type AwesomeSliderHandle = {
  getInfo: () => any;
  goTo: (args: { index: any; direction: boolean; touch?: boolean }) => void;
  resetSlider: (index?: number) => void;
};

function createInitialCtx(p: AwesomeSliderProps): RuntimeCtx {
  const ctx: RuntimeCtx = {
    props: p,
    state: { index: null, boxA: null, boxB: null },
    setState: () => {},

    _mounted: false,
    _timeouts: new Set(),
    _setTimeout: () => 0,

    rootElement: p.rootElement || ROOTELM,
    classNames: {} as any,

    slider: null,
    wrapper: null,
    container: null,
    boxA: null,
    boxB: null,

    active: 'boxA',
    loader: 'boxB',

    index: null,
    nextIndex: null,

    loading: false,
    direction: true,
    started: false,

    touchEnabled: false,
    animating: false,
    touchStartPoint: null,

    media: null, // ✅ critical for correct first init
    loaded: [],
    bar: null,

    buttons: null,
    activeArrow: null,
    activeArrowClass: null,

    engine: null as any,
    model: null as any,

    getInfo: () => ({}),
    releaseTransition: () => {},
  };

  ctx._setTimeout = (fn, ms) => {
    const id = setTimeout(() => {
      ctx._timeouts.delete(id);
      fn();
    }, ms);
    ctx._timeouts.add(id);
    return id;
  };

  return ctx;
}

const AwesomeSlider = forwardRef<AwesomeSliderHandle, AwesomeSliderProps>(
  (incomingProps, ref) => {
    // merge defaults exactly once per render (don’t rely on React defaultProps)
    const props = useMemo(
      () => ({ ...DEFAULT_PROPS, ...incomingProps }),
      [incomingProps]
    );

    // ✅ compute css var for bullets position
    const bulletsBottomVar = useMemo(() => {
      // outside => -40px (classic)
      // inside  =>  40px (into the slide area)
      return props.bulletsPosition === 'inside' ? '40px' : '-40px';
    }, [props.bulletsPosition]);

    // ✅ merge into root style (inline CSS vars)
    const rootStyle = useMemo(() => {
      const s = (props.style || {}) as any;
      return {
        ...s,
        ['--control-bullets-bottom']: bulletsBottomVar,
      } as React.CSSProperties;
    }, [props.style, bulletsBottomVar]);

    const ctxRef = useRef<RuntimeCtx | null>(null);
    const cbQueueRef = useRef<(() => void)[]>([]);
    const prevPropsRef = useRef<AwesomeSliderProps | null>(null);

    const [state, setState] = useState<AwesomeSliderState>(() => {
      const p0 = { ...DEFAULT_PROPS, ...incomingProps };

      const ctx = createInitialCtx(p0);
      ctxRef.current = ctx;

      ctx.engine = createEngine(() => ctxRef.current as any);
      ctx.model = createModel(() => ctxRef.current as any, ctx.engine);

      ctx.getInfo = () => ctx.model.getInfo();
      ctx.releaseTransition = () => ctx.engine.releaseTransition();

      // ✅ must run before first render (initial screen correctness)
      ctx.model.setupStartup(p0 as any);

      return ctx.state;
    });

    const setStateWithCb = useCallback(
      (patch: any, cb?: () => void) => {
        if (cb) cbQueueRef.current.push(cb);
        setState((prev) => {
          const nextPatch = typeof patch === 'function' ? patch(prev) : patch;
          return { ...prev, ...nextPatch };
        });
      },
      [setState]
    );

    // keep ctx in sync every render
    const ctx = ctxRef.current!;
    ctx.props = props;
    ctx.state = state;
    ctx.rootElement = props.rootElement || ROOTELM;
    ctx.setState = setStateWithCb;

    // flush queued "setState callbacks" after commit
    useLayoutEffect(() => {
      const c = ctxRef.current;
      if (!c) return;

      const q = cbQueueRef.current;
      if (!q.length) return;

      cbQueueRef.current = [];
      for (const fn of q) {
        if (c._mounted) fn();
      }
    }, [state]);

    // mount/unmount behavior (mirrors componentDidMount/WillUnmount)
    useLayoutEffect(() => {
      const c = ctxRef.current!;
      c._mounted = true;

      if (c.boxA) classListAdd(c.boxA, c.classNames.active);

      if (c.props.startupScreen) {
        if (c.buttons) {
          classListAdd(c.buttons.element, c.classNames.controlsHidden);
          classListAdd(c.buttons.element, c.classNames.controlsActive);
        }
        if (c.props.startup === true && (c.media || []).length > 0) {
          c.model.startup();
        }
      }

      if (c.props.onFirstMount) {
        c.props.onFirstMount({ ...c.getInfo() });
      }

      if (c.buttons) {
        onceNextCssLayout().then(() => {
          const cc = ctxRef.current;
          if (!cc || !cc._mounted) return;
          if (cc.buttons && cc.buttons.element) {
            classListRemove(cc.buttons.element, cc.classNames.controlsHidden);
          }
        });
      }

      return () => {
        const cc = ctxRef.current;
        if (!cc) return;
        cc._mounted = false;
        for (const id of cc._timeouts) clearTimeout(id);
        cc._timeouts.clear();
      };
    }, []);

    // props-change logic (mirrors componentDidUpdate guard)
    useEffect(() => {
      const c = ctxRef.current!;
      const prev = prevPropsRef.current;

      if (!prev) {
        prevPropsRef.current = props;
        return;
      }

      const didPropsChange =
        prev.children !== props.children ||
        prev.media !== props.media ||
        prev.cssModule !== props.cssModule ||
        prev.className !== props.className ||
        prev.animation !== props.animation ||
        prev.disabled !== props.disabled ||
        prev.fillParent !== props.fillParent ||
        prev.infinite !== props.infinite ||
        prev.organicArrows !== props.organicArrows ||
        prev.rootElement !== props.rootElement ||
        prev.startup !== props.startup ||
        prev.startupScreen !== props.startupScreen ||
        prev.name !== props.name ||
        prev.selected !== props.selected ||
        prev.bulletsPosition !== props.bulletsPosition; // ✅ include for completeness

      if (!didPropsChange) {
        prevPropsRef.current = props;
        return;
      }

      c.model.checkChildren(props as any, prev as any);
      c.model.setupClassNames(mergeStyles(props.cssModule));

      if (props.name !== prev.name) {
        c.model.resetSlider(c.model.getIndex(props.selected));
        prevPropsRef.current = props;
        return;
      }

      if (props.startup === true && c.started === false) {
        c.model.startup();
        prevPropsRef.current = props;
        return;
      }

      if (props.selected !== prev.selected) {
        const index = c.model.getIndex(props.selected);

        const direction =
          props.infinite === true &&
          index === 0 &&
          c.index === (c.media || []).length - 1
            ? true
            : !(c.index! > index);

        c.model.goTo({ index, direction });
        prevPropsRef.current = props;
        return;
      }

      c.model.refreshSlider();
      prevPropsRef.current = props;
    }, [
      props.children,
      props.media,
      props.cssModule,
      props.className,
      props.animation,
      props.disabled,
      props.fillParent,
      props.infinite,
      props.organicArrows,
      props.rootElement,
      props.startup,
      props.startupScreen,
      props.name,
      props.selected,
      props.bulletsPosition, // ✅
    ]);

    // imperative ref (best-effort compat vs old class refs)
    useImperativeHandle(
      ref,
      () => ({
        getInfo: () => ctxRef.current!.model.getInfo(),
        goTo: (args) => ctxRef.current!.model.goTo(args),
        resetSlider: (index?: number) =>
          ctxRef.current!.model.resetSlider(index),
      }),
      []
    );

    // handlers read/write ctxRef (no stale closures)
    const clickNext = useCallback(() => {
      const c = ctxRef.current!;
      const next = c.index === null ? 0 : c.index + 1;
      c.model.onTransitionRequest('next', next);
      c.model.goTo({ index: next, direction: true });
    }, []);

    const clickPrev = useCallback(() => {
      const c = ctxRef.current!;
      const prev = (c.index ?? 0) - 1;
      c.model.onTransitionRequest('prev', prev);
      c.model.goTo({ index: prev, direction: false });
    }, []);

    const touchStart = useCallback(
      (event: React.TouchEvent<HTMLDivElement>) => {
        const c = ctxRef.current!;
        if (c.animating) return;
        if (c.index === null) return;
        c.touchStartPoint = event.nativeEvent.touches[0].clientX;
      },
      []
    );

    const touchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
      const c = ctxRef.current!;
      if (c.animating || !c.touchStartPoint) return;

      let diff = event.nativeEvent.touches[0].clientX - c.touchStartPoint;

      const activeEl = (c as any)[c.active] as HTMLDivElement | null;
      const loaderEl = (c as any)[c.loader] as HTMLDivElement | null;
      if (!activeEl || !loaderEl) return;

      const direction = !(diff > 0);
      const abs = Math.abs(diff);

      if (c.touchEnabled === false) {
        if (abs > 20) {
          c.touchEnabled = true;
          c.touchStartPoint = event.nativeEvent.touches[0].clientX;
        }
        return;
      }

      if (abs >= 10) {
        if (c.loading === false) {
          c.model.goTo({
            index: direction ? (c.index ?? 0) + 1 : (c.index ?? 0) - 1,
            direction,
            touch: true,
          });
        } else if (c.direction === true) {
          diff += 10;
          if (Math.abs(diff) > activeEl.offsetWidth)
            diff = -activeEl.offsetWidth;
          else if (diff > 0) diff = 0;

          activeEl.style.transform = `translate3d(${diff}px, 0, 0)`;
          loaderEl.style.transform = `translate3d(calc(100% + ${diff}px), 0, 0)`;
        } else {
          diff -= 10;
          if (Math.abs(diff) > activeEl.offsetWidth)
            diff = activeEl.offsetWidth;
          else if (diff < 0) diff = 0;

          activeEl.style.transform = `translate3d(${diff}px, 0, 0)`;
          loaderEl.style.transform = `translate3d(calc(-100% + ${diff}px), 0, 0)`;
        }
      }
    }, []);

    const touchEnd = useCallback(() => {
      const c = ctxRef.current!;
      if (c.animating || !c.touchStartPoint || !c.loading) return;

      c.touchStartPoint = null;
      c.animating = true;
      c.touchEnabled = false;

      c.engine.animateMobileEnd(() => {
        const cc = ctxRef.current!;
        if (!cc._mounted) return;

        cc.index = cc.nextIndex;
        cc.setState({ index: cc.index });

        cc.model.onTransitionEnd();

        cc.animating = false;
        cc.loading = false;

        cc.model.unchargeIndex();
      });
    }, []);

    const setSliderRef = useCallback((el: HTMLDivElement | null) => {
      const c = ctxRef.current!;
      c.slider = el;
    }, []);

    const setWrapperRef = useCallback((el: HTMLDivElement | null) => {
      const c = ctxRef.current!;
      c.wrapper = el;
    }, []);

    const setContainerRef = useCallback((el: HTMLDivElement | null) => {
      const c = ctxRef.current!;
      c.container = el;
    }, []);

    const setBoxARef = useCallback((el: HTMLDivElement | null) => {
      const c = ctxRef.current!;
      c.boxA = el;
    }, []);

    const setBoxBRef = useCallback((el: HTMLDivElement | null) => {
      const c = ctxRef.current!;
      c.boxB = el;
    }, []);

    const renderBox = (box: 'A' | 'B') => {
      const c = ctxRef.current!;
      const extra: Partial<React.HTMLAttributes<HTMLDivElement>> = {};

      if (c.props.mobileTouch) {
        extra.onTouchStart = touchStart as any;
        extra.onTouchMove = touchMove as any;
        extra.onTouchEnd = touchEnd as any;
      }

      const refFn = box === 'A' ? setBoxARef : setBoxBRef;

      return (
        <div ref={refFn} className={c.classNames.box} {...extra}>
          {(state as any)[`box${box}`] && (
            <Media
              media={(state as any)[`box${box}`]}
              className={c.classNames.content}
            />
          )}
        </div>
      );
    };

    const rootElement = ctx.rootElement;

    return (
      <div
        ref={setSliderRef}
        className={ctx.model.getRootClassName()}
        style={rootStyle}
      >
        <div ref={setWrapperRef} className={ctx.classNames.wrapper}>
          <div ref={setContainerRef} className={ctx.classNames.container}>
            {renderBox('A')}
            {renderBox('B')}
          </div>

          {props.buttons && (
            <Buttons
              rootElement={rootElement}
              cssModule={mergeStyles(props.cssModule) as CssModuleMerged}
              onMount={(btns: ButtonsMountInfo) => {
                ctxRef.current!.buttons = btns;
              }}
              onNext={clickNext}
              onPrev={clickPrev}
              organicArrows={props.organicArrows}
              buttonContentLeft={props.buttonContentLeft}
              buttonContentRight={props.buttonContentRight}
            />
          )}

          {props.customContent}
        </div>

        {props.bullets && (
          <Bullets
            cssModule={mergeStyles(props.cssModule) as CssModuleMerged}
            rootElement={rootElement}
            media={(ctx.media || []) as any}
            selected={state.index as any}
            onClick={(info: any) => {
              ctx.model.onTransitionRequest('bullet', info.index);
              ctx.model.goTo(info);
            }}
          />
        )}
      </div>
    );
  }
);

AwesomeSlider.displayName = 'AwesomeSlider';

export default AwesomeSlider;
