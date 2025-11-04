import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';

const Dashboards = React.lazy(() => import('dashboards/Module'));
const Reports = React.lazy(() => import('reports/Module'));
const Settings = React.lazy(() => import('settings/Module'));

export function App() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eee' }}>
        <Link to="/">Home</Link>
        <Link to="/dashboards">Dashboards</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      <React.Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<p>Shell home</p>} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </React.Suspense>
    </div>
  );
}
