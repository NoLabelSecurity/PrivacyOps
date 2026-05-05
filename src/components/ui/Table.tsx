import React from 'react';

export const Table = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 ${className}`}>
    <table className="w-full text-left border-collapse">
      {children}
    </table>
  </div>
);

export const THead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-zinc-900/50 border-b border-zinc-800">
    <tr>{children}</tr>
  </thead>
);

export const TBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-zinc-800/50">
    {children}
  </tbody>
);

export const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
    {children}
  </th>
);

export const TR = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <tr className={`hover:bg-zinc-900/30 transition-colors ${className}`} {...props}>
    {children}
  </tr>
);

export const TD = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <td className={`px-6 py-4 text-xs text-zinc-300 font-mono ${className}`} {...props}>
    {children}
  </td>
);
