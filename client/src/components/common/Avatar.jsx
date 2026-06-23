import React from 'react';

const Avatar = ({ src, name = '', size = 'md', className = '' }) => {
  const getInitials = (n) => {
    if (!n) return '';
    const parts = n.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n[0].toUpperCase();
  };

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-24 w-24 text-3xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover border border-slate-200/50 dark:border-slate-800/50 shadow-sm ${sizes[size] || sizes.md} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200/30 dark:border-primary-800/30 ${sizes[size] || sizes.md} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
