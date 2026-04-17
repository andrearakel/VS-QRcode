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

async function generateAll() {
  for (const product of products) {
    const url = `${BASE_URL}/${product.id}`;
    const filename = `${product.id}-${product.label.toLowerCase().replace(/\s+/g, '-')}.png`;
    const filepath = path.join(outputDir, filename);

    await QRCode.toFile(filepath, url, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });

    console.log(`Done: ${filename}  ->  ${url}`);
  }

  console.log(`\nAll ${products.length} QR codes saved to .\\qr-codes\\`);
}

generateAll().catch(console.error);