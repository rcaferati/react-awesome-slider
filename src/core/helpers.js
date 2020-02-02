/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { classToModules, getClassName } from '../helpers/components';

export const classListAdd = (element, classString) => {
  if (typeof classString !== 'string' || !element) {
    return;
  }
  classString.split(' ').forEach(className => {
    element.classList.add(className);
  });
};

export const classListRemove = (element, classString) => {
  if (typeof classString !== 'string' || !element) {
    return;
  }
  classString.split(' ').forEach(className => {
    element.classList.remove(className);
  });
};

export const getAnyClassName = className => {
  if (typeof className === 'string') {
    const cls = className.split(' ');
    return cls[0] || '';
  }
  return '';
};

export const mergeStyles = styles => {
  const local = !Array.isArray(styles) ? [styles] : styles;
  if (local.length === 1) {
    return local[0];
  }
  const main = { ...local[0] };
  for (let i = 1; i < local.length; i += 1) {
    for (const item in main) {
      if (local[i][item]) {
        main[item] = [main[item], local[i][item]].join(' ');
      }
    }
    for (const item in local[i]) {
      if (!main[item]) {
        main[item] = local[i][item];
      }
    }
  }
  return main;
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
}) {
  let classNames = [rootElement];
  if (animation) {
    classNames.push(`${rootElement}--${animation}`);
  }
  if (organicArrows === true) {
    classNames.push(`${rootElement}--organic-arrows`);
  }
  if (disabled === true) {
    classNames.push(`${rootElement}--disabled`);
  }
  if (fillParent) {
    classNames.push(`${rootElement}--fill-parent`);
  }
  if (infinite === false) {
    if (current === 0) {
      classNames.push(`${rootElement}--first`);
    }
    if (current === total - 1) {
      classNames.push(`${rootElement}--last`);
    }
  }

  if (cssModule && cssModule[rootElement]) {
    classNames = classToModules(classNames, cssModule);
  }

  if (className) {
    classNames.push(...className.split(' '));
  }
  return classNames
    .join(' ')
    .trim()
    .replace(/[\s]+/gi, ' ');
}

export function transformChildren(children) {
  const media = [];
  const items = children.constructor === Array ? children : [children];

  items.forEach(child => {
    const item = {
      ...child.props,
    };
    if (child.props['data-src']) {
      item.source = child.props['data-src'];
    }
    if (child.props['data-slug']) {
      item.slug = child.props['data-slug'];
    }
    media.push(item);
  });
  return media;
}

export function setupClassNames(rootElement, cssModule) {
  return {
    boxA: getClassName(`${rootElement}__boxA`, cssModule),
    boxB: getClassName(`${rootElement}__boxB`, cssModule),
    box: getClassName(`${rootElement}__box`, cssModule),
    container: getClassName(`${rootElement}__container`, cssModule),
    wrapper: getClassName(`${rootElement}__wrapper`, cssModule),
    bar: getClassName(`${rootElement}__bar`, cssModule),
    barActive: getClassName(`${rootElement}__bar--active`, cssModule),
    barEnd: getClassName(`${rootElement}__bar--end`, cssModule),
    content: getClassName(`${rootElement}__content`, cssModule),
    contentStatic: getClassName(`${rootElement}__content--static`, cssModule),
    contentMoveLeft: getClassName(
      `${rootElement}__content--moveLeft`,
      cssModule
    ),
    contentMoveRight: getClassName(
      `${rootElement}__content--moveRight`,
      cssModule
    ),
    controlsHidden: getClassName(`${rootElement}__controls--hidden`, cssModule),
    controlsActive: getClassName(`${rootElement}__controls--active`, cssModule),
    animated: getClassName(`${rootElement}--animated`, cssModule),
    animatedMobile: getClassName(`${rootElement}--animated-mobile`, cssModule),
    contentExit: getClassName(`${rootElement}__content--exit`, cssModule),
    exit: getClassName(`${rootElement}--exit`, cssModule),
    active: getClassName(`${rootElement}--active`, cssModule),
    moveLeft: getClassName(`${rootElement}--moveLeft`, cssModule),
    moveRight: getClassName(`${rootElement}--moveRight`, cssModule),
    startUp: getClassName(`${rootElement}__startUp`, cssModule),
    bulletsLoading: getClassName(`${rootElement}__bullets--loading`, cssModule),
  };
}
