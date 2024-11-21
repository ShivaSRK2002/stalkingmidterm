import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, MenuItem, Button } from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';

const stalkingTypes = [
  'Physical Following',
  'Harassment via Calls/Messages',
  'Online Stalking',
  'Others',
];

const IncidentDetails = ({ prevStep, nextStep, updateFormData, formData, setStepValid }) => {
  const individualDetails = formData.individualdetails || {};
  const [errors, setErrors] = useState({}); // Track validation errors

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const validateFields = () => {
    const newErrors = {};
    // Validate Date
    if (!individualDetails.incidentDate) {
      newErrors.incidentDate = 'Date of incident is required';
    }
    // Validate Time
    if (!individualDetails.incidentTime) {
      newErrors.incidentTime = 'Time of incident is required';
    }
    // Validate Location
    if (!individualDetails.incidentLocation) {
      newErrors.incidentLocation = 'Location of incident is required';
    }
    // Validate Nature of Stalking
    if (!individualDetails.natureOfStalking) {
      newErrors.natureOfStalking = 'Nature of stalking is required';
    }
    // Validate Description
    if (!individualDetails.incidentDescription) {
      newErrors.incidentDescription = 'Description of incident is required';
    }

    setErrors(newErrors);

    // Return whether the form is valid
    return Object.keys(newErrors).length === 0;
  };

  // Update the parent component with form validity
  useEffect(() => {
    setStepValid(validateFields());
  }, [individualDetails, setStepValid]);

  const handleNext = () => {
    if (validateFields()) {
      nextStep();
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Incident Details
      </Typography>

      {/* Date of Incident */}
      <TextField
        label="Date of Incident"
        type="date"
        value={individualDetails.incidentDate || ''}
        onChange={(e) => handleChange('incidentDate', e.target.value)}
        fullWidth
        margin="normal"
        required
        error={!!errors.incidentDate}
        helperText={errors.incidentDate}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <DateRangeIcon />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {/* Time of Incident */}
      <TextField
        label="Time of Incident"
        type="time"
        value={individualDetails.incidentTime || ''}
        onChange={(e) => handleChange('incidentTime', e.target.value)}
        fullWidth
        margin="normal"
        error={!!errors.incidentTime}
        helperText={errors.incidentTime}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccessTimeIcon />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {/* Location of Incident */}
      <TextField
        label="Location of Incident"
        value={individualDetails.incidentLocation || ''}
        onChange={(e) => handleChange('incidentLocation', e.target.value)}
        fullWidth
        margin="normal"
        required
        error={!!errors.incidentLocation}
        helperText={errors.incidentLocation}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Nature of Stalking */}
      <TextField
        label="Nature of Stalking"
        select
        value={individualDetails.natureOfStalking || ''}
        onChange={(e) => handleChange('natureOfStalking', e.target.value)}
        fullWidth
        margin="normal"
        required
        error={!!errors.natureOfStalking}
        helperText={errors.natureOfStalking}
      >
        {stalkingTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      {/* Description of Incident */}
      <TextField
        label="Description of Incident"
        value={individualDetails.incidentDescription || ''}
        onChange={(e) => handleChange('incidentDescription', e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
        required
        error={!!errors.incidentDescription}
        helperText={errors.incidentDescription}
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

export default IncidentDetails;
