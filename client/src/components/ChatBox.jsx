import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";
import { messageAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Send, User as UserIcon, ShieldAlert } from "lucide-react";

const ChatBox = ({ complaintId, citizen, agent, status }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!complaintId) return;

    // 1. Fetch chat history
    const fetchChatHistory = async () => {
      try {
        const res = await messageAPI.getByComplaint(complaintId);
        if (res.success) {
          setMessages(res.messages || []);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    fetchChatHistory();

    // 2. Join socket room
    socket.emit("joinRoom", complaintId);

    // 3. Mark messages as read
    const markAsRead = async () => {
      try {
        await messageAPI.markRead(complaintId);
      } catch (err) {
        console.warn("Could not mark messages as read:", err);
      }
    };
    markAsRead();

    // 4. Listen for incoming messages
    const handleReceiveMessage = (msgData) => {
      // Avoid duplicates
      setMessages((prev) => {
        if (prev.some((m) => m._id === msgData._id || (m.createdAt === msgData.createdAt && m.message === msgData.message))) {
          return prev;
        }
        return [...prev, msgData];
      });
      scrollToBottom();
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [complaintId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Determine receiver
  // If the logged in user is the citizen, the receiver is the agent.
  // If the logged in user is the agent, the receiver is the citizen.
  const getReceiverId = () => {
    if (!user) return null;
    const currentUserId = user.id || user._id;
    const citizenId = citizen?.id || citizen?._id;
    const agentId = agent?.id || agent?._id;

    if (currentUserId === citizenId) {
      return agentId;
    }
    if (currentUserId === agentId) {
      return citizenId;
    }
    // Fallback: if Admin is viewing, send to agent or citizen
    return citizenId || agentId;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    const receiverId = getReceiverId();
    if (!receiverId) {
      alert("Cannot send message. An agent must be assigned first.");
      return;
    }

    try {
      setSending(true);
      const res = await messageAPI.send({
        complaintId,
        receiverId,
        message: text.trim(),
      });

      if (res.success && res.data) {
        const payload = {
          ...res.data,
          // Ensure sender field is populated for UI presentation
          sender: {
            _id: user.id || user._id,
            name: user.name,
            role: user.role,
          },
          complaintId,
        };

        // Emit message to Socket
        socket.emit("sendMessage", payload);

        // Update local state
        setMessages((prev) => [...prev, payload]);
        setText("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      alert(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const isMyMessage = (msg) => {
    const currentUserId = user?.id || user?._id;
    const msgSenderId = msg.sender?._id || msg.sender;
    return msgSenderId === currentUserId;
  };

  const hasAgent = !!agent;

  return (
    <div className="flex flex-col h-[500px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gov-primary text-white px-5 py-4 flex items-center justify-between border-b border-gov-accent">
        <div>
          <h4 className="text-sm font-bold m-0 flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span>Real-time Assistance Chat</span>
          </h4>
          <p className="text-[10px] text-blue-100 m-0 mt-0.5">
            {hasAgent ? `Chatting with Agent: ${agent.name}` : "Grievance Chat Room"}
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <UserIcon className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-500 font-medium">No messages yet.</p>
            <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">
              Ask questions or update status directly in this secure chat channel.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = isMyMessage(msg);
            const role = msg.sender?.role || "USER";
            return (
              <div
                key={msg._id || index}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                    isMe
                      ? "bg-gov-primary text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold ${isMe ? "text-blue-100" : "text-slate-800"}`}>
                      {msg.sender?.name || "System"}
                    </span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      role === "ADMIN"
                        ? "bg-red-500 text-white"
                        : role === "AGENT"
                        ? "bg-amber-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}>
                      {role}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed m-0 break-words">
                    {msg.message}
                  </p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {hasAgent || (user && user.role === "ADMIN") ? (
        <form
          onSubmit={handleSend}
          className="border-t border-slate-200 bg-white p-3 flex items-center space-x-2"
        >
          {(() => {
            const isAgentBlocked = user && user.role === "AGENT" && status === "REJECTED";
            return (
              <>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={isAgentBlocked ? "This complaint is REJECTED. Chat is disabled for agents." : "Type your message here..."}
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gov-primary bg-slate-50 focus:bg-white transition"
                  disabled={sending || isAgentBlocked}
                />
                <button
                  type="submit"
                  disabled={!text.trim() || sending || isAgentBlocked}
                  className="bg-gov-primary hover:bg-gov-accent text-white p-2.5 rounded-lg disabled:opacity-50 transition shadow-sm flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </>
            );
          })()}
        </form>
      ) : (
        <div className="bg-amber-50 border-t border-amber-100 p-4 text-center flex items-center justify-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span className="text-xs text-amber-800 font-medium">
            Waiting for an agent to be assigned before starting live chat.
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
