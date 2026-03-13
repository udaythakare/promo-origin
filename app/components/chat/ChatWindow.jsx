"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { sendMessage } from "@/app/actions/messages/sendMessage";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const THEMES = {
  investor: {
    headerBg:      "#1f1f1f",
    headerAccent:  "#f5c518",
    ownBubbleBg:   "#f5c518",
    ownBubbleText: "#1a1a1a",
    ownTimeTxt:    "#a37e00",
    ownTickColor:  "#a37e00",
    sendBtnBg:     "#f5c518",
    sendBtnTxt:    "#1a1a1a",
    inputRing:     "#f5c518",
    avatarBg:      "#f5c518",
    avatarTxt:     "#1a1a1a",
    onlineDot:     "#f5c518",
    label:         "INVESTOR PORTAL",
  },
  vendor: {
    headerBg:      "#1f1f1f",
    headerAccent:  "#df6824",
    ownBubbleBg:   "#df6824",
    ownBubbleText: "#ffffff",
    ownTimeTxt:    "#ffc49a",
    ownTickColor:  "#ffc49a",
    sendBtnBg:     "#df6824",
    sendBtnTxt:    "#ffffff",
    inputRing:     "#df6824",
    avatarBg:      "#df6824",
    avatarTxt:     "#ffffff",
    onlineDot:     "#df6824",
    label:         "VENDOR PORTAL",
  },
};

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function groupByDate(messages) {
  const groups = {};
  messages.forEach((msg) => {
    const key = new Date(msg.created_at).toDateString();
    if (!groups[key]) {
      groups[key] = { label: formatDate(msg.created_at), messages: [] };
    }
    groups[key].messages.push(msg);
  });
  return Object.values(groups);
}

function Avatar({ name, bg, color, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: "50%",
        background: bg,
        color: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: size * 0.4,
        border: "2px solid rgba(255,255,255,0.15)",
      }}
    >
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

