export class MediaLoader {
  constructor() {
    if (typeof window !== 'undefined') {
      this.image = new Image();
      this.resolve = null;
      this.video = document.createElement('video');
      this.events();
    }
  }
  events() {
    this.video.addEventListener(
      'loadeddata',
      () => this.resolve && this.resolve(true)
    );
    this.video.addEventListener(
      'loadeddata',
      () => this.resolve && this.resolve(false)
    );
    this.image.onload = () => this.resolve && this.resolve(true);
    this.image.onerror = () => this.resolve && this.resolve(false);
  }
  load(url) {
    return new Promise(resolve => {
      if (!url) {
        resolve(true);
      }
      this.resolve = resolve;
      this.loading = true;
      this.ended = false;
      if (url.match(/\.(mp4|webm)/i)) {
        this.video.setAttribute('src', url);
      }
      if (url.match(/\.(png|jp(e)?g|gif|webp)/i)) {
        this.image.src = url;
        if (this.image.width > 0 || this.image.height > 0) {
          resolve(true);
        }
      }
    });
  }
}

export function serialize(obj, separator = '&') {
  return Object.entries(obj)
    .map(([key, val]) => `${key}=${val}`)
    .join(separator);
}

export function classToModules(classNames = [], cssModule) {
  if (!cssModule) {
    return classNames.join(' ').trim();
  }
  const result = [];
  let i = classNames.length;
  // eslint-disable-next-line
  while (i--) {
    if (cssModule[classNames[i]]) {
      result.push(cssModule[classNames[i]]);
    }
  }
  return result;
}

export function getClassName(className = '', cssModule) {
  if (cssModule) {
    return cssModule[className] || className;
  }
  return className;
}
