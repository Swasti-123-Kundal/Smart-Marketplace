import React from 'react';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatWindow from '../../components/chat/ChatWindow';

const ClientMessages = () => {
  return (
    <div className="flex bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-xl min-h-[500px]">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
};

export default ClientMessages;
