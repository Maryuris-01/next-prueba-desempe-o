import { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#59463f]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`rounded-xl border border-[#dfcbc2] bg-white px-3 py-2.5 text-[#493631] placeholder:text-[#b09b92] focus:border-[#a66d63] focus:outline-none focus:ring-2 focus:ring-[#e8c9c1]/40 ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-[#9b3f3c]">{error}</span>}
    </div>
  );
}