import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import websocketService from "./websocketService";
import { fetchMessageHistory } from "./messageService";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const ChatWidget = ({ userid, policeId, onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!userid || !policeId) {
      alert("Missing user or police information.");
      navigate(-1);
      return;
    }

    const loadHistory = async () => {
      setLoading(true);
      try {
        const { messages: history } = await fetchMessageHistory(userid, policeId);

        const parsedHistory = history.map((msg) => ({
          ...msg,
          isSent: msg.senderId === userid,
        }));

        setMessages(parsedHistory);
        scrollToBottom();
      } catch (error) {
        console.error("Error loading chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    websocketService.connect(userid, (message) => {
      const updatedMessage = {
        ...message,
        isSent: message.senderId === userid,
      };
      setMessages((prevMessages) => [...prevMessages, updatedMessage]);
      scrollToBottom();
    });

    return () => websocketService.close();
  }, [userid, policeId]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      const messageData = {
        action: "sendMessage",
        senderId: userid,
        receiverId: policeId,
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };

      websocketService.sendMessage(messageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, isSent: true },
      ]);
      setInputMessage("");
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: "100%",
        maxWidth: 350, // Smaller width
        height: 450, // Reduced height
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#1976d2",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Police Chat
        </Typography>
        <IconButton size="small" color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 1,
          backgroundColor: "#f9f9f9",
        }}
      >
        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: "100%" }}
          >
            <CircularProgress size={24} />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Loading messages...
            </Typography>
          </Stack>
        ) : (
          <List disablePadding>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                disableGutters
                sx={{
                  display: "flex",
                  justifyContent: msg.isSent ? "flex-end" : "flex-start",
                  marginBottom: 0.5,
                }}
              >
                {!msg.isSent && (
                  <Avatar
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      marginRight: 1,
                      width: 28,
                      height: 28, // Smaller avatar
                    }}
                  >
                    U
                  </Avatar>
                )}
                <Box
                  sx={{
                    maxWidth: "70%",
                    padding: "8px 12px", // Compact padding
                    borderRadius: 2,
                    backgroundColor: msg.isSent ? "#e3f2fd" : "white",
                    boxShadow: 1,
                    wordBreak: "break-word",
                    fontSize: "14px", // Smaller font size
                  }}
                >
                  <ListItemText
                    primary={msg.content}
                    secondary={new Date(msg.timestamp).toLocaleTimeString()}
                    primaryTypographyProps={{
                      variant: "body2",
                      color: "textPrimary",
                    }}
                    secondaryTypographyProps={{
                      variant: "caption",
                      align: "right",
                    }}
                  />
                </Box>
              </ListItem>
            ))}
            <div ref={chatContainerRef} />
          </List>
        )}
      </Box>

      {/* Input Area */}
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "8px",
          backgroundColor: "#fff",
        }}
      >
        <TextField
          fullWidth
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          size="small"
          variant="outlined"
          sx={{
            marginRight: 1,
            backgroundColor: "#f9f9f9",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          sx={{
            minWidth: 40, // Smaller button
            minHeight: 40,
          }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatWidget;
