# Maison Wood – Furniture E-commerce (React + Vite + Tailwind)

Multi-page furniture store: Sofa, Bed, Almirah, Table, Chair.
Responsive from 300px up to 4000px+ (root font-size scales with the screen).

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
```

## Features
- Pages: Home, Shop (search, category, price, sort, in-stock, pagination), Product details (gallery, color, qty, Buy Now),
  Cart (qty, coupon), Checkout, Order success, Track order, Wishlist, Login/Register, Account (orders, profile, cancel),
  About, Contact, Policies, 404
- Buying flow: cart -> checkout (COD / bKash / Nagad with TrxID) -> order saved -> stock reduced -> order tracking
- Admin panel (/admin): dashboard, product add/edit/delete, order list, order status update (cancel restores stock)

## Demo accounts / coupons
- Admin: admin@maisonwood.com / admin123
- Coupons: WELCOME10 (10%), FURNI500 (৳500 off above ৳20,000)

## Important
All data (products, orders, users, cart) is stored in the browser's localStorage, so the whole store works with no server.
This is a demo-grade data layer: passwords are not hashed and orders are only visible in the browser where they were placed.
For a real shop, replace the context files in `src/context/` with API calls (Express + MongoDB), keep the UI unchanged.

## Structure
```
src/
  data/        config.js (shipping, coupons, payment, districts), products.js (seed products)
  lib/         format.js, pricing.js, storage.js
  context/     Toast, Products, Auth, Wishlist, Cart, Orders
  components/  layout/ (Navbar, Footer, Layout), ui/, ProductCard, OrderDetailView, RequireAuth
  pages/       all store pages, admin/ (Layout, Dashboard, Products, Orders, OrderDetail)
```
Deploy: Netlify (`public/_redirects`) and Vercel (`vercel.json`) SPA rewrites are included.
