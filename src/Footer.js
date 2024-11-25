import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, GitHub } from '@mui/icons-material';
 
const Footer = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
 
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
 
    return (
        <Box
            sx={{
                backgroundColor: '#002B5C',
                color: '#F5F5F5',
                padding: { xs: 1, sm: 2 },
                fontFamily: "'Roboto', sans-serif",
                marginTop: 'auto',
            }}
        >
            <Grid
                container
                spacing={4}
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: { xs: 'center', md: 'left' }, // Center content for small screens
                }}
            >
                {/* Company Info */}
                <Grid item xs={12} md={3}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            marginBottom: 1,
                            color: '#FFD700',
                            textAlign: { xs: 'center', md: 'left' },
                        }}
                    >
                        <img
                            src="https://i.ibb.co/bRk596h/logodigipo-1.png"
                            alt="DiGIPo Logo"
                            style={{ verticalAlign: 'middle', marginRight: 8, marginTop: 8 }}
                        />
                         DiGiPo
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0C4DE' }}>
                        Content is owned and maintained by DiGiPo IT Services.
                    </Typography>
                </Grid>
 
                {/* Quick Links */}
                <Grid item xs={12} md={3}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            marginBottom: 1,
                            color: '#FFD700',
                        }}
                    >
                        Quick Links
                    </Typography>
                    <Grid container spacing={1} sx={{ justifyContent: { xs: 'center', md: 'start' } }}>
                        {[
                            'Officers Login',
                            'Site Map',
                            'Feedback',
                            'Recruitment',
                            'Crime Prevention',
                            'Privacy Policy',
                            'Disclaimer',
                            'Terms of Use',
                        ].map((link, index) => (
                            <Grid item xs={6} key={index}>
                                <Link href="#" color="inherit" underline="hover">
                                    {link}
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
 
                {/* Social Media */}
                <Grid item xs={12} md={3}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            marginBottom: 1,
                            color: '#FFD700',
                        }}
                    >
                        Follow Us
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        {[
                            { icon: <Facebook />, url: 'https://facebook.com' },
                            { icon: <Twitter />, url: 'https://twitter.com' },
                            { icon: <Instagram />, url: 'https://instagram.com' },
                            { icon: <LinkedIn />, url: 'https://linkedin.com' },
                            { icon: <GitHub />, url: 'https://github.com' },
                        ].map((social, index) => (
                            <IconButton
                                key={index}
                                href={social.url}
                                target="_blank"
                                sx={{ color: '#FFD700' }}
                                aria-label="Social Media"
                            >
                                {social.icon}
                            </IconButton>
                        ))}
                    </Box>
                    <Typography variant="body2" sx={{ marginTop: 2, color: '#B0C4DE' }}>
                        Designed and Developed by DiGiPo IT Services, Chennai
                    </Typography>
                </Grid>
 
                {/* Contact Info */}
                <Grid item xs={12} md={3}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            color: '#FFD700',
                            marginBottom: 1,
                        }}
                    >
                        Contact Us
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0C4DE' }}>
                        info@example.com
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0C4DE' }}>
                        +1 234 567 890
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            marginTop: 2,
                            color: '#FFD700',
                            fontWeight: 600,
                        }}
                    >
                        Current Date & Time: <strong>{currentDateTime.toLocaleString()}</strong>
                    </Typography>
                </Grid>
            </Grid>
 
            <Box
                sx={{
                    borderTop: '1px solid #FFD700',
                    marginTop: 1,
                    marginBottom:-2,
                    padding:1,
                    textAlign: 'center',
                }}
            >
                <Typography variant="body2" sx={{ color: '#B0C4DE' }}>
                    Best viewed in Firefox (v50.0 & Above), Google Chrome (v37.0 & Above), and Firefox for Android.
                </Typography>
            </Box>
        </Box>
    );
};
 
export default Footer;