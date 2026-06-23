import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Check, CheckCheck, Inbox } from 'lucide-react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../redux/slices/notificationSlice';
import Avatar from './Avatar';
import { formatDistanceToNow } from '../../utils/formatters';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all focus:outline-none"
        aria-label="View notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/50 dark:border-slate-800/50">
            <h3 className="font-bold text-slate-900 dark:text-slate-50 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 dark:text-slate-500">
                <Inbox size={32} className="mb-2 opacity-50" />
                <p className="text-xs font-medium">All caught up!</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`flex items-start gap-3 p-4 border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all cursor-pointer
                    ${!notif.isRead ? 'bg-primary-50/30 dark:bg-primary-950/10' : ''}
                  `}
                  onClick={() => !notif.isRead && handleMarkRead(notif._id)}
                >
                  <div className="flex-1">
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-normal font-medium">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                      {formatDistanceToNow ? formatDistanceToNow(notif.createdAt) : 'Just now'}
                    </span>
                  </div>
                  {!notif.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(notif._id);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
