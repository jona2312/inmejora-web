import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  ogUrl, 
  ogTitle,
  ogDescription,
  ogType = 'website', 
  twitterCard = 'summary_large_image' 
}) => {
  const location = useLocation();
  const canonicalUrl = ogUrl || `https://inmejora.com${location.pathname}`;
  
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#d4af37" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
    </Helmet>
  );
};

export default SEOHead;