import React, { useState, useEffect } from "react";
import * as ChimeSDK from "amazon-chime-sdk-js";
import { useLocation } from 'react-router-dom';
import axios from "axios";

import { decryptToken } from "../authUtils";
 
function MeetingApp() {
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const [meetingId, setMeetingId] = useState(location.state?.meetingId || "");
  const [attendeeId, setAttendeeId] = useState("");
  const [isMeetingHost, setIsMeetingHost] = useState(false);
  const [meetingSession, setMeetingSession] = useState(null);
  const [videoTiles, setVideoTiles] = useState([]);
  const [notification, setNotification] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenShared, setIsScreenShared] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingStarted, setMeetingStarted] = useState(false);
  //const location = useLocation();
  //const { meetingId } = location.state || {};
 
  const requestPath = "https://ssxy1k9uq5.execute-api.ca-central-1.amazonaws.com/prod/videocall";
 
  const logger = new ChimeSDK.ConsoleLogger("Logger", ChimeSDK.LogLevel.INFO);
  const deviceController = new ChimeSDK.DefaultDeviceController(logger);
 
  const showMessage = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };
 
  useEffect(() => {
    initializeDefaultDevices();
    const encryptedToken = sessionStorage.getItem('jwt');
    if (encryptedToken) {
      const token = decryptToken(encryptedToken); // Assuming decryptToken returns the token object
      console.log(token);
      if (token && token.userName) {
        setUserName(token.userName); // Update state with the name from the token
      }
    }
  }, []);
 
  const initializeDefaultDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevice = devices.find((device) => device.kind === "audioinput");
      const videoDevice = devices.find((device) => device.kind === "videoinput");
 
      if (!audioDevice || !videoDevice) {
        throw new Error("No audio or video devices found.");
      }
 
      await deviceController.chooseAudioInputDevice(audioDevice.deviceId);
      await deviceController.chooseVideoInputDevice(videoDevice.deviceId);
 
      console.log(`Audio Device: ${audioDevice.label}`);
      console.log(`Video Device: ${videoDevice.label}`);
 
    } catch (error) {
      console.error("Error initializing devices:", error);
     
    }
  };
 
