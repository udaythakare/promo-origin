"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { getNotifications } from "@/app/actions/notifications/getNotifications";
import { markAsRead } from "@/app/actions/notifications/markAsRead";
import { Bell } from "lucide-react";

export default function InvestorNotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  /* Load existing notifications */
  useEffect(() => {
    async function load() {
      const data = await getNotifications();
      setNotifications(data);
    }
    load();
  }, []);

  /* Realtime subscription */
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("investor_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "internal_notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  async function handleRead(id) {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <Bell size={22} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border z-50">
          {notifications.length === 0 && (
            <div className="p-4 text-sm text-gray-500">
              No notifications
            </div>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleRead(n.id)}
              className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                !n.is_read ? "bg-gray-100" : ""
              }`}
            >
              <p className="font-semibold text-sm">
                {n.title}
              </p>
              <p className="text-xs text-gray-600">
                {n.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
