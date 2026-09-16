import React from 'react';

export interface LocusLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  height?: number | string;
  className?: string;
  onClick?: () => void;
}

export const LocusLogo: React.FC<LocusLogoProps> = ({
  variant = 'full',
  height = 48,
  className,
  onClick,
}) => {
  if (variant === 'icon') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 110 155"
        style={{ height, width: 'auto', display: 'block' }}
        className={className}
        onClick={onClick}
        aria-label="Locus Pathology Lab Emblem"
      >
        <defs>
          <linearGradient id="logoIconMicroscopeBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E4F1F9" />
            <stop offset="45%" stop-color="#B8DCF2" />
            <stop offset="100%" stop-color="#7BB5DB" />
          </linearGradient>
          <linearGradient id="logoIconBasePlate" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#C5DFEE" />
            <stop offset="50%" stop-color="#E8F4FB" />
            <stop offset="100%" stop-color="#9BC7E2" />
          </linearGradient>
        </defs>
        <path
          d="M 12 142 L 88 142 C 91 142 93 139 91 135 L 88 128 C 86 125 82 123 78 123 L 22 123 C 18 123 14 125 12 128 L 9 135 C 7 139 9 142 12 142 Z"
          fill="url(#logoIconBasePlate)"
          stroke="#162644"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <line x1="14" y1="134" x2="86" y2="134" stroke="#162644" strokeWidth="1.2" opacity="0.6" />
        <rect x="52" y="102" width="18" height="23" rx="2" fill="url(#logoIconMicroscopeBody)" stroke="#162644" strokeWidth="2.4" />
        <ellipse cx="40" cy="116" rx="10" ry="4.5" transform="rotate(-20 40 116)" fill="#EAF4FC" stroke="#162644" strokeWidth="2" />
        <path d="M 40 120 L 52 114" stroke="#162644" strokeWidth="2.5" />
        <rect x="22" y="93" width="46" height="5.5" rx="1.5" fill="#162644" stroke="#162644" strokeWidth="1.5" />
        <rect x="33" y="90.5" width="24" height="2.5" rx="0.5" fill="#FFFFFF" stroke="#4B9ECC" strokeWidth="1" />
        <path
          d="M 61 106 C 80 102, 90 85, 86 64 C 83 45, 68 35, 54 35 C 49 35, 43 38, 38 42 L 44 48 C 47 45, 51 43, 55 43 C 64 43, 73 50, 75 64 C 77 78, 70 92, 57 96 Z"
          fill="url(#logoIconMicroscopeBody)"
          stroke="#162644"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="68" cy="85" r="8" fill="#4B9ECC" stroke="#162644" strokeWidth="2.2" />
        <circle cx="68" cy="85" r="4.5" fill="#E4F1F9" stroke="#162644" strokeWidth="1.5" />
        <circle cx="68" cy="85" r="1.5" fill="#162644" />
        <path d="M 33 55 L 53 43 L 45 37 L 27 49 Z" fill="#7BB5DB" stroke="#162644" strokeWidth="2" />
        <rect x="36" y="66" width="7" height="15" rx="1.5" transform="rotate(22 36 66)" fill="url(#logoIconMicroscopeBody)" stroke="#162644" strokeWidth="2" />
        <rect x="27" y="63" width="6" height="13" rx="1.2" transform="rotate(38 27 63)" fill="url(#logoIconMicroscopeBody)" stroke="#162644" strokeWidth="1.8" />
        <rect x="44" y="67" width="5.5" height="11" rx="1.2" transform="rotate(5 44 67)" fill="url(#logoIconMicroscopeBody)" stroke="#162644" strokeWidth="1.8" />
        <path d="M 44 47 L 62 25 L 72 33 L 54 55 Z" fill="url(#logoIconMicroscopeBody)" stroke="#162644" strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="48" y1="45" x2="66" y2="28" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
        <rect x="62" y="16" width="13" height="14" rx="1" transform="rotate(-42 62 16)" fill="#7BB5DB" stroke="#162644" strokeWidth="2.2" />
        <rect x="69" y="10" width="16" height="6.5" rx="1.5" transform="rotate(-42 69 10)" fill="#162644" stroke="#162644" strokeWidth="1.5" />
      </svg>
    );
  }

  const isCompact = variant === 'compact';
  const viewBox = isCompact ? '0 0 460 145' : '0 0 460 178';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      style={{ height, width: 'auto', display: 'block' }}
      className={className}
      onClick={onClick}
      aria-label="Locus Pathology Lab Logo"
    >
      <defs>
        <linearGradient id="logoMicroscopeBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E4F1F9" />
          <stop offset="45%" stopColor="#B8DCF2" />
          <stop offset="100%" stopColor="#7BB5DB" />
        </linearGradient>

        <linearGradient id="logoMicroscopeKnob" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D5E8F5" />
          <stop offset="100%" stopColor="#4B9ECC" />
        </linearGradient>

        <linearGradient id="logoBasePlate" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C5DFEE" />
          <stop offset="50%" stopColor="#E8F4FB" />
          <stop offset="100%" stopColor="#9BC7E2" />
        </linearGradient>
      </defs>

      {/* Microscope Vector */}
      <g id="microscopeGroup" transform="translate(8, 4)">
        <path
          d="M 12 142 L 86 142 C 89 142 91 139 89 135 L 86 128 C 84 125 80 123 76 123 L 22 123 C 18 123 14 125 12 128 L 9 135 C 7 139 9 142 12 142 Z"
          fill="url(#logoBasePlate)"
          stroke="#162644"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <line x1="14" y1="134" x2="84" y2="134" stroke="#162644" strokeWidth="1.2" opacity="0.6" />
        <rect x="52" y="102" width="18" height="23" rx="2" fill="url(#logoMicroscopeBody)" stroke="#162644" strokeWidth="2.4" />
        <ellipse cx="40" cy="116" rx="10" ry="4.5" transform="rotate(-20 40 116)" fill="#EAF4FC" stroke="#162644" strokeWidth="2" />
        <path d="M 40 120 L 52 114" stroke="#162644" strokeWidth="2.5" />
        <rect x="22" y="93" width="46" height="5.5" rx="1.5" fill="#162644" stroke="#162644" strokeWidth="1.5" />
        <rect x="33" y="90.5" width="24" height="2.5" rx="0.5" fill="#FFFFFF" stroke="#4B9ECC" strokeWidth="1" />
        <path
          d="M 61 106 C 80 102, 90 85, 86 64 C 83 45, 68 35, 54 35 C 49 35, 43 38, 38 42 L 44 48 C 47 45, 51 43, 55 43 C 64 43, 73 50, 75 64 C 77 78, 70 92, 57 96 Z"
          fill="url(#logoMicroscopeBody)"
          stroke="#162644"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="68" cy="85" r="8" fill="url(#logoMicroscopeKnob)" stroke="#162644" strokeWidth="2.2" />
        <circle cx="68" cy="85" r="4.5" fill="#E4F1F9" stroke="#162644" strokeWidth="1.5" />
        <circle cx="68" cy="85" r="1.5" fill="#162644" />
        <path d="M 33 55 L 53 43 L 45 37 L 27 49 Z" fill="#7BB5DB" stroke="#162644" strokeWidth="2" />
        <rect x="36" y="66" width="7" height="15" rx="1.5" transform="rotate(22 36 66)" fill="url(#logoMicroscopeBody)" stroke="#162644" strokeWidth="2" />
        <rect x="27" y="63" width="6" height="13" rx="1.2" transform="rotate(38 27 63)" fill="url(#logoMicroscopeBody)" stroke="#162644" strokeWidth="1.8" />
        <rect x="44" y="67" width="5.5" height="11" rx="1.2" transform="rotate(5 44 67)" fill="url(#logoMicroscopeBody)" stroke="#162644" strokeWidth="1.8" />
        <path d="M 44 47 L 62 25 L 72 33 L 54 55 Z" fill="url(#logoMicroscopeBody)" stroke="#162644" strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="48" y1="45" x2="66" y2="28" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
        <rect x="62" y="16" width="13" height="14" rx="1" transform="rotate(-42 62 16)" fill="#7BB5DB" stroke="#162644" strokeWidth="2.2" />
        <rect x="69" y="10" width="16" height="6.5" rx="1.5" transform="rotate(-42 69 10)" fill="#162644" stroke="#162644" strokeWidth="1.5" />
      </g>

      {/* Typography: "LOCUS" */}
      <text
        x="118"
        y="90"
        fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="78"
        fill="#4B9ECC"
        letterSpacing="-1"
      >
        L
      </text>

      {/* "O" with embedded DNA Helix */}
      <g transform="translate(168, 28)">
        <circle cx="36" cy="62" r="32" fill="none" stroke="#4B9ECC" strokeWidth="14" />
        <g transform="translate(36, 62)">
          <path
            d="M -9 -28 C -2 -19, -2 -9, -9 0 C -16 9, -16 19, -9 28"
            fill="none"
            stroke="#162644"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 9 -28 C 2 -19, 2 -9, 9 0 C 16 9, 16 19, 9 28"
            fill="none"
            stroke="#162644"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <line x1="-7" y1="-22" x2="7" y2="-22" stroke="#4B9ECC" strokeWidth="2" strokeLinecap="round" />
          <line x1="-3" y1="-14" x2="3" y2="-14" stroke="#162644" strokeWidth="2" strokeLinecap="round" />
          <line x1="-9" y1="0" x2="9" y2="0" stroke="#4B9ECC" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="-3" y1="14" x2="3" y2="14" stroke="#162644" strokeWidth="2" strokeLinecap="round" />
          <line x1="-7" y1="22" x2="7" y2="22" stroke="#4B9ECC" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>

      <text
        x="250"
        y="90"
        fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="78"
        fill="#4B9ECC"
        letterSpacing="-1"
      >
        C
      </text>

      <text
        x="316"
        y="90"
        fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="78"
        fill="#4B9ECC"
        letterSpacing="-1"
      >
        U
      </text>

      <text
        x="380"
        y="90"
        fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="78"
        fill="#4B9ECC"
        letterSpacing="-1"
      >
        S
      </text>

      {/* "PATHOLOGY LAB" */}
      <text
        x="118"
        y="126"
        fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="28"
        fill="#111827"
        letterSpacing="5.5"
      >
        PATHOLOGY LAB
      </text>

      {/* Tagline: "Precision in Diagnosis, Excellence in care..." */}
      {!isCompact && (
        <text
          x="118"
          y="155"
          fontFamily="'Playfair Display', 'Georgia', 'Times New Roman', serif"
          fontStyle="italic"
          fontWeight="500"
          fontSize="16.5"
          fill="#1F2937"
          letterSpacing="0.4"
        >
          Precision in Diagnosis, Excellence in care...
        </text>
      )}
    </svg>
  );
};

export default LocusLogo;
