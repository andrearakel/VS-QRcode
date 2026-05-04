import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useProduct } from '../hooks/useProduct';
import ProductLanding from '../components/landing/ProductLanding';
import productsData from '../data/products.json';

const products = productsData.products || [];

// Map batch species to product IDs
const SPECIES_TO_PRODUCT = {
  cod: 'prod-001',
  haddock: 'prod-003',
};

export default function ProductPage() {
  const { productId, batchId } = useParams();
  const location = useLocation();
  
  const isBatchRoute = location.pathname.startsWith('/batch/');
  
  const [batch, setBatch] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState(null);
  
  // For product routes, use the hook
  const { product: hookProduct, loading: productLoading, error: productError } = useProduct(
    isBatchRoute ? null : productId
  );

  // For batch routes, fetch from Supabase
  useEffect(() => {
    if (!isBatchRoute || !batchId) return;

    async function fetchBatch() {
      setBatchLoading(true);
      setBatchError(null);

      try {
        const { data, error } = await supabase
          .from('batches')
          .select('*')
          .eq('id', batchId)
          .single();

        if (error) throw new Error(error.message);
        if (!data) throw new Error('Batch not found');

        setBatch(data);
      } catch (err) {
        console.error('Error fetching batch:', err);
        setBatchError(err.message);
      } finally {
        setBatchLoading(false);
      }
    }

    fetchBatch();
  }, [isBatchRoute, batchId]);

  // Determine which product to show
  let product = null;
  let loading = false;
  let error = null;

  if (isBatchRoute) {
    loading = batchLoading;
    error = batchError;
    
    // Find product based on batch species
    if (batch) {
      const mappedProductId = SPECIES_TO_PRODUCT[batch.species];
      product = products.find(p => p.id === mappedProductId) || null;
    }
  } else {
    loading = productLoading;
    error = productError;
    product = hookProduct;
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-pulse">🐟</div>
          <p className="text-gray-500 mt-2">
            {isBatchRoute ? 'Loading batch data...' : 'Loading product...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mt-3">
            {isBatchRoute ? 'Batch Not Found' : 'Product Not Found'}
          </h2>
          <p className="text-gray-500 mt-1">
            {error || 'The QR code may be invalid or the item is not in our system.'}
          </p>
          <p className="text-sm text-gray-400 mt-3 font-mono">
            {isBatchRoute ? batchId : productId}
          </p>
        </div>
      </div>
    );
  }

  return <ProductLanding product={product} batch={batch} />;
}