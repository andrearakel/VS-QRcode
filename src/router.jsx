import { createBrowserRouter } from "react-router-dom";
import ScanLanding from "./pages/ScanLanding";
import ProductPage from "./pages/ProductPage";
import RecipePage from "./pages/RecipePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ScanLanding />,
  },
  {
    path: "/product/:productId",
    element: <ProductPage />,
  },
  {
    path: "/product/:id/recipe/:index",
    element: <RecipePage />,
  },
  {
    path: "/batch/:batchId",
    element: <ProductPage />,
  },
]);