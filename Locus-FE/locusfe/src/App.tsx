import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import AppRoutes from './routes/AppRoutes';
import styles from './App.module.css';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.mainContent}>
          <Navbar />
          <main className={styles.pageContainer}>
            <AppRoutes />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
