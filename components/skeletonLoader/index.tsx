import React, { useEffect, useMemo, useState } from "react";

interface SkeletonLoaderProps {
  visible?: boolean; // 单位：毫秒
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <div className="flex items-start justify-center animate-pulse p-4 pl-0">
      <div className="rounded-full bg-slate-200 h-10 w-10 mr-4"></div>
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 bg-slate-200 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
          </div>
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};
