// src/__tests__/core/helpers.test.ts
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ✅ Mock the dependency used by src/core/helpers.ts:
// src/core/helpers.ts imports from "../helpers/components"
// From this test file, that resolves as "../../helpers/components"
vi.mock('../../helpers/components', () => {
  return {
    // emulate "CSS module mapping" by appending __m
    classToModules: vi.fn(
      (classes: string[], cssModule: Record<string, string>) =>
        classes.map((c) => cssModule[c] || c)
    ),

    // emulate getClassName behavior: return module mapping if present, else raw className
    getClassName: vi.fn(
      (className: string, cssModule?: Record<string, string> | null) => {
        if (cssModule && cssModule[className]) return cssModule[className];
        return className;
      }
    ),
  };
});

import {
  classListAdd,
  classListRemove,
  getAnyClassName,
  mergeStyles,
  getRootClassName,
  transformChildren,
  setupClassNames,
} from '../../core/helpers';

import { classToModules, getClassName } from '../../helpers/components';

describe('core/helpers.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('classListAdd / classListRemove', () => {
    it('classListAdd: adds tokens from a string', () => {
      const el = document.createElement('div');

      classListAdd(el, 'a  b   c');
      expect(el.classList.contains('a')).toBe(true);
      expect(el.classList.contains('b')).toBe(true);
      expect(el.classList.contains('c')).toBe(true);
    });

    it('classListAdd: noops on null element or non-string', () => {
      const el = document.createElement('div');

      classListAdd(null, 'a');
      classListAdd(el, null);
      classListAdd(el, undefined);
      classListAdd(el, 123);

      expect(el.className).toBe('');
    });

    it('classListRemove: removes tokens from a string', () => {
      const el = document.createElement('div');
      el.className = 'a b c';

      classListRemove(el, 'b c');
      expect(el.classList.contains('a')).toBe(true);
      expect(el.classList.contains('b')).toBe(false);
      expect(el.classList.contains('c')).toBe(false);
    });

    it('classListRemove: noops on null element or non-string', () => {
      const el = document.createElement('div');
      el.className = 'a';

      classListRemove(null, 'a');
      classListRemove(el, null);
      classListRemove(el, undefined);
      classListRemove(el, 123);

      expect(el.className).toBe('a');
    });
  });

  describe('getAnyClassName', () => {
    it('returns the first token, or empty string', () => {
      expect(getAnyClassName('  hello   world ')).toBe('hello');
      expect(getAnyClassName('')).toBe('');
      expect(getAnyClassName(null)).toBe('');
      expect(getAnyClassName(undefined)).toBe('');
      expect(getAnyClassName(123)).toBe('');
    });
  });

  describe('mergeStyles', () => {
    it('returns null when no valid module objects are provided', () => {
      expect(mergeStyles(null)).toBe(null);
      expect(mergeStyles(undefined)).toBe(null);
      expect(mergeStyles([])).toBe(null);
      expect(mergeStyles([null, undefined, 1, 'x'])).toBe(null);
    });

    it('returns the same object when exactly one module is provided', () => {
      const m = { a: 'A' };
      expect(mergeStyles(m)).toBe(m);
      expect(mergeStyles([m])).toBe(m);
    });

    it('merges multiple modules, concatenating values for the same key', () => {
      const a = { foo: 'a1', shared: 's1', empty: '' };
      const b = { bar: 'b1', shared: 's2', empty: 'IGNORED?' };
      const c = { shared: 's3', foo: 'a2' };

      // note: mergeStyles skips falsy values when copying entries
      const out = mergeStyles([a, b, c]) as any;

      expect(out.foo).toBe('a1 a2');
      expect(out.bar).toBe('b1');
      expect(out.shared).toBe('s1 s2 s3');

      // "empty" from a is '', so it won't be set initially; then b has 'IGNORED?' (truthy)
      // but a empty isn't present, so it becomes that.
      expect(out.empty).toBe('IGNORED?');
    });
  });

  describe('getRootClassName', () => {
    it('builds class string with flags + extra className tokens', () => {
      const cls = getRootClassName({
        rootElement: 'awssld',
        cssModule: null,
        disabled: true,
        organicArrows: true,
        className: 'extra  two',
        total: 3,
        current: 0,
        infinite: false,
        animation: 'fallAnimation',
        fillParent: true,
      });

      expect(cls).toContain('awssld');
      expect(cls).toContain('awssld--fallAnimation');
      expect(cls).toContain('awssld--organic-arrows');
      expect(cls).toContain('awssld--disabled');
      expect(cls).toContain('awssld--fill-parent');
      expect(cls).toContain('awssld--first');
      expect(cls).toContain('extra');
      expect(cls).toContain('two');
    });

    it('adds --last when current === total-1 and infinite === false', () => {
      const cls = getRootClassName({
        rootElement: 'awssld',
        cssModule: null,
        total: 3,
        current: 2,
        infinite: false,
        animation: null,
        fillParent: false,
      });

      expect(cls).toContain('awssld--last');
    });

    it('does NOT call classToModules unless cssModule[rootElement] exists', () => {
      // cssModule missing rootElement key => no classToModules
      const cssModule = {
        awssld__container: 'X',
      };

      getRootClassName({
        rootElement: 'awssld',
        cssModule: cssModule as any,
        total: 1,
        current: 0,
        infinite: true,
        animation: null,
        fillParent: false,
      });

      expect(classToModules).not.toHaveBeenCalled();
    });

    it('calls classToModules when cssModule[rootElement] exists', () => {
      const cssModule = {
        awssld: 'ROOT_MAPPED',
        'awssld--disabled': 'DISABLED_MAPPED',
      };

      const cls = getRootClassName({
        rootElement: 'awssld',
        cssModule: cssModule as any,
        disabled: true,
        total: 1,
        current: 0,
        infinite: true,
        animation: null,
        fillParent: false,
      });

      expect(classToModules).toHaveBeenCalledTimes(1);
      expect(cls).toContain('ROOT_MAPPED');
      expect(cls).toContain('DISABLED_MAPPED');
    });
  });

  describe('transformChildren', () => {
    it('returns [] for empty children', () => {
      expect(transformChildren(null)).toEqual([]);
      expect(transformChildren(undefined)).toEqual([]);
      expect(transformChildren(false)).toEqual([]);
    });

    it('extracts props and maps data-src/data-slug into source/slug', () => {
      const out = transformChildren([
        React.createElement('div', {
          'data-src': 'img-a.png',
          'data-slug': 'a',
          foo: 'bar',
        }),
        React.createElement('div', {
          'data-src': 'img-b.png',
        }),
        React.createElement('span', {
          'data-slug': 'c',
        }),
      ]);

      expect(out).toHaveLength(3);

      // contract: mapping works + other props are preserved
      expect(out[0]).toMatchObject({
        foo: 'bar',
        source: 'img-a.png',
        slug: 'a',
      });

      expect(out[1]).toMatchObject({
        source: 'img-b.png',
      });

      expect(out[2]).toMatchObject({
        slug: 'c',
      });

      // if you still want: these should now be stable
      expect(out[0]['data-src']).toBe('img-a.png');
      expect(out[0]['data-slug']).toBe('a');
    });
  });

  describe('setupClassNames', () => {
    it('calls getClassName for all expected keys', () => {
      const cssModule = {
        awssld__boxA: 'boxA_m',
        awssld__container: 'container_m',
      };

      const cn = setupClassNames('awssld', cssModule as any);

      // spot-check a few fields
      expect(cn.boxA).toBe('boxA_m'); // mapped
      expect(cn.container).toBe('container_m'); // mapped
      expect(cn.wrapper).toBe('awssld__wrapper'); // not mapped => raw

      // sanity: ensure helper was consulted many times
      expect(getClassName).toHaveBeenCalled();
      // (don’t assert exact count — it’s fine to change over time)
      expect((getClassName as any).mock.calls.length).toBeGreaterThan(10);
    });
  });
});
