import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  MessageSquare,
  TrendingUp,
  X,
  MessageCircle,
  Video,
  FileText,
} from "lucide-react";
import ImageViewer from "../components/ImageViewer";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

const SupportTicketManagement = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    GA: true,
    HR: true,
    IT: false,
    YAI: false,
  });
  const [expandedCSR, setExpandedCSR] = useState(true);
  const [activeView, setActiveView] = useState("list");
  const [selectedSection, setSelectedSection] = useState("GA - Main");
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackTicket, setFeedbackTicket] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImagePath, setSelectedImagePath] = useState("");

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCSR = () => {
    setExpandedCSR((prev) => !prev);
  };

  // Sample ticket data matching the image
  const tickets = [
    {
      no: 687,
      ref: "REF0716",
      image:
        "https://ym.yaikh.com/storage/tickets/66d5790ccbee1f2a920e2dfa/T8CqwFJraSdpGjQYZEDzm75yevLXmnDJnL2fuexW.jpg",
      from: "YM0695 - ROUS NAL",
      department: "Warehouse",
      date: "2026-01-06",
      planDate: "2026-01-06",
      nature: "6S, H&S",
      subject: "ម៉ូតូកង់បី អស់សាំង",
      description: "ម៉ូតូកង់បីដឹកក្រណាត់ទៅតុកកាត់អស់សាំង",
      assignedTo: "YM2250 - Prak Chanveasna",
      status: "Completed",
    },
    {
      no: 686,
      ref: "REF0714",
      image:
        "https://ym.yaikh.com/storage/tickets/66d5790ccbee1f2a920e2dfa/i7tSux5JGnwp57igneyRO2Ltsn2aW5acoGLdheNl.jpg",
      from: "YM0695 - ROUS NAL",
      department: "Warehouse",
      date: "2026-01-06",
      planDate: "2026-01-06",
      nature: "6S, H&S",
      subject: "Forklift អស់ប្រេងម៉ាស៊ុត",
      description: "Forklift អស់ប្រេងម៉ាស៊ុត",
      assignedTo: "YM0988 - Prak Chenda",
      status: "Completed",
    },
    {
      no: 685,
      ref: "REF1344",
      image:
        "https://ym.yaikh.com/storage/tickets/692666c3df0e534e60069473/cJwFGVk5ghvABSMGbzaineLrNYD79hWHb32A8b4v.png",
      from: "YM8855 - Uth Chantha",
      department: "YM Admin",
      date: "2026-01-05",
      planDate: null,
      nature: "Repair",
      subject: "Repair Request - Rainwater Gutter at WH-12K",
      description:
        "The rainwater gutter at Warehouse 12000 is damaged and requires repair. It leaks from joints and needs immediate inspection and maintenance.",
      assignedTo: "YMTM - YMTM",
      status: "Assigned",
    },
    {
      no: 684,
      ref: "REF1315",
      image:
        "https://ym.yaikh.com/storage/tickets/692666c3df0e534e60069473/O1NrjkTH4jL36K5Ql5l3oF9hVvUcTvzlpob4lHLs.jpg",
      from: "YM8855 - Uth Chantha",
      department: "YM Admin",
      date: "2026-01-05",
      planDate: "2026-01-06",
      nature: "6S, H&S",
      subject: "Forklift ZDCC-006 & LDTC-003 (DISPOSAL)",
      description:
        "The forklift has no further repair value. Management has advised disposal. Please support in suspending repairs and assist with disposal steps.",
      assignedTo: "YM0988 - Prak Chenda",
      status: "Received",
    },
  ];

  const getStatusButton = (status) => {
    const buttonClass =
      {
        Completed: "bg-green-100 text-green-700",
        Assigned: "bg-gray-200 text-gray-700",
        Received: "bg-teal-100 text-teal-700",
      }[status] || "bg-gray-200 text-gray-700";

    return (
      <button
        className={`px-2 py-1 rounded-lg text-xs font-semibold ${buttonClass} w-fit`}
      >
        {status}
      </button>
    );
  };

  // Sample timeline data for each ticket
  const getTimelineData = (ticket) => {
    // Return timeline events based on ticket number
    if (ticket.no === 685) {
      return [
        {
          dateTime: "2026-01-05 13:15:09",
          status: "Created",
          description: "Ticket was created by YM8855 - Uth Chantha.",
        },
        {
          dateTime: "2026-01-05 13:20:19",
          status: "Assigned",
          description:
            "Ticket was assigned from YM0389 - CHAY PHANO to YM0988 - Prak Chenda.",
        },
        {
          dateTime: "2026-01-06 08:03:06",
          status: "Received",
          description:
            "Ticket was planned to complete by YM0988 - Prak Chenda. Plan Date: 2026-01-06 08:02 AM.",
        },
      ];
    } else if (ticket.no === 686) {
      return [
        {
          dateTime: "2026-01-06 09:00:00",
          status: "Created",
          description: "Ticket was created by YM0695 - ROUS NAL.",
        },
        {
          dateTime: "2026-01-06 09:15:00",
          status: "Assigned",
          description: "Ticket was assigned to YM0988 - Prak Chenda.",
        },
        {
          dateTime: "2026-01-06 14:30:00",
          status: "Completed",
          description: "Ticket was completed by YM0988 - Prak Chenda.",
        },
      ];
    } else if (ticket.no === 687) {
      return [
        {
          dateTime: "2026-01-06 10:00:00",
          status: "Created",
          description: "Ticket was created by YM0695 - ROUS NAL.",
        },
        {
          dateTime: "2026-01-06 10:20:00",
          status: "Assigned",
          description: "Ticket was assigned to YM2250 - Prak Chanveasna.",
        },
        {
          dateTime: "2026-01-06 16:00:00",
          status: "Completed",
          description: "Ticket was completed by YM2250 - Prak Chanveasna.",
        },
      ];
    } else {
      return [
        {
          dateTime: "2026-01-05 12:00:00",
          status: "Created",
          description: `Ticket was created by ${ticket.from}.`,
        },
        {
          dateTime: ticket.planDate
            ? `${ticket.planDate} 08:00:00`
            : "2026-01-06 08:00:00",
          status: "Assigned",
          description: `Ticket was assigned to ${ticket.assignedTo}.`,
        },
      ];
    }
  };

  const handleTimeline = (ticket) => {
    setSelectedTicket(ticket);
    setShowTimeline(true);
  };

  const handleFeedback = (ticket) => {
    setFeedbackTicket(ticket);
    setFeedbackText("");
    setShowFeedback(true);
  };

  const handleSubmitFeedback = () => {
    // Handle feedback submission
    console.log(
      "Feedback submitted for ticket:",
      feedbackTicket?.no,
      feedbackText,
    );
    // You can add API call here to submit feedback
    setShowFeedback(false);
    setFeedbackTicket(null);
    setFeedbackText("");
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-200 flex-shrink-0 flex flex-col border-r border-gray-300">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold text-gray-800">
            {t("scheduledTicket")}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {/* GA Section */}
          <div className="mb-2">
            <button
              onClick={() => toggleSection("GA")}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-300 rounded text-left font-semibold text-gray-700"
            >
              <span>GA</span>
              <span>{expandedSections.GA ? "−" : "+"}</span>
            </button>
            {expandedSections.GA && (
              <div className="ml-4 mt-1 space-y-1">
                {[
                  "Main",
                  "Electric",
                  "Water",
                  "Aircon",
                  "Carteen",
                  "Cleaning",
                  "Infirmary",
                  "Hotel Booking",
                  "Welding",
                  "Purchase",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedSection(`GA - ${item}`)}
                    className={`w-full text-left p-2 rounded hover:bg-gray-300 text-sm ${
                      selectedSection === `GA - ${item}`
                        ? "bg-blue-500 text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* HR Section */}
          <div className="mb-2">
            <button
              onClick={() => toggleSection("HR")}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-300 rounded text-left font-semibold text-gray-700"
            >
              <span>HR</span>
              <span>{expandedSections.HR ? "−" : "+"}</span>
            </button>
            {expandedSections.HR && (
              <div className="ml-4 mt-1 space-y-1">
                <button
                  onClick={() => setSelectedSection("HR - Main")}
                  className={`w-full text-left p-2 rounded hover:bg-gray-300 text-sm ${
                    selectedSection === "HR - Main"
                      ? "bg-blue-500 text-white"
                      : "text-gray-700"
                  }`}
                >
                  Main
                </button>
                <div>
                  <button
                    onClick={toggleCSR}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-300 text-sm text-gray-700"
                  >
                    <span>CSR</span>
                    <span>{expandedCSR ? "−" : "+"}</span>
                  </button>
                  {expandedCSR && (
                    <div className="ml-4 mt-1 space-y-1">
                      {["Main", "6S", "Health And Safety", "Visitor/Audit"].map(
                        (item) => (
                          <button
                            key={item}
                            onClick={() =>
                              setSelectedSection(`HR - CSR - ${item}`)
                            }
                            className={`w-full text-left p-2 rounded hover:bg-gray-300 text-xs ${
                              selectedSection === `HR - CSR - ${item}`
                                ? "bg-blue-500 text-white"
                                : "text-gray-700"
                            }`}
                          >
                            {item}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* IT Section */}
          <div className="mb-2">
            <button
              onClick={() => toggleSection("IT")}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-300 rounded text-left font-semibold text-gray-700"
            >
              <span>IT</span>
              <span>{expandedSections.IT ? "−" : "+"}</span>
            </button>
            {expandedSections.IT && (
              <div className="ml-4 mt-1 space-y-1">
                <button className="w-full text-left p-2 rounded hover:bg-gray-300 text-sm text-gray-700">
                  Main
                </button>
              </div>
            )}
          </div>

          {/* YAI Section */}
          <div className="mb-2">
            <button
              onClick={() => toggleSection("YAI")}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-300 rounded text-left font-semibold text-gray-700"
            >
              <span>YAI</span>
              <span>{expandedSections.YAI ? "−" : "+"}</span>
            </button>
            {expandedSections.YAI && (
              <div className="ml-4 mt-1 space-y-1">
                <button className="w-full text-left p-2 rounded hover:bg-gray-300 text-sm text-gray-700">
                  Main
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {/* Left: Back Button */}
            <button
              onClick={() => (onBack ? onBack() : navigate(-1))}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              {t("back")}
            </button>

            {/* Center: View Toggle Buttons */}
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

            {/* Right: Empty space for balance */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setSelectedVideo(
                    "/assets/short-video-training/new-updated-vd/Support-Ticket.mp4",
                  )
                }
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300 relative z-[202]"
                title="Video Training"
              >
                <Video size={20} className="text-blue-600" />
              </button>
              <button
                onClick={() =>
                  setSelectedDocument(
                    "/assets/report-training/support-ticket-management.pdf",
                  )
                }
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300 relative z-[202]"
                title="Report Training"
              >
                <FileText size={20} className="text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {/* Overview Sections - Side by Side */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Ticket's Overview */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("ticketsOverview")}
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded bg-green-400 flex items-center justify-center text-white text-2xl font-bold mb-2">
                    1977
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {t("total")}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded bg-red-400 flex items-center justify-center text-white text-2xl font-bold mb-2">
                    0
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {t("assign")}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded bg-red-500 flex items-center justify-center text-white text-2xl font-bold mb-2">
                    687
                  </div>
                  <button className="text-sm font-semibold text-gray-700 underline hover:text-blue-600">
                    {t("requested")}
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded bg-blue-400 flex items-center justify-center text-white text-2xl font-bold mb-2">
                    1290
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {t("scheduled")}
                  </div>
                </div>
              </div>
            </div>

            {/* GA Main Team's progress */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("gaMainTeamProgress")}
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: t("toDo"), value: 5, color: "bg-gray-400" },
                  { label: t("planned"), value: 10, color: "bg-teal-400" },
                  { label: t("inProgress"), value: 11, color: "bg-yellow-400" },
                  { label: t("done"), value: 1923, color: "bg-green-400" },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-20 h-20 rounded ${item.color} flex items-center justify-center text-white text-2xl font-bold mb-2`}
                    >
                      {item.value}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* My Tickets Button - Positioned in content area */}
          <div className="flex justify-end mb-6">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              {t("myTickets")}
            </button>
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    {t("no")}
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    {t("image")}
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    {t("subject")}
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    {t("assignedTo")}
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    {t("status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-800">
                        {ticket.no}
                      </div>
                      <div className="text-xs text-gray-500">{ticket.ref}</div>
                    </td>
                    <td className="px-4 py-4">
                      <img
                        src={ticket.image}
                        alt={ticket.subject}
                        className="w-16 h-16 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          e.target.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">
                          From: {ticket.from} • {ticket.department} •{" "}
                          {ticket.date}
                        </div>
                        {ticket.planDate && (
                          <div className="text-xs text-gray-600">
                            Plan Date: {ticket.planDate}
                          </div>
                        )}
                        <div className="text-xs text-gray-600">
                          Nature: {ticket.nature}
                        </div>
                        <div className="font-semibold text-gray-800 mt-2">
                          Subject: {ticket.subject}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          {ticket.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-gray-600">
                        Assigned to:{" "}
                        <span className="font-bold text-gray-800">
                          {ticket.assignedTo}
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
                        <button
                          onClick={() => handleFeedback(ticket)}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-blue-200 w-fit"
                        >
                          <MessageSquare size={10} />
                          {t("feedback")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Timeline Modal */}
      {showTimeline && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {t("timeline")}
              </h2>
              <button
                onClick={() => {
                  setShowTimeline(false);
                  setSelectedTicket(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Timeline Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {getTimelineData(selectedTicket).map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      {idx < getTimelineData(selectedTicket).length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-sm text-gray-600 mb-1">
                        {event.dateTime}
                      </div>
                      <div className="font-bold text-gray-800 mb-1">
                        {event.status}
                      </div>
                      <div className="text-sm text-gray-700">
                        {event.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && feedbackTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {t("feedback")}
              </h2>
              <button
                onClick={() => {
                  setShowFeedback(false);
                  setFeedbackTicket(null);
                  setFeedbackText("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Feedback Content */}
            <div className="p-6 flex-1 flex flex-col">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={t("enterYourFeedback")}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Submit Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSubmitFeedback}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  {t("submit")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer for Calendar and KPI */}
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

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask Support Ticket Management bot"
        title="Ask Support Ticket Management bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Support Ticket Management"
        />
      )}

      {/* Video Viewer Modal */}
      {selectedVideo && (
        <VideoViewer
          videoPath={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          documentPath={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default SupportTicketManagement;
