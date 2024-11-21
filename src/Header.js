import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, IconButton, Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" color="primary" sx={{ padding: '5px 0' }}> {/* Reduced padding */}
      <Toolbar sx={{ padding: 0 }}> {/* Remove padding from Toolbar */}
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* Logo or Portal Name */}
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                animation: 'sirenEffect 1.5s infinite',
                '@keyframes sirenEffect': {
                  '0%': { color: 'red' },
                  '50%': { color: 'blue' },
                  '100%': { color: 'red' },
                },
              }}
              onClick={() => navigate('/Home')} // Navigate to home on clicking the logo
            >
              DiGiPo-Stalking Complaint Portal
            </Typography>

            {/* Navigation & User Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                color="inherit"
                sx={{
                  marginRight: 2,
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'transparent', color: '#fff' },
                }}
                onClick={() => navigate('/complaint-form')} // Navigate to Complaint Form
              >
                Raise Complaint
              </Button>
              <Button
                color="inherit"
                sx={{
                  marginRight: 2,
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'transparent', color: '#fff' },
                }}
                onClick={() => navigate('/user-cases')} // Navigate to Track Status
              >
                Track Status
              </Button>
              <Button
                color="inherit"
                sx={{
                  marginRight: 2,
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'transparent', color: '#fff' },
                }}
                onClick={() => navigate('/contact-us')} // Navigate to Contact Us
              >
                Contact Us
              </Button>
              <IconButton color="inherit" onClick={() => navigate('/profile')}> {/* Navigate to Profile */}
                <AccountCircle />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
