'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function useScrollScene() {
  const section = useRef<HTMLDivElement>(null);
  const progress = useRef({value:0});
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)', () => {
      if(!section.current) return;
      const ctx = gsap.context(() => {
        gsap.to(progress.current,{value:1,ease:'none',scrollTrigger:{trigger:section.current,start:'top top',end:'bottom bottom',scrub:1}});
        gsap.fromTo('.module-badge',{y:55,opacity:0,rotateX:25},{y:0,opacity:1,rotateX:0,stagger:.16,scrollTrigger:{trigger:section.current,start:'top top-=180',end:'bottom bottom',scrub:1}});
        gsap.to('.float-metric',{opacity:0,scrollTrigger:{trigger:section.current,start:'top top',end:'+=250',scrub:1}});
      },section);
      return () => {ctx.revert();progress.current.value=0;};
    });
    return () => media.revert();
  },[]);
  return {section,progress};
}
