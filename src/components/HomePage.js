import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Box, Container, Typography, Grid, Paper, Divider } from "@mui/material";
import { ArrowForward, Report, CheckCircle, HelpOutline, LocationOn } from "@mui/icons-material";
import Header from "../Header";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Stalking Complaint Portal | Home";
  }, []);

  const handleFileComplaint = () => navigate("/complaint-form");
  const handleViewStatus = () => navigate("/user-cases");
  const handleContactUs = () => navigate("/contact-us");
  const handleFindPoliceStations = () => navigate("/map");

  const Card = ({ title, description, icon, buttonText, onClick }) => (
    <Grid item xs={12} sm={6} md={4}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            borderRadius: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            "&:hover": { boxShadow: 6, backgroundColor: "#f5f5f5" },
          }}
        >
          {icon}
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#666", lineHeight: 1.5 }}>
            {description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, px: 3 }}
            onClick={onClick}
            aria-label={`Navigate to ${title} section`}
          >
            {buttonText} <ArrowForward fontSize="small" sx={{ ml: 1 }} />
          </Button>
        </Paper>
      </motion.div>
    </Grid>
  );

  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          py: 6,
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          borderRadius: 2,
          boxShadow: 3,
          mt: "90px", // Adjust margin for fixed header
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "2rem", sm: "2.8rem" },
              fontWeight: 700,
              color: "#2C3E50",
              letterSpacing: 1.2,
              textAlign: "center",
            }}
          >
            Welcome to the Stalking Complaint Portal
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#555",
              fontSize: "1.2rem",
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.8,
              textAlign: "center",
              mt: 2,
            }}
          >
            A secure platform to report stalking complaints, monitor case status, and receive guidance. 
            Your safety is our priority.
          </Typography>
        </motion.div>

        {/* Cards Section */}
        <Grid container spacing={4} justifyContent="center">
          {[ 
            {
              title: "File a Complaint",
              description: "Submit your complaint securely. Our officers are here to assist and support you.",
              icon: <Report fontSize="large" color="primary" />,
              onClick: handleFileComplaint,
              buttonText: "Raise Complaint",
            },
            {
              title: "Track Complaint Status",
              description: "Stay updated with real-time progress of your complaint.",
              icon: <CheckCircle fontSize="large" color="success" />,
              onClick: handleViewStatus,
              buttonText: "View Status",
            },
            {
              title: "Guidance & Support",
              description: "Get expert guidance and support tailored to your needs.",
              icon: <HelpOutline fontSize="large" color="secondary" />,
              onClick: handleContactUs,
              buttonText: "Get Help",
            },
            {
              title: "Find Police Stations",
              description: "Locate nearby police stations quickly and conveniently.",
              icon: <LocationOn fontSize="large" color="info" />,
              onClick: handleFindPoliceStations,
              buttonText: "Find Now",
            },
          ].map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </Grid>

        {/* Informative Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{ marginTop: "50px" }}
        >
          <Divider sx={{ my: 4 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#2C3E50",
              textAlign: "center",
              mb: 2,
            }}
          >
            Know Your Rights & the Law on Stalking in India
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#555",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              maxWidth: "700px",
              mx: "auto",
              textAlign: "center",
            }}
          >
            Stalking is a punishable offense under Section 354D of the Indian Penal Code. Use this platform to take action and access resources for support.
          </Typography>
        </motion.div>
      </Container>
    </>
  );
};

export default HomePage;
