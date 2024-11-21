import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


const App = () => {
  const [loading, setLoading] = useState(false); // Loading state
  const [complaints, setComplaints] = useState([]); // Centralized state for complaints

  // Handle loading state for transitions or asynchronous operations
  const handleLoading = (isLoading) => setLoading(isLoading);

  // Handle form submissions and store complaints in state
  const handleSubmitComplaint = (newComplaintData) => {
    setComplaints((prevComplaints) => [...prevComplaints, newComplaintData]);
  };

  return (
    <div className="App">
      <Router>
        {/* Show LoadingScreen when `loading` is true */}
        {loading && <LoadingScreen />}

        {/* Main App Layout */}
        <AppLayout>
          <Routes>
            {/* Default Callback Route */}
            <Route path="/" element={<TargetCallbackHandler />} />

            {/* Home Page */}
            <Route path="/home" element={<HomePage />} />

            {/* Complaint Form */}
            <Route
              path="/complaint-form"
              element={
                <ComplaintMultiForm
                  setLoading={handleLoading}
                  handleSubmit={handleSubmitComplaint}
                />
              }
            />
            

          

            {/* Chat */}
            <Route path="/chat" element={<ChatWidget />} />

            {/* Complaints List */}
            <Route path="/complaint-list" element={<ComplaintList complaints={complaints} />} />

            {/* User Cases */}
            <Route path="/user-cases" element={<UserCases />} />

            {/* Profile Page */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Map Page */}
            <Route path="/map" element={<MapPage />} />

            {/* Fallback Route for Undefined Paths */}
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
        </AppLayout>
      </Router>
    </div>
  );
};

export default App;
