# React `<AwesomeSlider />`

`@rcaferati/react-awesome-slider` provides a fast, production-ready slider/carousel with optional HOCs:

- **`AwesomeSlider`** — animated media/children slider
- **`withAutoplay`** — autoplay wrapper
- **`withCaptionedImages`** — caption overlay wrapper
- **`withAnimatedLettering`** — “screens → <p> lines” wrapper
- **Navigation utilities** — `Provider`, `Link`, `withNavigationContext`, `withNavigationHandlers`

This README is updated for the current v5+ patterns (functional core + CSS variables + optional CSS Modules).

---

## Installation

```bash
npm install @rcaferati/react-awesome-slider
```

Peer deps:

- `react >= 18`
- `react-dom >= 18`

---

## Quick Start

### Plain CSS (no CSS Modules)

```jsx
import React from 'react';
import AwesomeSlider from '@rcaferati/react-awesome-slider';
import '@rcaferati/react-awesome-slider/styles.css';

export default function Example() {
  return (
    <AwesomeSlider>
      <div data-src="https://picsum.photos/id/1018/1200/600" />
      <div data-src="https://picsum.photos/id/1015/1200/600" />
      <div data-src="https://picsum.photos/id/1019/1200/600" />
    </AwesomeSlider>
  );
}
```

### Media prop (recommended for deterministic slides)

```jsx
import React from 'react';
import AwesomeSlider from '@rcaferati/react-awesome-slider';
import '@rcaferati/react-awesome-slider/styles.css';

export default function Example() {
  return (
    <AwesomeSlider
      media={[
        { source: 'https://picsum.photos/id/1018/1200/600', slug: 'slide-1' },
        { source: 'https://picsum.photos/id/1015/1200/600', slug: 'slide-2' },
        { source: 'https://picsum.photos/id/1019/1200/600', slug: 'slide-3' },
      ]}
    />
  );
}
```

---

## Animations

### Default animation: `sideAnimation`

The default “side” animation ships in the base stylesheet:

```js
import '@rcaferati/react-awesome-slider/styles.css';
```

### Extra animation recipes

Load one of the extra animation stylesheets and set `animation`:

- `cubeAnimation`
- `fallAnimation`
- `foldOutAnimation`
- `openAnimation`
- `scaleOutAnimation`

```jsx
import React from 'react';
import AwesomeSlider from '@rcaferati/react-awesome-slider';

import '@rcaferati/react-awesome-slider/styles.css';
import '@rcaferati/react-awesome-slider/custom-animations/cube-animation.css';

export default function Example() {
  return (
    <AwesomeSlider animation="cubeAnimation">
      <div data-src="https://picsum.photos/id/1018/1200/600" />
      <div data-src="https://picsum.photos/id/1015/1200/600" />
      <div data-src="https://picsum.photos/id/1019/1200/600" />
    </AwesomeSlider>
  );
}
```

> Tip: When `animation="sideAnimation"` you typically omit `animation` entirely (core defaults).

---

## Styling

### CSS variables (recommended)

The core stylesheet exposes CSS variables on the slider root element (default `awssld`).
You can override them per instance using `style`:

```jsx
<AwesomeSlider
  style={{
    // arrows
    '--organic-arrow-color': 'rgba(255,255,255,0.9)',
    '--organic-arrow-height': '44px',
    '--organic-arrow-thickness': '4px',

    // bullets
    '--control-bullet-color': 'rgba(255,255,255,0.35)',
    '--control-bullet-active-color': 'rgba(255,255,255,0.9)',

    // content
    '--content-background-color': '#10131a',
  }}
/>
```

### CSS Modules (`cssModule`)

If your bundler emits CSS module maps, you can pass module objects via `cssModule`.
Many setups export the module object as `default` — this pattern is safe:

```jsx
import AwsSliderStyles from '@rcaferati/react-awesome-slider/dist/styles.css?inline'; // (example — depends on bundler)
```

In this repository’s Storybook setup, `*.scss` imports resolve to CSS module maps. In consumer apps, you’ll typically import prebuilt CSS files (`styles.css`, `captioned.css`, `lettering.css`, and `custom-animations/*.css`) unless you have a CSS-module pipeline configured.

