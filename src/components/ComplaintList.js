import React from 'react';
import { Box, Typography } from '@mui/material';

const ComplaintList = ({ complaints }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Complaints You Have Filed</Typography>
      {complaints.length === 0 ? (
        <Typography>No complaints filed yet.</Typography>
      ) : (
        complaints.map((complaint, index) => (
          <Box key={index} sx={{ marginBottom: 2, padding: 2, border: '1px solid #ddd' }}>
            <Typography variant="h6">Complaint #{index + 1}</Typography>
            <pre>{JSON.stringify(complaint, null, 2)}</pre>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ComplaintList;
