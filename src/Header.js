import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, IconButton, Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout } from './authUtils';

import logo from '../src/assets/DiGiPo.png'
const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#002B5B', // Navy blue
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '5px 0',
      }}
    >
      <Toolbar>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo and Portal Name */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: 1.5, // Space between logo and text
            }}
            onClick={() => navigate('/home')}
          >
            <img src={logo} alt="Portal Logo" style={{ width: 40, height: 40 }} /> {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: 1.1,
                color: '#FFF',
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                textTransform: 'uppercase',
              }}
            >
              DiGiPo Portal
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              sx={{
                color: '#FFF',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
              onClick={() => navigate('/complaint-form')}
            >
              Raise Complaint
            </Button>
            <Button
              sx={{
                color: '#FFF',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
              onClick={() => navigate('/user-cases')}
            >
              Track Status
            </Button>
            <Button
              sx={{
                color: '#FFF',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
              onClick={() => navigate('/about')}
            >
              Contact Us
            </Button>
            <Button
              sx={{
                color: '#FFF',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
              onClick={logout}
            >
              Logout
            </Button>
            <IconButton
              sx={{
                color: '#FFF',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
              onClick={() => navigate('/profile')}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
