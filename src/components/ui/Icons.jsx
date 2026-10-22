const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };

function Svg({ size = 20, children, ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
      {children}
    </svg>
  );
}

export const SearchIcon = (p) => (<Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>);
export const HeartIcon = ({ filled, ...p }) => (
  <Svg {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 21s-7-4.6-9.3-9A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9.3 6c-2.3 4.4-9.3 9-9.3 9z" />
  </Svg>
);
export const BagIcon = (p) => (<Svg {...p}><path d="M6 7h12l1 13H5L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></Svg>);
export const UserIcon = (p) => (<Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></Svg>);
export const MenuIcon = (p) => (<Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>);
export const CloseIcon = (p) => (<Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>);
export const TruckIcon = (p) => (<Svg {...p}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></Svg>);
export const ShieldIcon = (p) => (<Svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="m9 12 2 2 4-4" /></Svg>);
export const ReturnIcon = (p) => (<Svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></Svg>);
export const CashIcon = (p) => (<Svg {...p}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /></Svg>);
export const TrashIcon = (p) => (<Svg {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Svg>);
export const PlusIcon = (p) => (<Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>);
export const MinusIcon = (p) => (<Svg {...p}><path d="M5 12h14" /></Svg>);
export const CheckIcon = (p) => (<Svg {...p}><path d="m5 12 5 5 9-10" /></Svg>);
export const FilterIcon = (p) => (<Svg {...p}><path d="M4 6h16M7 12h10M10 18h4" /></Svg>);
