export const exportToDocx = (elementId: string, filename: string = 'Document.docx') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for DOCX export.`);
    return;
  }

  // Retrieve the inner html
  let htmlContent = element.innerHTML;

  // Cleanup interactive elements (e.g. range sliders, action buttons, progress bars if any)
  // Let's replace any skill bars with simple text level indications for Word readability
  // Since Modern Template has skill bars, we want to make sure it prints nicely
  // We can inject customized inline styles to ensure tables, flex boxes, and spacing render beautifully in Word
  const documentTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>Document Export</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 20mm 20mm 20mm 20mm;
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.45;
          color: #27272a;
          margin: 0;
          padding: 0;
        }
        h1 {
          font-size: 26pt;
          font-weight: bold;
          margin-bottom: 2pt;
          text-transform: uppercase;
          color: #09090b;
          font-family: 'Georgia', serif;
        }
        h2 {
          font-size: 13pt;
          font-weight: bold;
          border-bottom: 2px solid #e4e4e7;
          padding-bottom: 3pt;
          margin-top: 14pt;
          margin-bottom: 6pt;
          text-transform: uppercase;
          color: #18181b;
        }
        h3 {
          font-size: 11pt;
          font-weight: bold;
          margin-top: 8pt;
          margin-bottom: 2pt;
          color: #18181b;
        }
        p {
          margin: 0 0 6pt 0;
          font-size: 10pt;
          color: #3f3f46;
          text-align: justify;
        }
        a {
          color: #4f46e5;
          text-decoration: none;
        }
        ul {
          margin: 0 0 6pt 16pt;
          padding: 0;
        }
        li {
          margin-bottom: 3pt;
          font-size: 10pt;
          color: #3f3f46;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8pt;
        }
        td {
          vertical-align: top;
          padding: 3pt 0;
        }
        .text-right {
          text-align: right;
        }
        .text-xs {
          font-size: 9pt;
          color: #71717a;
        }
        .text-sm {
          font-size: 10pt;
        }
        .font-semibold {
          font-weight: bold;
        }
        .italic {
          font-style: italic;
        }
        /* Specific structures for two-column resume grids */
        .grid-experience {
          margin-bottom: 8pt;
        }
        .border-l-2 {
          border-left: 2px solid #e4e4e7;
          padding-left: 8pt;
        }
        /* Override tailwind dark-mode coloring to ensure it renders as black-and-white in Word */
        * {
          color: #18181b !important;
          background-color: transparent !important;
          background: transparent !important;
        }
        a {
          color: #4f46e5 !important;
          text-decoration: underline !important;
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  // Wrap inside application/octet-stream to bypass browser download protection filters
  const blob = new Blob(['\ufeff' + documentTemplate], {
    type: 'application/octet-stream'
  });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};
