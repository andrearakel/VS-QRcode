import { createBrowserRouter } from 'react-router-dom';
import ScanLanding from './pages/ScanLanding';
import ProductPage from './pages/ProductPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ScanLanding />,
  },
  {
    path: '/product/:productId',
    element: <ProductPage />,
  },
]);