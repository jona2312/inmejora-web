import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton Card 1 */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
        <div className="h-6 bg-[#2a2a2a] rounded w-1/3 mb-4 skeleton-pulse"></div>
        <div className="space-y-3">
          <div className="h-4 bg-[#2a2a2a] rounded w-full skeleton-pulse"></div>
          <div className="h-4 bg-[#2a2a2a] rounded w-5/6 skeleton-pulse"></div>
          <div className="h-4 bg-[#2a2a2a] rounded w-4/6 skeleton-pulse"></div>
        </div>
      </div>

      {/* Skeleton Card 2 */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
        <div className="h-6 bg-[#2a2a2a] rounded w-2/5 mb-4 skeleton-pulse"></div>
        <div className="space-y-3">
          <div className="h-4 bg-[#2a2a2a] rounded w-full skeleton-pulse"></div>
          <div className="h-4 bg-[#2a2a2a] rounded w-3/4 skeleton-pulse"></div>
        </div>
      </div>

      {/* Skeleton Card 3 */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
        <div className="h-6 bg-[#2a2a2a] rounded w-1/2 mb-4 skeleton-pulse"></div>
        <div className="space-y-3">
          <div className="h-4 bg-[#2a2a2a] rounded w-full skeleton-pulse"></div>
          <div className="h-4 bg-[#2a2a2a] rounded w-2/3 skeleton-pulse"></div>
          <div className="h-4 bg-[#2a2a2a] rounded w-5/6 skeleton-pulse"></div>
        </div>
      </div>

      {/* Skeleton Card 4 */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
        <div className="h-6 bg-[#2a2a2a] rounded w-1/4 mb-4 skeleton-pulse"></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-[#2a2a2a] rounded skeleton-pulse"></div>
          <div className="h-10 bg-[#2a2a2a] rounded skeleton-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;