import React, { useEffect } from "react";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Box, Container, Typography, Grid, Paper, useMediaQuery } from "@mui/material";
import { ReportOutlined, CheckCircleOutline, HelpOutlineOutlined, LocationOnOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Helmet } from "react-helmet";

// Animations
const cardAnimation = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 15, ease: "easeOut" },
  },
};

const containerAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

// Reusable Iframe Component
const ResponsiveIframe = ({ src, title }) => (
  <Box
    sx={{
      width: "100%",
      height: "300px",
      borderRadius: 2,
      overflow: "hidden",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    }}
  >
    <iframe
      width="100%"
      height="100%"
      src={src}
      frameBorder="0"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
      aria-label={title}
    ></iframe>
  </Box>
);

// Landing Page Card Component
const LandingCard = ({ title, description, icon, buttonText, onClick }) => (
  <Grid item xs={12} sm={6} md={3}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      variants={cardAnimation}
    >
      <Paper
        elevation={10}
        sx={{
          p: { xs: 2, sm: 3 },
          textAlign: "center",
          borderRadius: 4,
          height: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#f3f6fa",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <Box
          sx={{
            color: "#1a237e",
            fontSize: "3rem",
            backgroundColor: "#e8f4fd",
            borderRadius: "50%",
            padding: 2,
            width: "80px",
            height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          aria-label={`${title} icon`}
        >
          {icon}
        </Box>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: 700,
            color: "#0d47a1",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 1, color: "#616161", lineHeight: 1.6 }}
        >
          {description}
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#1a237e",
            "&:hover": { backgroundColor: "#0d193d" },
          }}
          onClick={onClick}
        >
          {buttonText}
          <ArrowForward fontSize="small" sx={{ ml: 1 }} />
        </Button>
      </Paper>
    </motion.div>
  </Grid>
);

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    document.title = "Stalking Complaint Portal | Home";
  }, []);

  const cardsData = [
    {
      title: "File a Complaint",
      description:
        "Submit your complaint securely. Our officers are here to assist and support you.",
      icon: <ReportOutlined fontSize="large" />,
      buttonText: "Raise Complaint",
      onClick: () => navigate("/complaint-form"),
    },
    {
      title: "Track Complaint Status",
      description: "Stay updated with real-time progress of your complaint.",
      icon: <CheckCircleOutline fontSize="large" />,
      buttonText: "View Status",
      onClick: () => navigate("/user-cases"),
    },
    {
      title: "Guidance & Support",
      description: "Get expert guidance and support tailored to your needs.",
      icon: <HelpOutlineOutlined fontSize="large" />,
      buttonText: "Get Help",
      onClick: () => navigate("/contact-us"),
    },
    {
      title: "Find Police Stations",
      description: "Locate nearby police stations quickly and conveniently.",
      icon: <LocationOnOutlined fontSize="large" />,
      buttonText: "Find Now",
      onClick: () => navigate("/map"),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Stalking Complaint Portal | Home</title>
        <meta
          name="description"
          content="Empower yourself to take action against stalking. Report complaints, track progress, and access guidance – all in one place."
        />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          background: "linear-gradient(135deg, #1a237e 30%, #3949ab 90%)",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant={isMobile ? "h4" : "h3"}
            sx={{ fontWeight: 700 }}
          >
            Your Safety, Our Priority
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, maxWidth: "700px", mx: "auto" }}
          >
            Empowering you to take action. Report stalking, track progress, and
            access guidance – all in one place.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ffffff",
                color: "#1a237e",
                mr: 2,
                "&:hover": { backgroundColor: "#e8f4fd" },
              }}
              onClick={() => navigate("/complaint-form")}
            >
              File a Complaint
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#ffffff",
                color: "#ffffff",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
              onClick={() => navigate("/about")}
            >
              Learn More
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* Cards Section */}
      <Container sx={{ py: 6 }}>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          component={motion.div}
          variants={containerAnimation}
        >
          {cardsData.map((card, index) => (
            <LandingCard key={index} {...card} />
          ))}
        </Grid>
      </Container>

      {/* Informative Section */}
      <Box
        sx={{
          py: 8,
          px: 4,
          backgroundColor: "#f3f6fa",
          textAlign: "center",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{ fontWeight: 600, color: "#283593" }}
        >
          Learn More About Stalking and Your Rights
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body1"
              sx={{
                color: "#616161",
                lineHeight: 1.8,
                textAlign: "left",
              }}
            >
              Stalking is a punishable offense under Section 354D of the Indian
              Penal Code. Our mission is to empower individuals to report and
              address stalking confidently and securely.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <ResponsiveIframe
              src="https://www.youtube.com/embed/ZHeUddArYtk"
              title="Explainer Video"
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HomePage;
