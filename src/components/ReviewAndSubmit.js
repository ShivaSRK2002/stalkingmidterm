import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ReviewAndSubmit = ({ handleSubmit, formData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== null && value !== "")
      );

      await handleSubmit(filteredFormData);
      setLoading(false);
    } catch (err) {
      setError("Submission failed. Please try again.");
      console.error("Error during submission:", err);
      setLoading(false);
    }
  };

  // Use `individualdetails` directly as it's already an object
  const individualDetails = formData.individualdetails;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Review and Submit
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {!individualDetails || Object.keys(individualDetails).length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No individual details available to display.
        </Typography>
      ) : (
        <Box sx={{ my: 2 }}>
          <Typography variant="h6" gutterBottom>
            Individual Details
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Field</strong></TableCell>
                  <TableCell><strong>Value</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(individualDetails).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>
                      <strong>{key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim()}</strong>
                    </TableCell>
                    <TableCell>
                      {Array.isArray(value) && value.length === 0
                        ? "None"
                        : value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ReviewAndSubmit;
