import { useEffect, useState } from "react";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='#e7e1d6'/><path d='M110 250h180v22H110zM125 205h150v45H125zM115 205h12v45h-12zM273 205h12v45h-12z' fill='#c9bfae'/></svg>"
  );

export default function Img({ src, alt = "", className = "", ...rest }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <img
      src={failed || !src ? PLACEHOLDER : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`bg-stone-200 object-cover ${className}`}
      {...rest}
    />
  );
}
