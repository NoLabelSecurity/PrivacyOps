import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-zinc-300 font-mono outline-none focus:border-blue-600/50 focus:ring-1 focus:ring-blue-600/20 transition-all placeholder:text-zinc-700 ${
            error ? 'border-red-900/50 focus:border-red-500/50' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[10px] text-red-500 font-medium ml-1">!! {error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
