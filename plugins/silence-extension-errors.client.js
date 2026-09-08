export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    const isExtensionError = (err) => {
      if (!err) return false;
      const str = typeof err === 'string' ? err : (err.message || err.reason || err.stack || '');
      return str.includes('asynchronous response') ||
             str.includes('message channel closed') ||
             str.includes('chrome-extension');
    };

    window.addEventListener('unhandledrejection', (e) => {
      if (isExtensionError(e.reason)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
    }, true);

    window.addEventListener('error', (e) => {
      if (isExtensionError(e.message || e.error)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
    }, true);

    const origErr = console.error;
    console.error = function (...args) {
      if (args.some(isExtensionError)) return;
      origErr.apply(console, args);
    };

    const origWarn = console.warn;
    console.warn = function (...args) {
      if (args.some(isExtensionError)) return;
      origWarn.apply(console, args);
    };

    nuxtApp.hook('vue:error', (error) => {
      if (isExtensionError(error)) {
        return false;
      }
    });
  }
});
