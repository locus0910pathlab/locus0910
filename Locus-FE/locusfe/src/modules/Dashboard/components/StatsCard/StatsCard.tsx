import React from 'react';
import styles from './StatsCard.module.css';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet';
  badge?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtext,
  icon,
  color = 'blue',
  badge,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <div className={styles.labelRow}>
          <span className={styles.label}>{title}</span>
          {badge && (
            <span className={`${styles.badge} ${styles[`badge_${color}`]}`}>
              {badge}
            </span>
          )}
        </div>
        <span className={styles.value}>{value}</span>
        {subtext && <span className={styles.subtext}>{subtext}</span>}
      </div>
      <div className={`${styles.iconWrapper} ${styles[color]}`}>{icon}</div>
    </div>
  );
};

export default StatsCard;
