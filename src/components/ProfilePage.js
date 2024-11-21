import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Avatar, Grid } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { decryptToken } from "../authUtils";
import { Email, DateRange, Phone, Accessibility } from '@mui/icons-material'; // Corrected imports

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);

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
  }, []);

  if (!userData) {
    console.log("No user data available, rendering fallback message.");
    return (
      <Container>
        <Typography variant="h5" sx={{ textAlign: "center", mt: 4 }}>
          No user information available. Please log in.
        </Typography>
      </Container>
    );
  }

  console.log("Rendering user profile with data:", userData);

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
        >
          {userData.name?.charAt(0).toUpperCase()}
        </Avatar>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {userData.name || "User Name"}
          </Typography>

          <Grid container spacing={1} sx={{ mt: 2 }}>
            {/* Email */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", color: "gray" }}>
                <Email sx={{ mr: 1 }} />
                {userData.email || "Not Available"}
              </Typography>
            </Grid>

            {/* Birthdate */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", color: "gray" }}>
                <DateRange sx={{ mr: 1 }} />
                {userData.birthdate || "Not Provided"}
              </Typography>
            </Grid>

            {/* Gender */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", color: "gray" }}>
                <Accessibility sx={{ mr: 1 }} /> {/* Using Accessibility icon for gender */}
                {userData.gender || "Not Specified"}
              </Typography>
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center", color: "gray" }}>
                <Phone sx={{ mr: 1 }} />
                {userData.phone_number || "Not Verified"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
