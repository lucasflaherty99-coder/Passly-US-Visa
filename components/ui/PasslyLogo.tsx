// PasslyLogo.tsx — Passly AI brand mark
//
// Reconstructed from brand identity reference images (May 2026)
// Primary icon: open passport book
//   Left page  → USA silhouette (crimson)
//   Right page → globe grid (steel blue)
//   Base       → bold V-checkmark (navy) — forms book spine AND checkmark
//
// Brand palette (adjusted per user feedback — more blue, more red):
//   Navy    #1B3569  outlines, wordmark, checkmarks
//   Crimson #7E1B2A  USA silhouette  (wine-red, not orange)
//   Globe   #84B0DC  globe strokes   (saturated steel blue, not gray-blue)

const C = {
  navy:        "#1B3569",
  crimson:     "#7E1B2A",
  globeStroke: "#84B0DC",
  globeFill:   "#E8F2FB",   // very light blue, only used in shield variant
  white:       "#FFFFFF",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// PASSPORT ICON  (open book — matches reference image)
// viewBox 0 0 80 72
// Left  page: white + USA crimson silhouette
// Right page: white + globe grid (steel blue, no fill)
// Base:       bold navy checkmark — left arm = book V, right arm = up through right page
// ─────────────────────────────────────────────────────────────────────────────
export function PasslyPassportIcon({
  size = 56,
  className,
}: {
  size?: number;
  className?: string;
}) {
  // Globe geometry (right page, upper area)
  const gx = 57, gy = 26, gr = 13;

  // Helper: x extent of a horizontal chord at offset dy from globe center
  const chordX = (dy: number) => {
    const half = Math.sqrt(gr * gr - dy * dy);
    return { x1: gx - half, x2: gx + half };
  };

  return (
    <svg
      width={Math.round(size * (80 / 72))}
      height={size}
      viewBox="0 0 80 72"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ── LEFT PAGE ──────────────────────────────────────────────────────── */}
      <path
        d="M 40,6 L 9,6 Q 5,6 5,10 L 5,51 Q 5,57 9,61 L 26,67 Q 33,70 40,68 Z"
        fill={C.white}
        stroke={C.navy}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* ── RIGHT PAGE ─────────────────────────────────────────────────────── */}
      <path
        d="M 40,6 L 71,6 Q 75,6 75,10 L 75,51 Q 75,57 71,61 L 54,67 Q 47,70 40,68 Z"
        fill={C.white}
        stroke={C.navy}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* ── USA SILHOUETTE — left page (crimson filled polygon) ────────────── */}
      {/* Simplified continental US: Pacific coast left → northern border →     */}
      {/* east coast → Florida peninsula → Gulf coast → Texas → SW → Pacific   */}
      <path
        d={`
          M 10,33
          L 10,27 L 11,24 L 12,22 L 13,20
          L 16,20 L 18,21 L 21,20 L 23,21
          L 25,20 L 27,20 L 29,21 L 30,23
          L 31,26 L 31,29 L 30,32
          L 32,36 L 33,39
          L 34,42 L 32,44
          L 30,43 L 28,44 L 26,44 L 24,45 L 22,44
          L 19,45 L 16,43 L 13,41
          L 11,38 L 10,36 Z
        `}
        fill={C.crimson}
      />

      {/* ── GLOBE — right page (no fill, steel-blue grid) ──────────────────── */}
      {/* Outer circle */}
      <circle cx={gx} cy={gy} r={gr} stroke={C.globeStroke} strokeWidth="1.8" fill="none" />

      {/* Latitude lines (4 lines: upper-2, equator, lower-2) */}
      {([-7, -4, 0, 4, 7] as const).map((dy) => {
        const { x1, x2 } = chordX(dy);
        return (
          <line
            key={dy}
            x1={x1} y1={gy + dy}
            x2={x2} y2={gy + dy}
            stroke={C.globeStroke}
            strokeWidth={dy === 0 ? 1.5 : 1.1}
          />
        );
      })}

      {/* Meridian arcs — two ellipses create 4 arcs; inner + outer pair */}
      <ellipse cx={gx} cy={gy} rx={4}  ry={gr} stroke={C.globeStroke} strokeWidth="1.1" fill="none" />
      <ellipse cx={gx} cy={gy} rx={10} ry={gr} stroke={C.globeStroke} strokeWidth="1.1" fill="none" />

      {/* ── BOLD CHECKMARK — spine of book + upward arm into right page ─────── */}
      {/* Left arm  → (book V): from left-page lower area down to V tip         */}
      {/* Right arm → (checkmark long leg): from V tip up-right through globe    */}
      <path
        d="M 14,62 L 40,70 L 73,18"
        stroke={C.navy}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHIELD ICON  (navbar / small sizes 24–36px)
