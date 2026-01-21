import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import ReactMarkdown from "react-markdown";
import "../assets/CSS/ChatBot.css";

const ChatBot: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [{ role: "system", content: "You are a helpful assistant." }]
  );
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_DEEPSEEKV3_APIKEY;
      const aiUrl = import.meta.env.VITE_DEEPSEEKV3_APIURL;

      const res = await fetch(aiUrl, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
          //"X-Title": "Chat Assistant",
        },
        body: JSON.stringify({
          //   model: "deepseek/deepseek-r1-0528:free",
          model: "deepseek/deepseek-chat-v3-0324",
          // model: "mistralai/devstral-small:free",

          messages: updatedMessages,
        }),
      });

      const data = await res.json();
      console.log("Full API response:", data);
      const botReply = data.choices?.[0]?.message?.content || "No response.";
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: botReply },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Failed to get response from chatbot." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="chat-page">
            <div className="chat-shell">
              <header className="chat-header">
                <div>
                  <h2>Chat Assistant</h2>
                  <p>Your GPT-style chat experience.</p>
                </div>
              </header>

              <div className="chat-content">
                {messages
                  .filter((msg) => msg.role !== "system")
                  .map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}`}>
                      <span className="chat-role">
                        {msg.role === "user" ? "You" : "Assistant"}
                      </span>
                      <div className="chat-bubble">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                {loading && (
                  <div className="chat-message assistant">
                    <span className="chat-role">Assistant</span>
                    <div className="chat-bubble chat-loading">
                      Bot is thinking...
                    </div>
                  </div>
                )}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  className="chat-input-field"
                  placeholder="Message Chat Assistant..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="chat-send"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatBot;
