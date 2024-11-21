import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';

const AccusedInformation = ({ updateFormData, formData, setStepValid }) => {
  const individualDetails = formData.individualdetails || {};
  const [errors, setErrors] = useState({}); // Track validation errors

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const validateFields = () => {
    const newErrors = {};
    
    // Validate Accused's Name
    if (!individualDetails.accusedName) {
      newErrors.accusedName = 'Accused name is required';
    }

    // Validate Accused's Location
    if (!individualDetails.accusedLocation) {
      newErrors.accusedLocation = 'Accused location is required';
    }

    // Validate Relation to Complainant
    if (!individualDetails.relation) {
      newErrors.relation = 'Relation to complainant is required';
    }

    setErrors(newErrors);

    // Return whether the form is valid
    return Object.keys(newErrors).length === 0;
  };

  // Update the parent component with form validity
  useEffect(() => {
    setStepValid(validateFields());
  }, [individualDetails, setStepValid]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Accused's Details (if known)
      </Typography>

      {/* Accused Name */}
      <TextField
        label="Accused's Name"
        value={individualDetails.accusedName || ''}
        onChange={(e) => handleChange('accusedName', e.target.value)}
        fullWidth
        margin="normal"
        required
        error={!!errors.accusedName}
        helperText={errors.accusedName}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Accused Address/Location */}
      <TextField
        label="Accused's Address/Location"
        value={individualDetails.accusedLocation || ''}
        onChange={(e) => handleChange('accusedLocation', e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={3}
        required
        error={!!errors.accusedLocation}
        helperText={errors.accusedLocation}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <HomeIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Description or Relation to Complainant */}
      <TextField
        label="Description or Relation to Complainant"
        value={individualDetails.relation || ''}
        onChange={(e) => handleChange('relation', e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={3}
        required
        error={!!errors.relation}
        helperText={errors.relation}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <DescriptionIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default AccusedInformation;
