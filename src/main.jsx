import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext";
import { ProductsProvider } from "./context/ProductsContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ProductsProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <OrdersProvider>
                  <App />
                </OrdersProvider>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ProductsProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
