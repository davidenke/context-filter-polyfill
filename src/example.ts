import { supportsContextFilters } from './utils/detection.utils';

function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Edg')) {
    return 'Microsoft Edge';
  } else if (ua.includes('Chrome')) {
    return 'Chrome';
  } else if (ua.includes('Firefox')) {
    return 'Firefox';
  } else if (ua.includes('Safari')) {
    return 'Safari';
  } else if (ua.includes('Opera')) {
    return 'Opera';
  }

  return 'as unknown browser';
}

function isPolyfilled() {
  return supportsContextFilters() ? 'is not' : 'is';
}

// https://stackoverflow.com/a/66143123/1146207
function getDomPath(element: Element): string[] {
  const stack = [];

  while (element.parentNode !== null) {
    let sibCount = 0;
    let sibIndex = 0;
    for (let i = 0; i < element.parentNode.childNodes.length; i += 1) {
      const sib = element.parentNode.childNodes[i];
      if (sib.nodeName === element.nodeName) {
        if (sib === element) {
          sibIndex = sibCount;
          break;
        }
        sibCount += 1;
      }
    }

    const nodeName = CSS.escape(element.nodeName.toLowerCase());

    // Ignore `html` as a parent node
    if (nodeName === 'html') break;

    if (element.hasAttribute('id') && element.id !== '') {
      stack.unshift(`#${CSS.escape(element.id)}`);
      // Remove this `break` if you want the entire path
      break;
    } else if (sibIndex > 0) {
      // :nth-of-type is 1-indexed
      stack.unshift(`${nodeName}:nth-of-type(${sibIndex + 1})`);
    } else {
      stack.unshift(nodeName);
    }

    element = element.parentNode as Element;
  }

  return stack;
}

document.querySelector('[data-debug="browser"]')!.textContent = detectBrowser();
document.querySelector('[data-debug="polyfilled"]')!.textContent =
  isPolyfilled();

document.querySelector('iframe')!.srcdoc = document
  .querySelector('main')!
  .outerHTML.replace('<h2>Polyfilled</h2>', '<h2>Native</h2>');

let cloned = 0;
window.addEventListener('context-filter-polyfill:draw', ({ detail }) => {
  const { original, clone, drawFn, drawArgs } = detail;
  if (
    'parentElement' in original.canvas &&
    original.canvas.parentElement?.classList.contains('debug')
  ) {
    ++cloned;
    const wrapper = document.createElement('div');
    wrapper.classList.add('clone');
    wrapper.style.setProperty('--i', `${cloned}`);

    const label = document.createElement('code');
    label.textContent = `${drawFn}(${drawArgs.map(String).join(', ')})`;

    wrapper.appendChild(label);
    wrapper.appendChild(clone.canvas as HTMLCanvasElement);
    document.getElementById('clones')?.appendChild(wrapper);
  }
});

document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.querySelectorAll('canvas').forEach(canvas => {
      canvas.addEventListener(
        'click',
        () => {
          const rootPath = getDomPath(canvas);
          const mainIndex = rootPath.findIndex(s => s.startsWith('main'));
          const path = rootPath.slice(mainIndex).join(' ');
          const iframe = document.querySelector('iframe');
          const counter = iframe?.contentDocument?.querySelector(path);
          console.log(path, canvas, counter);
        },
        { passive: true },
      );
    });
  },
  { passive: true },
);
