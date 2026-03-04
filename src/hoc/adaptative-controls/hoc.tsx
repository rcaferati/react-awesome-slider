import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  AdaptiveControlsOptions,
  AdaptiveControlsInjectedProps,
} from './types';
import { useAdaptiveControls } from './useAdaptiveControls';

// Same helpers core uses (cssModules-safe)
import { mergeStyles, getAnyClassName } from '../../core/helpers';
import { getClassName } from '../../helpers/components';

export type AdaptiveControlsHocProps = {
  adaptiveControls?: AdaptiveControlsOptions;

  /**
   * If the wrapped component supports rootElement (AwesomeSlider does),
   * we use it for cssModules-safe lookups (content class sampling).
   */
  rootElement?: string;

  /**
   * If the wrapped component supports cssModule (AwesomeSlider does),
   * we use it to resolve the mapped class tokens.
   */
  cssModule?: any;

  /**
   * Wrapped component may expose these. We wrap them.
   */
  onFirstMount?: ((info: any) => void) | null;
  onTransitionEnd?: ((info: any) => void) | null;
};

const DEFAULT_ROOT = 'awssld';

export default function AdaptiveControlsHoc<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const Component: React.FC<
    P & AdaptiveControlsHocProps & AdaptiveControlsInjectedProps
  > = (props) => {
    const {
      adaptiveControls,
      adaptiveControlsRootRef,
      rootElement,
      cssModule,
      onFirstMount,
      onTransitionEnd,
      ...rest
    } = props as AdaptiveControlsHocProps & AdaptiveControlsInjectedProps & P;

    // Wrapper always exists even if WrappedComponent doesn't forward refs
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    // We apply vars on the *real* slider root, not on our wrapper.
    const [resolvedRootEl, setResolvedRootEl] = useState<HTMLElement | null>(
      null
    );

    // We prefer sampling the actual slide content (where background is usually set),
    // not the box wrapper (boxA/boxB) which is often transparent.
    const [activeSlideEl, setActiveSlideEl] = useState<HTMLElement | null>(
      null
    );

    // If user provides explicit root ref, prefer it always.
    const explicitRootEl = adaptiveControlsRootRef?.current || null;

    // Resolve content class token for querying inside currentSlide (cssModules-safe).
    const contentClassToken = useMemo(() => {
      const merged = mergeStyles(cssModule);
      const key = rootElement || DEFAULT_ROOT;
      const token = getAnyClassName(
        getClassName(`${key}__content`, merged as any)
      );
      return token || '';
    }, [rootElement, cssModule]);

    // Fallback: if we don't get info.element yet, locate the slider root in wrapper.
    useLayoutEffect(() => {
      if (explicitRootEl) {
        setResolvedRootEl(explicitRootEl);
        return;
      }

      const wrap = wrapperRef.current;
      if (!wrap) {
        setResolvedRootEl(null);
        return;
      }

      const key = rootElement || DEFAULT_ROOT;
      const merged = mergeStyles(cssModule);

      // root class token, cssModules-safe
      const rootClassToken = getAnyClassName(getClassName(key, merged as any));

      const found =
        (rootClassToken
          ? (wrap.querySelector(`.${rootClassToken}`) as HTMLElement | null)
          : null) ||
        (wrap.firstElementChild as HTMLElement | null) ||
        null;

      setResolvedRootEl(found);
    }, [explicitRootEl, rootElement, cssModule]);

    const captureFromInfo = useCallback(
      (info: any, reason: string) => {
        if (!info || typeof info !== 'object') return;

        // ✅ Best: model.getInfo() exposes slider root as `element`
        const rootFromInfo =
          (info.element as HTMLElement | null | undefined) || null;

        // ✅ Best: model.getInfo() exposes active box element as `currentSlide`
        const currentBox =
          (info.currentSlide as HTMLElement | null | undefined) || null;

        // Prefer explicit root ref, then info.element, then our previous resolution.
        const nextRoot =
          explicitRootEl || rootFromInfo || resolvedRootEl || null;
        if (nextRoot && nextRoot !== resolvedRootEl) {
          setResolvedRootEl(nextRoot);
        }

        // Try to sample the actual slide "content" node inside the active box.
        // This is where background-color usually lives (especially for children screens).
        let nextActive: HTMLElement | null = null;

        if (currentBox) {
          if (contentClassToken) {
            nextActive =
              (currentBox.querySelector(
                `.${contentClassToken}`
              ) as HTMLElement | null) || null;
          }
          // If not found, fall back to the box itself.
          nextActive = nextActive || currentBox;
        } else {
          // If there's no currentSlide, fall back to sampling the root itself.
          nextActive = nextRoot;
        }

        // Avoid churn if nothing changed.
        if (nextActive !== activeSlideEl) {
          setActiveSlideEl(nextActive);
        }

        // Optional: provide reason to options.onApplied via hook's internal callback,
        // but we keep it inside useAdaptiveControls; no external side effects here.
        void reason;
      },
      [explicitRootEl, resolvedRootEl, contentClassToken, activeSlideEl]
    );

    // Hook that actually computes & applies CSS variables.
    useAdaptiveControls({
      rootEl: explicitRootEl || resolvedRootEl,
      activeSlideEl,
      options: adaptiveControls,
    });

    // Wrap user handlers so we capture info.
    const wrappedOnFirstMount = useCallback(
      (info: any) => {
        if (typeof onFirstMount === 'function') onFirstMount(info);
        captureFromInfo(info, 'onFirstMount');
      },
      [onFirstMount, captureFromInfo]
    );

    const wrappedOnTransitionEnd = useCallback(
      (info: any) => {
        if (typeof onTransitionEnd === 'function') onTransitionEnd(info);
        captureFromInfo(info, 'onTransitionEnd');
      },
      [onTransitionEnd, captureFromInfo]
    );

    return (
      <div ref={wrapperRef}>
        <WrappedComponent
          {...(rest as P)}
          // preserve passthrough props that the wrapped component may use
          rootElement={rootElement as any}
          cssModule={cssModule as any}
          // ✅ wrapped hooks
          onFirstMount={wrappedOnFirstMount as any}
          onTransitionEnd={wrappedOnTransitionEnd as any}
        />
      </div>
    );
  };

  Component.displayName = `AdaptiveControlsHoc(${
    (WrappedComponent as any).displayName ||
    (WrappedComponent as any).name ||
    'Component'
  })`;

  return Component;
}
