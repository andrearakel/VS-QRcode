import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

// ✅ CHANGE THIS to your deployed URL (Netlify/Vercel)
const BASE_URL = process.env.BASE_URL || 'https://visible-sustainability.netlify.app';

const products = [
  { id: 'prod-001', name: 'Fresh Cod Whole' },
  { id: 'prod-002', name: 'Fresh Cod Loin' },
  { id: 'prod-003', name: 'Frozen Cod Loin' },
  { id: 'prod-004', name: 'Fresh Haddock Whole' },
  { id: 'prod-005', name: 'Fresh Haddock Loin' },
  { id: 'prod-006', name: 'Frozen Haddock Loin' },
  { id: 'prod-007', name: 'Fresh Saithe Whole' },
  { id: 'prod-008', name: 'Fresh Saithe Loin' },
];

const outputDir = path.resolve('qr-codes');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generate() {
  console.log(`\n🐟 Generating QR codes for Visible Sustainability`);
  console.log(`📡 Base URL: ${BASE_URL}\n`);

  for (const product of products) {
    const url = `${BASE_URL}/product/${product.id}`;
    const filename = `${product.id}-${product.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    const filepath = path.join(outputDir, filename);

    await QRCode.toFile(filepath, url, {
      width: 512,
      margin: 2,
      color: {
        dark: '#0c4a6e',  // sky-900 — matches app branding
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',  // High — allows ~30% damage, good for printing
    });

    console.log(`  ✅ ${filename}`);
    console.log(`     → ${url}`);
  }

  // Also generate an index HTML for easy printing
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Visible Sustainability — QR Codes</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #0c4a6e; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; page-break-inside: avoid; }
    .card img { width: 200px; height: 200px; }
    .card h3 { margin: 8px 0 4px; color: #0c4a6e; }
    .card p { margin: 0; color: #64748b; font-size: 12px; word-break: break-all; }
    @media print { .grid { grid-template-columns: repeat(2, 1fr); } }
  </style>
</head>
<body>
  <h1>🐟 Visible Sustainability — QR Codes</h1>
  <p>Base URL: <code>${BASE_URL}</code></p>
  <p>Generated: ${new Date().toISOString()}</p>
  <div class="grid">
    ${products.map(p => `
    <div class="card">
      <img src="${p.id}-${p.name.toLowerCase().replace(/\s+/g, '-')}.png" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${BASE_URL}/product/${p.id}</p>
    </div>`).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
  console.log(`\n  📄 index.html (printable sheet)`);
  console.log(`\n✨ Done! QR codes saved to ./qr-codes/`);
  console.log(`   Open qr-codes/index.html in a browser to print.\n`);
}

generate().catch(console.error);