import React from 'react';

const HeroVideo = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Fallback Image / Poster (displayed if video fails or on low-power devices) */}
      <img
        src="https://images.unsplash.com/photo-1661116586693-6ed19dbae5fc?q=80&auto=format&fit=crop&w=1920"
        srcSet="https://images.unsplash.com/photo-1661116586693-6ed19dbae5fc?q=80&auto=format&fit=crop&w=768 768w, https://images.unsplash.com/photo-1661116586693-6ed19dbae5fc?q=80&auto=format&fit=crop&w=1280 1280w, https://images.unsplash.com/photo-1661116586693-6ed19dbae5fc?q=80&auto=format&fit=crop&w=1920 1920w"
        sizes="100vw"
        alt="Obra de reforma en proceso"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Video Element */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 md:opacity-100 transition-opacity duration-1000"
        poster="https://images.unsplash.com/photo-1661116586693-6ed19dbae5fc?q=80&auto=format&fit=crop&w=1920"
      >
        {/* 
            NOTE: Since no direct video URL was provided in the prompt, 
            this source is a placeholder. The component will gracefully 
            fallback to the high-quality image provided in the 'poster' 
            and 'img' tag above. To enable video, uncomment the line below 
            and add a valid local or remote video URL.
        */}
        {/* <source src="/assets/hero-video.mp4" type="video/mp4" /> */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default HeroVideo;