import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import Img from "../components/ui/Img";
import { CRAFT_IMAGE } from "../data/products";

const VALUES = [
  [
    "Seasoned Wood",
    "Every piece starts with kiln-dried, responsibly sourced timber so it stays true for decades.",
  ],
  [
    "Hand Finished",
    "Sanded, stained and polished by our artisans, never rushed through a machine line.",
  ],
  [
    "Honest Pricing",
    "We sell directly from our workshop, so you pay for the furniture and not the middlemen.",
  ],
  [
    "Built to Last",
    "Strong joinery and a 2 year warranty on frames, backed by real after-sales support.",
  ],
];

export default function About() {
  return (
    <>
      <PageHeader
        title="About Maison"
        eyebrow="Our Story"
        crumbs={[{ label: "About" }]}
      />
      <section className="wrap grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-20">
        <Img src={CRAFT_IMAGE} alt="Workshop" className="aspect-[4/3] w-full" />
        <div className="space-y-4 text-sm leading-relaxed text-ink/80 sm:text-base">
          <h2 className="h-display text-3xl sm:text-4xl">
            We give form to the timeless.
          </h2>
          <p>
            Maison began as a small workshop in Dhaka with a simple belief: good
            furniture should be made carefully, priced fairly and built to be
            passed on.
          </p>
          <p>
            Today our craftsmen create sofas, beds, almirahs, tables and chairs
            that blend traditional joinery with clean, modern design, and we
            deliver them to homes across Bangladesh.
          </p>
          <Link to="/shop" className="btn mt-4">
            Explore the collection
          </Link>
        </div>
      </section>
      <section className="bg-white py-14 sm:py-20">
        <div className="wrap grid gap-6 xs:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([t, d]) => (
            <div key={t} className="border-l-2 border-gold pl-4">
              <h3 className="font-serif text-xl">{t}</h3>
              <p className="mt-2 text-sm text-ink/70">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
