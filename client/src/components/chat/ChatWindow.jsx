import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useSocket from '../../hooks/useSocket';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Input from '../common/Input';
import { Send, MessageSquare } from 'lucide-react';

const ChatWindow = () => {
  const { messages, activeRoom, activePartner, partnerTyping } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const { joinRoom, leaveRoom, sendMessage, emitTyping, markRead } = useSocket();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeRoom) {
      joinRoom(activeRoom);
      markRead(activeRoom);
      
      return () => {
        leaveRoom(activeRoom);
      };
    }
  }, [activeRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, partnerTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeRoom || !activePartner) return;

    sendMessage(activeRoom, activePartner._id, text.trim());
    setText('');
    emitTyping(activeRoom, false);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (activeRoom) {
      emitTyping(activeRoom, e.target.value.trim().length > 0);
    }
  };

  if (!activeRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-slate-900/10 min-h-[400px]">
        <div className="p-4 bg-primary-500/10 text-primary-600 rounded-full mb-3">
          <MessageSquare size={32} />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200">Start Messaging</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Select an active conversation from the sidebar to chat, clarify details, or check status.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/10 min-h-[400px] border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50">
        <Avatar src={activePartner?.profileImage} name={activePartner?.name} size="sm" />
        <div>
          <p className="text-xs font-bold text-slate-950 dark:text-slate-50">{activePartner?.name}</p>
          <p className="text-[10px] text-slate-400 font-semibold uppercase">{activePartner?.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-h-[500px]">
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id || msg.createdAt}
            message={msg}
            isSelf={msg.sender === user?._id || msg.sender?._id === user?._id}
          />
        ))}
        {partnerTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer input */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-2">
        <Input
          id="messageText"
          placeholder="Type your message..."
          value={text}
          onChange={handleInputChange}
          className="flex-1"
        />
        <Button type="submit" variant="primary" className="shrink-0 rounded-xl px-4 py-3" disabled={!text.trim()}>
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
