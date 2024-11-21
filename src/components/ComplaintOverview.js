import React, { useEffect, useState } from "react";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";

const ComplaintOverview = ({ setStepValid }) => {
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    // Validate the step when the "Agree" checkbox is checked
    setStepValid(isAgreed);
  }, [isAgreed, setStepValid]);

  const handleAgreementChange = (event) => {
    setIsAgreed(event.target.checked);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Complaint Overview
      </Typography>
      <Typography variant="body1" paragraph>
        Please note that providing false or misleading information in a complaint is a serious offense...
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={isAgreed}
            onChange={handleAgreementChange}
            color="primary"
          />
        }
        label="I solemnly declare that the information provided is true to the best of my knowledge."
      />
    </Box>
  );
};

export default ComplaintOverview;
