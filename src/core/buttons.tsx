import React, { memo, useLayoutEffect, useRef } from 'react';
import { getClassName } from '../helpers/components';
import type { CssModuleMerged } from './helpers';

export type ButtonsMountInfo = {
  element: HTMLDivElement | null;
  next: HTMLButtonElement | null;
  prev: HTMLButtonElement | null;
};

export type ButtonsProps = {
  cssModule?: CssModuleMerged;
  rootElement: string;

  onMount: (info: ButtonsMountInfo) => void;
  onNext: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onPrev: (e: React.MouseEvent<HTMLButtonElement>) => void;

  buttonContentLeft?: React.ReactNode;
  buttonContentRight?: React.ReactNode;
  organicArrows?: boolean;
};

function Buttons({
  cssModule = null,
  rootElement,
  onMount,
  onNext,
  onPrev,
  buttonContentLeft = null,
  buttonContentRight = null,
  organicArrows = true,
}: ButtonsProps) {
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);

  // ✅ layout effect runs during commit, before parent componentDidMount
  useLayoutEffect(() => {
    onMount({
      element: controlsRef.current,
      next: nextRef.current,
      prev: prevRef.current,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={controlsRef}
      className={[
        getClassName(`${rootElement}__controls`, cssModule as any),
        getClassName(`${rootElement}__controls--hidden`, cssModule as any),
      ].join(' ')}
    >
      {/* ✅ preserve original order: next first */}
      <button
        ref={nextRef}
        type="button"
        aria-label="next"
        className={getClassName(`${rootElement}__next`, cssModule as any)}
        onClick={onNext}
      >
        {organicArrows ? (
          <span
            className={getClassName(
              `${rootElement}__controls__arrow-right`,
              cssModule as any
            )}
          />
        ) : (
          buttonContentRight
        )}
      </button>

      <button
        ref={prevRef}
        type="button"
        aria-label="previous"
        className={getClassName(`${rootElement}__prev`, cssModule as any)}
        onClick={onPrev}
      >
        {organicArrows ? (
          <span
            className={getClassName(
              `${rootElement}__controls__arrow-left`,
              cssModule as any
            )}
          />
        ) : (
          buttonContentLeft
        )}
      </button>
    </div>
  );
}

export default memo(Buttons);
