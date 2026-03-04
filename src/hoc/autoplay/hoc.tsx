// autoplay/hoc.tsx (drop-in replacement)
// ✅ Functional HOC preserving legacy behavior (including forceStop, timer DOM injection, selected state).
// ✅ No StrictMode double-timer: guarded with refs + cleanup.
// ✅ Keeps "showTimer" prop for API compatibility (still unused, like legacy).

import React, {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { onceNextCssLayout, onceTransitionEnd } from '@rcaferati/wac';
import { getClassName } from '../../helpers/components';
import { mergeStyles, getAnyClassName } from '../../core/helpers';

const ROOTELM = 'awssld';

type AnyObj = Record<string, any>;

type AutoplayProps = {
  interval?: number;
  cssModule?: any;
  play?: boolean;
  cancelOnInteraction?: boolean;
  timerHeight?: string;
  timerBackgroundColor?: string;
  showTimer?: boolean; // legacy API (unused by original)
  onTransitionStart?: ((info: any) => void) | null;
  onTransitionEnd?: ((info: any) => void) | null;
  onTransitionRequest?: ((info: any) => void) | null;
  onFirstMount?: ((info: any) => void) | null;
  rootElement?: string;
};

const DEFAULTS: Required<
  Pick<
    AutoplayProps,
    | 'interval'
    | 'play'
    | 'cancelOnInteraction'
    | 'timerHeight'
    | 'cssModule'
    | 'timerBackgroundColor'
    | 'showTimer'
    | 'onTransitionStart'
    | 'onTransitionEnd'
    | 'onTransitionRequest'
    | 'rootElement'
  >
> = {
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

function noop() {}

export default function AutoplayHoc<P extends AnyObj>(
  WrappedComponent: ComponentType<P>
) {
  const AutoplayWrapped: React.FC<P & AutoplayProps> = (props) => {
    const interval = props.interval ?? DEFAULTS.interval;
    const play = props.play ?? DEFAULTS.play;
    const cancelOnInteraction =
      props.cancelOnInteraction ?? DEFAULTS.cancelOnInteraction;
    const timerHeight = props.timerHeight ?? DEFAULTS.timerHeight;
    const timerBackgroundColor =
      props.timerBackgroundColor ?? DEFAULTS.timerBackgroundColor;
    const rootElement = props.rootElement ?? DEFAULTS.rootElement;

    const onFirstMount = props.onFirstMount ?? null;
    const onTransitionStart = props.onTransitionStart ?? null;
    const onTransitionEnd = props.onTransitionEnd ?? null;
    const onTransitionRequest = props.onTransitionRequest ?? null;

    // NOTE: keep showTimer prop for compatibility (legacy did nothing with it)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const showTimer = props.showTimer ?? DEFAULTS.showTimer;

    // --- internal refs (mirror legacy instance fields) -----------------------
    const forceStopRef = useRef(false);
    const currentInfoRef = useRef<any>(null);

    // Track whether we should ignore async callbacks after unmount
    const mountedRef = useRef(true);
    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
      };
    }, []);

    // mergedStyles is recomputed when cssModule changes (like componentWillReceiveProps)
    const mergedStyles = useMemo(
      () => mergeStyles(props.cssModule ?? DEFAULTS.cssModule),
      [props.cssModule]
    );

    const [selected, setSelected] = useState<number>(0);

    const getTimerSelector = useCallback(() => {
      const cls = getAnyClassName(
        getClassName(`${rootElement}__timer`, mergedStyles)
      );
      return `.${cls}`;
    }, [rootElement, mergedStyles]);

    const getBarFromSlide = useCallback(
      (sliderEl: Element | null | undefined) => {
        if (!sliderEl) return null;
        const bar = sliderEl.querySelector(getTimerSelector());
        return (bar as HTMLElement) || null;
      },
      [getTimerSelector]
    );

    const clearBarAnimation = useCallback(
      (bar: Element | null) => {
        if (!bar) return;
        bar.classList.remove(
          getClassName(`${rootElement}__timer--animated`, mergedStyles)
        );
      },
      [rootElement, mergedStyles]
    );

    const restartBarAnimation = useCallback(
      (bar: Element | null) => {
        if (!bar) return;
        bar.classList.remove(
          getClassName(`${rootElement}__timer--run`, mergedStyles)
        );
        bar.classList.remove(
          getClassName(`${rootElement}__timer--fast`, mergedStyles)
        );
      },
      [rootElement, mergedStyles]
    );

    const createBarElement = useCallback(() => {
      const bar = document.createElement('div');
      bar.classList.add(getClassName(`${rootElement}__timer`, mergedStyles));
      bar.style.setProperty('--timer-delay', `${interval}ms`);
      bar.style.setProperty('--timer-height', timerHeight);
      bar.style.setProperty('--timer-background-color', timerBackgroundColor);
      return bar;
    }, [
      rootElement,
      mergedStyles,
      interval,
      timerHeight,
      timerBackgroundColor,
    ]);

    const forceClearBar = useCallback(() => {
      const info = currentInfoRef.current;
      if (!info?.currentSlide) return;
      const bar = getBarFromSlide(info.currentSlide);
      restartBarAnimation(bar);
    }, [getBarFromSlide, restartBarAnimation]);

    const goToNext = useCallback(() => {
      const info = currentInfoRef.current;
      if (!info) return;

      const { currentIndex, slides } = info;
      const next = (currentIndex ?? 0) + 1;
      const nextSelected = next > (slides ?? 0) - 1 ? 0 : next;

      if (nextSelected === selected) {
        // same behavior as legacy: clear/restart and bail
        forceClearBar();
        return;
      }

      setSelected(nextSelected);
    }, [selected, forceClearBar]);

    const clearBar = useCallback(
      (info: any) => {
        const bar = getBarFromSlide(info?.currentSlide);
        if (!bar) return;

        // legacy hook: bar.clearCssEndEvent() if present
        const anyBar = bar as any;
        if (typeof anyBar.clearCssEndEvent === 'function') {
          anyBar.clearCssEndEvent();
        }

        bar.classList.add(
          getClassName(`${rootElement}__timer--fast`, mergedStyles)
        );

        onceTransitionEnd(bar).then(() => {
          if (!mountedRef.current) return;
          clearBarAnimation(bar);
        });
      },
      [getBarFromSlide, rootElement, mergedStyles, clearBarAnimation]
    );

    const setInfo = useCallback(
      (info: any) => {
        currentInfoRef.current = info;

        const idx = info?.currentIndex;
        if (typeof idx === 'number' && idx !== selected) {
          setSelected(idx);
        }
      },
      [selected]
    );

    const setTimer = useCallback(
      (element: Element | null | undefined) => {
        if (!element) return;
        if (forceStopRef.current === true) return;

        let bar = element.querySelector(
          getTimerSelector()
        ) as HTMLElement | null;
        const wrapper = element.querySelector('div'); // legacy: first inner div
        if (!wrapper) return;

        if (!bar) {
          bar = createBarElement();
          wrapper.appendChild(bar);
        }

        // mirror exact legacy class dance to retrigger transition
        bar.classList.remove(
          getClassName(`${rootElement}__timer--animated`, mergedStyles)
        );

        onceNextCssLayout().then(() => {
          if (!mountedRef.current) return;

          bar!.classList.remove(
            getClassName(`${rootElement}__timer--run`, mergedStyles)
          );
          bar!.classList.remove(
            getClassName(`${rootElement}__timer--fast`, mergedStyles)
          );

          onceNextCssLayout().then(() => {
            if (!mountedRef.current) return;

            bar!.classList.add(
              getClassName(`${rootElement}__timer--animated`, mergedStyles)
            );

            onceNextCssLayout().then(() => {
              if (!mountedRef.current) return;

              bar!.classList.add(
                getClassName(`${rootElement}__timer--run`, mergedStyles)
              );

              onceTransitionEnd(bar!).then(() => {
                if (!mountedRef.current) return;

                clearBarAnimation(bar);

                if (forceStopRef.current === true || play === false) return;
                goToNext();
              });
            });
          });
        });
      },
      [
        play,
        goToNext,
        rootElement,
        mergedStyles,
        getTimerSelector,
        createBarElement,
        clearBarAnimation,
      ]
    );

    // Equivalent to componentWillReceiveProps -> checkStartStatus(newProps)
    const prevPlayRef = useRef<boolean>(play);
    useEffect(() => {
      const prevPlay = prevPlayRef.current;
      prevPlayRef.current = play;

      const info = currentInfoRef.current;
      if (!info) return;

      if (prevPlay !== play) {
        if (play === true) {
          setTimer(info.currentSlide);
        } else {
          // legacy: forceClearBar(this.currentInfo)
          forceClearBar();
        }
      }
    }, [play, setTimer, forceClearBar]);

    // --- render --------------------------------------------------------------
    // Legacy typo: "inverval" was destructured but unused; we ignore it here too.
    const {
      interval: _interval,
      play: _play,
      cancelOnInteraction: _cancelOnInteraction,
      timerHeight: _timerHeight,
      timerBackgroundColor: _timerBackgroundColor,
      showTimer: _showTimer,
      onTransitionStart: _onTransitionStart,
      onTransitionEnd: _onTransitionEnd,
      onTransitionRequest: _onTransitionRequest,
      onFirstMount: _onFirstMount,
      rootElement: _rootElement,
      ...extra
    } = props as any;

    return (
      <WrappedComponent
        {...(extra as P)}
        selected={selected as any}
        onFirstMount={(info: any) => {
          if (onFirstMount) onFirstMount(info);

          // legacy early return if startupScreen exists
          if ((extra as any).startupScreen) return;

          setInfo(info);

          if (play === true) {
            setTimer(info?.currentSlide);
          }
        }}
        onTransitionStart={(info: any) => {
          const bar = getBarFromSlide(info?.nextSlide);
          if (bar) restartBarAnimation(bar);

          if (onTransitionStart) onTransitionStart(info);
        }}
        onTransitionRequest={(info: any) => {
          clearBar(info);
          currentInfoRef.current = info;

          if (cancelOnInteraction === true) {
            forceStopRef.current = true;
          }

          if (onTransitionRequest) onTransitionRequest(info);
        }}
        onTransitionEnd={(info: any) => {
          setInfo(info);

          if (play === true) {
            setTimer(info?.currentSlide);
          }

          if (onTransitionEnd) onTransitionEnd(info);
        }}
      />
    );
  };

  AutoplayWrapped.displayName = `AutoplayHoc(${
    (WrappedComponent as any).displayName ||
    (WrappedComponent as any).name ||
    'Component'
  })`;

  return AutoplayWrapped;
}
