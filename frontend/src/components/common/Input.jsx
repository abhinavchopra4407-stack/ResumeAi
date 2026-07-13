import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  required = false,
  className = '',
  rows = 4, // for textarea
  ...props
}) => {
  const baseInputStyles = 'w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm';
  
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          className={baseInputStyles}
          required={required}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={baseInputStyles}
          required={required}
          {...props}
        />
      )}
      {error && <span className="text-xs text-rose-400 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
