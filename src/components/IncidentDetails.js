import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, MenuItem, Button, Grid } from '@mui/material';
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
  const [isTouched, setIsTouched] = useState({}); // To track whether the field was touched for the first time

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
    setIsTouched((prevState) => ({ ...prevState, [field]: true }));
  };

  const validateFields = () => {
    const newErrors = {};
    // Validate Date (must be a valid date)
    if (!individualDetails.incident_date || isNaN(Date.parse(individualDetails.incident_date))) {
      newErrors.incident_date = 'Valid Date of incident is required';
    }
    // Validate Time (must be a valid time)
    if (!individualDetails.incidentTime) {
      newErrors.incidentTime = 'Time of incident is required';
    }
    // Validate Location (must be alphabetic)
    if (!individualDetails.location || !/^[a-zA-Z\s]*$/.test(individualDetails.location)) {
      newErrors.location = 'Location should contain only alphabets and spaces';
    }
    // Validate Nature of Stalking (must be selected)
    if (!individualDetails.natureOfStalking) {
      newErrors.natureOfStalking = 'Nature of stalking is required';
    }
    // Validate Description (should be a non-empty string)
    if (!individualDetails.incident_description) {
      newErrors.incident_description = 'Description of incident is required';
    }

    setErrors(newErrors);

    // Return whether the form is valid
    return Object.keys(newErrors).length === 0;
  };

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

      {/* Form Grid Layout */}
      <Grid container spacing={2}>

        {/* Date of Incident */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Date of Incident"
            type="date"
            value={individualDetails.incident_date || ''}
            onChange={(e) => handleChange('incident_date', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={isTouched.incidentDate && !!errors.incidentDate}
            helperText={isTouched.incidentDate && errors.incidentDate}
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
        </Grid>

        {/* Time of Incident */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Time of Incident"
            type="time"
            value={individualDetails.incidentTime || ''}
            onChange={(e) => handleChange('incidentTime', e.target.value)}
            fullWidth
            margin="normal"
            error={isTouched.incidentTime && !!errors.incidentTime}
            helperText={isTouched.incidentTime && errors.incidentTime}
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
        </Grid>

        {/* Location of Incident */}
        <Grid item xs={12}>
          <TextField
            label="Location of Incident"
            value={individualDetails.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={isTouched.incidentLocation && !!errors.incidentLocation}
            helperText={isTouched.incidentLocation && errors.incidentLocation}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Nature of Stalking */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Nature of Stalking"
            select
            value={individualDetails.natureOfStalking || ''}
            onChange={(e) => handleChange('natureOfStalking', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={isTouched.natureOfStalking && !!errors.natureOfStalking}
            helperText={isTouched.natureOfStalking && errors.natureOfStalking}
          >
            {stalkingTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Description of Incident */}
        <Grid item xs={12}>
          <TextField
            label="Description of Incident"
            value={individualDetails.incident_description || ''}
            onChange={(e) => handleChange('incident_description', e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
            error={isTouched.incidentDescription && !!errors.incidentDescription}
            helperText={isTouched.incidentDescription && errors.incidentDescription}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

       
      </Grid>
    </Box>
  );
};

export default IncidentDetails;
