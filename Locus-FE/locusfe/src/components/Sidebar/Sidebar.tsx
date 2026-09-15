import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FlaskConical,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
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

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}

      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${
          isOpen ? styles.mobileOpen : ''
        }`}
      >
        <div className={styles.brand}>
          <div className={styles.brandLeft}>
            <div className={styles.logoIcon}>
              <Stethoscope size={20} />
            </div>
            {!isCollapsed && (
              <div className={styles.brandInfo}>
                <div className={styles.brandName}>LocusLab</div>
                <div className={styles.brandSub}>Clinical Diagnostics</div>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            className={styles.toggleBtn}
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

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
          <div className={styles.avatar}>LL</div>
          {!isCollapsed && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>Lab Staff</span>
              <span className={styles.userRole}>Technician / Admin</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
