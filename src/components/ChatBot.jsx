import { useState } from 'react';

const API_KEY = "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";

function ChatBot() {
  const [typing, setTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [messages, setMessages] = useState([
    {
      message: `Hello! I'm your language learning assistant for ${selectedLanguage}. How can I help you today?`,
      sender: "chatGPT"
    }
  ]);

  const languages = ["Spanish", "French", "German", "Italian", "Japanese", "Mandarin", "Korean"];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleSend = async (message) => {
    if (typing) return;

    const newMessage = {
      message: message,
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  const changeLanguage = (language) => {
    setSelectedLanguage(language);
    setMessages([
      {
        message: `Hello! I'm your language learning assistant for ${language}. How can I help you today?`,
        sender: "chatGPT"
      }
    ]);
  };

  const changeLevel = (level) => {
    setSelectedLevel(level);
    setMessages([
      {
        message: `Your proficiency level has been set to ${level} for ${selectedLanguage}. How can I help you learn?`,
        sender: "chatGPT"
      }
    ]);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((msg) => {
      let role = msg.sender === "chatGPT" ? "assistant" : "user";
      return { role: role, content: msg.message };
    });

    const systemMessage = {
      role: "system",
      content: `You are a helpful language learning assistant for ${selectedLanguage} at ${selectedLevel} level. 
                Provide examples, translations, grammar tips, and cultural context. 
                Use simple explanations and engaging content. Occasionally include ${selectedLanguage} words or phrases with translations.`
    };

    const apiRequestBody = {
      model: "llama3-70b-8192",
      messages: [systemMessage, ...apiMessages]
    };

    await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    })
      .then(res => res.json())
      .then(data => {
        const chatGptResponse = {
          message: data.choices[0].message.content,
          sender: "chatGPT"
        };
        setMessages(prev => [...prev, chatGptResponse]);
        setTyping(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setTyping(false);
        setMessages(prev => [...prev, {
          message: "Sorry, I encountered an error. Please try again later.",
          sender: "chatGPT"
        }]);
      });
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f5f5f5" }}>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: "#4a69bd",
        padding: "10px 20px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button 
            onClick={toggleSidebar}
            style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer", marginRight: "15px" }}
          >
            ☰
          </button>
          <h1 style={{ margin: 0 }}>LingoChat Assistant</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <select 
            value={selectedLevel} 
            onChange={(e) => changeLevel(e.target.value)}
            style={{ padding: "5px 10px", borderRadius: "5px", border: "none", marginRight: "15px" }}
          >
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <button style={{
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "7px 15px",
            cursor: "pointer"
          }}>
            My Profile
          </button>
        </div>
      </nav>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        {sidebarVisible && (
          <div style={{
            width: "260px",
            backgroundColor: "white",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            padding: "15px",
            boxSizing: "border-box",
            overflowY: "auto"
          }}>
            <input 
              type="text" 
              placeholder="Search languages..." 
              style={{
                padding: "8px",
                marginBottom: "10px",
                width: "100%",
                boxSizing: "border-box",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            />
            {languages.map(language => (
              <div 
                key={language}
                onClick={() => changeLanguage(language)}
                style={{
                  padding: "10px",
                  marginBottom: "5px",
                  backgroundColor: selectedLanguage === language ? "#4a69bd" : "#f0f0f0",
                  color: selectedLanguage === language ? "white" : "black",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                {language}
              </div>
            ))}
            <div style={{ marginTop: "20px" }}>
              <h3>Learning Resources</h3>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                <li style={{ padding: "5px 0", cursor: "pointer", color: "#4a69bd" }}>Vocabulary Lists</li>
                <li style={{ padding: "5px 0", cursor: "pointer", color: "#4a69bd" }}>Grammar Rules</li>
                <li style={{ padding: "5px 0", cursor: "pointer", color: "#4a69bd" }}>Practice Exercises</li>
                <li style={{ padding: "5px 0", cursor: "pointer", color: "#4a69bd" }}>Cultural Notes</li>
              </ul>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header inside chat */}
          <div style={{
            backgroundColor: "white",
            padding: "10px 20px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div>
              <h2 style={{ margin: 0 }}>{selectedLanguage} Learning Assistant</h2>
              <small>{selectedLevel} Level</small>
            </div>
            <button style={{
              backgroundColor: "#eaeaea",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
              fontSize: "12px",
              cursor: "pointer"
            }}>
              Start Practice Session
            </button>
          </div>

          {/* Message List */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            backgroundColor: "#fafafa",
            display: "flex",
            flexDirection: "column"
          }}>
            {messages.map((msg, index) => (
              <div 
                key={index}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#4a69bd" : "#e0e0e0",
                  color: msg.sender === "user" ? "white" : "black",
                  borderRadius: "10px",
                  padding: "10px 15px",
                  marginBottom: "10px",
                  maxWidth: "60%"
                }}
              >
                {msg.message}
              </div>
            ))}
            {typing && (
              <div style={{
                alignSelf: "flex-start",
                backgroundColor: "#e0e0e0",
                color: "black",
                borderRadius: "10px",
                padding: "10px 15px",
                marginBottom: "10px",
                fontStyle: "italic"
              }}>
                {selectedLanguage} assistant is typing...
              </div>
            )}
          </div>

          {/* Message Input */}
          <div style={{
            padding: "10px 20px",
            borderTop: "1px solid #ddd",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center"
          }}>
            <input 
              type="text" 
              placeholder={`Ask anything about ${selectedLanguage}...`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(e.target.value.trim());
              }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginRight: "10px"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
