import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Tooltip } from '@mui/material';
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

    if (!individualDetails.accusedName) {
      newErrors.accusedName = 'Accused name is required';
    }

    if (!individualDetails.accusedLocation) {
      newErrors.accusedLocation = 'Accused location is required';
    }

    if (!individualDetails.relation) {
      newErrors.relation = 'Relation to complainant is required';
    }

    // Validate Gender
    if (!individualDetails.accusedgender) {
      newErrors.accusedgender = 'Gender is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setStepValid(validateFields());
  }, [individualDetails, setStepValid]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Accused's Details (if known)
      </Typography>

      {/* Form Table */}
      <Grid container spacing={2}>
        {/* Accused Name */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Tooltip title="Please enter the full name of the accused" arrow>
              <TextField
                label="Accused's Name"
                value={individualDetails.accusedName || ''}
                onChange={(e) => handleChange('accusedName', e.target.value)}
                margin="normal"
                required
                helperText={errors.accusedName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Tooltip>
          </FormControl>
        </Grid>

        {/* Accused Address/Location */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              label="Accused's Address/Location"
              value={individualDetails.accusedLocation || ''}
              onChange={(e) => handleChange('accusedLocation', e.target.value)}
              margin="normal"
              multiline
              rows={3}
              required
              helperText={errors.accusedLocation}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Grid>

        {/* Description or Relation to Complainant */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Tooltip title="Describe the relation or provide a description of the accused" arrow>
              <TextField
                label="Description or Relation to Complainant"
                value={individualDetails.relation || ''}
                onChange={(e) => handleChange('relation', e.target.value)}
                margin="normal"
                multiline
                rows={3}
                required
                helperText={errors.relation}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Tooltip>
          </FormControl>
        </Grid>

        {/* Gender selection */}
        <Grid item xs={12}>
          <FormControl component="fieldset" fullWidth margin="normal" required>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              value={individualDetails.accusedgender || ''}
              onChange={(e) => handleChange('accusedgender', e.target.value)}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccusedInformation;
