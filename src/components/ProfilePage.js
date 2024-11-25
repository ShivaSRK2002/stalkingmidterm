import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Avatar, Grid, Box, Button, Link } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { decryptToken } from "../authUtils";
import { Email, DateRange, Phone, Accessibility } from '@mui/icons-material'; // Corrected imports
import Skeleton from '@mui/material/Skeleton';

// Function to handle missing user data gracefully
const getUserField = (field, fallback) => (field ? field : fallback);

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve the encrypted JWT token from session storage
    const encryptedToken = sessionStorage.getItem("jwt");
    console.log("Encrypted Token retrieved from session storage:", encryptedToken);

    if (encryptedToken) {
      try {
        // Decrypt the token
        const decryptedToken = decryptToken(encryptedToken);
        console.log("Decrypted token:", decryptedToken);

        // Decode the decrypted token to extract user information
        const decoded = jwtDecode(decryptedToken);
        console.log("Decoded token successfully:", decoded);
        setUserData(decoded); // Set user data from the decoded token
      } catch (error) {
        console.error("Error decrypting or decoding token:", error);
      }
    } else {
      console.warn("No encrypted token found in session storage.");
    }

    setLoading(false); // Once data fetching and decryption are done, stop the loading state
  }, []);

  if (loading) {
    return (
      <Container>
        <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
        <Skeleton variant="text" width="80%" sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" width="80%" sx={{ mx: 'auto', mb: 1 }} />
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <Typography variant="h5" sx={{ textAlign: "center", mt: 4 }}>
          No user information available. Please <Link href="/login">log in</Link> to access your profile.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card sx={{ p: 3, textAlign: "center" }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            backgroundColor: "#2196f3",
            fontSize: "2rem",
          }}
          src={userData?.avatarUrl || "default-avatar-url.png"} // Use a fallback image URL here
        >
          {getUserField(userData.name?.charAt(0).toUpperCase(), "U")}
        </Avatar>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: "1.5rem", sm: "2rem" } }}>
            {getUserField(userData.name, "User Name")}
          </Typography>

          <Grid container spacing={1} sx={{ mt: 2 }}>
            {/* Email */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", color: "gray" }}>
                <Email sx={{ mr: 1 }} />
                {getUserField(userData.email, "Not Available")}
              </Typography>
            </Grid>

            {/* Birthdate */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", color: "gray" }}>
                <DateRange sx={{ mr: 1 }} />
                {getUserField(userData.birthdate, "Not Provided")}
              </Typography>
            </Grid>

            {/* Gender */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", color: "gray" }}>
                <Accessibility sx={{ mr: 1 }} /> {/* Using Accessibility icon for gender */}
                {getUserField(userData.gender, "Not Specified")}
              </Typography>
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", color: "gray" }}>
                <Phone sx={{ mr: 1 }} />
                {getUserField(userData.phone_number, "Not Verified")}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Edit Profile Button */}
      {(!userData.email || !userData.phone_number) && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            Some details are missing. Please <Link href="/profile/edit">update your profile</Link>.
          </Typography>
        </Box>
      )}

     
    </Container>
  );
};

export default ProfilePage;
