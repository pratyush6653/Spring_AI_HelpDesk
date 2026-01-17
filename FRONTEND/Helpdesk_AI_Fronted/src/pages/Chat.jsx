// src/pages/Chat.jsx
import React, { useEffect, useRef, useState } from "react";
import { Search, MoreVertical, Send, Plus, LogOut, Bot, X } from "lucide-react";
import { useNavigate } from "react-router";
import { sendMessagesToServer } from "../Services/chatServices";
import "./Chat.css";

const CHATS = [
  { id: 1, name: "Spring boot..", lastMessage: "How to create rest api in spring boot?", unread: 2, initials: "SB" },
  { id: 2, name: "React helpers", lastMessage: "Can you suggest a hook for this?", unread: 0, initials: "RH" },
  { id: 3, name: "Database team", lastMessage: "Schema migration planned for tonight.", unread: 1, initials: "DB" },
];

function Chat() {
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEndChatConfirm, setShowEndChatConfirm] = useState(false);
  const [chatEnded, setChatEnded] = useState(true); // Start with chat ended state

  const endRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize conversation when component mounts
  useEffect(() => {
    if (!conversationId) {
      startNewConversation();
    }
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Start a new conversation
  const startNewConversation = () => {
    const newId = "conv-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    console.log("Starting new conversation with ID:", newId);
    
    setConversationId(newId);
    setChatEnded(false);
    setMessages([
      { 
        id: 1, 
        author: "bot", 
        text: "Hello! I'm your AI Help Desk Assistant. How can I help you today?", 
        at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      },
    ]);
    setShowEndChatConfirm(false);
    setDraft("");
    
    // Focus input after a short delay
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleEndChat = () => {
    if (conversationId && !chatEnded) {
      setShowEndChatConfirm(true);
    }
  };

  const confirmEndChat = () => {
    // Add a final message from the bot
    const finalMessage = {
      id: messages.length + 1,
      author: "bot",
      text: "Thank you for chatting with me. This conversation has been ended. Click 'New Chat' button to start a new conversation.",
      at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, finalMessage]);
    setChatEnded(true);
    setShowEndChatConfirm(false);
    setDraft("");
    setConversationId(""); // Clear conversation ID
  };

  const cancelEndChat = () => {
    setShowEndChatConfirm(false);
  };

  const handleSendMessage = async () => {
    const textMessage = draft.trim();
    if (!textMessage || sending) return;

    // If chat is ended or no conversation ID, start a new one
    let currentId = conversationId;
    if (chatEnded || !currentId) {
      currentId = "conv-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
      console.log("Starting new conversation with ID:", currentId);
      setConversationId(currentId);
      setChatEnded(false);
      
      // Reset messages for new conversation
      setMessages([
        { 
          id: 1, 
          author: "bot", 
          text: "Hello! I'm your AI Help Desk Assistant. How can I help you today?", 
          at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        },
      ]);
    }

    setSending(true);

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      author: "user",
      text: textMessage,
      at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessage]);
    setDraft("");

    try {
      setIsTyping(true);

      // Send message to backend using the conversation ID
      const responseFromAI = await sendMessagesToServer(textMessage, currentId);

      // Extract content safely
      const aiText = responseFromAI?.content || "Sorry, no response from server";

      // Add AI message
      const aiMessage = {
        id: messages.length + 2,
        author: "bot",
        text: aiText,
        timestamp: responseFromAI?.timestamp,
        at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);

      setMessages(prev => [...prev, {
        id: messages.length + 2,
        author: "bot",
        text: "Sorry, I encountered an error connecting to the server. Please try again.",
        at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setSending(false);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !sending) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-actions">
            <button className="icon-btn" title="New Chat" onClick={startNewConversation}>
              <Plus size={18} />
            </button>
            <div className="search-box">
              <input placeholder="Search chats..." type="text" />
              <Search size={16} />
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="chat-list">
          {CHATS.map((chat) => (
            <div 
              key={chat.id} 
              className={`chat-item ${activeChat.id === chat.id ? 'active' : ''}`}
              onClick={() => setActiveChat(chat)}
            >
              <div className="avatar">{chat.initials}{chat.unread > 0 && <span className="badge">{chat.unread}</span>}</div>
              <div className="chat-info">
                <div className="chat-title">
                  <h4>{chat.name}</h4>
                  <span className="time">10:30 AM</span>
                </div>
                <p>{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-user">
            <div className="avatar"><Bot size={18} /></div>
            <div className="user-info">
              <h3>AI Help Desk Assistant</h3>
              <p>{isTyping ? "Typing..." : chatEnded ? "Chat Ended" : "Online"}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate("/")} title="Back to Home"><LogOut size={18} /></button>
            <button className="icon-btn" title="More options"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="messages-container">
          {messages.length === 0 && !isTyping ? (
            <div className="no-messages">
              <div className="avatar large"><Bot size={24} /></div>
              <h3>AI Help Desk Assistant</h3>
              <p>Start a new conversation to get help with your questions.</p>
              <button className="start-chat-btn" onClick={startNewConversation}>
                <Plus size={16} />
                <span>Start New Chat</span>
              </button>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.author}`}>
                  <div className="message-content">
                    <div className="text">{msg.text}</div>
                    {msg.title && <div className="title">{msg.title}</div>}
                    <div className="time">{msg.at}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              )}
              <div ref={endRef} />
            </>
          )}
        </div>

        {/* End Chat Confirmation Modal */}
        {showEndChatConfirm && (
          <div className="end-chat-confirm">
            <div className="confirm-modal">
              <h4>End this chat?</h4>
              <p>Are you sure you want to end this conversation? You'll need to start a new chat to continue.</p>
              <div className="confirm-actions">
                <button className="cancel-btn" onClick={cancelEndChat}>Cancel</button>
                <button className="end-btn" onClick={confirmEndChat}>End Chat</button>
              </div>
            </div>
          </div>
        )}

        {/* Action Button Section - Shows either End Chat or New Chat button */}
        <div className="action-button-section">
          {chatEnded ? (
            <button 
              className="new-chat-action-btn" 
              onClick={startNewConversation}
              title="Start new chat"
            >
              <Plus size={16} />
              <span>New Chat</span>
            </button>
          ) : (
            <button 
              className="end-chat-action-btn" 
              onClick={handleEndChat}
              disabled={showEndChatConfirm || sending}
              title="End current chat"
            >
              <X size={16} />
              <span>End Chat</span>
            </button>
          )}
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              placeholder={chatEnded ? "Chat ended. Click 'New Chat' button above to start..." : "Type your message here..."}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
            />
            <button 
              className="send-btn glossy" 
              onClick={handleSendMessage} 
              disabled={sending || !draft.trim()} 
              title="Send message"
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;