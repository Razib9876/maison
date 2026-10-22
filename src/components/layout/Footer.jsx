import { Link } from "react-router-dom";
import { SITE } from "../../data/config";
import { CATEGORIES } from "../../data/products";

export default function Footer() {
  return (
    <footer className="bg-ink text-sand">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-serif text-2xl uppercase tracking-[0.2em]">{SITE.name}</h3>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand/70">
            Handcrafted sofas, beds, almirahs, tables and chairs for homes that are meant to last. Delivered across Bangladesh.
          </p>
        </div>

        <div>
          <h4 className="eyebrow">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-sand/80">
            {CATEGORIES.map((c) => (
              <li key={c}><Link to={`/shop?category=${c}`} className="hover:text-gold">{c}s</Link></li>
            ))}
            <li><Link to="/shop" className="hover:text-gold">All Furniture</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">Help</h4>
          <ul className="mt-4 space-y-2 text-sm text-sand/80">
            <li><Link to="/track-order" className="hover:text-gold">Track Order</Link></li>
            <li><Link to="/policy/shipping" className="hover:text-gold">Shipping Policy</Link></li>
            <li><Link to="/policy/returns" className="hover:text-gold">Returns & Refunds</Link></li>
            <li><Link to="/policy/privacy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="/policy/terms" className="hover:text-gold">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-sand/80">
            <li>{SITE.email}</li>
            <li>{SITE.phone}</li>
            <li>{SITE.address}</li>
            <li>{SITE.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand/10 py-5 text-center text-xs text-sand/50">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved. We accept Cash on Delivery, bKash and Nagad.
      </div>
    </footer>
  );
}
