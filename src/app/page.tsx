import { LandingPage } from '@/components/landing/landing-page';
import { structuredData } from '@/lib/seo';

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,'\\u003c')}} />
    <LandingPage />
  </>;
}

