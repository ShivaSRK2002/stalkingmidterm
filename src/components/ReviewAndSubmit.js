import React, { useState } from 'react';
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
  Button,
} from '@mui/material';

const ReviewAndSubmit = ({ handleSubmit, formData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Filter out empty fields before submission (optional).
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== null && value !== '')
      );

      // Stringify nested objects for submission if necessary.
      const processedData = { ...filteredFormData };
      for (const key in processedData) {
        if (processedData[key] && typeof processedData[key] === 'object') {
          processedData[key] = JSON.stringify(processedData[key]);
        }
      }

      await handleSubmit(processedData);
      setLoading(false);
    } catch (err) {
      setError('Submission failed. Please try again.');
      console.error('Error during submission:', err);
      setLoading(false);
    }
  };

  // Helper function to render table rows for a given object
  const renderTableRows = (data, prefix = '') =>
    Object.entries(data).map(([key, value]) => (
      <TableRow key={prefix + key}>
        <TableCell>{prefix ? `${prefix}.${key}` : key}</TableCell>
        <TableCell>
          {typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : value}
        </TableCell>
      </TableRow>
    ));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Review and Submit
      </Typography>

      {Object.keys(formData).length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No details provided. Please fill in the required fields.
        </Typography>
      ) : (
        <Box sx={{ my: 2 }}>
          <Typography variant="h6" gutterBottom>
            Complaint Details
          </Typography>

          {/* Table to display all fields, including nested individualDetails */}
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Field</strong></TableCell>
                  <TableCell><strong>Value</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderTableRows(formData)}
                {formData.individualDetails &&
                  renderTableRows(formData.individualDetails, 'individualDetails')}
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

      {/* Loading Spinner */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ReviewAndSubmit;
