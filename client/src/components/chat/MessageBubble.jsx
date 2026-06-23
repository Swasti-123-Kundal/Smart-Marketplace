import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from '../../utils/formatters';

const MessageBubble = ({ message, isSelf }) => {
  return (
    <div className={`flex flex-col max-w-[75%] gap-1 ${isSelf ? 'self-end items-end' : 'self-start items-start'}`}>
      <div
        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isSelf
            ? 'bg-primary-600 text-white rounded-br-none'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/40 rounded-bl-none'
          }
        `}
      >
        {message.message}
      </div>
      <div className="flex items-center gap-1.5 px-1">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
          {formatDistanceToNow(message.createdAt)}
        </span>
        {isSelf && (
          <span className="text-slate-400">
            {message.isRead ? (
              <CheckCheck size={12} className="text-accent-500" />
            ) : (
              <Check size={12} />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
