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
  return 'filter' in CanvasRenderingContext2D.prototype ? 'is not' : 'is';
}

document.querySelector('[data-debug="browser"]')!.textContent = detectBrowser();
document.querySelector('[data-debug="polyfilled"]')!.textContent =
  isPolyfilled();

document.querySelector('iframe')!.srcdoc = document
  .querySelector('main')!
  .outerHTML.replace('<h2>Polyfilled</h2>', '<h2>Native</h2>');

let cloned = 0;
window.addEventListener('context-filter-polyfill:draw', ({ detail }) => {
  const { original, clone } = detail;
  if (original.canvas.parentElement?.classList.contains('debug')) {
    ++cloned;
    clone.canvas.classList.add('clone');
    clone.canvas.style.setProperty('--i', `${cloned}`);
    document.getElementById('clones')?.appendChild(clone.canvas);
  }
});
