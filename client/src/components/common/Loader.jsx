import React from 'react';

const Loader = ({ fullPage = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-t-transparent border-primary-500 ${sizeClasses[size] || sizeClasses.md}`}
      role="status"
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
            Loading WorkSphere...
          </p>
        </div>
      </div>
    );
  }

  return <div className="flex items-center justify-center p-4">{spinner}</div>;
};

export default Loader;
