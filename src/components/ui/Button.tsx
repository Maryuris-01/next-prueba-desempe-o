import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary: 'bg-[#8e514b] text-white hover:bg-[#74403b]',
  secondary: 'bg-[#f0e5df] text-[#654d44] hover:bg-[#e8d8d0]',
  danger: 'bg-[#a84640] text-white hover:bg-[#873b36]',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}