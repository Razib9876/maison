import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Img from "../components/ui/Img";
import { CashIcon, ReturnIcon, ShieldIcon, TruckIcon } from "../components/ui/Icons";
import { CATEGORIES, CATEGORY_IMAGES, CRAFT_IMAGE, HERO_IMAGE } from "../data/products";
import { useProducts } from "../context/ProductsContext";
import { useToast } from "../context/ToastContext";
import { isValidEmail } from "../lib/format";
import { load, save } from "../lib/storage";

const USPS = [
  [TruckIcon, "Nationwide Delivery", "All 64 districts, with careful handling"],
  [ShieldIcon, "2 Year Warranty", "On frames and joinery"],
  [ReturnIcon, "7 Day Returns", "If it is not what you expected"],
  [CashIcon, "Cash on Delivery", "Or pay with bKash and Nagad"],
];

const REVIEWS = [
  ["Nusrat J.", "Dhaka", "The sofa is even better in person. Delivery was on time and the team set everything up."],
  ["Tanvir H.", "Chattogram", "Solid wood bed, no noise at all. Packaging was excellent and support answered quickly."],
  ["Farzana A.", "Sylhet", "Ordered an almirah and a dining table. Finish quality is far above the price."],
];

export default function Home() {
  const { products } = useProducts();
  const toast = useToast();
  const [email, setEmail] = useState("");

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const arrivals = [...products].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 4);

  const subscribe = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) return toast("Please enter a valid email address.", "error");
    const list = load("mw_newsletter", []);
    if (!list.includes(email.trim().toLowerCase())) save("mw_newsletter", [...list, email.trim().toLowerCase()]);
    setEmail("");
    toast("Thanks for subscribing!");
  };

  return (
    <>
      <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-ink text-sand">
        <Img src={HERO_IMAGE} alt="" loading="eager" className="absolute inset-0 h-full w-full opacity-50" />
        <div className="wrap relative py-24">
          <p className="eyebrow">Handcrafted Furniture</p>
          <h1 className="h-display mt-4 max-w-4xl text-[2.4rem] xs:text-5xl md:text-7xl">We give form to the timeless.</h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-sand/80 sm:text-base">
            Sofas, beds, almirahs and more, made from seasoned wood and finished by hand for homes meant to last.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/shop" className="btn-solid !border-sand !bg-sand !text-ink hover:!border-gold hover:!bg-gold hover:!text-white">Shop Now</Link>
            <Link to="/about" className="btn !border-sand !text-sand hover:!bg-sand hover:!text-ink">Our Story</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-white">
        <div className="wrap grid grid-cols-1 gap-6 py-8 xs:grid-cols-2 lg:grid-cols-4">
          {USPS.map(([Icon, title, text]) => (
            <div key={title} className="flex items-start gap-3">
              <Icon size={26} className="mt-0.5 shrink-0 text-gold" />
              <div>
                <h3 className="text-xs font-medium uppercase tracking-[0.15em]">{title}</h3>
                <p className="mt-1 text-xs text-ink/60">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap py-16 sm:py-24">
        <p className="eyebrow">Collections</p>
        <h2 className="h-display mt-3 text-3xl sm:text-5xl">Shop by room</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/shop?category=${c}`} className="group relative block aspect-[3/4] overflow-hidden">
              <Img src={CATEGORY_IMAGES[c]} alt={c} className="h-full w-full transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-4 text-sand">
                <h3 className="h-display text-2xl">{c}</h3>
                <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.25em]">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Bestsellers</p>
              <h2 className="h-display mt-3 text-3xl sm:text-5xl">Featured pieces</h2>
            </div>
            <Link to="/shop" className="btn">View all</Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 xs:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="wrap grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20">
        <Img src={CRAFT_IMAGE} alt="Our craftsmen at work" className="aspect-[4/3] w-full" />
        <div>
          <p className="eyebrow">The Artisans</p>
          <h2 className="h-display mt-3 text-3xl sm:text-5xl">Every piece has a story.</h2>
          <p className="mt-5 text-sm leading-relaxed text-ink/70 sm:text-base">
            Our craftsmen blend traditional joinery with modern design. Seasoned timber, honest finishes and careful
            detailing, so each sofa, bed and almirah feels personal and quietly luxurious.
          </p>
          <Link to="/about" className="btn mt-8">Read more</Link>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="wrap">
          <p className="eyebrow">Just In</p>
          <h2 className="h-display mt-3 text-3xl sm:text-5xl">New arrivals</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 xs:grid-cols-2 lg:grid-cols-4">
            {arrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="wrap py-16 sm:py-24">
        <p className="eyebrow">Testimonials</p>
        <h2 className="h-display mt-3 text-3xl sm:text-5xl">Loved at home</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {REVIEWS.map(([name, city, text]) => (
            <figure key={name} className="card p-6">
              <div className="tracking-widest text-gold">★★★★★</div>
              <blockquote className="mt-3 text-sm leading-relaxed text-ink/80">{text}</blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-[0.18em]">{name} · {city}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-ink text-sand">
        <div className="wrap py-16 text-center sm:py-20">
          <p className="eyebrow">Newsletter</p>
          <h2 className="h-display mt-3 text-3xl sm:text-4xl">Get 10% off your first order</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-sand/70">Subscribe for new collections and offers. Use code WELCOME10 at checkout.</p>
          <form onSubmit={subscribe} className="mx-auto mt-8 flex max-w-md flex-col gap-3 xs:flex-row">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Your email"
              aria-label="Email"
              className="w-full flex-1 border border-sand/30 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-sand/40 focus:border-gold"
            />
            <button className="btn-solid !border-gold !bg-gold">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
