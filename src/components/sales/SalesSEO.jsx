import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { COMMERCIAL, PROMISE } from '@/config/commercial';
import { SERVICES, ZONES } from '@/data/salesContent';

// Structured data is generated from the single commercial config so the phone never diverges from the buttons.
export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'INMEJORA',
  url: COMMERCIAL.siteUrl,
  ...(COMMERCIAL.whatsapp ? { telephone: `+${COMMERCIAL.whatsapp}` } : {}),
  email: COMMERCIAL.email,
  image: `${COMMERCIAL.siteUrl}/og-image.jpg`,
  description: `Reformas y terminaciones en zona sur del GBA. ${PROMISE.short} desde que tenemos la información necesaria.`,
  areaServed: ZONES.map(z => ({ '@type': 'City', name: z.name })),
  makesOffer: SERVICES.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name } })),
  sameAs: [COMMERCIAL.instagram],
});

const SalesSEO = ({ title, description, path = '/', schema = false }) => {
  // index.html keeps static tags for crawlers that do not run JavaScript. Once the page renders, Helmet owns the tags,
  // so remove the static copies to avoid duplicate description/canonical/OG tags.
  useEffect(() => { document.querySelectorAll('[data-static-seo]').forEach(el => el.remove()); }, []);
  const url = `${COMMERCIAL.siteUrl}${path === '/' ? '' : path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {schema && <script type="application/ld+json">{JSON.stringify(localBusinessSchema())}</script>}
    </Helmet>
  );
};

export default SalesSEO;
