import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import api from '../../utils/api';

const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'waiting_human', label: 'Waiting' },
  { key: 'human_active', label: 'Active' },
  { key: 'resolved', label: 'Resolved' },
];

const STATUS_BADGE = {
  waiting_human: 'bg-amber-50 text-amber-600',
  human_active: 'bg-emerald-50 text-emerald-600',
  resolved: 'bg-gray-100 text-gray-500',
  async: 'bg-blue-50 text-blue-600',
  bot: 'bg-violet-50 text-violet-600',
};

const fmtTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const fmtDate = (ts) => new Date(ts).toLocaleDateString();

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [thread, setThread] = useState(null);     // { conversation, messages }
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [supportOnline, setSupportOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const loadList = useCallback(async () => {
    try {
      const res = await api.get('/chat/admin/conversations', { params: statusFilter ? { status: statusFilter } : {} });
      setConversations(res.data.data);
    } catch {
      /* keep prior list on transient errors */
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const loadThread = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/chat/admin/conversations/${id}`);
      setThread(res.data.data);
    } catch {
      /* ignore */
    }
  }, []);

  // Support online/offline state
  useEffect(() => {
    api.get('/settings/support_chat')
      .then((res) => setSupportOnline(res.data.data?.online === true))
      .catch(() => {});
  }, []);

  // Poll the conversation list
  useEffect(() => {
    loadList();
    const t = setInterval(loadList, 5000);
    return () => clearInterval(t);
  }, [loadList]);

  // Poll the open thread
  useEffect(() => {
    if (!selectedId) return;
    loadThread(selectedId);
    const t = setInterval(() => loadThread(selectedId), 4000);
    return () => clearInterval(t);
  }, [selectedId, loadThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages?.length]);

  const toggleSupport = async () => {
    const next = !supportOnline;
    setSupportOnline(next);
    try {
      await api.put('/settings/support_chat', { online: next });
      toast.success(next ? 'Live support is now ONLINE' : 'Live support set to offline');
    } catch {
      setSupportOnline(!next);
      toast.error('Failed to update support status');
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    const text = reply.trim();
    if (!text || !selectedId) return;
    setSending(true);
    try {
      await api.post(`/chat/admin/conversations/${selectedId}/messages`, { text });
      setReply('');
      await loadThread(selectedId);
      loadList();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const resolveConversation = async () => {
    if (!selectedId) return;
    try {
      await api.put(`/chat/admin/conversations/${selectedId}/status`, { status: 'resolved' });
      toast.success('Conversation resolved');
      loadThread(selectedId);
      loadList();
    } catch {
      toast.error('Failed to resolve');
    }
  };

  const customerName = (c) => c?.customer?.user?.name || c?.customer?.name || 'Guest';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <p className="text-gray-500 text-sm">Answer customer questions in real time.</p>
        </div>
        <button
          onClick={toggleSupport}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors ${
            supportOnline ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${supportOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
          {supportOnline ? 'Support Online' : 'Support Offline'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex" style={{ height: '70vh' }}>
        {/* Conversation list */}
        <div className="w-80 border-r border-gray-100 flex flex-col shrink-0">
          <div className="flex gap-1 p-2 border-b border-gray-100">
            {STATUS_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  statusFilter === t.key ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-400 text-sm">Loading…</div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No conversations yet.</div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setSelectedId(c._id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selectedId === c._id ? 'bg-secondary/40' : ''
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm truncate flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${c.customerOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}
                        title={c.customerOnline ? 'Online now' : 'Away'}
                      ></span>
                      {customerName(c)}
                      {c.unreadForAdmin && <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">{fmtDate(c.lastMessageAt)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {c.lastMessageSender === 'admin' ? 'You: ' : ''}{c.lastMessageText || 'New conversation'}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_BADGE[c.status] || 'bg-gray-100 text-gray-500'}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Thread */}
        <div className="flex-1 flex flex-col min-w-0">
          {!thread ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation to view the chat.
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${thread.conversation.customerOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></span>
                    {customerName(thread.conversation)}
                    <span className={`text-[10px] font-semibold ${thread.conversation.customerOnline ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {thread.conversation.customerOnline ? 'Online' : 'Away'}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {thread.conversation.customer?.email || 'No email (guest)'}
                  </p>
                </div>
                {thread.conversation.status !== 'resolved' && (
                  <button
                    onClick={resolveConversation}
                    className="px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50/50">
                {thread.messages.map((m) => {
                  const isAdmin = m.sender === 'admin';
                  const isSystem = m.sender === 'system';
                  if (isSystem) {
                    return (
                      <div key={m._id} className="text-center">
                        <span className="text-[11px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{m.text}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={m._id} className={`flex flex-col max-w-[75%] ${isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                      <div className={`p-3 text-[13px] leading-relaxed shadow-sm break-words rounded-2xl ${
                        isAdmin ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {m.senderName ? `${m.senderName} · ` : ''}{fmtTime(m.createdAt)}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply box */}
              <form onSubmit={sendReply} className="border-t border-gray-100 p-3 flex gap-2 items-center">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply…"
                  className="flex-1 border-2 border-gray-100 focus:border-primary bg-gray-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!reply.trim() || sending}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-40"
                >
                  {sending ? '…' : 'Send'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
