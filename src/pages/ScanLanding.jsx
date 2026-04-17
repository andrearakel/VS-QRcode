import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllProducts } from '../services/productService';

export default function ScanLanding() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 text-center">
        <h1 className="text-3xl font-bold">Visible Sustainability</h1>
        <p className="text-blue-200 mt-2">
          Scan a QR code on any product to see its full story
        </p>
        <div className="text-6xl mt-6">📱</div>
      </div>

      {/* Dev: product list for testing */}
      <div className="p-5">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Demo Products
        </h2>
        <div className="space-y-2">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-500">
                    {p.species.common_name} · {p.format} · {p.cut === 'whole_gutted' ? 'whole' : p.cut}
                  </p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}