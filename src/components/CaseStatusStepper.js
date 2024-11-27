import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

// Custom connector for the steps
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
  },
}));

// Custom step icon with corresponding icons
function CustomStepIcon(props) {
  const { active, completed, icon } = props;

  const icons = {
    1: <PendingIcon />,
    2: <VerifiedIcon />,
    3: <AssignmentTurnedInIcon />,
    4: <CheckCircleIcon />,
    5: <CloseIcon />,
  };

  return (
    <Box
      sx={{
        backgroundColor: completed ? 'success.main' : 'grey.300',
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        ...(active && {
          backgroundColor: 'primary.main',
          boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        }),
      }}
    >
      {icons[String(icon)]}
    </Box>
  );
}

// Case status steps
const steps = [
  { label: 'Complaint Registered', percentage: 20 },
  { label: 'Verification in Progress', percentage: 40 },
  { label: 'Investigation Ongoing', percentage: 60 },
  { label: 'Action Taken', percentage: 80 },
  { label: 'Case Closed', percentage: 100 },
];

// Stepper Component
function CaseStatusStepper({ caseStatus }) {
  // Log the received caseStatus
  console.log("Received caseStatus:", caseStatus);

  // Find the index of the active step or default to -1 for invalid/missing caseStatus
  const activeStep = steps.findIndex(
    (step) => step.label.toLowerCase() === (caseStatus || '').toLowerCase()
  );

  // Log the activeStep to debug step matching
  console.log("Determined activeStep index:", activeStep);

  // Determine the percentage progress based on the active step
  const percentage = activeStep >= 0 ? steps[activeStep].percentage : 0;

  // Log the calculated percentage
  console.log("Calculated progress percentage:", percentage);

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{ height: 10, borderRadius: 5, mb: 2 }}
      />
      <Typography variant="body2" align="right">
        {percentage}% Completed
      </Typography>

      {/* Stepper */}
      <Stepper
        alternativeLabel
        activeStep={activeStep >= 0 ? activeStep : 0}
        connector={<CustomConnector />}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon {...props} icon={index + 1} />
              )}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default CaseStatusStepper;