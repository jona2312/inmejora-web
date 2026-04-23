export const useSEO = ({ title, description, keywords, ogImage, ogUrl, ogType = 'website', twitterCard = 'summary_large_image' }) => {
  return {
    title,
    description,
    keywords,
    ogImage,
    ogUrl,
    ogType,
    twitterCard
  };
};