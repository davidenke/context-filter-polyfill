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
