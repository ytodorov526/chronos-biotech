import { ChangeEvent } from 'react';

type FormInputProps = {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'date';
  placeholder?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  units?: string;
  helpText?: string;
};

export default function FormInput({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  min,
  max,
  step,
  className = '',
  units,
  helpText,
}: FormInputProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-secondary-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          step={step}
          className={`input ${units ? 'pr-10' : ''}`}
        />
        {units && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-secondary-500">{units}</span>
          </div>
        )}
      </div>
      {helpText && <p className="mt-1 text-xs text-secondary-500">{helpText}</p>}
    </div>
  );
}
