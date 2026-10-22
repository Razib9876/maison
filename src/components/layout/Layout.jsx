import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <div className="bg-ink px-3 py-2 text-center text-[0.62rem] uppercase tracking-[0.2em] text-sand/90 sm:text-[0.68rem]">
        Free delivery above ৳1,00,000 &nbsp;·&nbsp; Use code <b className="text-gold">WELCOME10</b> for 10% off
      </div>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
