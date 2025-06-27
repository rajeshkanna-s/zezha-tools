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
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "FD Chat Assistant",
        },
        body: JSON.stringify({
          //   model: "deepseek/deepseek-r1-0528:free",
          model: "deepseek/deepseek-chat-v3:free",
          // model: "mistralai/devstral-small:free",

          messages: updatedMessages,
        }),
      });

      const data = await res.json();
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
          <div className="chatcard shadow p-4 mt-4">
            <h2 className="text-center mb-4">Chat Assistant</h2>

            <div
              className="chat-box bg-light border rounded p-3 mb-3"
              style={{ height: "400px", overflowY: "auto" }}
            >
              {messages
                .filter((msg) => msg.role !== "system")
                .map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      msg.role === "user" ? "text-end" : "text-start"
                    }`}
                  >
                    <div
                      className={`d-inline-block p-2 rounded ${
                        msg.role === "user"
                          ? "bg-success text-white"
                          : "bg-secondary text-white"
                      }`}
                      style={{
                        whiteSpace: "pre-wrap",
                        textAlign: "left",
                        maxWidth: "100%",
                      }}
                    >
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              {loading && (
                <div className="text-start text-muted">Bot is typing...</div>
              )}
            </div>

            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="btn btn-success"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatBot;
