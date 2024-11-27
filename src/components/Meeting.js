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
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

const ScheduledMeeting = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [videoIdMap, setVideoIdMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encryptedToken = sessionStorage.getItem("jwt");
        const userName = sessionStorage.getItem("userName");

        if (!encryptedToken || !userName) {
          throw new Error("Missing authorization credentials in session storage.");
        }

        const token = decryptToken(encryptedToken);
        if (!token) throw new Error("Failed to decrypt the authorization token.");

        const response = await axios.get(
          "https://1yc0t7b8u5.execute-api.ca-central-1.amazonaws.com/dev/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const responseBody = JSON.parse(response.data.body);
        const filteredData = responseBody.filter(
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
  }, [caseId]);

  const handleDownloadRecording = async (videoId) => {
  console.log("Downloading recording for video ID:", videoId);

  const apiUrl = "https://mi7i5mp6l5.execute-api.ca-central-1.amazonaws.com/prod/videoFetch";
  
  const requestBody = {
    body: {
      concatenationId: videoId,
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
console.log(response);
    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const data = await response.json();
    const url = JSON.parse(data.body);

    console.log(url.files[0].url);

    // console.log(files);
    //  console.log(files);

    const videoUrl = url.files[0].url;

    if (videoUrl) {
      console.log("Video URL:", videoUrl);

      // Automatically start download or navigate to the URL
      window.open(videoUrl, "_blank");
    } else {
      console.error("Video URL not found in the API response.");
    }
  } catch (error) {
    console.error("Error fetching video URL:", error);
  }
};

  const fetchVideoId = async (meetingId, complaintId) => {
    try {
      const requestBody = {
        meetingId,
        complaintId,
      };

      const response = await fetch(
        "https://ft2qfsweb3.execute-api.eu-west-1.amazonaws.com/dev",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: JSON.stringify(requestBody) }),
        }
      );

      const data = await response.json();
      console.log(data.body);
      const parsedData = JSON.parse(data.body);

  // Access the `videoid` field
  const videoId = parsedData.item?.videoid;
      return videoId || null;
    } catch (error) {
      console.error("Error fetching video ID:", error);
      return null;
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const handleJoinMeeting = (meetingId) => {
    navigate(`/joinmeeting/${meetingId}`, { state: { meetingId } });
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      {loading && (
        <Box
          sx={{
            display: "flex",
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
      )}

      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "#2c3e50", textAlign: "center" }}
      >
        Scheduled Meetings
      </Typography>

      {error ? (
        <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 3 }}>
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
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => {
                const now = dayjs();
                const meetingStart = dayjs(`${row.date}T${row.start_time}`);
                const meetingEnd = dayjs(`${row.date}T${row.end_time}`);
                const videoId = videoIdMap[row.meeting_id];

                let actionButtonLabel;
                let actionButtonDisabled = false;

                if (now.isBefore(meetingStart)) {
                  actionButtonLabel = "Yet to Start";
                  actionButtonDisabled = true;
                } else if (now.isAfter(meetingEnd)) {
                  actionButtonLabel = "Ended";
                  actionButtonDisabled = true;

                  if (!videoIdMap[row.meeting_id]) {
                    fetchVideoId(row.meeting_id, row.complaint_id).then((videoId) => {
                      if (videoId) {
                        setVideoIdMap((prev) => ({ ...prev, [row.meeting_id]: videoId }));
                      }
                    });
                  }
                } else {
                  actionButtonLabel = "Join Meeting";
                }

                return (
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
                        onClick={() =>
                          actionButtonLabel === "Join Meeting"
                            ? handleJoinMeeting(row.meeting_id)
                            : null
                        }
                        disabled={actionButtonDisabled}
                      >
                        {actionButtonLabel}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDownloadRecording(videoId)}
                        disabled={!videoId}
                        sx={{ ml: 2 }}
                      >
                        Recordings
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Meeting ID copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScheduledMeeting;
