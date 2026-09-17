import React from 'react';
import logoFull from '../../assets/logo.png';
import logoCompact from '../../assets/logo-compact.png';
import logoIcon from '../../assets/logo-icon.png';

export interface LocusLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  height?: number | string;
  width?: number | string;
  className?: string;
  onClick?: () => void;
  alt?: string;
  style?: React.CSSProperties;
}

export const LocusLogo: React.FC<LocusLogoProps> = ({
  variant = 'full',
  height = 46,
  width,
  className,
  onClick,
  alt = 'Locus Pathology Lab',
  style,
}) => {
  const getSource = () => {
    switch (variant) {
      case 'icon':
        return logoIcon;
      case 'compact':
        return logoCompact;
      case 'full':
      default:
        return logoFull;
    }
  };

  const getAriaLabel = () => {
    switch (variant) {
      case 'icon':
        return 'Locus Pathology Lab Emblem';
      case 'compact':
        return 'Locus Pathology Lab Compact Logo';
      case 'full':
      default:
        return 'Locus Pathology Lab - Precision in Diagnosis, Excellence in Care';
    }
  };

  const formattedHeight = typeof height === 'number' ? `${height}px` : height;
  const formattedWidth = typeof width === 'number' ? `${width}px` : width;

  return (
    <img
      src={getSource()}
      alt={alt || getAriaLabel()}
      title="Locus Pathology Lab"
      style={{
        height: formattedHeight,
        width: formattedWidth || 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        userSelect: 'none',
        ...style,
      }}
      className={className}
      onClick={onClick}
      loading="eager"
      decoding="async"
    />
  );
};

export default LocusLogo;
