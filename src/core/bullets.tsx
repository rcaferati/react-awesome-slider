import React, { memo, useCallback, useMemo } from 'react';
import { getClassName } from '../helpers/components';
import type { CssModuleMerged, MediaItem } from './helpers';

export type BulletClickInfo = {
  index: number;
  direction: boolean;
};

export type BulletsProps = {
  cssModule?: CssModuleMerged;
  rootElement: string;
  media?: MediaItem[];
  onClick?: (info: BulletClickInfo) => void;
  selected?: number;
};

function Bullets({
  cssModule = null,
  rootElement,
  media = [],
  onClick = () => {},
  selected = 0,
}: BulletsProps) {
  const loadingClass = useMemo(
    () => getClassName(`${rootElement}__bullets--loading`, cssModule as any),
    [rootElement, cssModule]
  );

  const activeClass = useMemo(
    () => getClassName(`${rootElement}__bullets--active`, cssModule as any),
    [rootElement, cssModule]
  );

  const onBulletClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;

      // Preserve existing behavior: add loading class immediately
      if (loadingClass) button.classList.add(loadingClass);

      const indexAttr = button.getAttribute('data-index');
      const index = Number.parseInt(indexAttr || '0', 10);
      const direction = !(selected > index);

      onClick({ index, direction });
    },
    [loadingClass, onClick, selected]
  );

  return (
    <nav className={getClassName(`${rootElement}__bullets`, cssModule as any)}>
      {media.map((_, index) => {
        const isActive = index === selected;

        return (
          <button
            key={`bullet-${index}`}
            type="button"
            data-index={index}
            onClick={onBulletClick}
            className={isActive ? activeClass : undefined}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={isActive ? 'true' : undefined}
          >
            {index}
          </button>
        );
      })}
    </nav>
  );
}

export default memo(Bullets);
