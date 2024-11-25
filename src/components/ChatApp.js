import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import websocketService from "./websocketService";
import { fetchMessageHistory } from "./messageService";

const ChatWidget = ({userid , policeId , onClose}) => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { userid, policeId } = location.state || {};

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
        maxWidth: "400px",
        height: "500px",
        backgroundColor: "#ECE5DD", // WhatsApp's background color
        borderRadius: "20px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 15px",
          background: "linear-gradient(90deg, #075E54, #128C7E)", // WhatsApp green gradient
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "20px 20px 0 0",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Chat</span>
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() => onClose()}
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
          backgroundColor: "#ECE5DD", // Light beige background
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
                borderRadius: "15px",
                backgroundColor: msg.isSent ? "#DCF8C6" : "#FFFFFF", // WhatsApp bubble colors
                color: "#000",
                wordWrap: "break-word",
                fontSize: "14px",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div>{msg.content}</div>
              <div
                style={{
                  fontSize: "0.75em",
                  color: "#888",
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
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #ddd",
          borderRadius: "0 0 20px 20px",
        }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: "10px",
            border: "none",
            borderRadius: "20px",
            outline: "none",
            fontSize: "14px",
            marginRight: "10px",
            backgroundColor: "#F0F0F0", // Lighter input box background
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px 15px",
            backgroundColor: "#25D366", // WhatsApp green send button
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
