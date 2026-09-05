/// <reference types="vite/client" />

// html2pdf.js does not ship TypeScript types.
// Minimal shim covering the chained API used in src/utils/pdfExport.ts
declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type?: 'jpeg' | 'png' | 'webp'; quality?: number };
    html2canvas?: Record<string, unknown>;
    jsPDF?: Record<string, unknown>;
    pagebreak?: Record<string, unknown>;
  }

  interface Html2PdfWorker {
    set: (options: Html2PdfOptions) => Html2PdfWorker;
    from: (element: HTMLElement | string) => Html2PdfWorker;
    save: () => Promise<void>;
    outputPdf: (type?: string) => Promise<unknown>;
    then: Html2PdfWorker['save'];
  }

  function html2pdf(): Html2PdfWorker;
  export default html2pdf;
}
