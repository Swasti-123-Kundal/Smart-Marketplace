import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all';

  const variants = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
    info: 'bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400',
    primary: 'bg-primary-500/10 border-primary-500/20 text-primary-600 dark:text-primary-400',
    secondary: 'bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400',
  };

  return (
    <span className={`${baseClasses} ${variants[variant] || variants.info} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
