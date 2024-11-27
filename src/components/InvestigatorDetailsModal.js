import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import axios from 'axios';

const InvestigatorDetailsModal = ({ complaint, openInvestigatorModal, setOpenInvestigatorModal, token }) => {
  const [investigator, setInvestigator] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);


  console.log(complaint);

  useEffect(() => {
    if (complaint) {
      setSelectedComplaint(complaint);
    }
  }, [complaint]);

  const handleCloseModals = () => {
    setOpenInvestigatorModal(false);
  };

  const handleOpenInvestigatorDetails = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_GET_ALL_USER_DATA, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const investigators = JSON.parse(response.data.body);
      const userName = complaint.policeId;
      console.log(userName);

      const investigatorDetails = investigators.filter(
        (investigator) => investigator.personid === complaint.policeId
      );      
console.log(investigatorDetails)
      if (investigatorDetails) {
        setInvestigator(investigatorDetails);
      } else {
        console.error('Investigator not found.');
        setInvestigator(null);
      }
    } catch (error) {
      console.error('Failed to fetch investigator details:', error);
      setInvestigator(null);
    }
  };

  // Open the modal when the component is mounted and when a complaint is passed
  useEffect(() => {
    if (complaint && openInvestigatorModal) {
      handleOpenInvestigatorDetails();
    }
    
  }, [complaint, openInvestigatorModal]);

  return (
    <Modal open={openInvestigatorModal} onClose={handleCloseModals}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '60%' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {selectedComplaint && (
          <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                textAlign: 'center',
                mb: 3,
              }}
            >
              Investigator Details
            </Typography>

            {investigator ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.primary' }}>
                  <strong>Name:</strong> {investigator[0].name}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.primary' }}>
                  <strong>Contact:</strong> {investigator[0].phone_number}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.primary' }}>
                  <strong>Email:</strong> {investigator[0].email}
                </Typography>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleCloseModals}
                  sx={{
                    width: '100%',
                    py: 1,
                    fontWeight: 'bold',
                  }}
                >
                  Close
                </Button>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', mt: 3, fontStyle: 'arial' }}>
                Loading investigator details...
              </Typography>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default InvestigatorDetailsModal;
