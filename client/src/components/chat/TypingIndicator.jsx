import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 w-fit">
      <span className="text-xs font-semibold mr-1">Typing</span>
      <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
};

export default TypingIndicator;
