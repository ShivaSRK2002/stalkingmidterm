import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import websocketService from "./websocketService";
import { fetchMessageHistory } from "./messageService";

const ChatWidget = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userid, policeId } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!userid || !policeId) {
      alert("Missing user or police information.");
      navigate(-1);
      return;
    }

    const loadHistory = async () => {
      const { messages: history, lastEvaluatedKey: newKey } = await fetchMessageHistory(
        userid,
        policeId,
        lastEvaluatedKey
      );

      const parsedHistory = history.map((msg) => ({
        ...msg,
        isSent: msg.senderId === userid,
      }));

      setMessages((prevMessages) => [...parsedHistory, ...prevMessages]);
      setLastEvaluatedKey(newKey);
      scrollToBottom();
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
        read: false,
      };

      websocketService.sendMessage(messageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, isSent: true, read: false },
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
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "100%",
        maxWidth: "350px",
        height: "480px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 15px",
          backgroundColor: "#007bff",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Chat with Police</span>
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() => navigate(-1)}
        >
          ✖
        </button>
      </div>

      {/* Chat Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.isSent ? "flex-end" : "flex-start",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "10px",
                borderRadius: "12px",
                backgroundColor: msg.isSent ? "#007bff" : "#e0e0e0",
                color: msg.isSent ? "#fff" : "#000",
                wordWrap: "break-word",
                fontSize: "14px",
              }}
            >
              <div>{msg.content}</div>
              <div
                style={{
                  fontSize: "0.75em",
                  color: msg.isSent ? "#d1e7ff" : "#555",
                  textAlign: "right",
                  marginTop: "5px",
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatContainerRef} />
      </div>

      {/* Input Box */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ccc",
          backgroundColor: "#fff",
        }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
