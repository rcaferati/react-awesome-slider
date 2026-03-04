// helpers/components.ts

export class MediaLoader {
  private image?: HTMLImageElement;
  private video?: HTMLVideoElement;

  private resolve: ((ok: boolean) => void) | null = null;

  private loaded = 0;
  private toLoad = 0;
  private resolver: ((ok: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.image = new Image();
      this.video = document.createElement('video');
      this.video.preload = 'auto';
      this.video.muted = true; // helps some browsers actually load metadata

      this.events();
    }
  }

  private events() {
    // In SSR / no-dom environments, nothing to wire.
    if (!this.video || !this.image) return;

    // Video: resolve true on loadeddata, false on error
    this.video.addEventListener('loadeddata', () => {
      if (this.resolve) this.resolve(true);
    });
    this.video.addEventListener('error', () => {
      if (this.resolve) this.resolve(false);
    });

    // Image: resolve true on load, false on error
    this.image.onload = () => this.resolve && this.resolve(true);
    this.image.onerror = () => this.resolve && this.resolve(false);
  }

  load(url?: string | null): Promise<boolean> {
    return new Promise((resolve) => {
      if (!url) {
        resolve(true);
        return;
      }

      // SSR fallback: can't actually preload, but don't deadlock.
      if (!this.image || !this.video) {
        resolve(true);
        return;
      }

      this.resolve = resolve;

      // Heuristic: treat extensionless as image
      const isVideo = /\.(mp4|webm)(\?|#|$)/i.test(url);
      if (isVideo) {
        try {
          this.video.setAttribute('src', url);
          if (typeof this.video.load === 'function') this.video.load();
        } catch {
          resolve(false);
        }
        return;
      }

      // default image
      this.image.src = url;

      // if cached and dimensions already known, resolve immediately
      if (
        this.image.complete &&
        (this.image.naturalWidth > 0 || this.image.naturalHeight > 0)
      ) {
        resolve(true);
      }
    });
  }

  private loadImage(url: string) {
    const image = new Image();
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      this.pumpLoaded();
    };

    image.onload = finish;
    image.onerror = finish;
    image.src = url;

    // cached fast-path
    if (image.complete && (image.naturalWidth > 0 || image.naturalHeight > 0)) {
      finish();
    }
  }

  private loadVideo(url: string) {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      this.pumpLoaded();
    };

    video.addEventListener('loadeddata', finish);
    video.addEventListener('error', finish);

    try {
      video.setAttribute('src', url);
      if (typeof video.load === 'function') video.load();
    } catch {
      finish();
    }
  }

  private pumpLoaded() {
    this.loaded += 1;
    if (this.loaded >= this.toLoad) {
      if (this.resolver) this.resolver(true);
    }
  }

  private startLoad(url?: string | null) {
    if (!url) {
      this.pumpLoaded();
      return;
    }

    const isVideo = /\.(mp4|webm)(\?|#|$)/i.test(url);

    if (isVideo) {
      this.loadVideo(url);
      return;
    }

    // ✅ IMPORTANT: extensionless URLs are treated as images
    this.loadImage(url);
  }

  loadMultiple(urls: unknown): Promise<boolean> {
    const list: string[] = Array.isArray(urls)
      ? (urls.filter((u) => typeof u === 'string') as string[])
      : [];

    this.loaded = 0;
    this.toLoad = list.length;

    return new Promise((resolve) => {
      this.resolver = resolve;

      if (this.toLoad === 0) {
        resolve(true);
        return;
      }

      list.forEach((url) => {
        this.startLoad(url);
      });
    });
  }
}

export function serialize(
  obj: Record<string, any>,
  separator: string = '&'
): string {
  return Object.entries(obj)
    .map(([key, val]) => `${key}=${val}`)
    .join(separator);
}

export function classToModules(
  classNames: string[] = [],
  cssModule?: Record<string, string> | null
): string[] {
  if (!cssModule) {
    return classNames.join(' ').trim().split(' ').filter(Boolean);
  }
  const result: string[] = [];
  let i = classNames.length;
  while (i--) {
    const k = classNames[i];
    if (cssModule[k]) result.push(cssModule[k]);
  }
  return result;
}

export function getClassName(
  className: string = '',
  cssModule?: Record<string, string> | null
): string {
  if (cssModule) {
    return cssModule[className] || className;
  }
  return className;
}
