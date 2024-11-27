import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Table,
  TableBody,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Typography,
  Chip,
  Container,
  Grid,
  Card,
  CardContent,
  Modal,
  Backdrop,
  Fade,
  TextField,
  CardActions,
  Avatar,
  InputBase,
  IconButton,

  Pagination,
} from '@mui/material';

import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import BadgeIcon from '@mui/icons-material/Badge';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import InvestigatorDetailsModal from './InvestigatorDetailsModal';
import ChatWidget from "./ChatApp";
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { decryptToken } from "../authUtils";
import CaseStatusStepper from './CaseStatusStepper';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import { generateFIRCopy } from './generateFIRCopy';
import DownloadIcon from '@mui/icons-material/Download';
import CaseStatusDynamic from './InvestigatorDetailsModal';

const UserCases = () => {
  const [cases, setCases] = useState([]);
  const userid=sessionStorage.getItem("userName")
  const [open, setOpen] = useState(false); // Modal state
  const [filteredCases, setFilteredCases] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const casesPerPage = 6; // Number of cases per page
  const jwtToken = sessionStorage.getItem('jwt');
  const token = decryptToken(jwtToken);

  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle the chat
  const [selectedPoliceId, setSelectedPoliceId] = useState(null);

  const [openInvestigatorModal, setOpenInvestigatorModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleOpenModal = (complaint) => {
    setSelectedComplaint(complaint); // Set the selected complaint
    setOpenInvestigatorModal(true); // Open the modal
  };

  const [evidences, setEvidences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvidences = async () => {
      const encryptedToken = sessionStorage.getItem('jwt');
      if (!encryptedToken) {
        console.error('Authorization token not found');
        return;
      }

      const token = decryptToken(encryptedToken);
      if (selectedCase) {
        setIsLoading(true); // Start loading
        try {
          const payload = {
            body: {
              folderName: `${selectedCase.complaintid}`,
            },
          };
          const response = await axios.post(
            process.env.REACT_APP_S3_GET_FILE_API,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          const responseBody = JSON.parse(response.data.body);
          const files = responseBody.files || [];
          setEvidences(files); // Update evidence state
        } catch (error) {
          console.error('Error fetching evidences:', error);
          setEvidences([]);
        } finally {
          setIsLoading(false); // Stop loading
        }
      }
    };

    if (selectedCase) fetchEvidences(); // Trigger evidence fetching when a case is selected
  }, [selectedCase]);

  const navigate = useNavigate();
  //const token ="eyJraWQiOiJPMGgyenNCR2lacnlSTzBkNklqdDI1SzdteldpREJKejdhK0lBV2R6XC9yVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3OGYxZDNmMC05MGMxLTcwOTMtOWYxZi05OGNlNzc0ZjY0ZTgiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYmlydGhkYXRlIjoiMjAwMi0xMC0yMCIsImdlbmRlciI6Im1hbGUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9RUHVKZk9hRmMiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJjb2duaXRvOnVzZXJuYW1lIjoiNzhmMWQzZjAtOTBjMS03MDkzLTlmMWYtOThjZTc3NGY2NGU4Iiwib3JpZ2luX2p0aSI6IjU1MmFkN2E3LTYwMjctNDE5OC04MTQ5LTczODUxZDRmMjFkOSIsImF1ZCI6IjJtbnYxN3ZvYTdlOHE2YmFubGcwajBxdGgiLCJldmVudF9pZCI6ImM0MzlkOGE3LTVhZTctNGU0OS1iNDAwLTQxNDQ0YTkxNjMzZiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzMyNDIyODMzLCJuYW1lIjoiU2hpdmEgUmFtYWtyaXNobmFuIiwicGhvbmVfbnVtYmVyIjoiKzkxODgyNTc5MjI2NSIsImV4cCI6MTczMjUwOTIzMywiY3VzdG9tOnJvbGUiOiJ1c2VyIiwiaWF0IjoxNzMyNDIyODMzLCJqdGkiOiI4MWExMDJlNi1iMjA2LTQxNmEtYjg5MS1kYWEzY2ZiMWEyOTIiLCJlbWFpbCI6InNoaXZhcmFtYWtyc2hubkBnbWFpbC5jb20ifQ.q4RJ4Ri0zU34Qbb9yGGz-F3tvozRQI1kUSKbxnWoMxtNyl6GuT1vzrbHrcgSyo8PsZLpusGeZtBKTAbEICwvr6ZBGpNyQsoEMMZx1t0P6Z5i3AD6at9x8OOBpbGB1bvo9uKw0PLUtrz0B81qc13jngXVbH-EP8g1uIBZQD7XBAVLFwFtyRNegsxgafeY8-vTmAXm6nf_owp2FCjN0M6uWMxE1Q6rmqhMvj7gdhNvB3K_Jrh6umeP8A5uTXDzjOkqh_TPmftrC6jGheGYMSJ9epesMe4dfL03lKVcm52DPubdXVsbBIeIGCjCmQrqMqrS3c_3Lpy22p-O6FSDkiAP_g"; // Replace with actual token
  const categoryid = 24; // Replace with actual category ID

  // Fetch cases with POST request
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        const response = await axios.post(
          'https://p34mpb3lnc.execute-api.eu-west-2.amazonaws.com/User',
          { userid: userid },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const parsedBody = JSON.parse(response.data.body);
        const allCases = Array.isArray(parsedBody.items) ? parsedBody.items : [];
        const userCases = allCases
          .filter((caseItem) => caseItem.categoryid === categoryid)
          .map((caseItem) => ({
            caseId: caseItem.complaintid || 'N/A',
            policeId: caseItem.policeid || 'N/A',
            isFirFiled: caseItem.isfirfiled ? 'Yes' : 'No',
            casestatus: caseItem.casestatus || 'Unknown',
            individualdetails: JSON.parse(caseItem.individualdetails || '{}'),
            reasonforwithdrawal: caseItem.reasonforwithdrawal || '',
            iswithdrawn: caseItem.iswithdrawn || 0,
          }));

        setCases(userCases);
        setFilteredCases(userCases); // Initially set filtered cases to all cases
      } catch (err) {
        setError('Failed to fetch cases. Please try again.');
      } finally {
        setLoading(false); // Set loading to false when the fetch is complete
      }
    };

    fetchCases();
  }, [token, userid, categoryid]);

  const handleSearch = () => {
    // If the search term is empty, show all cases
    if (!searchTerm.trim()) {
      setFilteredCases(cases); // Show all cases
      return;
    }

    setLoading(true);
    setError(null);

    // Filter the cases based on the search term (complaint ID), making it case-insensitive
    const results = cases.filter((caseItem) =>
      caseItem.caseId.toString().startsWith(searchTerm.trim())
    );

    // Set the filtered cases to be displayed
    setFilteredCases(results);

    setLoading(false);
  };
  const handleChatOpen = (policeId) => {
    setSelectedPoliceId(policeId);
    setIsChatOpen(true); // Open the chat widget
  };



  const handleChatClose = () => {
    setIsChatOpen(false); // Close the chat widget
    setSelectedPoliceId(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    handleSearch(); // Trigger search immediately on change
  };
  const handleScheduleMeeting = (caseId) => {
    navigate(`/meetings/${caseId}`);
  };

  const handleWithdraw = async () => {
    if (!withdrawReason.trim()) {
      alert('Please enter a reason for withdrawal.');
      return;
    }

    try {
      const url = 'https://p34mpb3lnc.execute-api.eu-west-2.amazonaws.com/User';
      const payload = {
        complaintid: selectedCase.caseId,
        categoryid,
        userid,
        policeid: selectedCase.policeId,
        reasonforwithdrawal: withdrawReason,
        iswithdrawalaccepted: 0,
        iswithdrawn: 1,
        iscomplaintaccepted: 0,
        isfake: 0,
        casestatus: selectedCase.casestatus,
        isfirfiled: selectedCase.isFirFiled === 'Yes' ? 1 : 0,
        individualdetails: JSON.stringify(selectedCase.individualdetails),
      };

      const response = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert('Complaint withdrawal successful.');
        setCases((prevCases) =>
          prevCases.map((caseItem) =>
            caseItem.caseId === selectedCase.caseId
              ? { ...caseItem, reasonforwithdrawal: withdrawReason, iswithdrawn: 1 }
              : caseItem
          )
        );
        setOpenModal(false);
      } else {
        alert('Failed to withdraw the complaint.');
      }
    } catch (err) {
      alert('An error occurred while withdrawing the complaint. Please try again.');
    }
  };


  const handleStatusDetails = (caseItem) => {
    setSelectedCase(caseItem); // Set the selected case data
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCase(null); // Close the modal
  };
  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setOpenDetailsModal(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const renderWitnesses = (witnesses) => {
    if (!witnesses || Object.keys(witnesses).length === 0) return null;
    return (
      <Box>
        <Typography variant="body1" fontWeight="bold" gutterBottom>
          Witnesses:
        </Typography>
        {Object.entries(witnesses).map(([key, value], index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Name:</strong> {value.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Contact:</strong> {value.contact}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const renderDetailsSection = (title, details) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      {details.map(({ label, value }, index) => (
        value && (
          <Typography key={index} variant="body2" gutterBottom>
            <strong>{label}:</strong> {value}
          </Typography>
        )
      ))}
    </Box>
  );

  // Calculate the index of the first and last case to display on the current page
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;

  // Slice the cases to show only the ones on the current page
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Registered Cases
      </Typography>

      {/* Search Bar */}
      <Box mb={4}>
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <InputBase
            placeholder="Search cases by ID, police ID, or status..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flex: 1, px: 1 }}
          />
          <IconButton type="submit" color="primary">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
          <CircularProgress color="primary" />
        </Box>
      )}
      {/* Display Cases */}
      <Grid container spacing={4}>
        {currentCases.length > 0 ? (
          currentCases.map((caseItem, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: caseItem.casestatus === 'Active' ? 'success.main' : 'info.main',
                        mr: 2,
                      }}
                    >
                      {caseItem.casestatus.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Complaint ID:{caseItem.caseId}
                      </Typography>
                      {/* <Typography variant="body2" color="textSecondary">
                        Investigator ID: {caseItem.policeId}
                      </Typography> */}
                    </Box>
                  </Box>
                  <Box display="flex" gap={1}>
                    {/* Tooltip Button */}
                    <Tooltip title="Chat with Officer">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleChatOpen(caseItem.policeId, userid)}
                      >
                        <ChatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Video Call">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleScheduleMeeting(caseItem.caseId)}
                      >
                        <VideoCallIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Card Content */}
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Details Button */}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<InfoIcon />}
                    onClick={() => handleViewDetails(caseItem)}
                  >
                    Details
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => generateFIRCopy(caseItem)}
                  >
                    Download FIR
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<BadgeIcon />}
                    onClick={() => handleOpenModal(caseItem)} // Opens the modal when clicked
                  >
                    Investigator
                  </Button>

                  {/* InvestigatorDetailsModal */}
                  {openInvestigatorModal && selectedComplaint && (
                    <InvestigatorDetailsModal
                      complaint={selectedComplaint} // Pass only the selected complaint
                      openInvestigatorModal={openInvestigatorModal} // Modal visibility state
                      setOpenInvestigatorModal={setOpenInvestigatorModal} // Function to close modal
                      token={token} // Authorization token
                    />
                  )}

                  {/* Status Button */}
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    startIcon={<AssessmentIcon />}
                    onClick={() => handleStatusDetails(caseItem)}
                  >
                    Status
                  </Button>



                  {/* Modal */}
                  <Modal
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        minHeight: 300,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 5,
                        overflow: 'auto',
                      }}
                    >
                      {selectedCase ? (
                        <>
                          {/* Pass only the selected case to the Stepper */}
                          {console.log("Rendering CaseStatusStepper with selectedCase:", selectedCase)}
                          <CaseStatusStepper caseStatus={selectedCase.casestatus} />
                        </>
                      ) : (
                        <Typography variant="body1">Loading case details...</Typography>
                      )}
                    </Box>
                  </Modal>





                  {/* Withdrawn or Withdraw Button */}
                  {caseItem.iswithdrawn ? (
                    <Chip label="Withdrawn" color="error" size="small" sx={{ fontWeight: 500 }} />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => {
                        setSelectedCase(caseItem);
                        setOpenModal(true);
                      }}
                    >
                      Withdraw
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))

        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" color="textSecondary" textAlign="center">

            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Conditionally Render ChatWidget */}
      {isChatOpen && selectedPoliceId && (
        <div style={{ zIndex: 1000 }}>
          <ChatWidget
            userid={userid}
            policeId={selectedPoliceId}
            onClose={handleChatClose} // Pass a close handler
          />
        </div>
      )}

      {/* Pagination */}
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredCases.length / casesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Modals */}
      {/* Withdrawal Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box style={{ width: 400, margin: '10% auto', backgroundColor: 'white', padding: '20px' }}>
            <Typography variant="h6" gutterBottom>Withdraw Complaint</Typography>
            <TextField
              fullWidth
              label="Reason for Withdrawal"
              variant="outlined"
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              multiline
              rows={4}
            />
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button
                color="primary"
                onClick={handleWithdraw}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>



      {/* details */}
      <Dialog open={openDetailsModal} onClose={() => setOpenDetailsModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div" fontWeight="bold">
            Complaint Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedCase && (
            <Paper variant="outlined" sx={{ padding: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
              {/* Incident Details */}
              {renderDetailsSection('Incident Details', [
                { label: 'Incident Date', value: selectedCase.individualdetails?.incident_date },
                { label: 'Incident Time', value: selectedCase.individualdetails?.incidentTime },
                { label: 'Incident Location', value: selectedCase.individualdetails?.location },
                { label: 'Nature of Stalking', value: selectedCase.individualdetails?.natureOfStalking },
                { label: 'Description', value: selectedCase.individualdetails?.incident_description },
              ])}

              <Divider sx={{ my: 2 }} />

              {/* Personal Information */}
              {renderDetailsSection('Personal Information', [
                { label: 'Full Name', value: selectedCase.individualdetails?.location },
                { label: 'Email Address', value: selectedCase.individualdetails?.victim_email },
                { label: 'Phone Number', value: selectedCase.individualdetails?.phoneNumber },
                { label: 'Address', value: selectedCase.individualdetails?.address },
                { label: 'Gender', value: selectedCase.individualdetails?.gender },
                {
                  label: 'Identification Proof',
                  value: `${selectedCase.individualdetails?.identificationProofType || ''} - ${selectedCase.individualdetails?.identificationProofNumber || ''
                    }`,
                },
              ])}

              <Divider sx={{ my: 2 }} />

              {/* Accused Details */}
              {renderDetailsSection('Accused Details', [
                { label: 'Name', value: selectedCase.individualdetails?.accusedName },
                { label: 'Location', value: selectedCase.individualdetails?.accusedLocation },
                { label: 'Relation', value: selectedCase.individualdetails?.relation },
                { label: 'Gender', value: selectedCase.individualdetails?.accusedgender },
              ])}

              <Divider sx={{ my: 2 }} />

              {/* Witnesses */}
              {renderWitnesses(selectedCase.individualdetails?.witnesses)}
              <Divider sx={{ my: 2 }} />

              {/* Evidence Section */}
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#2c3e50', mt: 3, mb: 2, textDecoration: 'underline' }}>
                Evidence Details
              </Typography>
              {isLoading ? (
                <Typography sx={{ color: '#7f8c8d', mb: 2 }}>
                  Loading evidence...
                </Typography>
              ) : evidences.length > 0 ? (
                <ul style={{ paddingLeft: '20px', color: '#7f8c8d' }}>
                  {evidences.map((evidence, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                      {evidence.fileName.endsWith('.pdf') ? (
                        <PictureAsPdfIcon style={{ marginRight: '8px', color: '#e74c3c' }} />
                      ) : (
                        <ImageIcon style={{ marginRight: '8px', color: '#3498db' }} />
                      )}
                      <a
                        href={evidence.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#3498db', textDecoration: 'none' }}
                      >
                        {evidence.fileName || `Evidence ${index + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography sx={{ color: '#e74c3c', mb: 2 }}>
                  No evidence provided for this case.
                </Typography>
              )}
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsModal(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>

  );
};

export default UserCases;
