import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  error?: string;
  type?: string;
  options?: { value: string; label: string }[];
  helperText?: string;
}

export function FormInput({ 
  label, 
  error, 
  type = 'text',
  options,
  className = '',
  value = '',
  onChange,
  helperText,
  ...props 
}: FormInputProps) {
  const inputClasses = `
    block w-full px-3 py-2 
    border-2 border-gray-300 
    rounded-md shadow-sm 
    bg-white
    text-gray-900
    placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    hover:border-gray-400
    transition-colors
    disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
    ${className}
  `;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (type === 'number' && e.target.value === '0') {
      e.target.value = '';
      onChange?.(e as any);
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {type === 'select' && options ? (
        <select 
          className={inputClasses} 
          value={value} 
          onChange={onChange as any} 
          {...props}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      ) : (
        <input 
          type={type} 
          className={inputClasses} 
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          {...props} 
        />
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}