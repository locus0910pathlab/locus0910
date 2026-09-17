import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FlaskConical,
  Menu,
  X,
  RotateCw,
} from 'lucide-react';
import { api } from '../../services/api';
import LocusLogo from '../LocusLogo/LocusLogo';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { to: '/patients', label: 'Patients', icon: <Users size={19} /> },
    { to: '/appointments', label: 'Appointments', icon: <Calendar size={19} /> },
    { to: '/tests', label: 'Lab Tests', icon: <FlaskConical size={19} /> },
  ];

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      // Clear localStorage, sessionStorage and API cache
      localStorage.clear();
      sessionStorage.clear();
      api.clearCache();

      // Clear Service Worker CacheStorage if available
      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((name) => window.caches.delete(name)));
      }
    } catch (err) {
      console.error('Error clearing local cache:', err);
    }

    // Brief delay to display spinning effect then reload with fresh data
    setTimeout(() => {
      window.location.reload();
    }, 350);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}

      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${
          isOpen ? styles.mobileOpen : ''
        }`}
      >
        <div className={`${styles.brand} ${isCollapsed ? styles.brandCollapsed : ''}`}>
          {/* Retraction button placed next to and BEFORE the logo */}
          <button
            className={styles.retractBtn}
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={19} />
          </button>

          {/* Brand Logo */}
          {!isCollapsed && (
            <NavLink to="/" className={styles.logoExpandedWrapper} title="Locus Pathology Lab - Go to Dashboard">
              <LocusLogo variant="full" height={44} />
            </NavLink>
          )}

          {/* Mobile close button */}
          <button
            className={styles.closeMobileBtn}
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {!isCollapsed && <div className={styles.navSectionLabel}>Main Menu</div>}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => {
                // Auto-close drawer on mobile when clicking a link
                if (window.innerWidth <= 768) {
                  onClose();
                }
              }}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navItemIcon}>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.avatar}>AC</div>
          {!isCollapsed && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>Abhijeet Chavan</span>
              <span className={styles.userRole}>Founder & Lab Admin</span>
            </div>
          )}
          <button
            type="button"
            className={`${styles.refreshBtn} ${isRefreshing ? styles.refreshing : ''}`}
            onClick={handleRefresh}
            title="Clear device local storage & recall latest data"
            aria-label="Refresh and sync data"
            disabled={isRefreshing}
          >
            <RotateCw size={15} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
