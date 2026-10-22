import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const { products } = useProducts();
  const { ids } = useWishlist();
  const list = products.filter((p) => ids.includes(p.id));

  return (
    <>
      <PageHeader title="Wishlist" crumbs={[{ label: "Wishlist" }]} />
      <div className="wrap py-10 sm:py-14">
        {list.length === 0 ? (
          <EmptyState title="Your wishlist is empty" text="Tap the heart on any product to save it here." actionLabel="Browse furniture" actionTo="/shop" />
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 xs:grid-cols-2 lg:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
}
