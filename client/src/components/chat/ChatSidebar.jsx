import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, fetchChatHistory, setActiveRoom } from '../../redux/slices/chatSlice';
import Avatar from '../common/Avatar';
import Card from '../common/Card';
import Loader from '../common/Loader';
import { MessageSquareOff } from 'lucide-react';

const ChatSidebar = () => {
  const dispatch = useDispatch();
  const { conversations, activeRoom, loading } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleSelectConv = (conv) => {
    dispatch(setActiveRoom({ roomId: conv.roomId, partner: conv.partner }));
    dispatch(fetchChatHistory(conv.roomId));
  };

  if (loading && conversations.length === 0) return <Loader />;

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500 min-h-[400px]">
        <MessageSquareOff size={36} className="mb-2 opacity-50" />
        <p className="text-xs font-semibold">No active conversations yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/50 w-80 shrink-0">
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <h2 className="font-bold text-base text-slate-900 dark:text-slate-50">Conversations</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conv) => {
          const isActive = activeRoom === conv.roomId;
          return (
            <div
              key={conv.roomId}
              onClick={() => handleSelectConv(conv)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border border-transparent
                ${isActive
                  ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border-primary-100/50 dark:border-primary-900/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }
              `}
            >
              <Avatar src={conv.partner?.profileImage} name={conv.partner?.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold truncate">{conv.partner?.name || 'Assigned Agent'}</p>
                </div>
                {conv.lastMessage && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-medium">
                    {conv.lastMessage.message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
