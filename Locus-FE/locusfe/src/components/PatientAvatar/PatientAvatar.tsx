import React from 'react';
import styles from './PatientAvatar.module.css';

export interface PatientAvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

export const PatientAvatar: React.FC<PatientAvatarProps> = ({
  firstName,
  lastName,
  size = 'md',
  className = '',
  style,
}) => {
  const fInitial = firstName?.trim()?.[0] || '';
  const lInitial = lastName?.trim()?.[0] || '';
  const initials = (fInitial + lInitial).toUpperCase() || 'PT';

  return (
    <div
      className={`${styles.avatar} ${styles[size]} ${className}`.trim()}
      style={style}
      aria-label={`${firstName || ''} ${lastName || ''}`.trim() || 'Patient'}
    >
      {initials}
    </div>
  );
};

export default PatientAvatar;
