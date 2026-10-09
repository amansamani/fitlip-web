import { FitLipMark } from '@/components/brand/fitlip-mark';

export function Nav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 top-0 z-50 flex h-[calc(58px+env(safe-area-inset-top))] items-center gap-7 border-b border-white/10 bg-plum-950/60 px-[max(20px,3vw)] pt-[env(safe-area-inset-top)] backdrop-blur-md"
    >
      <a href="#top" className="mr-auto flex items-center gap-2.5 text-[17px] font-semibold">
        <FitLipMark size={26} accent="#B887C7" />
        FitLip
      </a>
      <a href="#tour" className="text-sm text-white/75 hover:text-white max-tour:hidden">Features</a>
      <a href="#download" className="text-sm text-white/75 hover:text-white max-tour:hidden">Install</a>
      <a href="#download" className="inline-flex h-9 items-center rounded-[10px] bg-white px-4 text-sm font-semibold text-plum-900 hover:opacity-90">
        Get the app
      </a>
    </nav>
  );
}
