import React from "react";
import { Box, Typography, Button, Paper, TextField, Grid, Card, CardContent } from "@mui/material";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { Shield, Lock, Face } from "@mui/icons-material"; // Importing Material UI Icons

// Hero Section with matching theme
const HeroSection = () => (
  <Box
    sx={{
      height: "300px",
      background: "linear-gradient(135deg, #1a237e 30%, #3949ab 90%)", // Gradient background from homepage
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    }}
  >
    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)" }} />
    <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", textAlign: "center", position: "relative" }}>
      Welcome to DiGiPo Stalking Portal
    </Typography>
  </Box>
);

// Contact Form Section
const ContactForm = () => (
  <Box sx={{ marginTop: "30px", textAlign: "center" }}>
    <Typography variant="h6" sx={{ fontWeight: "600", marginBottom: "10px", color: "#1a237e" }}>
      Contact Us
    </Typography>
    <TextField label="Your Message" multiline rows={4} sx={{ width: "100%", marginBottom: "10px" }} />
    <Button variant="contained" sx={{ backgroundColor: "#1a237e", "&:hover": { backgroundColor: "#0d193d" } }}>
      Send Message
    </Button>
  </Box>
);

// Main About Section with Mission, Features, and Benefits
const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>About Us - DiGiPo Stalking Portal</title>
        <meta name="description" content="Learn more about the DiGiPo Stalking Portal and how we help you track online behavior and ensure digital security." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection />

      {/* Mission Section */}
      <Paper elevation={3} sx={{ padding: "20px", marginTop: "30px", marginBottom: "30px", backgroundColor: "#f3f6fa" }}>
        <Typography variant="h6" sx={{ fontWeight: "600", marginBottom: "10px", color: "#1a237e" }}>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: "#616161" }}>
          At DiGiPo, we are dedicated to providing a safe and secure platform to report stalking incidents and protect your digital privacy.
          <span role="img" aria-label="shield">🛡️</span> Our goal is to ensure that users can file complaints based on IPC Section, chat directly with the police, and even have video calls to discuss their case. You can also track the status of your complaint in real-time.
        </Typography>

        {/* Step-by-Step Guide for Filing Complaints */}
        <Typography variant="h6" sx={{ fontWeight: "600", marginBottom: "15px", color: "#1a237e" }}>
          How It Works
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", height: "100%" }}>
              <CardContent>
                <Shield sx={{ fontSize: "40px", color: "#1a237e", marginBottom: "15px" }} />
                <Typography variant="h6" sx={{ fontWeight: "600", marginBottom: "10px" }}>
                  Step 1: File a Complaint
                </Typography>
                <Typography>Report incidents of stalking in accordance with IPC Section.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", height: "100%" }}>
              <CardContent>
                <Lock sx={{ fontSize: "40px", color: "#1a237e", marginBottom: "15px" }} />
                <Typography variant="h6" sx={{ fontWeight: "600", marginBottom: "10px" }}>
                  Step 2: Chat with Police
                </Typography>
                <Typography>Communicate directly with police officials to discuss your case.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", height: "100%" }}>
              <CardContent>
                <Face sx={{ fontSize: "40px", color: "#1a237e", marginBottom: "15px" }} />
                <Typography variant="h6" sx={{ fontWeight: "600", marginBottom: "10px" }}>
                  Step 3: Video Call with Police
                </Typography>
                <Typography>Have a face-to-face video call to explain your situation and provide evidence.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tracking Complaints */}
        <Typography variant="h6" sx={{ fontWeight: "600", marginTop: "30px", marginBottom: "15px", color: "#1a237e" }}>
          Track Your Complaint
        </Typography>
        <Typography variant="body1" sx={{ color: "#616161" }}>
          Track the status of your complaint in real-time and stay updated on its progress. You’ll be notified of any changes, ensuring transparency throughout the process.
        </Typography>
      </Paper>

      {/* Testimonials Section */}
      <Box sx={{ marginTop: "30px", padding: "20px", backgroundColor: "#f3f6fa", borderRadius: "8px" }}>
        <Typography variant="h5" sx={{ fontStyle: "italic", marginBottom: "20px", color: "#1a237e" }}>
          "DiGiPo helped us safeguard our company's online activities—highly recommended!"
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.2rem", color: "#616161" }}>
          "The platform's real-time monitoring capabilities allowed us to track and protect our sensitive data efficiently. We can now make data-driven decisions to improve our digital security."
        </Typography>
      </Box>

      {/* Contact Form */}
      <ContactForm />
    </motion.div>
  );
};

export default AboutPage;
