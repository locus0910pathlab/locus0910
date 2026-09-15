import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Activity } from 'lucide-react';
import styles from './Navbar.module.css';

const routeTitles: Record<string, string> = {
  '/': 'Laboratory Overview',
  '/patients': 'Patient Directory',
  '/patients/new': 'Register New Patient',
  '/tests': 'Test Catalog & Pricing',
};

export const Navbar: React.FC = () => {
  const location = useLocation();

  let title = routeTitles[location.pathname];
  if (!title) {
    if (location.pathname.startsWith('/patients/')) {
      title = 'Patient Medical Record';
    } else {
      title = 'LocusLab System';
    }
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      <div className={styles.right}>
        <div className={styles.statusIndicator}>
          <span className={styles.statusDot} />
          <span>API Connected (Port 8000)</span>
        </div>

        <button className={styles.iconButton} aria-label="System Activity" title="System Status">
          <Activity size={18} />
        </button>

        <button className={styles.iconButton} aria-label="Notifications" title="Notifications">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