//join meeting logic
const doMeeting = async () => {
  if (!userName.trim()) {
    showMessage("Please enter your name to join the meeting.");
    return;
  }
 
  if (!meetingId.trim()) {
    showMessage("Please enter a valid meeting ID to join the meeting.");
    return;
  }
 
  try {
    const response = await fetch(requestPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "DO_MEETING",
        MEETING_ID: meetingId,
        USERNAME: userName,
      }),
    });
 
    const responseData = await response.json();
    const parsedBody = JSON.parse(responseData.body);
 
    if (!parsedBody.Info) {
      alert("Meeting not available or has ended.");
      return;
    }
 
    const meeting = parsedBody.Info.Meeting.Meeting;
    const attendee = parsedBody.Info.Attendee.Attendee;
 
    // Set meeting session configuration
    await configureMeeting(meeting, attendee);
    showMessage("Meeting session initialized.");
    setMeetingStarted(true); // Set meetingStarted to true when meeting starts
  } catch (error) {
    console.error("Error joining the meeting:", error);
    showMessage("Failed to join the meeting.");
  }
};
 
 
 
  const configureMeeting = async (meeting, attendee) => {
    try {
      const configuration = new ChimeSDK.MeetingSessionConfiguration(meeting, attendee);
      const session = new ChimeSDK.DefaultMeetingSession(configuration, logger, deviceController);
 
      setMeetingSession(session);
 
      const audioInputs = await session.audioVideo.listAudioInputDevices();
      const videoInputs = await session.audioVideo.listVideoInputDevices();
 
      if (audioInputs.length > 0) {
        await session.audioVideo.startAudioInput(audioInputs[0].deviceId);
      }
 
      if (videoInputs.length > 0) {
        await session.audioVideo.startVideoInput(videoInputs[0].deviceId);
      }
 
      addObservers(session);
 
      session.audioVideo.bindAudioElement(document.getElementById("meeting-audio"));
      session.audioVideo.start();
      session.audioVideo.startLocalVideoTile();
 
      console.log("Meeting session started.");
    } catch (error) {
      console.error("Error configuring meeting session:", error);
      showMessage("Failed to configure the meeting session.");
    }
  };
 
  let localAttendeeId = null;
 
  const addObservers = (session) => {
    session.audioVideo.realtimeSubscribeToAttendeeIdPresence((attendeeId, present) => {
      if (present && attendeeId === session.configuration.credentials.attendeeId) {
        localAttendeeId = attendeeId;
      }
    });
    const observer = {
      videoTileDidUpdate: (tileState) => {
        if (!tileState.boundAttendeeId) {
          return;
        }
   
        const videoElementId = `tile-${tileState.tileId}`;
        let videoElement = document.getElementById(videoElementId);
   
        const isScreenShare = tileState.boundAttendeeId.includes("#content");
        const isLocalScreenShare =
          isScreenShare && tileState.boundAttendeeId.startsWith(localAttendeeId);
   
        if (isLocalScreenShare) {
          return;
        }
   
        if (!videoElement) {
          const videoContainer = document.createElement("div");
          videoContainer.className = "video-container";
          videoContainer.id = `container-${tileState.tileId}`;
   
          if (isScreenShare) {
            Object.assign(videoContainer.style, styles.screenShareTile);
          } else {
            Object.assign(videoContainer.style, styles.videoContainer);
          }
   
          videoElement = document.createElement("video");
          videoElement.id = videoElementId;
          videoElement.autoplay = true;
          videoElement.muted = true;
          Object.assign(videoElement.style, styles.videoElement);
   
          videoContainer.appendChild(videoElement);
          document.getElementById("video-tiles-container").appendChild(videoContainer);
        }
   
        videoElement.style.display = "block";
        session.audioVideo.bindVideoElement(tileState.tileId, videoElement);
      },
   
      videoTileWasRemoved: (tileId) => {
        const videoContainer = document.getElementById(`container-${tileId}`);
        if (videoContainer) {
          videoContainer.remove();
        }
        setVideoTiles((prev) => prev.filter((tile) => tile.tileId !== tileId));
      },
    };
   
 
    session.audioVideo.addObserver(observer);
  };
 
 
  const toggleAudio = () => {
    if (!meetingSession) return;
 
    if (audioEnabled) {
      meetingSession.audioVideo.realtimeMuteLocalAudio();
    } else {
      meetingSession.audioVideo.realtimeUnmuteLocalAudio();
    }
 
    setAudioEnabled(!audioEnabled);
  };
 
  const toggleVideo = () => {
    if (!meetingSession) return;
 
    if (videoEnabled) {
      meetingSession.audioVideo.stopLocalVideoTile();
    } else {
      meetingSession.audioVideo.startLocalVideoTile();
    }
 
    setVideoEnabled(!videoEnabled);
  };
 
  const toggleScreenShare = async () => {
    if (!meetingSession) {
        alert("Please start or join a meeting first!");
        return;
    }
 
    try {
        if (isScreenShared) {
            await meetingSession.audioVideo.stopContentShare();
            setIsScreenShared(false);
            alert("Screen sharing stopped.");
        } else {
            await meetingSession.audioVideo.startContentShareFromScreenCapture();
            setIsScreenShared(true);
            alert("Screen sharing started.");
        }
    } catch (error) {
        console.error("Error toggling screen share:", error);
        alert("Failed to toggle screen sharing.");
    }
};
 
  // const stopMeeting = () => {
  //   if (!meetingSession) return;
 
  //   meetingSession.audioVideo.stop();
  //   setMeetingSession(null);
  //   showMessage("Meeting ended.");
  // };
  const sendPostRequest = async (requestBody) => {
    const apiUrl = "https://y5vdz78j10.execute-api.eu-west-1.amazonaws.com/dev/";
    
    // Tagged body content
    console.log("Request Body: ", JSON.stringify(requestBody));
    const stringifiedBody = JSON.stringify({
        body: JSON.stringify(requestBody)
    });
    try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: stringifiedBody
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error during POST request:", error);
      }

}
  const stopMeeting = () => {
    if (!meetingSession) return;
 
    meetingSession.audioVideo.stop();
    setMeetingSession(null);
    setAudioEnabled(false); // Turn off audio
    setVideoEnabled(false); // Turn off video
    setUserName(''); // Clear the user name
    setMeetingId(''); // Clear the meeting ID
    setMeetingLink(''); // Clear the meeting link
    showMessage("Meeting ended.");
    // window.location.reload(); // Reload the page
    setTimeout(() => {
      window.location.reload(); // Reload the page after 2 seconds
    }, 3000); // 2000 milliseconds = 2 seconds
  };
 
  const toggleRecording = async () => {
    if (!meetingSession) {
      showMessage("Please start or join a meeting first!");
      return;
    }
 
    if (isRecording) {
      try {
        const response = await fetch(requestPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "STOP_RECORDING",
            MEDIA_PIPELINE_ID: window.mediaPipelineId,
          }),
        });
        const concatenationResponse1 = await response.json();
        console.log("Stop Recording Response:", concatenationResponse1);

