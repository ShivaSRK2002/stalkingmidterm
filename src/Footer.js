import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#3f51b5',
        color: 'white',
        marginTop: 'auto', // Pushes the footer to the bottom if the content is short
        paddingY: 2,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" sx={{ fontWeight: 500 }}>
          &copy; {new Date().getFullYear()} My Application. All Rights Reserved.
        </Typography>
        <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
          <Link color="inherit" href="/privacy-policy" underline="hover" sx={{ marginX: 1 }}>
            Privacy Policy
          </Link>
          |
          <Link color="inherit" href="/terms-of-service" underline="hover" sx={{ marginX: 1 }}>
            Terms of Service
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
