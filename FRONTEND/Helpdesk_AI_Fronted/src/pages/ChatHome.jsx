// src/pages/ChatHome.jsx
import React from "react";
import { motion } from "motion/react";
import Galaxy from "./Orb";
import { useNavigate } from "react-router";

function ChatHome() {

  const nevigateTo = useNavigate();
  const handleGetStarted = () => {
    nevigateTo("/chat");
  }
  return (
    <div className="chat-home-container">
      {/* Galaxy animated background */}
      <div className="galaxy-background">
        <Galaxy 
       mouseRepulsion={true}
  mouseInteraction={true}
  density={2.0}
  glowIntensity={0.4}
  saturation={0.0}
  hueShift={0}
  speed={0.6}
  twinkleIntensity={0.6}
  rotationSpeed={0.03}
  repulsionStrength={3.5}     // Even stronger
  autoCenterRepulsion={0}     // Disabled
  mouseActiveFactor={1.0}     // If this prop exists
        />
      </div>
      
      <div className="chat-home-header">
        <h1 className="chat-home-title">
          Welcome to Help Desk System
        </h1>
      </div>
      
      <div className="chat-home-content">
        <div className="chat-home-button-wrapper">
          <motion.button
            className="chat-home-button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGetStarted()}
            style={{ outline: 'none' }}
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default ChatHome;