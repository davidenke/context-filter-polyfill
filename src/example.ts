import pixelmatch from 'pixelmatch';

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
function getDomPath(element: Element, useIds = false): string[] {
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

    if (useIds && element.hasAttribute('id') && element.id !== '') {
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
  .outerHTML.replace('<h2>Polyfilled</h2>', '<h2>Native</h2>')
  .replace('</main>', '</main><style>html, body { overflow: hidden }</style>');

let cloned = 0;
window.addEventListener('context-filter-polyfill:draw', ({ detail }) => {
  const { original, clone, drawFn, drawArgs } = detail;
  if (
    'parentElement' in original.canvas &&
    original.canvas.parentElement?.id === 'history'
  ) {
    ++cloned;
    const wrapper = document.createElement('div');
    wrapper.classList.add('clone');
    wrapper.style.setProperty('---clone-index', `${cloned}`);

    const label = document.createElement('code');
    label.textContent = `${drawFn}(${drawArgs.map(String).join(', ')})`;

    wrapper.appendChild(label);
    wrapper.appendChild(clone.canvas as HTMLCanvasElement);
    const clones = document.getElementById('clones');
    clones?.appendChild(wrapper);
    clones?.style.setProperty('---clone-count', `${cloned}`);
  }
});

document.addEventListener(
  'DOMContentLoaded',
  () => {
    window.addEventListener('click', toggleComparison);
    window.addEventListener('touchend', toggleComparison);
  },
  { passive: true },
);

function toggleComparison(event: MouseEvent | TouchEvent) {
  if (!(event.target instanceof HTMLCanvasElement)) return;

  event.preventDefault();

  const leftPath = getDomPath(event.target);
  const rightPath = leftPath.slice(leftPath.indexOf('main')).join(' ');
  const iframe = document.querySelector('iframe');
  const counter = iframe?.contentDocument?.querySelector(rightPath);

  if (!counter) return;

  document.querySelector('cfp-compare')?.remove();
  const compare = document.createElement('cfp-compare');
  document.body.appendChild(compare);

  compare.between(event.target, counter as HTMLCanvasElement);
}

class Compare extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.addEventListener('click', this.#destroy);
    this.addEventListener('touchend', this.#destroy);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#destroy);
    this.removeEventListener('touchend', this.#destroy);
  }

  #destroy(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.remove();
  }

  #render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.75);

          display: flex;
          flex-flow: column nowrap;
          gap: 5px;
          align-items: center;
          justify-content: center;
        }
        section {
          display: flex;
          flex-flow: row nowrap;
          gap: 5px;
          padding: 5px;
          background-color: #000;

          canvas {
            image-rendering: pixelated;
            width: 30vw;
          }
        }
        code {
          padding: 0.1em 0.3em;
          border-radius: 3px;
          background-color: #4d4d4d;

          font-size: 10px;
          overflow: hidden;
          text-align: right;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }
      </style>
      <section></section>
      <code></code>
    `;
  }

  between(left: HTMLCanvasElement, right: HTMLCanvasElement) {
    const width = Math.min(left.width, right.width);
    const height = Math.min(left.height, right.height);
    const output = new Uint8ClampedArray(width * height * 4);
    const leftImg = left.getContext('2d')!.getImageData(0, 0, width, height);
    const rightImg = right.getContext('2d')!.getImageData(0, 0, width, height);
    const offset = pixelmatch(
      leftImg.data,
      rightImg.data,
      output,
      width,
      height,
    );
    const match = 100 - (offset / (height * width)) * 100;

    const diff = document.createElement('canvas');
    diff.width = width;
    diff.height = height;
    diff
      .getContext('2d')!
      .putImageData(new ImageData(output, width, height), 0, 0);

    const leftClone = left.cloneNode() as HTMLCanvasElement;
    leftClone.getContext('2d')!.putImageData(leftImg, 0, 0);
    const rightClone = right.cloneNode() as HTMLCanvasElement;
    rightClone.getContext('2d')!.putImageData(rightImg, 0, 0);

    this.#render();
    const section = this.shadowRoot!.querySelector('section')!;
    const code = this.shadowRoot!.querySelector('code')!;
    section.appendChild(leftClone);
    section.appendChild(diff);
    section.appendChild(rightClone);
    code.textContent = `${match === 100 ? '100' : match.toFixed(2)}%`;
  }
}

if (!window.customElements.get('cfp-compare')) {
  window.customElements.define('cfp-compare', Compare);
}

declare global {
  interface HTMLElementTagNameMap {
    'cfp-compare': Compare;
  }
}
