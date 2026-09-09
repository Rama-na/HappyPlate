/**
 * The fork — drawn from the one tucked into the logo's rim.
 *
 * Used as the progress marker that travels the evening's timeline. Line weights
 * stay hairline-thin so it reads as engraving rather than an icon.
 */
export function Fork({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* tines */}
      <path d="M6 4v13M10 4v13M14 4v13M18 4v13"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* shoulder the tines gather into */}
      <path d="M6 17c0 4 2.4 6 6 6s6-2 6-6"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* handle */}
      <path d="M12 23v37"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
