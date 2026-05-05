import React from 'react';

type BadgeVariant = 'pending' | 'completed' | 'overdue' | 'system' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    pending: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
    system: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    default: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  };

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
