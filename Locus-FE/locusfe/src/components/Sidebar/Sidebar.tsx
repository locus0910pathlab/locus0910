import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, FlaskConical, Stethoscope } from 'lucide-react';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { to: '/patients', label: 'Patients', icon: <Users size={19} /> },
    { to: '/patients/new', label: 'Add Patient', icon: <UserPlus size={19} /> },
    { to: '/tests', label: 'Lab Tests', icon: <FlaskConical size={19} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <Stethoscope size={20} />
        </div>
        <div>
          <div className={styles.brandName}>LocusLab</div>
          <div className={styles.brandSub}>Clinical Diagnostics</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSectionLabel}>Main Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.avatar}>LL</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Lab Staff</span>
          <span className={styles.userRole}>Technician / Admin</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
