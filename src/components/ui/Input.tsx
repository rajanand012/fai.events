import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-brand-charcoal">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-brand-charcoal placeholder:text-gray-400 transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
}
