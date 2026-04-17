import { useCallback } from 'react';
import { logEvent } from '../services/analyticsService';

export const useAnalytics = (productId) => {
  const trackCategoryOpen = useCallback(
    (category) => {
      logEvent(productId, category, 1);
    },
    [productId]
  );

  const trackDetailView = useCallback(
    (category) => {
      logEvent(productId, category, 2);
    },
    [productId]
  );

  const trackLanding = useCallback(() => {
    logEvent(productId, 'landing', 0);
  }, [productId]);

  return { trackLanding, trackCategoryOpen, trackDetailView };
};