import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

export const Card = ({ children, className = '', title, subtitle, footer }: CardProps) => {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {(title || subtitle) && (
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/30">
          {title && <h3 className="text-xs font-bold text-zinc-100 tracking-widest uppercase">{title}</h3>}
          {subtitle && <p className="text-[10px] text-zinc-500 mt-1 font-mono tracking-tight">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-800">
          {footer}
        </div>
      )}
    </div>
  );
};
