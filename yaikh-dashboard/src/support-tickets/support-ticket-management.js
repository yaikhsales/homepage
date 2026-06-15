import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  MessageSquare,
  TrendingUp,
  X,
  MessageCircle,
  Video,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";
import ImageViewer from "../components/ImageViewer";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

const API_BASE =
  process.env.REACT_APP_YAIKH_COM ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "");

const DEPTS = ["HR", "Production", "Warehouse", "Admin", "IT", "GA", "CSR", "YAI"];
const NATURES = ["Aircon", "Electric", "Water", "Cleaning", "Repair", "6S", "H&S", "Other"];
const URGENCIES = ["Low", "Normal", "High", "Critical"];

const STATUS_COLORS = {
  Open: "bg-red-100 text-red-700",
  Assigned: "bg-gray-200 text-gray-700",
  InProgress: "bg-yellow-100 text-yellow-800",
  Fixed: "bg-emerald-100 text-emerald-700",
  Closed: "bg-green-100 text-green-700",
};

const OPEN_STATUSES = new Set(["Open", "Assigned", "InProgress"]);

const SupportTicketManagement = ({ onBack, currentUser }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeView, setActiveView] = useState("list");
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedNature, setSelectedNature] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImagePath, setSelectedImagePath] = useState("");
  const [showRaiseForm, setShowRaiseForm] = useState(false);
  const [showActionModal, setShowActionModal] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const actorName =
    currentUser?.name || currentUser?.id || "Admin User";

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (selectedDept) qs.set("dept", selectedDept);
      if (selectedNature) qs.set("nature", selectedNature);
      const r = await fetch(`${API_BASE}/api/support-tickets?${qs.toString()}`);
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || `HTTP ${r.status}`);
      setTickets(data.items || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [selectedDept, selectedNature]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const counts = tickets.reduce(
    (acc, tk) => {
      acc.total++;
      acc[tk.status] = (acc[tk.status] || 0) + 1;
      if (OPEN_STATUSES.has(tk.status)) acc.openTotal++;
      else acc.doneTotal++;
      return acc;
    },
    { total: 0, openTotal: 0, doneTotal: 0 }
  );

  const handleTimeline = (ticket) => {
    setSelectedTicket(ticket);
    setShowTimeline(true);
  };

  const handleAction = (ticket, action) => {
    setShowActionModal({ ticket, action });
  };

  const submitAction = async ({ ticket, action, payload }) => {
    try {
      const r = await fetch(`${API_BASE}/api/support-tickets/${ticket._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, actor: actorName, ...payload }),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || `HTTP ${r.status}`);
      await fetchTickets();
      setShowActionModal(null);
    } catch (e) {
      alert(`Action failed: ${e.message}`);
    }
  };

  const submitRaise = async (payload) => {
    try {
      const r = await fetch(`${API_BASE}/api/support-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, from: payload.from || actorName }),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || `HTTP ${r.status}`);
      await fetchTickets();
      setShowRaiseForm(false);
    } catch (e) {
      alert(`Could not raise ticket: ${e.message}`);
    }
  };

  const getStatusButton = (status) => {
    const cls = STATUS_COLORS[status] || "bg-gray-200 text-gray-700";
    return (
      <button className={`px-2 py-1 rounded-lg text-xs font-semibold ${cls} w-fit`}>
        {status}
      </button>
    );
  };

  const nextActionsFor = (ticket) => {
    switch (ticket.status) {
      case "Open":
        return [{ label: "Assign", action: "assign" }];
      case "Assigned":
        return [
          { label: "Start", action: "in-progress" },
          { label: "Reassign", action: "assign" },
        ];
      case "InProgress":
        return [{ label: "Mark Fixed", action: "fix" }];
      case "Fixed":
        return [
          { label: "Close", action: "close" },
          { label: "Reopen", action: "reopen" },
        ];
      case "Closed":
        return [{ label: "Reopen", action: "reopen" }];
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-200 flex-shrink-0 flex flex-col border-r border-gray-300">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold text-gray-800">{t("scheduledTicket")}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          <div>
            <div className="px-2 py-1 text-xs font-bold text-gray-600 uppercase">
              Department
            </div>
            <button
              onClick={() => setSelectedDept(null)}
              className={`w-full text-left p-2 rounded text-sm ${
                selectedDept === null ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Departments
            </button>
            {DEPTS.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={`w-full text-left p-2 rounded text-sm ${
                  selectedDept === d ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div>
            <div className="px-2 py-1 text-xs font-bold text-gray-600 uppercase">
              Nature
            </div>
            <button
              onClick={() => setSelectedNature(null)}
              className={`w-full text-left p-2 rounded text-sm ${
                selectedNature === null
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {NATURES.map((n) => (
              <button
                key={n}
                onClick={() => setSelectedNature(n)}
                className={`w-full text-left p-2 rounded text-sm ${
                  selectedNature === n
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => (onBack ? onBack() : navigate(-1))}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              {t("back")}
            </button>

            <div className="flex gap-2 absolute left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => setActiveView("list")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeView === "list"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 border border-gray-300"
                }`}
              >
                {t("list")}
              </button>
              <button
                onClick={() => {
                  setActiveView("calendar");
                  setSelectedImagePath("/assets/support-ticket/calendar.jpg");
                  setShowImageViewer(true);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeView === "calendar"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 border border-gray-300"
                }`}
              >
                {t("calendar")}
              </button>
              <button
                onClick={() => {
                  setActiveView("kpi");
                  setSelectedImagePath("/assets/support-ticket/kpi.jpg");
                  setShowImageViewer(true);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  activeView === "kpi"
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-600 border border-gray-300"
                }`}
              >
                <BarChart3 size={16} />
                {t("kpi")}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchTickets}
                className="p-2 hover:bg-slate-200 rounded-lg border border-slate-300"
                title="Refresh"
              >
                <RefreshCw size={18} className={`text-blue-600 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => setShowRaiseForm(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Raise Ticket
              </button>
              <button
                onClick={() =>
                  setSelectedVideo(
                    "/assets/short-video-training/new-updated-vd/Support-Ticket.mp4"
                  )
                }
                className="p-2 hover:bg-slate-200 rounded-lg border border-slate-300"
                title="Video Training"
              >
                <Video size={20} className="text-blue-600" />
              </button>
              <button
                onClick={() =>
                  setSelectedDocument("/assets/report-training/support-ticket-management.pdf")
                }
                className="p-2 hover:bg-slate-200 rounded-lg border border-slate-300"
                title="Report Training"
              >
                <FileText size={20} className="text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {/* KPI tiles — live data */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {t("ticketsOverview")}{" "}
              {(selectedDept || selectedNature) && (
                <span className="text-sm text-gray-500 font-normal">
                  · {selectedDept || "all depts"}
                  {selectedNature ? ` · ${selectedNature}` : ""}
                </span>
              )}
            </h3>
            <div className="grid grid-cols-6 gap-4">
              <KpiTile color="bg-blue-500" label={t("total") || "Total"} value={counts.total} />
              <KpiTile color="bg-red-500" label="Open" value={counts.Open || 0} />
              <KpiTile color="bg-gray-500" label="Assigned" value={counts.Assigned || 0} />
              <KpiTile color="bg-yellow-500" label="In Progress" value={counts.InProgress || 0} />
              <KpiTile color="bg-emerald-500" label="Fixed" value={counts.Fixed || 0} />
              <KpiTile color="bg-green-500" label="Closed" value={counts.Closed || 0} />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Tickets Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">No</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Image</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Subject</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Assigned To</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {!loading && tickets.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-10">
                      No tickets yet. Click "Raise Ticket" to create the first one.
                    </td>
                  </tr>
                )}
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-800">{ticket.no}</div>
                      <div className="text-xs text-gray-500">{ticket.urgency}</div>
                    </td>
                    <td className="px-4 py-4">
                      {ticket.photo ? (
                        <img
                          src={ticket.photo}
                          alt={ticket.subject}
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            e.target.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">
                          From: {ticket.from} • {ticket.dept} • {ticket.date}
                        </div>
                        {ticket.planDate && (
                          <div className="text-xs text-gray-600">
                            Plan Date: {ticket.planDate}
                          </div>
                        )}
                        <div className="text-xs text-gray-600">Nature: {ticket.nature}</div>
                        <div className="font-semibold text-gray-800 mt-2">
                          Subject: {ticket.subject}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">{ticket.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-gray-600">
                        Assigned to:{" "}
                        <span className="font-bold text-gray-800">
                          {ticket.assignee || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        {getStatusButton(ticket.status)}
                        <button
                          onClick={() => handleTimeline(ticket)}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-green-200 w-fit"
                        >
                          <TrendingUp size={10} />
                          {t("timeline")}
                        </button>
                        {nextActionsFor(ticket).map((a) => (
                          <button
                            key={a.action}
                            onClick={() => handleAction(ticket, a.action)}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 w-fit"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Timeline Modal — live timeline from Mongo */}
      {showTimeline && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Timeline · {selectedTicket.no}
                </h2>
                <div className="text-xs text-gray-500 mt-1">{selectedTicket.subject}</div>
              </div>
              <button
                onClick={() => {
                  setShowTimeline(false);
                  setSelectedTicket(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {(selectedTicket.timeline || []).map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      {idx < selectedTicket.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-sm text-gray-600 mb-1">
                        {new Date(event.dateTime).toLocaleString()}
                      </div>
                      <div className="font-bold text-gray-800 mb-1">
                        {event.status}
                        {event.actor ? (
                          <span className="text-xs font-normal text-gray-500 ml-2">
                            by {event.actor}
                          </span>
                        ) : null}
                      </div>
                      <div className="text-sm text-gray-700">{event.description}</div>
                    </div>
                  </div>
                ))}
                {(!selectedTicket.timeline || selectedTicket.timeline.length === 0) && (
                  <div className="text-sm text-gray-500">No timeline events.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raise Ticket Modal */}
      {showRaiseForm && (
        <RaiseTicketForm
          actorName={actorName}
          onCancel={() => setShowRaiseForm(false)}
          onSubmit={submitRaise}
        />
      )}

      {/* Action Modal */}
      {showActionModal && (
        <ActionModal
          ticket={showActionModal.ticket}
          action={showActionModal.action}
          onCancel={() => setShowActionModal(null)}
          onSubmit={(payload) => submitAction({ ...showActionModal, payload })}
        />
      )}

      {/* Image Viewer */}
      {showImageViewer && (
        <ImageViewer
          imagePath={selectedImagePath}
          onClose={() => {
            setShowImageViewer(false);
            setSelectedImagePath("");
            setActiveView("list");
          }}
        />
      )}

      {/* Bot Button */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        title="Ask Admin PA about tickets"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent onClose={() => setIsBotOpen(false)} moduleContext="Support Ticket Management" />
      )}
      {selectedVideo && (
        <VideoViewer videoPath={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
      {selectedDocument && (
        <DocumentViewer documentPath={selectedDocument} onClose={() => setSelectedDocument(null)} />
      )}
    </div>
  );
};

const KpiTile = ({ color, label, value }) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-20 h-20 rounded ${color} flex items-center justify-center text-white text-2xl font-bold mb-2`}
    >
      {value}
    </div>
    <div className="text-sm font-semibold text-gray-700 text-center">{label}</div>
  </div>
);

const RaiseTicketForm = ({ actorName, onCancel, onSubmit }) => {
  const [from, setFrom] = useState(actorName);
  const [dept, setDept] = useState(DEPTS[0]);
  const [nature, setNature] = useState(NATURES[0]);
  const [urgency, setUrgency] = useState("Normal");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ from, dept, nature, urgency, subject, description, photo: photo || null });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <form onSubmit={handle} className="bg-white rounded-lg shadow-2xl w-full max-w-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Raise Support Ticket</h2>
          <button type="button" onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Labeled label="From (raised by)">
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
              className="w-full p-2 border rounded"
              placeholder="e.g. YM0695 - ROUS NAL"
            />
          </Labeled>
          <Labeled label="Department">
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {DEPTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Labeled>
          <Labeled label="Nature">
            <select
              value={nature}
              onChange={(e) => setNature(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {NATURES.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </Labeled>
          <Labeled label="Urgency">
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {URGENCIES.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </Labeled>
        </div>

        <Labeled label="Subject">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder="AC broken in meeting room B"
          />
        </Labeled>
        <Labeled label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full p-2 border rounded resize-none"
            placeholder="Compressor stopped at 09:14. Room is unusable for upcoming standup."
          />
        </Labeled>
        <Labeled label="Photo URL (optional)">
          <input
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://..."
          />
        </Labeled>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit ticket"}
          </button>
        </div>
      </form>
    </div>
  );
};

const ActionModal = ({ ticket, action, onCancel, onSubmit }) => {
  const [assignee, setAssignee] = useState(ticket.assignee || "");
  const [planDate, setPlanDate] = useState("");
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");

  const ACTION_LABEL = {
    assign: ticket.assignee ? "Reassign" : "Assign",
    "in-progress": "Mark in-progress",
    fix: "Mark fixed",
    close: "Close ticket",
    reopen: "Reopen ticket",
  };

  const handle = (e) => {
    e.preventDefault();
    const payload = {};
    if (action === "assign") {
      payload.assignee = assignee;
      if (planDate) payload.planDate = planDate;
    } else if (action === "reopen") {
      if (reason) payload.reason = reason;
    } else if (note) {
      payload.note = note;
    }
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <form onSubmit={handle} className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {ACTION_LABEL[action]} · {ticket.no}
          </h2>
          <button type="button" onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="text-sm text-gray-600">{ticket.subject}</div>

        {action === "assign" && (
          <>
            <Labeled label="Assignee">
              <input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                required
                className="w-full p-2 border rounded"
                placeholder="e.g. YM0988 - Prak Chenda"
              />
            </Labeled>
            <Labeled label="Plan date (optional)">
              <input
                type="date"
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </Labeled>
          </>
        )}

        {(action === "in-progress" || action === "fix" || action === "close") && (
          <Labeled label={action === "fix" ? "Resolution note" : "Note (optional)"}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded resize-none"
              placeholder={
                action === "fix"
                  ? "What was actually fixed?"
                  : "Optional context for the timeline"
              }
            />
          </Labeled>
        )}

        {action === "reopen" && (
          <Labeled label="Reason for reopening">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded resize-none"
              placeholder="Why is this ticket being reopened?"
            />
          </Labeled>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

const Labeled = ({ label, children }) => (
  <label className="block">
    <span className="text-xs font-semibold text-gray-600">{label}</span>
    <div className="mt-1">{children}</div>
  </label>
);

export default SupportTicketManagement;
