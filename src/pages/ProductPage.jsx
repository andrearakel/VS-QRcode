import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import ProductLanding from '../components/landing/ProductLanding';

export default function ProductPage() {
  const { productId } = useParams();
  const { product, loading, error } = useProduct(productId);

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-pulse">🐟</div>
          <p className="text-gray-500 mt-2">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mt-3">Product Not Found</h2>
          <p className="text-gray-500 mt-1">
            The QR code may be invalid or the product is not in our system.
          </p>
          <p className="text-sm text-gray-400 mt-3">
            Product ID: {productId}
          </p>
        </div>
      </div>
    );
  }

  return <ProductLanding product={product} />;
}