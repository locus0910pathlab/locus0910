import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import AppRoutes from './routes/AppRoutes';
import styles from './App.module.css';

export const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <div className={styles.layout}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        <div
          className={`${styles.mainContent} ${
            isSidebarCollapsed ? styles.mainContentCollapsed : ''
          }`}
        >
          <Navbar onToggleSidebar={handleToggleSidebar} />
          <main className={styles.pageContainer}>
            <AppRoutes />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
