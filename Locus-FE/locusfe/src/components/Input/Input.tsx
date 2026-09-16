import React from 'react';
import { Clock } from 'lucide-react';
import { CalendarIcon } from '../CalendarIcon/CalendarIcon';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required,
  className = '',
  id,
  type,
  onClick,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  let defaultRightIcon = rightIcon;
  if (!defaultRightIcon) {
    if (type === 'date') {
      defaultRightIcon = <CalendarIcon size={18} />;
    } else if (type === 'time') {
      defaultRightIcon = <Clock size={16} color="#f8bc25" />;
    }
  }

  const inputClasses = [
    styles.input,
    leftIcon ? styles.hasLeftIcon : '',
    defaultRightIcon ? styles.hasRightIcon : '',
    error ? styles.error : '',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if ((type === 'date' || type === 'time') && typeof (e.currentTarget as any).showPicker === 'function') {
      try {
        (e.currentTarget as any).showPicker();
      } catch (_) {}
    }
    onClick?.(e);
  };

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputContainer}>
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={inputClasses}
          onClick={handleClick}
          {...props}
        />
        {defaultRightIcon && <span className={styles.rightIcon}>{defaultRightIcon}</span>}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
      {!error && helperText && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
