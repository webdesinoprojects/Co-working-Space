"use client";

import { useState, useTransition, useMemo } from "react";
import {
  getMessageAction,
  updateMessageStatusAction,
  updateMessageNotesAction,
} from "@/features/admin/messages/actions";
import type {
  MessagesListVM,
  ContactMessageSummaryVM,
  ContactMessageDetailVM,
  MessageStatus,
} from "@/features/admin/types";
import {
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

// -- Status config --------------------------------------------------------------

const STATUS_CONFIG: Record<
  MessageStatus,
  { label: string; bg: string; text: string }
> = {
  new: { label: "New", bg: "bg-blue-100", text: "text-blue-700" },
  viewed: { label: "Viewed", bg: "bg-neutral-100", text: "text-neutral-600" },
  in_progress: {
    label: "In Progress",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
  resolved: { label: "Resolved", bg: "bg-green-100", text: "text-green-700" },
  spam: { label: "Spam", bg: "bg-red-100", text: "text-red-700" },
};

function StatusBadge({ status }: { status: MessageStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

// -- Detail Panel ---------------------------------------------------------------

function MessageDetailPanel({
  message,
  onStatusChange,
}: {
  message: ContactMessageDetailVM;
  onStatusChange: (newStatus: MessageStatus) => void;
}) {
  const [notes, setNotes] = useState(message.admin_notes ?? "");
  const [notesPending, startNotes] = useTransition();
  const [statusPending, startStatus] = useTransition();
  const [notesSaved, setNotesSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = (status: MessageStatus) => {
    setError(null);
    startStatus(async () => {
      const result = await updateMessageStatusAction({
        id: message.id,
        status,
      });
      if (result.success) {
        onStatusChange(status);
      } else {
        setError(result.error);
      }
    });
  };

  const handleSaveNotes = () => {
    setNotesSaved(false);
    setError(null);
    startNotes(async () => {
      const result = await updateMessageNotesAction({
        id: message.id,
        admin_notes: notes,
      });
      if (result.success) {
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2000);
      } else {
        setError(result.error);
      }
    });
  };

  const STATUS_ACTIONS: MessageStatus[] = [
    "new",
    "viewed",
    "in_progress",
    "resolved",
    "spam",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-white/60 bg-white/30">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-neutral-900">
              {message.full_name}
            </h3>
            <div className="flex items-center gap-4 mt-1">
              <a
                href={`mailto:${message.email}`}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <Mail size={12} />
                {message.email}
              </a>
              {message.phone && (
                <a
                  href={`tel:${message.phone}`}
                  className="text-sm text-neutral-600 flex items-center gap-1"
                >
                  <Phone size={12} />
                  {message.phone}
                </a>
              )}
            </div>
          </div>
          <StatusBadge status={message.status} />
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {new Date(message.created_at).toLocaleString()}
          </span>
          {message.interest && (
            <span className="bg-neutral-200 px-2 py-0.5 rounded-full">
              {message.interest}
            </span>
          )}
        </div>
      </div>

      {/* Message body */}
      <div className="p-5 border-b border-neutral-200 flex-shrink-0">
        <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
          Message
        </p>
        <p className="text-sm text-neutral-800 whitespace-pre-wrap leading-relaxed">
          {message.message}
        </p>
      </div>

      {/* Status actions */}
      <div className="p-5 border-b border-neutral-200">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
          Update Status
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_ACTIONS.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const isCurrent = s === message.status;
            return (
              <button
                key={s}
                type="button"
                disabled={statusPending || isCurrent}
                onClick={() => handleStatusChange(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  isCurrent
                    ? `${cfg.bg} ${cfg.text} ring-2 ring-offset-1 ring-current`
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-40"
                }`}
              >
                {statusPending && !isCurrent ? (
                  <Loader2 size={11} className="animate-spin inline" />
                ) : (
                  cfg.label
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin notes */}
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
          Admin Notes
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="Internal notes (not visible to the sender)..."
          className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm resize-none flex-1 min-h-[100px]"
        />
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={handleSaveNotes}
            disabled={notesPending}
            className="bg-neutral-900 text-white px-3 py-1.5 text-sm rounded-md hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            {notesPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : null}
            {notesPending ? "Saving..." : "Save Notes"}
          </button>
          {notesSaved && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle size={12} /> Saved
            </span>
          )}
          {error && (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} /> {error}
            </span>
          )}
        </div>
      </div>

      {/* Timestamps */}
      <div className="px-5 pb-4 text-xs text-neutral-400 space-y-0.5 border-t border-neutral-100 pt-3">
        {message.viewed_at && (
          <p>Viewed: {new Date(message.viewed_at).toLocaleString()}</p>
        )}
        {message.resolved_at && (
          <p>Resolved: {new Date(message.resolved_at).toLocaleString()}</p>
        )}
        <p>Source: {message.source_path}</p>
      </div>
    </div>
  );
}

// -- Main Inbox Component -------------------------------------------------------

export function ContactInbox({ initial }: { initial: MessagesListVM }) {
  const [messages, setMessages] = useState<ContactMessageSummaryVM[]>(
    initial.items
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ContactMessageDetailVM | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<MessageStatus | "">("");
  const [refreshPending, startRefresh] = useTransition();

  const STATUS_OPTIONS: { value: MessageStatus | ""; label: string }[] = [
    { value: "", label: "All statuses" },
    { value: "new", label: "New" },
    { value: "viewed", label: "Viewed" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "spam", label: "Spam" },
  ];

  const filtered = useMemo(() => {
    const q = searchText.toLowerCase();
    return messages.filter((m) => {
      if (statusFilter && m.status !== statusFilter) return false;
      if (
        q &&
        !m.full_name.toLowerCase().includes(q) &&
        !m.email.toLowerCase().includes(q) &&
        !(m.interest ?? "").toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [messages, searchText, statusFilter]);

  const handleSelectMessage = async (id: string) => {
    setSelectedId(id);
    setDetailLoading(true);
    setDetail(null);
    try {
      const msg = await getMessageAction(id);
      setDetail(msg);
      // Auto-mark as viewed if it's new
      if (msg && msg.status === "new") {
        await updateMessageStatusAction({ id, status: "viewed" });
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: "viewed" } : m))
        );
        if (msg) setDetail({ ...msg, status: "viewed" });
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = (newStatus: MessageStatus) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === selectedId ? { ...m, status: newStatus } : m))
    );
    if (detail) setDetail({ ...detail, status: newStatus });
  };

  const handleRefresh = () => {
    startRefresh(async () => {
      window.location.reload();
    });
  };

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left: message list */}
      <div className="w-[380px] shrink-0 flex flex-col border-r border-white/60 bg-white/50 backdrop-blur-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-neutral-900">
              Contact Inbox
              {newCount > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {newCount} new
                </span>
              )}
            </h1>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshPending}
              className="text-neutral-400 hover:text-neutral-700 p-1 disabled:opacity-40 transition-colors"
              title="Refresh"
            >
              <RefreshCw
                size={15}
                className={refreshPending ? "animate-spin" : ""}
              />
            </button>
          </div>
          <input
            type="search"
            placeholder="Search name, email, interest..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full border border-neutral-300 rounded-md px-3 py-1.5 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as MessageStatus | "")}
            className="w-full border border-neutral-300 rounded-md px-3 py-1.5 text-sm bg-white"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-neutral-400">
            {filtered.length} of {messages.length} messages
          </p>
        </div>

        {/* Message rows */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((msg) => (
            <button
              key={msg.id}
              type="button"
              onClick={() => handleSelectMessage(msg.id)}
              className={`w-full text-left px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
                selectedId === msg.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`font-medium text-sm truncate ${
                    msg.status === "new"
                      ? "text-neutral-900"
                      : "text-neutral-600"
                  }`}
                >
                  {msg.status === "new" && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1.5 mb-0.5" />
                  )}
                  {msg.full_name}
                </span>
                <StatusBadge status={msg.status} />
              </div>
              <p className="text-xs text-neutral-500 truncate mt-0.5">
                {msg.email}
              </p>
              <div className="flex items-center justify-between mt-1">
                {msg.interest && (
                  <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500">
                    {msg.interest}
                  </span>
                )}
                <span className="text-[10px] text-neutral-400 ml-auto">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-neutral-500 text-sm">
              {messages.length === 0
                ? "No messages yet."
                : "No messages match your filters."}
            </div>
          )}
        </div>
      </div>

      {/* Right: detail panel */}
      <div className="flex-1 overflow-y-auto bg-white">
        {detailLoading && (
          <div className="flex items-center justify-center h-full text-neutral-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        )}
        {!detailLoading && detail && (
          <MessageDetailPanel
            key={detail.id}
            message={detail}
            onStatusChange={handleStatusChange}
          />
        )}
        {!detailLoading && !detail && (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-3">
            <XCircle size={40} className="opacity-30" />
            <p className="text-sm">Select a message to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