export default function ChatWindow({
  connectionId,
  initialMessages,
  currentUserId,
  currentUserName,
  otherPersonName,
  backUrl,
  theme = "vendor",
}) {
  const c = THEMES[theme] || THEMES.vendor;
  const [messages, setMessages] = useState(initialMessages || []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Supabase Realtime — listen for new messages AND read receipt updates
  useEffect(() => {
  // Channel 1: new messages INSERT
  const insertChannel = supabaseClient
    .channel(`chat:${connectionId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `connection_id=eq.${connectionId}`,
      },
      (payload) => {
        const nm = payload.new;
        setMessages((prev) => {
          if (prev.some((m) => m.id === nm.id)) return prev;
          const enriched = {
            ...nm,
            sender: {
              id: nm.sender_id,
              full_name:
                nm.sender_id === currentUserId
                  ? currentUserName
                  : otherPersonName,
            },
          };
          return [...prev, enriched];
        });
      }
    )
    .subscribe();

  // Channel 2: read receipt updates
  const updateChannel = supabaseClient
    .channel(`read:${connectionId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `connection_id=eq.${connectionId}`,
      },
      (payload) => {
        const updated = payload.new;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === updated.id ? { ...m, is_read: updated.is_read } : m
          )
        );
      }
    )
    .subscribe();

  return () => {
    supabaseClient.removeChannel(insertChannel);
    supabaseClient.removeChannel(updateChannel);
  };
}, [connectionId, currentUserId, currentUserName, otherPersonName]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;

    setInput("");
    setSending(true);
    if (textareaRef.current) textareaRef.current.style.height = "46px";

    // Optimistic message — show immediately
    const temp = {
      id: `temp-${Date.now()}`,
      content,
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
      sender: { id: currentUserId, full_name: currentUserName },
      is_read: false,
      _isTemp: true,
    };
    setMessages((p) => [...p, temp]);

    try {
      const res = await sendMessage({ connectionId, content });
      if (res.success) {
        // Replace temp with real message from server
        setMessages((p) =>
          p.map((m) => (m.id === temp.id ? res.message : m))
        );
      } else {
        // Remove temp if failed
        setMessages((p) => p.filter((m) => m.id !== temp.id));
      }
    } catch {
      setMessages((p) => p.filter((m) => m.id !== temp.id));
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "46px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const dateGroups = groupByDate(messages);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0d1117",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* ─── HEADER ─── */}
      <div
        style={{
          background: c.headerBg,
          borderBottom: `3px solid ${c.headerAccent}`,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        
        <a  href={backUrl}
          style={{
            color: c.headerAccent,
            fontWeight: 900,
            fontSize: 22,
            textDecoration: "none",
            lineHeight: 1,
          }}
        >
          &#8592;
        </a>

        <Avatar
          name={otherPersonName}
          bg={c.avatarBg}
          color={c.avatarTxt}
          size={42}
        />

        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>
            {otherPersonName || "Chat"}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 2,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: c.onlineDot,
              }}
            />
            <span
              style={{
                color: c.headerAccent,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              Connected
            </span>
          </div>
        </div>

        <div
          style={{
            background: c.headerAccent + "22",
            border: `1px solid ${c.headerAccent}55`,
            color: c.headerAccent,
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 1,
            padding: "4px 10px",
            borderRadius: 20,
          }}
        >
          {c.label}
        </div>
      </div>

      {/* ─── MESSAGES ─── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          background: "#0d1117",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              opacity: 0.5,
              marginTop: 80,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: c.ownBubbleBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              💬
            </div>
            <p
              style={{ color: "#6b7280", fontSize: 14, fontWeight: 600 }}
            >
              No messages yet — say hello!
            </p>
          </div>
        )}
           
        {dateGroups.map((group) => (
          <div key={group.label}>
            {/* Date separator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "16px 0 8px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.07)",
                }}
              />
              <span
                style={{
                  background: "#1e2530",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#9ca3af",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 12px",
                  borderRadius: 20,
                  letterSpacing: 0.5,
                }}
              >
                {group.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.07)",
                }}
              />
            </div>

            {/* Messages for this date */}
            {group.messages.map((msg, idx) => {
              // isMe = this message was sent by the currently logged in user
              const isMe = msg.sender_id === currentUserId;

              const prevMsg = group.messages[idx - 1];
              const nextMsg = group.messages[idx + 1];
              const isSameAsPrev = prevMsg?.sender_id === msg.sender_id;
              const isSameAsNext = nextMsg?.sender_id === msg.sender_id;

              const senderName = isMe
                ? currentUserName
                : msg.sender?.full_name || otherPersonName;

              // WhatsApp-style grouped bubble corners
              // When consecutive messages from same person,
              // inner corners become sharp (4px), outer stay round (18px)
              const br = {
                tl: isMe ? 18 : isSameAsPrev ? 4 : 18,
                tr: isMe ? (isSameAsPrev ? 4 : 18) : 18,
                br: isMe ? (isSameAsNext ? 4 : 18) : 18,
                bl: isMe ? 18 : isSameAsNext ? 4 : 18,
              };

              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    // MY messages on RIGHT, other person on LEFT
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: 8,
                    marginTop: isSameAsPrev ? 2 : 10,
                    opacity: msg._isTemp ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {/* Avatar — only for other person, only on last bubble in group */}
                  {!isMe && (
                    <div style={{ width: 32, flexShrink: 0 }}>
                      {!isSameAsNext && (
                        <Avatar
                          name={senderName}
                          bg={c.avatarBg}
                          color={c.avatarTxt}
                          size={30}
                        />
                      )}
                    </div>
                  )}

                  <div style={{ maxWidth: "68%", minWidth: 80 }}>
                    {/* Name label — only first bubble from other person in a group */}
                    {!isMe && !isSameAsPrev && (
                      <div
                        style={{
                          color: c.headerAccent,
                          fontSize: 11,
                          fontWeight: 800,
                          marginBottom: 3,
                          marginLeft: 4,
                          letterSpacing: 0.3,
                        }}
                      >
                        {senderName}
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      style={{
                        background: isMe ? c.ownBubbleBg : "#1e2530",
                        color: isMe ? c.ownBubbleText : "#e5e7eb",
                        padding: "8px 12px 6px",
                        borderRadius: `${br.tl}px ${br.tr}px ${br.br}px ${br.bl}px`,
                        fontSize: 14,
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        boxShadow: isMe
                          ? `0 1px 6px ${c.ownBubbleBg}55`
                          : "0 1px 4px rgba(0,0,0,0.3)",
                        border: isMe
                          ? "none"
                          : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {msg.content}

                      {/* Timestamp + read ticks */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 3,
                        }}
                      >
                        <span
  suppressHydrationWarning
  style={{
    fontSize: 10,
    color: isMe ? c.ownTimeTxt : "#6b7280",
    fontWeight: 500,
  }}
>
  {formatTime(msg.created_at)}
</span>

                        {/* Ticks only on MY messages */}
                       {isMe && (
  <span
    suppressHydrationWarning
    style={{
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: -1,
      color: msg.is_read ? c.ownTickColor : "#6b7280",
    }}
  >
    {msg._isTemp ? "⏳" : msg.is_read ? "✓✓" : "✓"}
  </span>
)}
                      </div>
                    </div>
                  </div>

                  {/* Right spacer for my messages */}
                  {isMe && (
                    <div style={{ width: 8, flexShrink: 0 }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* ─── INPUT ─── */}
      <div
        style={{
          background: c.headerBg,
          borderTop: `2px solid ${c.headerAccent}44`,
          padding: "10px 12px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            onFocus={(e) => {
              e.target.style.borderColor = c.inputRing;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.12)";
            }}
            style={{
              flex: 1,
              background: "#1e2530",
              color: "#f3f4f6",
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: 24,
              padding: "11px 18px",
              fontSize: 14,
              lineHeight: 1.5,
              resize: "none",
              outline: "none",
              minHeight: 46,
              maxHeight: 120,
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
          />

          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            onMouseDown={(e) => {
              if (input.trim())
                e.currentTarget.style.transform = "scale(0.92)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background:
                input.trim() && !sending ? c.sendBtnBg : "#2a2a2a",
              color:
                input.trim() && !sending ? c.sendBtnTxt : "#555",
              border: "none",
              cursor:
                input.trim() && !sending ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 900,
              flexShrink: 0,
              transition: "background 0.2s, transform 0.1s",
              boxShadow: input.trim()
                ? `0 2px 12px ${c.sendBtnBg}66`
                : "none",
            }}
          >
            {sending ? "⏳" : "➤"}
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 10,
            color: "#4b5563",
            fontWeight: 600,
            marginTop: 6,
            letterSpacing: 0.3,
          }}
        >
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}