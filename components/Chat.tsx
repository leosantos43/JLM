import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';
import { db } from '../services/mockSupabase';
import { Icons } from './Icons';

interface ChatProps {
  requestId: string;
  user: User;
}

export const Chat: React.FC<ChatProps> = ({ requestId, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const data = await db.getRequestMessages(requestId);
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [requestId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMsg = newMessage;
    setNewMessage('');
    
    await db.sendRequestMessage(requestId, user, tempMsg);
    fetchMessages();
  };

  return (
    <div className="flex flex-col h-full bg-[#F0F2F5]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-2 border-jlm-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                <Icons.MessageCircle size={28} className="text-gray-300" />
             </div>
             <p className="text-sm font-medium">Nenhuma mensagem.</p>
             <p className="text-xs">Inicie o suporte.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.user_id === user.id;
            const showAvatar = index === 0 || messages[index - 1].user_id !== msg.user_id;
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${showAvatar ? 'mt-4' : 'mt-1'}`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  {showAvatar ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                      isMe ? 'bg-jlm-blue text-white' : 'bg-white text-gray-700'
                    }`}>
                      {msg.user_name.charAt(0)}
                    </div>
                  ) : (
                    <div className="w-8"></div>
                  )}

                  {/* Bubble */}
                  <div className={`px-4 py-2.5 shadow-sm text-sm break-words relative group ${
                    isMe 
                      ? 'bg-gradient-to-r from-blue-600 to-jlm-blue text-white rounded-2xl rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100'
                  }`}>
                    <p className="leading-relaxed">{msg.message}</p>
                    <span className={`text-[9px] block text-right mt-1 opacity-70 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                {showAvatar && !isMe && (
                   <span className="text-[10px] text-gray-400 ml-11 mt-1">{msg.user_name}</span>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] z-10">
        <form onSubmit={handleSend} className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-gray-700 placeholder-gray-400"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="w-10 h-10 flex items-center justify-center bg-jlm-blue text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:scale-95 transform duration-200 shadow-md flex-shrink-0"
          >
            <Icons.Send size={18} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};