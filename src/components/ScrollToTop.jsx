import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    // Lazy route chunks may mount after navigation. Observe until the anchor exists,
    // and disconnect when navigating away rather than racing a fixed timeout.
    const scrollToAnchor = () => {
      let id;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return false; }
      const element = document.getElementById(id);
      if (!element) return false;
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      return true;
    };
    if (scrollToAnchor()) return;
    const observer = new MutationObserver(() => { if (scrollToAnchor()) observer.disconnect(); });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
