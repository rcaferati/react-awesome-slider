/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { Children, isValidElement } from 'react';
import { classToModules, getClassName } from '../helpers/components';

export type CssModule = Record<string, string>;
export type CssModuleInput = CssModule | null | undefined;
export type CssModuleMerged = CssModule | null;

export type MediaItem = Record<string, any> & {
  source?: string;
  slug?: string;
  ['data-src']?: string;
  ['data-slug']?: string;
};

const splitClasses = (classString: unknown): string[] =>
  typeof classString === 'string'
    ? classString.trim().split(/\s+/).filter(Boolean)
    : [];

export const classListAdd = (
  element: Element | null | undefined,
  classString: unknown
): void => {
  if (!element) return;
  const tokens = splitClasses(classString);
  if (!tokens.length) return;
  tokens.forEach((c) => element.classList.add(c));
};

export const classListRemove = (
  element: Element | null | undefined,
  classString: unknown
): void => {
  if (!element) return;
  const tokens = splitClasses(classString);
  if (!tokens.length) return;
  tokens.forEach((c) => element.classList.remove(c));
};

export const getAnyClassName = (className: unknown): string => {
  const tokens = splitClasses(className);
  return tokens[0] || '';
};

export const mergeStyles = (styles: unknown): CssModuleMerged => {
  const arr = Array.isArray(styles) ? styles : [styles];
  const modules = arr.filter(
    (m): m is CssModule => !!m && typeof m === 'object' && !Array.isArray(m)
  );

  if (modules.length === 0) return null;
  if (modules.length === 1) return modules[0];

  const out: CssModule = { ...modules[0] };

  for (let i = 1; i < modules.length; i += 1) {
    const mod = modules[i];
    for (const [key, val] of Object.entries(mod)) {
      if (!val) continue;
      out[key] = out[key] ? `${out[key]} ${val}` : val;
    }
  }

  return out;
};

export type GetRootClassNameArgs = {
  rootElement: string;
  cssModule: CssModuleMerged;
  disabled?: boolean;
  organicArrows?: boolean;
  className?: string | null;
  total: number;
  current: number | null;
  infinite?: boolean;
  animation?: string | null;
  fillParent?: boolean;
};

export function getRootClassName({
  rootElement,
  cssModule,
  disabled,
  organicArrows,
  className,
  total,
  current,
  infinite,
  animation,
  fillParent,
}: GetRootClassNameArgs): string {
  let classNames: string[] = [rootElement];

  if (animation) classNames.push(`${rootElement}--${animation}`);
  if (organicArrows === true) classNames.push(`${rootElement}--organic-arrows`);
  if (disabled === true) classNames.push(`${rootElement}--disabled`);
  if (fillParent) classNames.push(`${rootElement}--fill-parent`);

  if (infinite === false && typeof current === 'number') {
    if (current === 0) classNames.push(`${rootElement}--first`);
    if (current === total - 1) classNames.push(`${rootElement}--last`);
  }

  // keep existing behavior: only module-map if it looks like a module map
  if (cssModule && cssModule[rootElement]) {
    classNames = classToModules(classNames, cssModule as any) as any;
  }

  if (className) classNames.push(...splitClasses(className));

  return classNames.join(' ').trim();
}

export function transformChildren(children: unknown): MediaItem[] {
  const media: MediaItem[] = [];
  const items = Children.toArray(children as any);

  items.forEach((child) => {
    if (!isValidElement(child)) return;

    const props: Record<string, any> = (child as any).props || {};
    const item: MediaItem = { ...props };

    if (props['data-src']) item.source = props['data-src'];
    if (props['data-slug']) item.slug = props['data-slug'];

    media.push(item);
  });

  return media;
}

export type ClassNames = {
  boxA: string;
  boxB: string;
  box: string;
  container: string;
  wrapper: string;
  bar: string;
  barActive: string;
  barEnd: string;
  content: string;
  contentStatic: string;
  contentMoveLeft: string;
  contentMoveRight: string;
  controlsHidden: string;
  controlsActive: string;
  animated: string;
  animatedMobile: string;
  contentExit: string;
  exit: string;
  active: string;
  moveLeft: string;
  moveRight: string;
  startUp: string;
  bulletsLoading: string;
};

export function setupClassNames(
  rootElement: string,
  cssModule: CssModuleMerged
): ClassNames {
  return {
    boxA: getClassName(`${rootElement}__boxA`, cssModule as any),
    boxB: getClassName(`${rootElement}__boxB`, cssModule as any),
    box: getClassName(`${rootElement}__box`, cssModule as any),
    container: getClassName(`${rootElement}__container`, cssModule as any),
    wrapper: getClassName(`${rootElement}__wrapper`, cssModule as any),
    bar: getClassName(`${rootElement}__bar`, cssModule as any),
    barActive: getClassName(`${rootElement}__bar--active`, cssModule as any),
    barEnd: getClassName(`${rootElement}__bar--end`, cssModule as any),
    content: getClassName(`${rootElement}__content`, cssModule as any),
    contentStatic: getClassName(
      `${rootElement}__content--static`,
      cssModule as any
    ),
    contentMoveLeft: getClassName(
      `${rootElement}__content--moveLeft`,
      cssModule as any
    ),
    contentMoveRight: getClassName(
      `${rootElement}__content--moveRight`,
      cssModule as any
    ),
    controlsHidden: getClassName(
      `${rootElement}__controls--hidden`,
      cssModule as any
    ),
    controlsActive: getClassName(
      `${rootElement}__controls--active`,
      cssModule as any
    ),
    animated: getClassName(`${rootElement}--animated`, cssModule as any),
    animatedMobile: getClassName(
      `${rootElement}--animated-mobile`,
      cssModule as any
    ),
    contentExit: getClassName(
      `${rootElement}__content--exit`,
      cssModule as any
    ),
    exit: getClassName(`${rootElement}--exit`, cssModule as any),
    active: getClassName(`${rootElement}--active`, cssModule as any),
    moveLeft: getClassName(`${rootElement}--moveLeft`, cssModule as any),
    moveRight: getClassName(`${rootElement}--moveRight`, cssModule as any),
    startUp: getClassName(`${rootElement}__startUp`, cssModule as any),
    bulletsLoading: getClassName(
      `${rootElement}__bullets--loading`,
      cssModule as any
    ),
  };
}
