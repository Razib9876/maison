import { useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import { SHIPPING } from "../data/config";
import { formatPrice } from "../lib/format";

const POLICIES = {
  shipping: {
    title: "Shipping Policy",
    body: [
      `We deliver to all 64 districts of Bangladesh. Delivery inside Dhaka costs ${formatPrice(SHIPPING.dhaka)} and outside Dhaka ${formatPrice(SHIPPING.outside)}.`,
      `Orders above ${formatPrice(SHIPPING.freeAbove)} qualify for free delivery.`,
      "Delivery usually takes 5–10 working days. Our team will call you before delivering and will assemble beds, almirahs and large tables at your home.",
      "Please inspect the product at the time of delivery and report any damage immediately.",
    ],
  },
  returns: {
    title: "Returns & Refunds",
    body: [
      "You may request a return within 7 days of delivery if the product is unused and in its original condition.",
      "Custom-made or specially ordered items cannot be returned unless they arrive damaged.",
      "Approved refunds are processed within 7 working days to your original payment method (or bKash/Nagad number).",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect only the information needed to process your order: name, phone, address and email.",
      "We never sell your personal information. It is used only to deliver your order and to contact you about it.",
      "You may request deletion of your data at any time by contacting us.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "By placing an order you agree to provide accurate information and to accept delivery at the address given.",
      "Prices and availability may change without notice. Colors may vary slightly from photographs.",
      "Orders paid through bKash or Nagad are confirmed after we verify the transaction ID.",
      "Warranty covers manufacturing defects in frames and joinery and does not cover misuse, water damage or normal wear.",
    ],
  },
};

export default function Policy() {
  const { type } = useParams();
  const p = POLICIES[type];
  if (!p) {
    return (
      <div className="wrap">
        <EmptyState title="Page not found" actionLabel="Go home" actionTo="/" />
      </div>
    );
  }
  return (
    <>
      <PageHeader title={p.title} eyebrow="Policies" crumbs={[{ label: p.title }]} />
      <div className="wrap max-w-3xl space-y-4 py-10 text-sm leading-relaxed text-ink/80 sm:py-14 sm:text-base">
        {p.body.map((t) => <p key={t}>{t}</p>)}
      </div>
    </>
  );
}
