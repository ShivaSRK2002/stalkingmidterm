import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const ReviewAndSubmit = ({ formData }) => {
  // Debugging logs
  console.log('formData:', formData);
  console.log('individualDetails:', formData?.individualdetails);

  const renderIndividualDetails = (data) => {
    const excludedFields = ['evidenceFiles', 'caseappliedtime', 'proofFile'];
    return Object.entries(data)
      .filter(([key]) => !excludedFields.includes(key))
      .map(([key, value]) => (
        <TableRow key={key}>
          <TableCell>{key}</TableCell>
          <TableCell>{value}</TableCell>
        </TableRow>
      ));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Review and Submit
      </Typography>

      {formData.individualdetails && Object.keys(formData.individualdetails).length > 0 ? (
        <Box sx={{ my: 2 }}>
          <Typography variant="h6" gutterBottom>
            Individual Details
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Field</strong></TableCell>
                  <TableCell><strong>Value</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderIndividualDetails(formData.individualdetails)}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No individual details available.
        </Typography>
      )}
    </Box>
  );
};

export default ReviewAndSubmit;
