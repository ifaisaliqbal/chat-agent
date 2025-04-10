import React, { useState, useRef, useEffect } from 'react';
import { ChatRequest, Message } from '../types';
import { chatApi } from '../services/api';

export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;

    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const reqBody: ChatRequest = { message: userMessage, history: messages };
      const res = await chatApi.sendMessage(reqBody);
      setMessages([...updatedMessages, { role: 'assistant', content: res }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', content: '❌ Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };
  const bottomRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 font-sans max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Sierra Agent Chat 🏕️</h1>

      <div className="border border-gray-200 rounded p-4 mb-4 h-[60vh] overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${
                msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'
              }`}
            >
              <span className="block text-sm whitespace-pre-line">{msg.content}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-center text-gray-500 italic">Thinking... ⏳</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
        data-testid="chat-input"
          className="flex-1 p-2 border border-gray-300 rounded shadow-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about your order, get hiking tips, or request a promo code..."
        />
        <button
         data-testid="send-button"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};