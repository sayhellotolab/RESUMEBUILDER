import html2pdf from 'html2pdf.js';

/**
 * Exports the given DOM element to a paginated A4 PDF.
 *
 * Note: html2pdf.js uses html2canvas internally to rasterize the element.
 * This project aliases `html2canvas` -> `html2canvas-pro` in vite.config.ts
 * so modern CSS color functions (oklch/color-mix from Tailwind v4) render
 * correctly instead of throwing during capture.
 */
export const exportToPdf = (elementId: string, filename: string = 'Document.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    return;
  }

  const options = {
    margin: 0,
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait' as const,
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  html2pdf()
    .set(options)
    .from(element)
    .save()
    .catch((err: unknown) => {
      console.error('PDF export failed:', err);
    });
};
