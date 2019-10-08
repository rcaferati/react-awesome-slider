export function shadeRGBColor(color, percent) {
  const f = color.split(',');
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : percent;
  const R = parseInt(f[0].slice(4), 10);
  const G = parseInt(f[1], 10);
  const B = parseInt(f[2], 10);
  return `rgb(${Math.round((t - R) * p) + R}, ${Math.round((t - G) * p) +
    G}, ${Math.round((t - B) * p) + B})`;
}

export function setCssEndEvent(element, type) {
  return new Promise(resolve => {
    if (!element) {
      resolve(false);
      return;
    }
    let eventName = null;
    const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
    function end(event) {
      element.removeEventListener(eventName, end);
      const target = event.srcElement || event.target;
      if (target === element) {
        resolve();
      }
    }
    if (element.style[`Webkit${capitalized}`] !== undefined) {
      eventName = `webkit${capitalized}End`;
    }
    if (element.style.OTransition !== undefined) {
      eventName = `o${type}End`;
    }
    if (element.style[type] !== undefined) {
      eventName = `${type}end`;
    }
    element.addEventListener(eventName, end);
  });
}

function hex(number) {
  if (number > 255) {
    return false;
  }
  const str = Number(number).toString(16);
  return `0${str}`.slice(-2);
}

export function rgba2hex(rgba) {
  const regex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+)\s*)?\)/;
  const parsed = regex.exec(rgba);
  if (!parsed) {
    return false;
  }
  const red = parsed[1];
  const green = parsed[2];
  const blue = parsed[3];
  const alpha = parsed[4];
  const elems = [hex(red), hex(green), hex(blue)];
  if (alpha) {
    elems.push(hex(alpha));
  }
  return `#${elems.join('')}`;
}

export function resetSlider(slider, customFnc = null) {
  if (typeof window !== 'undefined') {
    clearTimeout(window.transitionUpdateTimer);
    if (customFnc) {
      customFnc();
    } else {
      slider.element.style.setProperty('--slider-transition-duration', '525ms');
    }
    window.setElement(slider.element);
  }
}

export function transitionStart(slider) {
  if (typeof window !== 'undefined') {
    const divs = slider.nextSlide.querySelectorAll('div');
    const color = getComputedStyle(divs[0]).backgroundColor;
    window.transitionUpdateTimer = setTimeout(() => {
      slider.element.style.setProperty(
        '--control-bullet-active-color',
        shadeRGBColor(color, -0.15)
      );
      slider.element.style.setProperty('--control-bullet-color', color);
    }, 400);
  }
}

export function transitionEnd(slider) {
  if (typeof window !== 'undefined') {
    const divs = slider.currentSlide.querySelectorAll('div');
    const color = getComputedStyle(divs[0]).backgroundColor;
    slider.element.style.setProperty(
      '--organic-arrow-color',
      shadeRGBColor(color, -0.15)
    );
    window.setElement(slider.element);
  }
}

export default {};
