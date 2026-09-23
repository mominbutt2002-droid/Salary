// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import styles from './App.module.css';

// Временные заглушки для страниц (будут заменены на импорты позже)
const Dashboard = () => <div className={styles.main}>Dashboard (заглушка)</div>;
const History = () => <div className={styles.main}>History (заглушка)</div>;
const Analytics = () => <div className={styles.main}>Analytics (заглушка)</div>;

// Временная заглушка для Header (будет заменена на импорт позже)
const Header = () => (
  <header style={{ padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' }}>
    <nav style={{ display: 'flex', gap: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#4f46e5' : '#111827' })}>
        Главная
      </NavLink>
      <NavLink to="/history" style={({ isActive }) => ({ color: isActive ? '#4f46e5' : '#111827' })}>
        История
      </NavLink>
      <NavLink to="/analytics" style={({ isActive }) => ({ color: isActive ? '#4f46e5' : '#111827' })}>
        Аналитика
      </NavLink>
    </nav>
  </header>
);

// Временная заглушка для Layout (будет заменена на импорт позже)
const Layout = ({ children }) => (
  <div className={styles.app}>
    <Header />
    <main>{children}</main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;