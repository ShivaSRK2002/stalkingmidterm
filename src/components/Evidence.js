import React from 'react';
import { Box, Typography } from '@mui/material';

const Evidence = ({ updateFormData }) => {
  const handleProofFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateFormData({ proofFile: file });
    }
  };

  const handleEvidenceFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      updateFormData({ evidenceFiles: files });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Evidence Upload
      </Typography>

      {/* Proof Upload */}
      <Typography variant="subtitle1" gutterBottom>
        Upload Proof
      </Typography>
      <input
        accept="image/*"
        id="proof-upload"
        type="file"
        onChange={handleProofFileChange}
        style={{ marginBottom: 20 }}
      />

      {/* Evidence Upload */}
      <Typography variant="subtitle1" gutterBottom>
        Upload Evidence (Images/Videos)
      </Typography>
      <input
        accept="image/*,video/*"
        id="evidence-upload"
        type="file"
        multiple
        onChange={handleEvidenceFileChange}
        style={{ marginBottom: 20 }}
      />
    </Box>
  );
};

export default Evidence;
