import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./App.css";

// Import your components (you'll need to create these files)
import SmartIrrigationApp from './components/SmartIrrigationApp';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import CropPredictionPage from './pages/CropPredictionPage';

// Context Provider (you'll need to create this)
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Main dashboard route */}
            <Route path="/" element={<SmartIrrigationApp />} />
            
            {/* Individual page routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/crop-recommendation" element={<CropPredictionPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Redirect /home to / */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;