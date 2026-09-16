import React from 'react';

export interface CalendarIconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const CalendarIcon: React.FC<CalendarIconProps> = ({
  size = 15,
  className = '',
  style = {},
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Left angled stand / shadow */}
      <path
        d="M6.5 7 L2 27 C1.8 28 2.5 29 3.5 29 L7.5 29 L7.5 7 Z"
        fill="#0F172A"
      />

      {/* Top black binder loops (behind) */}
      <rect x="9.5" y="1.5" width="3" height="6.5" rx="1.5" fill="#0F172A" />
      <rect x="21" y="1.5" width="3" height="6.5" rx="1.5" fill="#0F172A" />

      {/* Calendar body */}
      <rect
        x="6"
        y="5.5"
        width="23.5"
        height="23.5"
        rx="3"
        fill="#FFFDF2"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Red header band */}
      <path
        d="M6 8.5 C6 6.84 7.34 5.5 9 5.5 L26.5 5.5 C28.16 5.5 29.5 6.84 29.5 8.5 L29.5 13 L6 13 Z"
        fill="#E11D48"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Front black binder loops */}
      <rect x="9.5" y="1.5" width="3" height="6.5" rx="1.5" fill="#0F172A" />
      <rect x="21" y="1.5" width="3" height="6.5" rx="1.5" fill="#0F172A" />

      {/* Date Grid Squares - Row 1 (4 squares) */}
      <rect x="8.5" y="15.5" width="3.5" height="3.5" rx="0.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
      <rect x="13.5" y="15.5" width="3.5" height="3.5" rx="0.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
      <rect x="18.5" y="15.5" width="3.5" height="3.5" rx="0.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
      <rect x="23.5" y="15.5" width="3.5" height="3.5" rx="0.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />

      {/* Date Grid Squares - Row 2 (4 squares) */}
      <rect x="8.5" y="21.5" width="3.5" height="3.5" rx="0.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
      <rect x="13.5" y="21.5" width="3.5" height="3.5" rx="0.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
      <rect x="18.5" y="21.5" width="3.5" height="3.5" rx="0.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
      <rect x="23.5" y="21.5" width="3.5" height="3.5" rx="0.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
    </svg>
  );
};

export default CalendarIcon;
