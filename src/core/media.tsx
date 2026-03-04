/* eslint-disable no-useless-computed-key */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import React, { memo, useEffect, useMemo, useRef } from 'react';

type CssLike = React.CSSProperties | undefined;

export type MediaItem = {
  source?: string;
  preload?: string[];
  slug?: string;
  loader?: boolean;

  title?: string;
  alt?: string;
  style?: CssLike;
  className?: string;

  children?: React.ReactNode;

  // legacy attribute mirrors used by transformChildren / markup patterns
  ['data-src']?: string;
  ['data-alt']?: string;
  ['data-title']?: string;
  ['data-slug']?: string;

  // transition hooks (ignored here, but can exist)
  onTransitionEnd?: (...args: any[]) => any;
  onTransitionStartOut?: (...args: any[]) => any;
  onTransitionStartIn?: (...args: any[]) => any;
  onTransitionRequestOut?: (...args: any[]) => any;
  onTransitionRequestIn?: (...args: any[]) => any;

  // allow arbitrary extra fields; we will filter for safe DOM props
  [key: string]: any;
};

export type MediaProps = {
  media: MediaItem;
  className: string;
};

const VIDEO_RE = /\.(mp4|webm)(\?|#|$)/i;
const isVideoSrc = (src: unknown) => VIDEO_RE.test(String(src || ''));

// Only forward safe props to the DOM container.
// (Prevents React warnings from arrays/objects/functions on <div>.)
const pickDomProps = (
  obj: Record<string, any> | null | undefined
): React.HTMLAttributes<HTMLDivElement> & Record<string, any> => {
  const out: Record<string, any> = {};
  if (!obj || typeof obj !== 'object') return out as any;

  for (const [k, v] of Object.entries(obj)) {
    if (v == null) continue;

    // allow data-/aria- passthrough
    if (k.startsWith('data-') || k.startsWith('aria-')) {
      out[k] = v;
      continue;
    }

    // allow event handlers (onClick, onMouseEnter, etc)
    if (/^on[A-Z]/.test(k) && typeof v === 'function') {
      out[k] = v;
      continue;
    }

    // a small set of common safe DOM props
    if (
      k === 'id' ||
      k === 'role' ||
      k === 'tabIndex' ||
      k === 'title' ||
      k === 'draggable'
    ) {
      out[k] = v;
    }
  }

  return out as any;
};

function Media({ media, className }: MediaProps) {
  const {
    source,
    children,
    style,
    className: mediaClass,

    // strip slider-internal / transition hooks
    loader,
    onTransitionEnd,
    onTransitionStartOut,
    onTransitionStartIn,
    onTransitionRequestOut,
    onTransitionRequestIn,

    // strip legacy child attribute mirrors
    ['data-src']: dataSrc,
    ['data-alt']: dataAlt,

    // used for video/img metadata
    title,
    alt,
    ['data-title']: dataTitle,
    ['data-alt']: dataAlt2,
    ['data-slug']: dataSlug,
    slug,

    preload,

    ...extra
  } = media || ({} as MediaItem);

  void loader;
  void onTransitionEnd;
  void onTransitionStartOut;
  void onTransitionStartIn;
  void onTransitionRequestOut;
  void onTransitionRequestIn;
  void dataAlt;
  void dataSlug;
  void slug;
  void preload;

  const domProps = useMemo(() => pickDomProps(extra), [extra]);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Keep the refs "used" (no side effects needed without logs)
  useEffect(() => {
    void imgRef.current;
    void videoRef.current;
  }, [source, dataSrc]);

  const background = useMemo(() => {
    if (!source) return null;

    if (isVideoSrc(source)) {
      // NOTE: keep controls like original behavior
      return (
        <video
          ref={videoRef}
          title={title || dataTitle}
          src={source}
          controls
          playsInline
        />
      );
    }

    return (
      <img
        ref={imgRef}
        src={source}
        alt={alt || title || dataAlt2 || ''}
        loading="lazy"
        decoding="async"
      />
    );
  }, [source, title, alt, dataTitle, dataAlt2]);

  return (
    <div className={className} style={style || undefined} {...domProps}>
      {background}
      {children ? (
        <div className={mediaClass || undefined}>{children}</div>
      ) : null}
    </div>
  );
}

export default memo(Media);
