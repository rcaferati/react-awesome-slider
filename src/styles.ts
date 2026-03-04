// src/styles.ts
import styles from './core/styles.scss';

// Some bundlers expose CSS modules as `default`, others as the object itself.
// This keeps consumption stable.
export default (styles as any)?.default ?? styles;