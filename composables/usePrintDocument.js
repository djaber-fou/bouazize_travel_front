/**
 * Universal print helper for clean, high-fidelity document printing (Hotel Vouchers & Invoices)
 * Clones current Nuxt stylesheets into an isolated A4-dimensioned iframe, waits for all images/fonts,
 * and triggers window.print() without clipping or premature DOM destruction.
 */
export function printDocumentElement(element, docTitle = 'Document') {
  if (!element || typeof window === 'undefined') return;

  // 1. Remove any previous print iframe to ensure a clean slate
  const oldIframe = document.getElementById('bzz-print-iframe');
  if (oldIframe) {
    oldIframe.remove();
  }

  // 2. Create isolated print iframe with realistic A4 dimensions
  // Chromium requires non-zero dimensions to compute layout and avoid viewport-clipped prints
  const iframe = document.createElement('iframe');
  iframe.id = 'bzz-print-iframe';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.width = '210mm';
  iframe.style.minHeight = '297mm';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.style.zIndex = '-9999';
  document.body.appendChild(iframe);

  const iframeWin = iframe.contentWindow;
  if (!iframeWin) return;
  const iframeDoc = iframeWin.document;

  // 3. Collect all active stylesheets and inline style tags from parent document
  const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(el => el.outerHTML)
    .join('\n');

  // 4. Assemble complete standalone HTML document with A4 page rules
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <title>${docTitle}</title>
        <base href="${window.location.origin}/" />
        ${headStyles}
        <style>
          @page {
            size: A4 portrait;
            margin: 6mm 8mm 6mm 8mm;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 11px;
            line-height: 1.35;
          }
          #print-root {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          #print-root > * {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 16px 20px !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 8px !important;
            box-shadow: none !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          /* Print-color-adjust fallbacks */
          .bg-white { background-color: #ffffff !important; }
          .bg-slate-50, .bg-slate-50\\/50 { background-color: #f8fafc !important; }
          .bg-slate-100 { background-color: #f1f5f9 !important; }
          .bg-slate-200, .bg-slate-200\\/80 { background-color: #e2e8f0 !important; }
          .bg-rose-50, .bg-rose-50\\/40 { background-color: #fff1f2 !important; }
          .bg-rose-100 { background-color: #ffe4e6 !important; }
          .bg-emerald-50 { background-color: #ecfdf5 !important; }
          .bg-amber-50 { background-color: #fffbeb !important; }
          .text-slate-900 { color: #0f172a !important; }
          .text-slate-800 { color: #1e293b !important; }
          .text-slate-700 { color: #334155 !important; }
          .text-slate-600 { color: #475569 !important; }
          .text-slate-500 { color: #64748b !important; }
          .text-slate-400 { color: #94a3b8 !important; }
          .text-rose-700 { color: #be123c !important; }
          .text-rose-800 { color: #9f1239 !important; }
          .text-rose-900 { color: #881337 !important; }
          .text-emerald-700 { color: #047857 !important; }
          .text-amber-700 { color: #b45309 !important; }
          .border-slate-200, .border-slate-200\\/80 { border-color: #e2e8f0 !important; }
          .border-slate-300 { border-color: #cbd5e1 !important; }
          .border-rose-600 { border-color: #e11d48 !important; }
          .border-rose-200 { border-color: #fecdd3 !important; }
          img {
            max-width: 100%;
            display: inline-block;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Explicit print rules for voucher & invoice images */
          img[src*="bouazize-logo"] {
            width: 52px !important;
            height: 52px !important;
            min-width: 52px !important;
            max-width: 52px !important;
            object-fit: contain !important;
            border-radius: 9999px !important;
          }
          img[src*="cachet-bouazize"] {
            height: 95px !important;
            max-height: 95px !important;
            width: auto !important;
            object-fit: contain !important;
          }
          /* Hide interactive or unwanted elements */
          .print\\:hidden, button, [role="button"] {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div id="print-root">
          ${element.outerHTML}
        </div>
      </body>
    </html>
  `);
  iframeDoc.close();

  // 5. Cleanup handler — trigger only when printing has completed or cancelled
  const cleanup = () => {
    try {
      if (iframe && iframe.parentNode) {
        iframe.remove();
      }
    } catch (_) {}
  };

  iframeWin.onafterprint = cleanup;
  // Safety timeout: 2 minutes (never premature 1.5s!)
  setTimeout(cleanup, 120000);

  // 6. Ensure all images and fonts are loaded before triggering print dialog
  const executePrint = () => {
    try {
      iframeWin.focus();
      iframeWin.print();
    } catch (err) {
      console.warn('Iframe print error, falling back to window.print():', err);
      window.print();
    }
  };

  const images = Array.from(iframeDoc.images);
  const imgPromises = images.map(img => {
    if (img.complete && img.naturalHeight !== 0) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  });

  const fontPromise = iframeDoc.fonts ? iframeDoc.fonts.ready : Promise.resolve();

  Promise.all([...imgPromises, fontPromise])
    .then(() => {
      // Small tick to ensure browser layout engine has painted all DOM nodes
      setTimeout(executePrint, 180);
    })
    .catch(() => {
      setTimeout(executePrint, 250);
    });
}
