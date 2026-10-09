/** The F and L mark from the app (FitLipMark.tsx), as plain SVG. */
export function FitLipMark({ size = 28, color = '#fff', accent = color, title = 'FitLip' }: { size?: number; color?: string; accent?: string; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="-3 -8 66 66" role="img" aria-label={title}>
      <path d="M0 24V18C0 7 7 2 18 2H34V10C29 14 24 14 18 14C10 14 5 18 0 24ZM0 44V33C0 24 7 20 17 20H31C30 27 27 30 20 30H14C11 30 10 32 10 35V44Z" fill={color} />
      <path d="M37 5H45V37H61V44H37Z" fill={accent} />
    </svg>
  );
}
