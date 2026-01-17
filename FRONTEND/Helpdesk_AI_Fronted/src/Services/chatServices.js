// src/Services/chatServices.js
import axios from "axios";

const baseURL = "http://localhost:8090";

export const sendMessagesToServer = async (message, conversationId) => {
  const payload = {
    messages: {
      role: "user",
      content: message
    }
  };

  console.log("Conversation ID:", conversationId);
  const response = await axios.post(`${baseURL}/message`, payload, {
    headers: {
      "Content-Type": "application/json",
      "X-Conversation-Id": conversationId
    }
  });

  return response.data;
};