---

## `AwesomeSlider`

### Common usage patterns

#### Children mode (HTML slides)

```jsx
<AwesomeSlider>
  <div style={{ background: '#0b0f18', height: '100%' }}>
    <h2 style={{ color: 'white' }}>Slide A</h2>
  </div>
  <div style={{ background: '#f4f6fb', height: '100%' }}>
    <h2 style={{ color: '#111' }}>Slide B</h2>
  </div>
</AwesomeSlider>
```

#### Media mode (images/videos)

```jsx
<AwesomeSlider
  media={[
    { source: '/img/0.jpg', slug: 'a' },
    { source: '/img/1.jpg', slug: 'b' },
  ]}
/>
```

---

## `AwesomeSlider` Props (current)

| Prop                  | Type                         | Default            | Description                                                                             |
| --------------------- | ---------------------------- | ------------------ | --------------------------------------------------------------------------------------- |
| `media`               | `MediaItem[]`                | `[]`               | Slides as objects (`{ source, slug, preload? }`).                                       |
| `children`            | `ReactNode`                  | `null`             | Slides as React children (supports `data-src` / `data-slug`).                           |
| `selected`            | `number \| string`           | `0`                | Active slide index (number) or slug (string).                                           |
| `name`                | `string`                     | `'awesome-slider'` | Instance name (useful when multiple sliders are present).                               |
| `animation`           | `string \| null`             | `null`             | Animation key (`cubeAnimation`, `fallAnimation`, etc). Omit for default side animation. |
| `buttons`             | `boolean`                    | `true`             | Show next/prev buttons.                                                                 |
| `bullets`             | `boolean`                    | `true`             | Show bullets.                                                                           |
| `organicArrows`       | `boolean`                    | `true`             | Use the organic arrow shape styling.                                                    |
| `infinite`            | `boolean`                    | `true`             | Wrap-around navigation.                                                                 |
| `fillParent`          | `boolean`                    | `false`            | Fill parent bounds (fullscreen layouts).                                                |
| `startupScreen`       | `ReactNode`                  | `null`             | Optional startup screen shown before first slide.                                       |
| `startup`             | `boolean`                    | `true`             | If `startupScreen` is set, whether to auto-start into first slide.                      |
| `startupDelay`        | `number`                     | `0`                | Delay before auto-start.                                                                |
| `transitionDelay`     | `number`                     | `0`                | Delay before starting transition animation (ms).                                        |
| `controlsReturnDelay` | `number`                     | `0`                | Delay to remove “controls active” class after transitions (ms).                         |
| `mobileTouch`         | `boolean`                    | `true`             | Enables touch/swipe navigation.                                                         |
| `cssModule`           | `object \| object[] \| null` | `null`             | CSS module map(s) used to map class names.                                              |
| `className`           | `string \| null`             | `null`             | Extra className(s) added to root element.                                               |
| `style`               | `React.CSSProperties`        | `{}`               | Inline styles (also used for CSS variables).                                            |
| `onFirstMount`        | `(info) => void`             | `null`             | Called once after mount with `getInfo()` payload.                                       |
| `onTransitionStart`   | `(info) => void`             | `null`             | Called on transition start.                                                             |
| `onTransitionEnd`     | `(info) => void`             | `null`             | Called on transition end.                                                               |
| `onTransitionRequest` | `(info) => void`             | `null`             | Called when user requests a transition (next/prev/bullet).                              |
| `onTransitionReject`  | `(info) => void`             | `null`             | Called when a transition is rejected (e.g., busy/loading).                              |
| `onLoadStart`         | `(payload) => void`          | `null`             | Optional custom preload hook. Call `payload.next()` when ready.                         |

### `getInfo()` payload (high level)

`getInfo()` is used by the event callbacks and includes (best-effort):

- `slides` — slide count
- `currentIndex` — current index
- `currentMedia` — current media item
- `currentSlide` — active slide element (when available)
- `element` — slider root element

---

