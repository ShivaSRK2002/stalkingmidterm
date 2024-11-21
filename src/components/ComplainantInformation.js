import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, MenuItem, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

const identificationProofTypes = ['Aadhaar', 'Voter ID', 'Passport', 'Others'];

const ComplainantInformation = ({ prevStep, nextStep, updateFormData, formData, setStepValid }) => {
  const individualDetails = formData.individualdetails || {};
  const [errors, setErrors] = useState({}); // Track validation errors

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
        error={!!errors.fullName}
        helperText={errors.fullName}
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
        error={!!errors.address}
        helperText={errors.address}
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
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber}
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
        error={!!errors.emailAddress}
        helperText={errors.emailAddress}
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
        error={!!errors.identificationProofType}
        helperText={errors.identificationProofType}
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
        error={!!errors.identificationProofNumber}
        helperText={errors.identificationProofNumber}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BadgeIcon />
            </InputAdornment>
          ),
        }}
      />

      
    </Box>
  );
};

export default ComplainantInformation;
