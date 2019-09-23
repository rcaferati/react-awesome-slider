import { classToModules, getClassName } from '../helpers/components';

export function getRootClassName({
  rootElement,
  cssModule,
  disabled,
  organicArrows,
  className,
  total,
  current,
  infinite,
  fillParent,
}) {
  let classNames = [rootElement];
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
      item.url = child.props['data-src'];
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
