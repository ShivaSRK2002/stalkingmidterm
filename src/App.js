import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import ComplaintMultiForm from './components/ComplaintMultiForm';
import LoadingScreen from './components/LoadingScreen';
import ComplaintList from './components/ComplaintList';
import UserCases from './components/UserCases';
import ProfilePage from './components/ProfilePage';
import TargetCallbackHandler from './TargetCallbackHandler';
import AppLayout from './components/layouts/AppLayout';
import MapPage from './components/MapPage';
import ChatWidget from './components/ChatApp';
import { checkAuthorization, logout } from './authUtils'; // Ensure this utility exists
import AboutPage from './components/AboutPage';
import Meeting from './components/Meeting';
import JoinMeeting from './components/joinMeet';

const AppRoutes = ({ complaints, handleLoading, handleSubmitComplaint }) => (
  <Routes>
    <Route path="/" element={<TargetCallbackHandler />} />
    <Route path="/home" element={<HomePage />} />
    <Route
      path="/complaint-form"
      element={
        <ComplaintMultiForm
          setLoading={handleLoading}
          handleSubmit={handleSubmitComplaint}
        />
      }
    />
    <Route path="/chat" element={<ChatWidget />} />
    <Route path="/complaint-list" element={<ComplaintList complaints={complaints} />} />
    <Route path="/user-cases" element={<UserCases />} />
    <Route path="/meetings/:caseId" element={<Meeting />} />
    <Route path="/joinmeeting/:meetingId" element={<JoinMeeting />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/map" element={<MapPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route
      path="*"
      element={
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      }
    />
  </Routes>
);

// Main App Component
const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);  // Start with loading as true
  const [complaints, setComplaints] = useState([]);
  const jwtToken = sessionStorage.getItem('jwt') || '';

  useEffect(() => {
    const tokenUpdateInterval = setInterval(() => {
      if (jwtToken) {
        sessionStorage.setItem('jwt', jwtToken);
      }
    }, 1000);

    const authCheckInterval = setInterval(() => {
      if (!checkAuthorization()) {
        console.warn('Token check failed - redirecting to login');
        logout();
      }
    }, 500);

    return () => {
      clearInterval(tokenUpdateInterval);
      clearInterval(authCheckInterval);
    };
  }, [jwtToken]);

  // Listen for route changes and manage loading state accordingly
  useEffect(() => {
    setLoading(true);  // Show loading screen when the route is changing
    const timer = setTimeout(() => {
      setLoading(false);  // Hide loading after 2 seconds (or adjust this as per your needs)
    }, 2000); // Adjust delay to match your loading time

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Show LoadingScreen as an overlay */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // semi-transparent overlay
            zIndex: 9999, // Ensures it sits above the content
          }}
        >
          <LoadingScreen />
        </div>
      )}
      {/* Content layout */}
      <div style={{ opacity: loading ? 0.3 : 1, transition: 'opacity 0.5s ease' }}>
        <AppLayout>
          <AppRoutes
            complaints={complaints}
            handleLoading={setLoading}
            handleSubmitComplaint={(data) =>
              setComplaints((prev) => [...prev, data])
            }
          />
        </AppLayout>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
