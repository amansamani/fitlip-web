/** Exact outlines from the mobile app's src/components/share/FitLipWordmark.tsx. */
export const FITLIP_LETTERS = 'M0 24V18C0 7 7 2 18 2H34V10C29 14 24 14 18 14C10 14 5 18 0 24ZM0 44V33C0 24 7 20 17 20H31C30 27 27 30 20 30H14C11 30 10 32 10 35V44Z M40 18H47V44H40Z M55 10H62V18H70V24H62V34C62 38 64 39 70 37V43C60 47 55 43 55 35V24H51V18H55Z M77 5H85V37H101V44H77Z M107 18H114V44H107Z M121 18H128V21C133 15 145 17 147 28C151 41 139 50 128 42V54H121Z M128 31C128 41 141 41 141 31C141 21 128 21 128 31Z';
export const FITLIP_DOTS = 'M40 6H47V13H40Z M107 6H114V13H107Z';

export function FitLipWordmark({ width = 112, color = '#49225B', accent = '#B887C7', className }: { width?: number; color?: string; accent?: string; className?: string }) {
  return <svg className={className} width={width} height={width * 56 / 150} viewBox="0 0 150 56" role="img" aria-label="FitLip"><path d={FITLIP_LETTERS} fill={color} fillRule="evenodd" /><path d={FITLIP_DOTS} fill={accent} /></svg>;
}
