import React, { useEffect, useState } from "react";
import { Box, Typography, Checkbox, FormControlLabel, Tooltip, Button, Grid, IconButton } from "@mui/material";
import { Warning, CheckCircle } from "@mui/icons-material";

const ComplaintOverview = ({ setStepValid }) => {
  const [isAgreed, setIsAgreed] = useState(false);

  // UseEffect should trigger when the "isAgreed" state changes.
  useEffect(() => {
    // Avoid updating setStepValid unless the "isAgreed" state changes
    setStepValid(isAgreed);
  }, [isAgreed, setStepValid]);

  const handleAgreementChange = (event) => {
    setIsAgreed(event.target.checked);
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f3f6fa", borderRadius: "8px" }}>
      <Typography variant="h4" sx={{ fontWeight: "600", color: "#1a237e" }} gutterBottom>
        Complaint Overview
      </Typography>

      <Typography variant="body1" paragraph sx={{ marginBottom: "20px", color: "#616161" }}>
        Please note that providing false or misleading information in a complaint is a serious offense. By submitting
        your complaint, you declare that the information provided is accurate and truthful to the best of your knowledge.
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Tooltip title="Providing false information may lead to penalties or legal action." arrow>
            <IconButton>
              <Warning sx={{ fontSize: 30, color: "#f57c00" }} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAgreed}
                onChange={handleAgreementChange}
                color="primary"
                sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
              />
            }
            label="I solemnly declare that the information provided is true to the best of my knowledge."
            sx={{ fontSize: "1rem", color: "#424242" }}
          />
        </Grid>
      </Grid>

      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
        {/* <Button
          variant="contained"
          color="primary"
          disabled={!isAgreed}
          sx={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#1a237e",
            "&:hover": { backgroundColor: "#0d193d" },
          }}
        >
          Confirm and Proceed
        </Button> */}
      </Box>

      {/* Legal Disclaimer */}
      <Typography variant="body2" sx={{ textAlign: "center", marginTop: "15px", color: "#616161" }}>
        By agreeing, you confirm that you understand the seriousness of false complaints and the legal consequences.
      </Typography>
    </Box>
  );
};

export default ComplaintOverview;
