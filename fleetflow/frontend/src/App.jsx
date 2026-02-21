import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import AppLayout from './components/AppLayout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VehiclesPage from './pages/VehiclesPage';
import TripsPage from './pages/TripsPage';
import DriversPage from './pages/DriversPage';
import MaintenancePage from './pages/MaintenancePage';
import FuelPage from './pages/FuelPage';
import AnalyticsPage from './pages/AnalyticsPage';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return (
      <pre style={{ color: '#EF4444', background: '#0D1420', padding: 32, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 14 }}>
        {this.state.error.message}{'\n'}{this.state.error.stack}
      </pre>
    );
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
        <Route path="/vehicles" element={<AppLayout><VehiclesPage /></AppLayout>} />
        <Route path="/trips" element={<AppLayout><TripsPage /></AppLayout>} />
        <Route path="/drivers" element={<AppLayout><DriversPage /></AppLayout>} />
        <Route path="/maintenance" element={<AppLayout><MaintenancePage /></AppLayout>} />
        <Route path="/fuel" element={<AppLayout><FuelPage /></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><AnalyticsPage /></AppLayout>} />

        {/* Catch-all → Home */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
