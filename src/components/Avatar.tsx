import { initialsOf, gradientFor } from "@/lib/avatar";

// Renders a user's avatar image, or a deterministic initials-on-gradient
// fallback. Works in both server and client components (no hooks).
export function Avatar({
  name,
  src,
  handle,
  size = 40,
  className = "",
}: {
  name?: string | null;
  src?: string | null;
  handle?: string | null;
  size?: number;
  className?: string;
}) {
  const dimension = { width: size, height: size };

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name ? `${name}'s avatar` : "avatar"}
        style={dimension}
        className={`rounded-full object-cover border border-white/10 ${className}`}
      />
    );
  }

  const [a, b] = gradientFor(handle || name);
  return (
    <span
      aria-hidden="true"
      style={{ ...dimension, background: `linear-gradient(135deg, ${a}, ${b})`, fontSize: size * 0.4 }}
      className={`rounded-full flex items-center justify-center font-black text-white select-none border border-white/10 ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}
