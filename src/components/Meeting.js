import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { decryptToken } from "../authUtils";
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation
import {  useParams } from 'react-router-dom';

const ScheduledMeeting = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate(); // Hook to handle navigation
  const { caseId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encryptedToken = sessionStorage.getItem("jwt");
        const userName = sessionStorage.getItem("userName");
 
        if (!encryptedToken) {
          throw new Error("Authorization token is missing in session storage.");
        }
        if (!userName) {
          throw new Error("User name is missing in session storage.");
        }
 
        const token = decryptToken(encryptedToken);
        if (!token) {
          throw new Error("Failed to decrypt the authorization token.");
        }
 
        const response = await axios.get(
          "https://1yc0t7b8u5.execute-api.ca-central-1.amazonaws.com/dev/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
 
        const responseBody = JSON.parse(response.data.body);
        const responseData = Array.isArray(responseBody) ? responseBody : [];
        const filteredData = responseData.filter(
          (item) => item.complaint_id === caseId
        );
 
        setData(filteredData);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, []);
 
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };
 
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
 
  const handleJoinMeeting = (meetingId) => {
    // Navigate to the new page, passing the meetingId as state
    navigate(`/joinmeeting/${meetingId}`, { state: { meetingId } });
  };
 
  return (
    <>
      <Box
        sx={{
          padding: 3,
          backgroundColor: "#f4f4f4",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: loading ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
 
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold", color: "#2c3e50", textAlign: "center" }}
        >
          Scheduled Meetings
        </Typography>
 
        {error ? (
          <Typography
            variant="h6"
            color="error"
            sx={{ textAlign: "center", mt: 3 }}
          >
            {error}
          </Typography>
        ) : data.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><b>Sender Name</b></TableCell>
                  <TableCell align="center"><b>Meeting ID</b></TableCell>
                  <TableCell align="center"><b>Date</b></TableCell>
                  <TableCell align="center"><b>Start Time</b></TableCell>
                  <TableCell align="center"><b>End Time</b></TableCell>
                  <TableCell align="center"><b>Receiver Name</b></TableCell>
                  <TableCell align="center"><b>Receiver Email</b></TableCell>
                  <TableCell align="center"><b>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{row.sender_name}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Click to copy">
                        <span
                          style={{ cursor: "pointer", color: "#007BFF" }}
                          onClick={() => handleCopyToClipboard(row.meeting_id)}
                        >
                          {row.meeting_id}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">{row.date}</TableCell>
                    <TableCell align="center">{row.start_time}</TableCell>
                    <TableCell align="center">{row.end_time}</TableCell>
                    <TableCell align="center">{row.receiver_name}</TableCell>
                    <TableCell align="center">{row.receiver_email}</TableCell>
                    <TableCell align="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleJoinMeeting(row.meeting_id)}  // Navigate on click
                      >
                        Join Meeting
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography
            variant="body1"
            sx={{ color: "#2c3e50", mt: 2, textAlign: "center" }}
          >
            No records found for the current user.
          </Typography>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          Meeting ID copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};
 
export default ScheduledMeeting;