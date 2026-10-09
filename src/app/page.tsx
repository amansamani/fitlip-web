import { Preloader } from '@/components/landing/preloader';
import { Nav } from '@/components/landing/nav';
import { Hero } from '@/components/landing/hero';
import { PhoneTour } from '@/components/landing/phone-tour';
import { DownloadSection } from '@/components/landing/download-section';

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <PhoneTour />
        <DownloadSection />
      </main>
    </>
  );
}