## HOCs

### Autoplay

```jsx
import React from 'react';
import AwesomeSlider from '@rcaferati/react-awesome-slider';
import withAutoplay from '@rcaferati/react-awesome-slider/autoplay';
import '@rcaferati/react-awesome-slider/styles.css';

const AutoplaySlider = withAutoplay(AwesomeSlider);

export default function Example() {
  return (
    <AutoplaySlider
      play={true}
      cancelOnInteraction={false}
      interval={6000}
      media={[
        { source: 'https://picsum.photos/id/1018/1200/600' },
        { source: 'https://picsum.photos/id/1015/1200/600' },
      ]}
    />
  );
}
```

### Captioned Images

```jsx
import React from 'react';
import AwesomeSlider from '@rcaferati/react-awesome-slider';
import withCaptionedImages from '@rcaferati/react-awesome-slider/captioned';

import '@rcaferati/react-awesome-slider/styles.css';
import '@rcaferati/react-awesome-slider/captioned.css';

const Captioned = withCaptionedImages(AwesomeSlider);

export default function Example() {
  return (
    <Captioned
      screens={[
        {
          media: 'https://picsum.photos/id/1018/1200/600',
          caption: 'The first captioned slide',
          backgroundColor: '#ffffff',
        },
        {
          media: 'https://picsum.photos/id/1015/1200/600',
          caption: 'Second slide — caption overlay',
          backgroundColor: '#ffffff',
        },
      ]}
    />
  );
}
```

### Animated Lettering

```jsx
import React from 'react';
import AwesomeSlider from '@rcaferati/react-awesome-slider';
import withAnimatedLettering from '@rcaferati/react-awesome-slider/lettering';

import '@rcaferati/react-awesome-slider/styles.css';
import '@rcaferati/react-awesome-slider/lettering.css';

const Lettering = withAnimatedLettering(AwesomeSlider);

export default function Example() {
  return (
    <Lettering
      screens={[
        {
          backgroundColor: '#ffffff',
          children: [
            'React Awesome Slider',
            'Animated Lettering',
            'Each line is a <p>',
          ],
        },
        {
          backgroundColor: '#f5f5f5',
          children: ['Transitions are slide-based', 'Text moves on change'],
        },
      ]}
    />
  );
}
```

### Adaptive Controls (optional HOC)

If your build includes `hoc/adaptive-controls`, it can compute a theme (light/dark) and apply CSS variables for arrows/bullets based on the active slide background.

> This HOC is intentionally CSS-modules-safe and applies variables to the real slider root.

---

## Fullpage Navigation Utilities

These are designed for SPA / “slides-as-routes” setups.

### `Provider`

```jsx
import React from 'react';
import { Provider } from '@rcaferati/react-awesome-slider/navigation';

export default function App({ children }) {
  return (
    <Provider slug={window.location.pathname} defaultSlug="home">
      {children}
    </Provider>
  );
}
```

### `Link`

```jsx
import React from 'react';
import { Link } from '@rcaferati/react-awesome-slider/navigation';

export default function Nav() {
  return (
    <nav>
      <Link href="/home">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

### `withNavigationHandlers`

Wrap a slider so URL ↔ slider selection stays aligned (supports popstate, retries on rejects, and mismatch correction).

```jsx
import AwesomeSlider from '@rcaferati/react-awesome-slider';
import { withNavigationHandlers } from '@rcaferati/react-awesome-slider/navigation';

const SliderWithNav = withNavigationHandlers(AwesomeSlider);

export default function Page() {
  return <SliderWithNav />;
}
```

---

## Recommended patterns (current)

### ✅ Prefer `media` for stable routing

If you use slugs + navigation handlers, keep `media` entries stable and include `slug`.

### ✅ Keep animations modular

- Always load `styles.css`
- Load one extra animation CSS only when that animation is selected

### ✅ Customize via CSS variables first

Theme/contrast/polish is usually easiest via the exposed custom properties.

---

## Author

**Rafael Caferati**  
Website: https://caferati.dev  
GitHub: https://github.com/rcaferati

---

## License

MIT
