import React from 'react';

export const Skeleton = ({ className = '', ...props }: { className?: string; [key: string]: any }) => (
  <div className={`animate-pulse bg-zinc-800 rounded ${className}`} {...props}></div>
);
