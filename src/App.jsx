import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import theme from './theme/theme';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import IdeaSubmission from './components/IdeaSubmission';
import VotingSystem from './components/VotingSystem';
import CollaborationHub from './components/CollaborationHub';
import RegionalDashboard from './components/RegionalDashboard';
import RewardCenter from './components/RewardCenter';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box sx={{ display: 'flex', flex: 1 }}>
            {isLoggedIn && <Sidebar onLogout={handleLogout} />}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                marginTop: '64px',
                marginLeft: isLoggedIn ? '280px' : 0,
                padding: '24px',
                backgroundColor: 'background.default',
                minHeight: 'calc(100vh - 64px)',
                transition: 'margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
              }}
            >
              <Routes>
                <Route 
                  path="/login" 
                  element={!isLoggedIn ? <Login /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/signup" 
                  element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} 
                />
                {isLoggedIn ? (
                  <>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/submit-idea" element={<IdeaSubmission />} />
                    <Route path="/vote" element={<VotingSystem />} />
                    <Route path="/collaborate" element={<CollaborationHub />} />
                    <Route path="/regional-dashboard" element={<RegionalDashboard />} />
                    <Route path="/rewards" element={<RewardCenter />} />
                  </>
                ) : (
                  <Route path="*" element={<Navigate to="/login" />} />
                )}
              </Routes>
            </Box>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
