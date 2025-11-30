import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatbotIcon from "./ChatbotIcon";
import botIcon from "../assets/ChatbotIcon.png";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, role: "bot", text: "Hey there 👋 How can I help you today?" },
  ]);

  // typing state
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [botTypingDots, setBotTypingDots] = useState(1);

  // typing-effect state
  const [activeTypingId, setActiveTypingId] = useState(null);

  // auto-scroll
  const bodyRef = useRef(null);

  // container ref to detect outside clicks
  const containerRef = useRef(null);

  // cancellation ref for simulateAiResponse
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!isBotTyping) return;
    const t = setInterval(() => {
      setBotTypingDots((d) => (d >= 3 ? 1 : d + 1));
    }, 500);
    return () => clearInterval(t);
  }, [isBotTyping]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  // handle clicks outside the chat area -> cancel bot typing
  useEffect(() => {
    const handleDocClick = (e) => {
      // if click is inside container, ignore
      if (!containerRef.current) return;
      if (containerRef.current.contains(e.target)) return;

      // clicked outside -> cancel ongoing bot response and typing indicator
      cancelRef.current = true;
      setIsBotTyping(false);
      setActiveTypingId(null);

      // remove any placeholder empty bot messages added by simulateAiResponse
      setMessages((prev) =>
        prev.filter((m) => !(m.role === "bot" && (m.text === "" || m.text === null)))
      );
    };

    document.addEventListener("mousedown", handleDocClick, true);
    return () => document.removeEventListener("mousedown", handleDocClick, true);
  }, []);

  // Simulate AI message (cancellable)
  const simulateAiResponse = async (userText) => {
    cancelRef.current = false;
    setIsBotTyping(true);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));

    // if cancelled while waiting, stop
    if (cancelRef.current) {
      setIsBotTyping(false);
      return;
    }

    const fakeResponse = `Sure — I got "${userText}". Here’s your response.`;

    const newBotId = Date.now();
    // add placeholder bot message (empty text) so UI shows bubble immediately
    setMessages((m) => [...m, { id: newBotId, role: "bot", text: "" }]);
    setActiveTypingId(newBotId);

    // stop the "isTyping" indicator (we show the dot/typing and then the reveal)
    setIsBotTyping(false);

    // reveal characters one by one, unless cancelled
    for (let i = 0; i < fakeResponse.length; i++) {
      if (cancelRef.current) {
        // if cancelled, stop revealing and remove placeholder bot if empty
        setActiveTypingId(null);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newBotId ? { ...msg, text: prev.find((m) => m.id === newBotId)?.text || "" } : msg
          )
        );
        return;
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newBotId ? { ...msg, text: fakeResponse.slice(0, i + 1) } : msg
        )
      );

      // small variable delay for natural typing
      // if cancelled during delay, loop will check at top
      await new Promise((r) => setTimeout(r, 20 + Math.random() * 20));
    }

    // done
    setActiveTypingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // make sure we cancel any currently-running simulate loop before adding new user message
    cancelRef.current = false;

    const userMsg = message.trim();
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: userMsg }]);
    setMessage("");

    simulateAiResponse(userMsg);
  };

  return (
    <div ref={containerRef} className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbot-popup"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            drag
            dragElastic={0.12}
            className="
              relative bg-white text-gray-900
              rounded-2xl
              shadow-[0_0_128px_rgba(0,0,0,0.12),0_32px_64px_-48px_rgba(0,0,0,0.45)]
              w-[350px] sm:w-[420px] max-w-[92vw] overflow-hidden
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#305057]">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {/* improved avatar: use img but keep it crisp and centered */}
                  <img src={botIcon} alt="Bot" className="w-6 h-6 object-contain" />
                </div>
                <h2 className="text-white font-semibold text-sm sm:text-base">BotBuddy</h2>
              </div>

              {/* improved close / cut icon (accessible) */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition"
                aria-label="Close chat"
                title="Close chat"
              >
                {/* SVG X inside a subtle translucent circle */}
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
            </div>

            {/* Body */}
            <div ref={bodyRef} className="flex flex-col gap-3 h-100 sm:h-[420px] overflow-y-auto p-4 pb-24">
              {messages.map((msg) =>
                msg.role === "bot" ? (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#305057] flex items-center justify-center mt-2 overflow-hidden">
                      <img src={botIcon} alt="Bot" className="w-6 h-6 object-contain" />
                    </div>

                    <div className="bg-[#F6F2F6] rounded-[13px_13px_13px_1px] p-3 max-w-[80%] text-sm whitespace-pre-wrap">
                      {msg.text}
                      {activeTypingId === msg.id && <span className="inline-block ml-1 animate-pulse">▌</span>}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex flex-col items-end">
                    <div className="text-white bg-[#305057] rounded-[13px_13px_1px_13px] p-3 max-w-[80%] text-sm">
                      {msg.text}
                    </div>
                  </div>
                )
              )}

              {/* Bot typing indicator */}
              {isBotTyping && (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#305057] flex items-center justify-center overflow-hidden">
                    <img src={botIcon} alt="Bot" className="w-6 h-6 object-contain" />
                  </div>
                  <div className="bg-[#F6F2F6] rounded-[13px_13px_13px_1px] p-2 px-3 text-sm">
                    Bot is typing{".".repeat(botTypingDots)}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 w-full bg-white px-4 pb-4 pt-2">
              <form onSubmit={handleSubmit} className="flex items-center border border-[#E3E3E3] rounded-full shadow-sm h-[52px] focus-within:ring-1 focus-within:ring-[#305057]">
                <input
                  type="text"
                  placeholder="Message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-transparent border-none px-4 text-base focus:outline-none"
                />

                <button
                  type="submit"
                  className={`mr-2 h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#305057] text-lg transition ${
                    message.trim() ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
                  }`}
                >
                  ➤
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button with subtle bobbing animation */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open chatbot"
        title={isOpen ? "Close chat" : "Open chat"}
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 2.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0.8,
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96, rotate: -4 }}
        className="relative flex items-center justify-center h-12 w-12 sm:h-12 sm:w-12 rounded-full bg-[#0c082ca8] shadow-lg text-white hover:scale-105 active:scale-95 transition"
      >
        {/* decorative ring */}
        <span
          className="absolute inline-block h-12 w-12 sm:h-12 sm:w-12 rounded-full"
          style={{ boxShadow: "inset 0 0 0 6px rgba(48,80,87,0.02)", pointerEvents: "none" }}
        />
        <img src={botIcon} alt="Bot" className="w-9 h-9 object-contain" />
      </motion.button>
    </div>
  );
}

export default Chatbot;
