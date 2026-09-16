import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value (such as search inputs).
 * Delays updating the debounced value until after the specified delay has elapsed
 * since the last time the value changed.
 *
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds (defaults to 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
