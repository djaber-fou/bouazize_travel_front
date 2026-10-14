/**
 * Universal print helper for clean, unclipped document printing (Vouchers & Invoices)
 * Renders document in a dedicated hidden iframe to bypass modal overflow-y / body lock clipping.
 */
export function printDocumentElement(element, docTitle = 'Document') {
  if (!element || typeof window === 'undefined') return;

  // Remove existing print iframe if any
  const oldIframe = document.getElementById('bzz-print-iframe');
  if (oldIframe) {
    oldIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'bzz-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <title>${docTitle}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 8mm 10mm 8mm;
          }
          *, *::before, *::after {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
          }
          #print-root {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
          /* Ensure backgrounds print correctly */
          .bg-slate-50, .bg-slate-50\\/50 { background-color: #f8fafc !important; }
          .bg-slate-100 { background-color: #f1f5f9 !important; }
          .bg-white { background-color: #ffffff !important; }
          .text-slate-900 { color: #0f172a !important; }
          .text-slate-800 { color: #1e293b !important; }
          .text-slate-700 { color: #334155 !important; }
          .text-slate-600 { color: #475569 !important; }
          .text-slate-500 { color: #64748b !important; }
          .border-slate-200 { border-color: #e2e8f0 !important; }
          .border-slate-300 { border-color: #cbd5e1 !important; }
          img { max-width: 100%; display: inline-block; }
        </style>
      </head>
      <body>
        <div id="print-root">
          ${element.outerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Wait for images inside iframe to load before printing
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.warn('Iframe print error, falling back to window.print():', e);
      window.print();
    } finally {
      setTimeout(() => {
        iframe.remove();
      }, 1500);
    }
  }, 450);
}
