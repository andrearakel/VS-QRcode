import { useState, useEffect } from 'react';
import { getProduct } from '../services/productService';

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getProduct(productId)
      .then((data) => {
        if (!data) {
          setError('Product not found');
        }
        setProduct(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  return { product, loading, error };
};