export default defineNuxtPlugin((nuxtApp) => {
  // 1. Filter out known harmless dev warnings from Vue warnHandler
  const originalWarnHandler = nuxtApp.vueApp.config.warnHandler;
  nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
    if (
      msg.includes('DialogContent') ||
      msg.includes('DialogTitle') ||
      msg.includes('aria-describedby') ||
      msg.includes('Suspense')
    ) {
      return;
    }
    if (originalWarnHandler) {
      originalWarnHandler(msg, instance, trace);
    }
  };

  // 2. Filter out direct console.warn from Reka-UI / Radix-Vue
  if (typeof window !== 'undefined') {
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      const firstArg = args[0];
      if (typeof firstArg === 'string') {
        if (
          firstArg.includes('DialogContent') ||
          firstArg.includes('DialogTitle') ||
          firstArg.includes('aria-describedby') ||
          firstArg.includes('<Suspense>')
        ) {
          return;
        }
      }
      originalConsoleWarn.apply(console, args);
    };

    // 3. Filter out browser extension message channel closure errors
    const isExtensionChannelError = (str) => {
      if (!str || typeof str !== 'string') return false;
      return (
        str.includes('A listener indicated an asynchronous response by returning true') ||
        str.includes('message channel closed before a response was received') ||
        str.includes('chrome-extension://')
      );
    };

    window.addEventListener('unhandledrejection', (event) => {
      const msg = event?.reason?.message || (typeof event?.reason === 'string' ? event.reason : '');
      if (isExtensionChannelError(msg)) {
        event.preventDefault();
        if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      }
    });

    window.addEventListener('error', (event) => {
      const msg = event?.message || '';
      if (isExtensionChannelError(msg)) {
        event.preventDefault();
        if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      }
    });

    const originalConsoleError = console.error;
    console.error = (...args) => {
      const firstArg = typeof args[0] === 'string' ? args[0] : (args[0]?.message || '');
      if (isExtensionChannelError(firstArg)) {
        return;
      }
      originalConsoleError.apply(console, args);
    };
  }
});
