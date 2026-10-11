import type Lenis from 'lenis';

/** Shared reference so any component can trigger smooth scrolls. */
export const lenisRef: { current: Lenis | null } = { current: null };