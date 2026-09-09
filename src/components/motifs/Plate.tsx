/**
 * The plate — Happy Plate's travelling motif.
 *
 * Concentric rings rather than an icon: it reads as a dinner plate, the rim of
 * the logo, and a table seen from above all at once. Strokes only, with just a
 * faint wash, so it can pass behind typography without fighting it.
 *
 * The rings are broken — the same interruption the logo's circle has where the
 * fork and knife sit. That asymmetry is also what lets rotation read at all; a
 * closed circle would spin invisibly.
 */
export function Plate({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="plateWash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#C9A45C" stopOpacity="0.10" />
          <stop offset="70%" stopColor="#C9A45C" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#C9A45C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="plateRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9A45C" />
          <stop offset="45%" stopColor="#E4C68C" />
          <stop offset="100%" stopColor="#A98445" />
        </linearGradient>
      </defs>

      <circle cx="100" cy="100" r="92" fill="url(#plateWash)" />

      {/* outer rim, broken like the logo's circle (C≈578) */}
      <circle
        cx="100" cy="100" r="92" stroke="url(#plateRim)" strokeWidth="0.9"
        strokeLinecap="round" strokeDasharray="530 48" opacity="0.85"
        transform="rotate(-26 100 100)"
      />
      {/* the step down into the well, broken on the far side (C≈440) */}
      <circle
        cx="100" cy="100" r="70" stroke="url(#plateRim)" strokeWidth="0.6"
        strokeLinecap="round" strokeDasharray="408 32" opacity="0.5"
        transform="rotate(146 100 100)"
      />
      {/* base ring */}
      <circle cx="100" cy="100" r="44" stroke="url(#plateRim)" strokeWidth="0.4" opacity="0.26" />
    </svg>
  );
}