// Navy shield outline · steel-blue globe · navy checkmark · crimson airplane
// ─────────────────────────────────────────────────────────────────────────────
export function PasslyShieldIcon({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={Math.round(size * 0.9)}
      height={size}
      viewBox="0 0 44 50"
      fill="none"
      overflow="visible"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield outline */}
      <path
        d="M 5,9 Q 5,4 10,4 L 34,4 Q 39,4 39,9 L 39,32 Q 39,46 22,51 Q 5,46 5,32 Z"
        fill={C.white}
        stroke={C.navy}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Globe — light fill so it reads against the white shield */}
      <circle cx="22" cy="26" r="13" fill={C.globeFill} />
      <circle cx="22" cy="26" r="13" stroke={C.globeStroke} strokeWidth="1.5" fill="none" />
      <ellipse cx="22" cy="26" rx="5.5" ry="13" stroke={C.globeStroke} strokeWidth="1" fill="none" />
      <line x1="9"  y1="26" x2="35" y2="26" stroke={C.globeStroke} strokeWidth="1" />
      <line x1="11" y1="19" x2="33" y2="19" stroke={C.globeStroke} strokeWidth="0.8" />
      <line x1="11" y1="33" x2="33" y2="33" stroke={C.globeStroke} strokeWidth="0.8" />

      {/* Diagonal checkmark through globe */}
      <path
        d="M 10,29 L 20,40 L 37,17"
        stroke={C.navy}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Crimson airplane — top-right, outside shield, pointing up-right */}
      <g transform="translate(30, -1) rotate(42, 6, 6)">
        <path d="M 6,0 L 12,5 L 6,10 L 7.5,5 Z"   fill={C.crimson} />
        <path d="M 8,4 L 13,0 L 14,2 L 9.5,5 Z"   fill={C.crimson} />
        <path d="M 8,6 L 13,10 L 14,8 L 9.5,5 Z"  fill={C.crimson} />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSLY LOGO  (icon + "PASSLY" wordmark)
// ─────────────────────────────────────────────────────────────────────────────
interface PasslyLogoProps {
  /** "shield" = navbar/small; "passport" = hero/results header (48px+) */
  variant?: "shield" | "passport";
  /** Icon height in px */
  size?: number;
  showWordmark?: boolean;
  /** White wordmark for navy/dark backgrounds */
  dark?: boolean;
  className?: string;
}

export function PasslyLogo({
  variant = "shield",
  size = 32,
  showWordmark = true,
  dark = false,
  className,
}: PasslyLogoProps) {
  const Icon = variant === "passport" ? PasslyPassportIcon : PasslyShieldIcon;

  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Icon size={size} />
      {showWordmark && (
        <span
          style={{
            color: dark ? C.white : C.navy,
            fontWeight: 800,
            fontSize: Math.round(size * 0.56),
            letterSpacing: "0.1em",
            lineHeight: 1,
            textTransform: "uppercase" as const,
            fontFamily: "inherit",
            userSelect: "none",
          }}
        >
          Passly
        </span>
      )}
    </div>
  );
}
