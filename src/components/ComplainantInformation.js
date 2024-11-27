import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, MenuItem, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

const identificationProofTypes = ['Aadhaar', 'Voter ID', 'Passport', 'Others'];

const ComplainantInformation = ({ prevStep, nextStep, updateFormData, formData, setStepValid }) => {
  const individualDetails = formData.individualdetails || {};
  const [errors, setErrors] = useState({}); // Track validation errors

  console.log(individualDetails)

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const validateFields = () => {
    const newErrors = {};

    // Validate Full Name
    if (!individualDetails.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    // Validate Address
    if (!individualDetails.address) {
      newErrors.address = 'Address is required';
    }

    // Validate Phone Number
    if (!individualDetails.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    // Validate Email Address
    if (individualDetails.emailAddress && !/\S+@\S+\.\S+/.test(individualDetails.emailAddress)) {
      newErrors.emailAddress = 'Valid email is required';
    }

    // Validate Identification Proof Type
    if (!individualDetails.identificationProofType) {
      newErrors.identificationProofType = 'Identification proof type is required';
    }

    // Validate Identification Proof Number
    if (!individualDetails.identificationProofNumber) {
      newErrors.identificationProofNumber = 'Identification proof number is required';
    }

    // Validate Gender
    if (!individualDetails.gender) {
      newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);

    // Return whether the form is valid
    return Object.keys(newErrors).length === 0;
  };

  // Update the parent component with form validity
  useEffect(() => {
    const isValid = validateFields();
    setStepValid(isValid);
  }, [individualDetails, setStepValid]);

  const handleNext = () => {
    if (validateFields()) {
      nextStep();
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Complainant Information
      </Typography>

      {/* Full Name */}
      <TextField
        label="Full Name"
        value={individualDetails.fullName || ''}
        onChange={(e) => handleChange('fullName', e.target.value)}
        fullWidth
        margin="normal"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Address */}
      <TextField
        label="Address"
        value={individualDetails.address || ''}
        onChange={(e) => handleChange('address', e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={3}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <HomeIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Phone Number */}
      <TextField
        label="Phone Number"
        type="tel"
        value={individualDetails.phoneNumber || ''}
        onChange={(e) => handleChange('phoneNumber', e.target.value)}
        fullWidth
        margin="normal"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Email Address */}
      <TextField
        label="Email Address"
        type="email"
        value={individualDetails.emailAddress || ''}
        onChange={(e) => handleChange('emailAddress', e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Identification Proof Type */}
      <TextField
        label="Identification Proof Type"
        select
        value={individualDetails.identificationProofType || ''}
        onChange={(e) => handleChange('identificationProofType', e.target.value)}
        fullWidth
        margin="normal"
        required
      >
        {identificationProofTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      {/* Identification Proof Number */}
      <TextField
        label="Identification Proof Number"
        value={individualDetails.identificationProofNumber || ''}
        onChange={(e) => handleChange('identificationProofNumber', e.target.value)}
        fullWidth
        margin="normal"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BadgeIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Gender */}
      <FormControl component="fieldset" fullWidth margin="normal" required>
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup
          row
          value={individualDetails.gender || ''}
          onChange={(e) => handleChange('gender', e.target.value)}
        >
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
          <FormControlLabel value="Other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default ComplainantInformation;
