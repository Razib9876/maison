import { Link } from "react-router-dom";
import Img from "./ui/Img";
import Rating from "./ui/Rating";
import { HeartIcon } from "./ui/Icons";
import { formatPrice, discountPercent } from "../lib/format";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const off = discountPercent(product.price, product.oldPrice);
  const out = product.stock <= 0;
  const liked = has(product.id);

  const add = () => {
    const r = addItem(product.id, 1, (product.colors && product.colors[0]) || "");
    toast(r.message, r.ok ? "success" : "error");
  };

  const like = () => {
    const added = toggle(product.id);
    toast(added ? "Saved to wishlist." : "Removed from wishlist.");
  };

  return (
    <article className="group min-w-0">
      <div className="relative aspect-square overflow-hidden bg-stone-200">
        <Link to={`/product/${product.slug}`} aria-label={product.name}>
          <Img
            src={product.images && product.images[0]}
            alt={product.name}
            className={`h-full w-full transition duration-700 group-hover:scale-105 ${out ? "opacity-60" : ""}`}
          />
        </Link>

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {out && <span className="bg-ink px-2 py-1 text-[0.6rem] uppercase tracking-widest text-sand">Sold out</span>}
          {!out && off > 0 && <span className="bg-gold px-2 py-1 text-[0.6rem] uppercase tracking-widest text-white">-{off}%</span>}
          {!out && product.isNew && <span className="bg-white px-2 py-1 text-[0.6rem] uppercase tracking-widest">New</span>}
        </div>

        <button
          onClick={like}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 transition hover:bg-white"
        >
          <HeartIcon size={18} filled={liked} className={liked ? "text-red-600" : ""} />
        </button>

        <button
          onClick={add}
          disabled={out}
          className="absolute inset-x-0 bottom-0 bg-ink py-3 text-xs uppercase tracking-[0.2em] text-sand transition disabled:hidden md:translate-y-full md:group-hover:translate-y-0"
        >
          Add to Cart
        </button>
      </div>

      <p className="mt-4 text-[0.65rem] uppercase tracking-[0.25em] text-gold">{product.category}</p>
      <h3 className="mt-1 font-serif text-lg leading-snug sm:text-xl">
        <Link to={`/product/${product.slug}`} className="hover:text-gold">{product.name}</Link>
      </h3>
      <div className="mt-1"><Rating value={product.rating} count={product.reviews} /></div>
      <p className="mt-1 text-sm">
        <span className="font-medium">{formatPrice(product.price)}</span>
        {product.oldPrice > product.price && <span className="ml-2 text-ink/40 line-through">{formatPrice(product.oldPrice)}</span>}
      </p>
    </article>
  );
}
