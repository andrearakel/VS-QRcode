import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://vs-qrcode.netlify.app/product';

const products = [
  { id: 'prod-001', label: 'Cod Loin Fresh' },
  { id: 'prod-002', label: 'Cod Loin Frozen' },
  { id: 'prod-003', label: 'Haddock Loin Fresh' },
  { id: 'prod-004', label: 'Haddock Loin Frozen' },
  { id: 'prod-005', label: 'Salmon Fillet Fresh' },
  { id: 'prod-006', label: 'Salmon Fillet Frozen' },
];

const outputDir = path.resolve('qr-codes');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateSheet() {
  let cards = '';

  for (const product of products) {
    const url = `${BASE_URL}/${product.id}`;
    const dataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    });

    cards += `
      <div style="display:inline-block; text-align:center; margin:20px; padding:16px; border:2px solid #e2e8f0; border-radius:12px;">
        <img src="${dataUrl}" alt="${product.label}" style="width:200px; height:200px;" />
        <div style="margin-top:8px; font-size:16px; font-weight:600; color:#1a1a2e;">${product.label}</div>
        <div style="margin-top:4px; font-size:11px; color:#64748b;">${product.id}</div>
        <div style="margin-top:2px; font-size:10px; color:#94a3b8;">${url}</div>
      </div>`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Visible Sustainability - QR Codes</title>
  <style>
    @media print {
      body { margin: 0; }
      @page { margin: 1cm; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 20px;
      text-align: center;
    }
    h1 { color: #1a1a2e; font-size: 22px; margin-bottom: 4px; }
    p { color: #64748b; font-size: 13px; margin-bottom: 24px; }
  </style>
</head>
<body>
  <h1>Visible Sustainability - Product QR Codes</h1>
  <p>Scan any code to view full product transparency data</p>
  <div>${cards}</div>
</body>
</html>`;

  const sheetPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(sheetPath, html);
  console.log(`Done: ${sheetPath} created - open in browser and print`);
}

generateSheet().catch(console.error);