// Extract the `concatenationResponse` field
const concatenationResponse = concatenationResponse1.body
  ? JSON.parse(concatenationResponse1.body).concatenationResponse
  : null; // Ensure body is parsed only if it existsconsole.log(concatenationResponse1);
  console.log(concatenationResponse);
 const mediaPipelineId1=concatenationResponse.MediaConcatenationPipeline.MediaPipelineId;
 console.log(mediaPipelineId1);
        const getToken = () => sessionStorage.getItem("jwt");
        const encryptedToken = getToken();
        const token = decryptToken(encryptedToken);
        const response1 = await axios.get(
            "https://1yc0t7b8u5.execute-api.ca-central-1.amazonaws.com/dev/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );    
          const responseBody = JSON.parse(response1.data.body);
          const responseData = Array.isArray(responseBody) ? responseBody : [];
          const filteredData = responseData.filter(
            (item) => item.meeting_id === meetingId
          );
    
          if (filteredData.length === 0) {
            throw new Error("No meeting found with the given meeting ID.");
          }
    
          const { date, start_time, complaint_id: complaintId } =
            filteredData[0];
    
          // Combine date and time for `startTime`
          const startTime = `${date}T${start_time}`;
    
     

      // Step 3: Construct requestBody for the Lambda function API
      const requestBody = {
    meetingId: meetingId,          // Ensure meetingId is correctly set
    startTime: startTime,          // Ensure startTime is correctly set
    complaintId: complaintId,      // Ensure complaintId is correctly set
    mediaPipelineId1: mediaPipelineId1,  // Ensure mediaPipelineId1 is correctly set
};
          await sendPostRequest(requestBody);
        if (response.ok) {
          showMessage("Recording stopped successfully!");
          console.log("Media Pipeline ID stopped:", window.mediaPipelineId);
          setIsRecording(false);
          
          window.mediaPipelineId = null;
        } else {
          showMessage(`Failed to stop recording: ${concatenationResponse.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error stopping the recording:", error);
        showMessage("Failed to stop recording.");
      }
    } else {
      try {
        const response = await fetch(requestPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "START_RECORDING",
            MEETING_ID: meetingId,
            recordingConfiguration: {
              ArtifactsConfiguration: {
                Audio: { MuxType: "AudioWithActiveSpeakerVideo" },
                Content: { MuxType: "ContentOnly", State: "Enabled" },
                Video: { MuxType: "VideoOnly", State: "Enabled" },
              },
            },
          }),
        });
 
        const data = await response.json();
        console.log("Start Recording Full Response:", data);
 
        const parsedBody = JSON.parse(data.body);
        console.log("Parsed Recording Response Body:", parsedBody);
 
        const mediaPipelineId = parsedBody?.recordingResponse?.MediaCapturePipeline?.MediaPipelineId;
        console.log("Received Media Pipeline ID:", mediaPipelineId);
 
        if (mediaPipelineId) {
          setIsRecording(true);
          window.mediaPipelineId = mediaPipelineId;
          showMessage("Recording started!");
        } else {
          showMessage("Failed to start recording. No MediaPipelineId received.");
        }
      } catch (error) {
        console.error("Error starting the recording:", error);
        showMessage("Failed to start recording.");
      }
    }
  };
 
 
return (
  <div className="App" style={styles.app}>
 
    <h1 style={styles.title}></h1>
 
      {/* Render username and meeting ID input only if meeting has not started */}
      {!meetingStarted && (
      <>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Your Name:</label>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Meeting ID (optional):</label>
          <input
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={doMeeting} style={styles.button} disabled={!userName.trim()}>
          Join Meeting
        </button>
      </>
    )}
 
   
     
    {notification && <p style={styles.notification}>{notification}</p>}
 
    {meetingLink && (
      <div style={styles.linkContainer}>
        <p style={styles.meetingInfo}>Meeting ID: {meetingId}</p>
        <p style={styles.meetingLink}>
          Meeting Link: <a href={meetingLink}>{meetingLink}</a>
        </p>
      </div>
    )}
     {/* Render controls and video tiles only after meeting has started */}
     {meetingStarted && (
      <>
        <div style={styles.controlsContainer}>
          <div style={styles.controlRow}>
            <div style={styles.controlButton}>
              <button
                onClick={toggleAudio}
                style={styles.transparentButton}
                title={audioEnabled ? "Mute Audio" : "Unmute Audio"}
              >
                <i className={`fa ${audioEnabled ? "fa-volume-up" : "fa-volume-mute"}`} />
              </button>
              <span style={styles.iconLabel}>Mic</span>
            </div>
 
            <div style={styles.controlButton}>
              <button
                onClick={toggleVideo}
                style={styles.transparentButton}
                title={videoEnabled ? "Turn Off Video" : "Turn On Video"}
              >
                <i className={`fa ${videoEnabled ? "fa-video" : "fa-video-slash"}`} />
              </button>
              <span style={styles.iconLabel}>Camera</span>
            </div>
 
            <div style={styles.controlButton}>
              <button
                onClick={toggleScreenShare}
                style={{
                  ...styles.transparentButton,
                  color: isScreenShared ? "red" : "inherit",
                }}
                title={isScreenShared ? "Stop Screen Share" : "Start Screen Share"}
              >
                <i
                  className={`fa-solid ${
                    isScreenShared ? "fa-circle-xmark" : "fa-arrow-up-from-bracket"
                  }`}
                />
              </button>
              <span style={styles.iconLabel}>Share</span>
            </div>
 
            <div style={styles.controlButton}>
              <button
                onClick={toggleRecording}
                style={{
                  ...styles.transparentButton,
                  color: isRecording ? "red" : "inherit",
                }}
                title={isRecording ? "Stop Recording" : "Start Recording"}
              >
                <i className="fa-solid fa-record-vinyl" />
              </button>
              <span style={styles.iconLabel}>Record</span>
            </div>
 
            <div style={styles.controlButton}>
              <button
                onClick={stopMeeting}
                style={styles.transparentButton}
                title="End Meeting"
              >
                <i className="fa fa-phone-slash" />
              </button>
              <span style={styles.iconLabel}>End Meeting</span>
            </div>
          </div>
        </div>
 
        <div id="video-tiles-container" style={styles.videoTilesContainer}></div>
      </>
    )}
 
    <div id="video-tiles-container" style={styles.videoTilesContainer}></div>
    <audio id="meeting-audio" autoPlay />
 
  </div>
);
}
const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2c3e50",
    width: "100%",
    padding: "20px 0",
  },
  logo: {
    width: "80px",
    height: "80px",
    marginRight: "15px",
  },
  logoText: {
    color: "#ecf0f1",
    fontSize: "24px",
    fontWeight: "bold",
  },
  title: {
    fontSize: "36px",
    margin: "20px 0",
    color: "#2c3e50",
  },
  inputGroup: {
    marginBottom: "15px",
    textAlign: "left",
    width: "300px",
  },
  label: {
    fontSize: "16px",
    color: "#2c3e50",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  checkbox: {
    marginTop: "10px",
  },
  button: {
    backgroundColor: "#3498db",
    color: "#fff",
    fontSize: "18px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  controlsContainer: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  controlRow: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    alignItems: "center",
  },
  transparentButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#2c3e50",
    fontSize: "24px",
    width: "60px",
    height: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  endButton: {
    backgroundColor: "red",
    color: "#fff",
    fontSize: "14px",
    width: "30px",
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  controlButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80px", // Ensures consistent height for all buttons
  },
  iconLabel: {
    fontSize: "12px",
    color: "#2c3e50",
    marginTop: "5px",
    textAlign: "center",
  },
 
  videoTilesContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  },
  videoContainer: {
    width: "400px",
    backgroundColor: "#000",
    position: "relative",
    border: "1px solid #ccc",
    borderRadius: "5px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
 
  },
  videoElement: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
 
  screenShareTile: {
    width: "900px",
    height: "600px",
    backgroundColor: "#000",
    position: "relative",
    border: "2px solid #3498db",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexBasis: "100%",
    order: -1,
  },
 
};
 
export default MeetingApp;