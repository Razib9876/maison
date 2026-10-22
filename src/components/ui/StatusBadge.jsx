const STYLES = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Processing: "bg-indigo-100 text-indigo-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-widest ${STYLES[status] || "bg-stone-200"}`}>
      {status}
    </span>
  );
}
