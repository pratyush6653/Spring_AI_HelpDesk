import React from "react"

function Chat() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey there! How are you?", sender: "received", time: "10:00 AM", status: "read" },
    { id: 2, text: "I'm good! Working on a new project.", sender: "sent", time: "10:02 AM", status: "read" },
    { id: 3, text: "That's great! What kind of project?", sender: "received", time: "10:05 AM", status: "read" },
    { id: 4, text: "It's a chat application like WhatsApp", sender: "sent", time: "10:07 AM", status: "delivered" },
    { id: 5, text: "Awesome! Can I see it?", sender: "received", time: "10:10 AM", status: "read" },
    { id: 6, text: "Sure, I'll share the demo link soon.", sender: "sent", time: "10:12 AM", status: "sent" },
  ]);

  const chats = [
    { id: 1, name: "John Doe", avatar: "JD", lastMessage: "Sure, I'll share the demo link soon.", time: "10:12 AM", unread: 2, online: true },
    { id: 2, name: "Alice Smith", avatar: "AS", lastMessage: "Meeting at 3 PM tomorrow", time: "Yesterday", unread: 0, online: true },
    { id: 3, name: "Bob Johnson", avatar: "BJ", lastMessage: "Thanks for your help!", time: "Yesterday", unread: 0, online: false },
    { id: 4, name: "Emma Wilson", avatar: "EW", lastMessage: "Are we still on for Friday?", time: "Monday", unread: 1, online: true },
    { id: 5, name: "Mike Brown", avatar: "MB", lastMessage: "The documents are ready", time: "Monday", unread: 0, online: false },
    { id: 6, name: "Sarah Davis", avatar: "SD", lastMessage: "Let's catch up soon", time: "Sunday", unread: 0, online: true },
    { id: 7, name: "David Miller", avatar: "DM", lastMessage: "Happy Birthday! 🎉", time: "Saturday", unread: 0, online: false },
    { id: 8, name: "Lisa Taylor", avatar: "LT", lastMessage: "Can you review my PR?", time: "Friday", unread: 3, online: true },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "sent",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sent"
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      
      // Simulate reply after 1 second
      setTimeout(() => {
        const replies = [
          "That's interesting!",
          "I see what you mean.",
          "Can you explain more?",
          "Got it, thanks!",
          "Looking forward to it!"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const replyMessage = {
          id: messages.length + 2,
          text: randomReply,
          sender: "received",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "read"
        };
        setMessages(prev => [...prev, replyMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <Check size={14} />;
      case 'delivered': return <CheckCheck size={14} />;
      case 'read': return <CheckCheck size={14} color="#53bdeb" />;
      default: return null;
    }
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-profile">
            <div className="chat-avatar">YP</div>
            <div className="chat-user-info">
              <h3>Your Profile</h3>
              <p>Online</p>
            </div>
          </div>
          <div className="chat-header-icons">
            <Menu size={20} />
            <MoreVertical size={20} />
          </div>
        </div>

        {/* Search */}
        <div className="chat-search">
          <div className="chat-search-box">
            <Search size={18} />
            <input type="text" placeholder="Search or start new chat" />
          </div>
        </div>

        {/* Chat List */}
        <div className="chat-list">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              className={`chat-item ${selectedChat === chat.id ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="chat-item-avatar">
                {chat.avatar}
                {chat.online && <div className="chat-online"></div>}
              </div>
              <div className="chat-item-info">
                <h4>
                  {chat.name}
                  <span className="chat-item-time">{chat.time}</span>
                </h4>
                <div className="chat-item-message">
                  <span className="chat-item-preview">{chat.lastMessage}</span>
                  {chat.unread > 0 && (
                    <span className="chat-unread">{chat.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Chat Header */}
        <div className="chat-main-header">
          <div className="chat-contact-info">
            <div className="chat-contact-avatar">
              {selectedChatData?.avatar || "?"}
            </div>
            <div className="chat-contact-details">
              <h3>{selectedChatData?.name || "Select a chat"}</h3>
              <p>{selectedChatData?.online ? "Online" : "Last seen recently"}</p>
            </div>
          </div>
          <div className="chat-main-icons">
            <Video size={22} />
            <Phone size={22} />
            <Search size={22} />
            <MoreVertical size={22} />
          </div>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {selectedChat ? (
            <>
              <div className="chat-date-separator">
                <span>Today</span>
              </div>
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                  <div className="message-time">
                    {msg.time}
                    {msg.sender === 'sent' && (
                      <span className="message-status">
                        {getStatusIcon(msg.status)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">
                <CheckCheck size={48} />
              </div>
              <h3>Welcome to Help Desk Chat</h3>
              <p>Select a conversation from the sidebar to start chatting</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedChat && (
          <div className="chat-input-container">
            <div className="chat-input-icons">
              <Smile size={22} />
              <Paperclip size={22} />
            </div>
            <div className="chat-input-box">
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            {message.trim() ? (
              <button className="chat-send-button" onClick={handleSendMessage}>
                <Send size={20} />
              </button>
            ) : (
              <div className="chat-input-icons">
                <Mic size={22} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default Chat