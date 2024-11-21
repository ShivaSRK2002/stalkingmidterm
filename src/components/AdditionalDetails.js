import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const AdditionalDetails = ({ updateFormData, formData }) => {
  const individualDetails = formData.individualdetails || {};  // Ensure the details are correctly accessed

  // Handler for adding a new witness
  const handleAddWitness = () => {
    const newWitness = { name: '', contact: '' };
    updateFormData({
      witnesses: [...(individualDetails.witnesses || []), newWitness],
    });
  };

  // Handler for updating witness details
  const handleWitnessChange = (index, field, value) => {
    const updatedWitnesses = [...(individualDetails.witnesses || [])];
    updatedWitnesses[index] = { ...updatedWitnesses[index], [field]: value };
    updateFormData({ witnesses: updatedWitnesses });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Additional Information
      </Typography>

      {/* Additional Comments or Information */}
      <TextField
        label="Any Additional Comments or Information"
        value={individualDetails.additionalComments || ''}
        onChange={(e) => updateFormData({ additionalComments: e.target.value })}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
        Witnesses Information
      </Typography>

      {/* Render list of witnesses */}
      {(individualDetails.witnesses || []).map((witness, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <TextField
            label="Witness Name"
            value={witness.name}
            onChange={(e) => handleWitnessChange(index, 'name', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Witness Contact"
            value={witness.contact}
            onChange={(e) => handleWitnessChange(index, 'contact', e.target.value)}
            fullWidth
            margin="normal"
          />
        </Box>
      ))}

      {/* Button to add new witness */}
      <Button onClick={handleAddWitness} variant="outlined" sx={{ marginTop: 2 }}>
        Add Witness
      </Button>
    </Box>
  );
};

export default AdditionalDetails;
