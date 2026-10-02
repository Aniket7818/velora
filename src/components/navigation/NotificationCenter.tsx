'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Trash2,
  Tag,
  Package,
  Award,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatRelativeTime } from '@/lib/utils/formatters';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
  } = useVeloraStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return <Tag className="w-3.5 h-3.5 text-[#702C3B]" />;
      case 'order_update':
        return <Package className="w-3.5 h-3.5 text-blue-700" />;
      case 'reward':
        return <Award className="w-3.5 h-3.5 text-amber-600" />;
      case 'cart_reminder':
        return <ShoppingBag className="w-3.5 h-3.5 text-[#2E7658]" />;
      default:
        return <Info className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative p-2 text-stone-700 hover:text-black hover:bg-stone-200/50 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#702C3B] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#F8F6F1] border border-[#E9E2D8] shadow-2xl rounded-sm z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3.5 bg-white border-b border-[#E9E2D8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-medium text-stone-900 text-sm tracking-wide">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-[#702C3B]/10 text-[#702C3B] font-mono font-medium rounded">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-stone-500 hover:text-stone-900 flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Read all</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-stone-400 hover:text-red-700"
                  title="Clear notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E9E2D8]/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2 stroke-[1.5]" />
                <p className="text-xs font-serif text-stone-700">All caught up</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  You have no pending styling or order alerts.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-3 text-left transition-colors cursor-pointer flex gap-3 ${
                    notif.read ? 'bg-transparent hover:bg-white/50' : 'bg-stone-50 hover:bg-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-white border border-[#E9E2D8] flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p
                        className={`text-xs font-medium text-stone-900 ${
                          !notif.read ? 'font-semibold' : ''
                        }`}
                      >
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                        {formatRelativeTime(notif.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                    {notif.link && (
                      <Link
                        href={notif.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-block mt-1 text-[11px] font-medium text-[#702C3B] hover:underline"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                  {!notif.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#702C3B] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
