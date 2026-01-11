

import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, AppLayout } from './components/Layout';
import { User, UserRole } from './types';
import { db } from './services/mockSupabase';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import ResetPassword from './pages/public/ResetPassword';
import HowItWorks from './pages/public/HowItWorks';
import About from './pages/public/About';

// Syndic Pages
import SyndicDashboard from './pages/app/SyndicDashboard';
import NewRequest from './pages/app/NewRequest';
import RequestDetails from './pages/app/RequestDetails';
import UserSettings from './pages/common/UserSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRequests from './pages/admin/AdminRequests';
import AdminProfessionals from './pages/admin/AdminProfessionals';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCondos from './pages/admin/AdminCondos';

// Resident Pages
import ResidentDashboard from './pages/resident/ResidentDashboard';
import NewResidentRequest from './pages/resident/NewResidentRequest';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jlm_session');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('jlm_session', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jlm_session');
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login onLogin={handleLogin} /></PublicLayout>} />
        <Route path="/reset-password" element={<PublicLayout><ResetPassword /></PublicLayout>} />

        {/* Resident Routes */}
        <Route 
          path="/resident/*"
          element={
            user && user.role === UserRole.RESIDENT ? (
              <AppLayout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<ResidentDashboard user={user} />} />
                  <Route path="/new-request" element={<NewResidentRequest user={user} />} />
                  <Route path="/request/:id" element={<RequestDetails user={user} />} />
                  <Route path="/settings" element={<UserSettings user={user} />} />
                  <Route path="*" element={<Navigate to="/resident" />} />
                </Routes>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Syndic Routes (Protected) */}
        <Route
          path="/app/*"
          element={
            user && user.role === UserRole.SYNDIC ? (
              <AppLayout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<SyndicDashboard user={user} />} />
                  <Route path="/new-request" element={<NewRequest user={user} />} />
                  <Route path="/request/:id" element={<RequestDetails user={user} />} />
                  <Route path="/history" element={<SyndicDashboard user={user} showHistory />} />
                  <Route path="/settings" element={<UserSettings user={user} />} />
                  <Route path="*" element={<Navigate to="/app" />} />
                </Routes>
              </AppLayout>
            ) : (
               user && user.role === UserRole.RESIDENT ? <Navigate to="/resident" /> : <Navigate to="/login" />
            )
          }
        />

        {/* Admin Routes (Protected) */}
        <Route
          path="/admin/*"
          element={
            user && user.role === UserRole.ADMIN ? (
              <AppLayout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/requests" element={<AdminRequests />} />
                  <Route path="/users" element={<AdminUsers />} />
                  <Route path="/condos" element={<AdminCondos />} />
                  <Route path="/request/:id" element={<RequestDetails user={user} />} />
                  <Route path="/professionals" element={<AdminProfessionals />} />
                  <Route path="/testimonials" element={<AdminTestimonials />} />
                  <Route path="/settings" element={<UserSettings user={user} />} />
                  <Route path="*" element={<Navigate to="/admin" />} />
                </Routes>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
