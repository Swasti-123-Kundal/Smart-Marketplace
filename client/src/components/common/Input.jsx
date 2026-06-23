import React from 'react';

const Input = React.forwardRef(({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  helperText,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all
            ${Icon ? 'pl-11' : 'pl-4'} pr-4
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium">
          {error.message || error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
