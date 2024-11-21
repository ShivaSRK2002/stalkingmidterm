import React from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Box, Container } from '@mui/material'; // Import Box and Container from MUI

const AppLayout = ({ children }) => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box sx={{ paddingTop: '64px', minHeight: 'calc(100vh - 128px)' }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppLayout;
