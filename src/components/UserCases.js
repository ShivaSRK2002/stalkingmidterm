import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Chip,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Modal,
  Backdrop,
  Fade,
  TextField,
  CardActions,
  Paper,
  InputBase,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const UserCases = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [userId] = useState('user007'); // Replace with actual userId
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const userid = 'user007';
  const categoryid = 24;
  const token = 'YOUR_JWT_TOKEN_HERE'; // Replace with your actual token
  const navigate = useNavigate();

  // Fetch cases with POST request
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        const response = await axios.post(
          'https://p34mpb3lnc.execute-api.eu-west-2.amazonaws.com/User',
          { userid },
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
    if (!searchTerm) {
      setError('Please enter a complaint ID');
      return;
    }

    setLoading(true);
    setError(null);

    // Filter the cases based on the search term (complaint ID)
    const results = cases.filter((caseItem) =>
      caseItem.caseId.toString().includes(searchTerm)
    );

    // Set the filtered cases to be displayed
    setFilteredCases(results);

    setLoading(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleWithdraw = async () => {
    if (!withdrawReason.trim()) {
      alert('Please enter a reason for withdrawal.');
      return;
    }

    try {
      const url = 'https://8lhcpuuc3j.execute-api.eu-west-2.amazonaws.com/FIR';
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

  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setOpenDetailsModal(true);
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Registered Cases
      </Typography>

      {/* Search Bar */}
      <Box mb={4}>
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(); // This will filter the cases and show them on the same page
          }}
          style={{ display: 'flex', alignItems: 'center', padding: '4px 8px' }}
        >
          <InputBase
            placeholder="Search Cases"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <IconButton type="submit" color="primary">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Error Message Display */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Loading Indicator */}
      {loading && <Typography>Loading...</Typography>}

      {/* Display filtered cases */}
      <Grid container spacing={3}>
        {filteredCases.length > 0 ? (
          filteredCases.map((caseItem, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Case ID: {caseItem.caseId}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Police ID: {caseItem.policeId} | FIR Filed: {caseItem.isFirFiled}
                  </Typography>
                  <Chip
                    label={caseItem.casestatus}
                    color="info"
                    size="small"
                    style={{ marginTop: '8px' }}
                  />
                  <Box mt={2}>
                    {caseItem.iswithdrawn ? (
                      <Chip
                        label="Withdrawn"
                        color="secondary"
                        size="small"
                        style={{ marginTop: '8px' }}
                      />
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
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleViewDetails(caseItem)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => navigate('/chat', { state: { policeId: caseItem.policeId, userid } })}
                  >
                    Chat
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No cases found matching the search term.</Typography>
        )}
      </Grid>

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

      {/* Case Details Modal */}
      <Dialog open={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
        <DialogTitle>Case Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Case ID: {selectedCase?.caseId}</Typography>
          <Typography variant="body1">Police ID: {selectedCase?.policeId}</Typography>
          <Typography variant="body1">Status: {selectedCase?.casestatus}</Typography>
          <Typography variant="body1">Withdrawal Reason: {selectedCase?.reasonforwithdrawal}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsModal(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserCases;
