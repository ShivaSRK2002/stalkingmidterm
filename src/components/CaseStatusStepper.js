import React from 'react';
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

// Custom icon for each step
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed ? theme.palette.success.main : theme.palette.grey[300],
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
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
    <CustomStepIconRoot ownerState={{ completed, active }}>
      {icons[String(icon)]}
    </CustomStepIconRoot>
  );
}

// Case status steps
const steps = [
  'Complaint Registered',
  'Verification in Progress',
  'Investigation Ongoing',
  'Action Taken',
  'Case Closed',
];

export default function CaseStatusStepper({ activeStep = 0 }) {
  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<CustomConnector />}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
