import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/chatService';
import './ChatBot.css';

import aiAvatar from '../assets/images/ai_stylist_avatar_1791041447024.jpg';

const AI_AVATAR_SRC = aiAvatar;

const QUICK_PROMPTS = [
  'Đám cưới nên mặc cổ phục gì?',
  'Cách phối màu Áo ngũ thân?',
  'Áo Nhật Bình có ý nghĩa gì?',
  'Phụ kiện chuẩn cho Áo tứ thân?'
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Kính chào quý bạn! Tôi là Cố Vấn Việt Phục. Bạn có muốn tìm hiểu về trang phục truyền thống, phối màu theo ngũ hành hay cách chọn trang phục cho các dịp lễ hội, kỷ yếu và đám cưới không?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend = null) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const reply = await sendChatMessage(messages, text);
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Rất tiếc, đã có trục trặc nhỏ khi kết nối. Bạn vui lòng thử lại nhé!' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Action Button */}
      <button
        type="button"
        className={`chatbot-fab ${isOpen ? 'is-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Tư vấn Việt Phục AI"
        aria-label="Mở cửa sổ tư vấn Việt Phục"
      >
        <div className="chatbot-fab-avatar-ring">
          <img
            src={AI_AVATAR_SRC}
            alt="Cố Vấn AI"
            className="chatbot-fab-img"
            referrerPolicy="no-referrer"
          />
        </div>
        {!isOpen && <span className="chatbot-fab-badge">Tư vấn AI</span>}
        {isOpen && <span className="chatbot-fab-close">✕</span>}
      </button>

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="chatbot-panel glass-panel animate-scale-up">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar-ring">
                <img
                  src={AI_AVATAR_SRC}
                  alt="Cố Vấn Việt Phục"
                  className="chatbot-avatar-img"
                  referrerPolicy="no-referrer"
                />
                <span className="avatar-dot" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 className="chatbot-title">Cố Vấn Việt Phục</h4>
                  <span className="chatbot-status-pill">AI 4.0</span>
                </div>
                <span className="chatbot-subtitle">Chuyên gia văn hóa & phối đồ di sản</span>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          {/* Messages body */}
          <div className="chatbot-messages">
            {/* Top advisor introduction card */}
            <div className="chat-advisor-card animate-fade-in">
              <div className="advisor-card-avatar">
                <img
                  src={AI_AVATAR_SRC}
                  alt="Cố vấn AI"
                  className="advisor-avatar-photo"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="advisor-card-content">
                <span className="advisor-card-badge">Chuyên gia cố vấn di sản</span>
                <p className="advisor-card-text">
                  Tôi sẵn sàng tư vấn cách phối màu ngũ hành, chọn lễ phục đám cưới và phụ kiện chuẩn phong vị Việt.
                </p>
              </div>
            </div>

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble-row ${msg.role === 'user' ? 'user-row' : 'bot-row'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="chat-row-avatar">
                    <img
                      src={AI_AVATAR_SRC}
                      alt="Cố vấn"
                      className="chat-bubble-avatar-img"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--bot'}`}>
                  {msg.text.split('\n').map((line, lIdx) => (
                    <p key={lIdx} className="bubble-text">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row bot-row">
                <div className="chat-row-avatar">
                  <img
                    src={AI_AVATAR_SRC}
                    alt="Cố vấn"
                    className="chat-bubble-avatar-img"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="chat-bubble chat-bubble--bot typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="chatbot-quick-chips">
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                className="quick-chip"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="chatbot-input-bar">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Hỏi về cách phối áo, bối cảnh, phụ kiện..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="chatbot-send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
