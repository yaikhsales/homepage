import React from "react";
import {
  ArrowLeft,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  MoreVertical,
  ChevronRight,
  Filter,
  Users,
  BarChart3,
  Calendar,
  AlertCircle,
} from "lucide-react";

const CustomerComplainCap = ({ onBack }) => {
  const complains = [
    {
      id: "CAP-23001",
      customer: "Levi Strauss & Co.",
      date: "2024-05-10",
      type: "Quality Issue",
      subject: "Broken Stitch on Waistband",
      severity: "High",
      status: "Investigation",
      owner: "Dave Chen",
    },
    {
      id: "CAP-23002",
      customer: "Nike, Inc.",
      date: "2024-05-08",
      type: "Late Delivery",
      subject: "Sample set delayed by 3 days",
      severity: "Medium",
      status: "Implementation",
      owner: "Alice Wood",
    },
    {
      id: "CAP-23003",
      customer: "Adidas AG",
      date: "2024-05-05",
      type: "Labeling Error",
      subject: "Incorrect size labels on batch 402",
      severity: "Critical",
      status: "Review",
      owner: "Sam Park",
    },
    {
      id: "CAP-23004",
      customer: "Uniqlo",
      date: "2024-05-02",
      type: "Fabric Defect",
      subject: "Pilling issue after first wash",
      severity: "Low",
      status: "Closed",
      owner: "Elena Rodriguez",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 lg:p-10 selection:bg-orange-500/30">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16 apple-fade-in">
        <div className="flex items-start gap-8">
          <button
            onClick={onBack}
            className="mt-2 w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-500 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <ArrowLeft className="w-8 h-8 relative z-10 text-white/50 group-hover:text-white group-hover:-translate-x-1 transition-all" />
          </button>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full">
                Active Monitoring
              </span>
              <span className="text-white/30 font-bold text-xs uppercase tracking-widest leading-none">
                Global Network
              </span>
            </div>
            <div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] flex flex-col">
                <span>CUSTOMER</span>
                <span className="text-orange-500">COMPLAIN CAP</span>
              </h1>
              <p className="mt-4 text-white/40 text-lg font-medium max-w-lg leading-relaxed">
                Real-time Corrective and Preventive Action (CAPA) tracking
                system for premium client satisfaction.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:w-[400px]">
          <div className="flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <span className="text-sm font-bold text-white/60">
                System Online
              </span>
            </div>
            <span className="text-xs font-black text-white/20 uppercase tracking-widest">
              v4.2.0
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-orange-500 rounded-[2rem] text-black">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">
                Open Cases
              </p>
              <p className="text-4xl font-black tracking-tighter leading-none">
                12
              </p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                Solved (Mo)
              </p>
              <p className="text-4xl font-black tracking-tighter leading-none">
                84
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 apple-fade-in-delay">
        {[
          {
            label: "Critical Severity",
            value: "03",
            icon: AlertTriangle,
            color: "text-red-500",
          },
          {
            label: "Avg Resolution Time",
            value: "4.2d",
            icon: Clock,
            color: "text-emerald-500",
          },
          {
            label: "Customer Satisfaction",
            value: "98%",
            icon: MessageSquare,
            color: "text-blue-500",
          },
          {
            label: "Under Review",
            value: "18",
            icon: FileText,
            color: "text-amber-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="group p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <stat.icon className="w-24 h-24" />
            </div>
            <div
              className={`mb-6 p-4 rounded-2xl bg-white/5 w-fit ${stat.color}`}
            >
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-white/40 font-bold text-xs uppercase tracking-widest mb-1">
                {stat.label}
              </h3>
              <div className="text-4xl font-black tracking-tighter">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table View */}
      <div className="bg-white/5 border border-white/10 rounded-[4rem] overflow-hidden backdrop-blur-3xl apple-fade-in-delay-2 p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Case List</h2>
            <div className="mt-2 flex items-center gap-4 text-white/30 text-xs font-bold uppercase tracking-widest">
              <span>Filtered by Latest</span>
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
              <span>14 Results</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-4 border-neutral-950 bg-white/10 flex items-center justify-center text-xs font-black overflow-hidden ring-1 ring-white/10"
                >
                  <img
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-3xl hover:scale-105 active:scale-95 transition-all">
              <AlertCircle className="w-5 h-5" />
              Raise New CAP
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-8 px-4 text-xs font-black text-white/20 uppercase tracking-[0.2em]">
                  ID & Customer
                </th>
                <th className="pb-8 px-4 text-xs font-black text-white/20 uppercase tracking-[0.2em]">
                  Subject
                </th>
                <th className="pb-8 px-4 text-xs font-black text-white/20 uppercase tracking-[0.2em]">
                  Priority
                </th>
                <th className="pb-8 px-4 text-xs font-black text-white/20 uppercase tracking-[0.2em]">
                  Stage
                </th>
                <th className="pb-8 px-4 text-xs font-black text-white/20 uppercase tracking-[0.2em] text-right">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {complains.map((c, i) => (
                <tr
                  key={i}
                  className="group hover:bg-white/5 transition-all duration-500 cursor-pointer"
                >
                  <td className="py-10 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-orange-500 tracking-wider">
                        #{c.id}
                      </span>
                      <span className="text-lg font-black tracking-tight">
                        {c.customer}
                      </span>
                      <div className="flex items-center gap-2 text-white/20 text-xs font-bold mt-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {c.date}
                      </div>
                    </div>
                  </td>
                  <td className="py-10 px-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full w-fit">
                        {c.type}
                      </span>
                      <span className="text-white/70 font-bold leading-relaxed max-w-xs">
                        {c.subject}
                      </span>
                    </div>
                  </td>
                  <td className="py-10 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${c.severity === "Critical" ? "bg-red-500" : c.severity === "High" ? "bg-orange-500" : "bg-blue-500"}`}
                      ></div>
                      <span
                        className={`text-sm font-black uppercase tracking-widest ${c.severity === "Critical" ? "text-red-500" : c.severity === "High" ? "text-orange-500" : "text-blue-500"}`}
                      >
                        {c.severity}
                      </span>
                    </div>
                  </td>
                  <td className="py-10 px-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden max-w-[120px]">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${c.status === "Closed" ? "bg-emerald-500" : "bg-orange-500"}`}
                          style={{
                            width:
                              c.status === "Closed"
                                ? "100%"
                                : c.status === "Investigation"
                                  ? "25%"
                                  : c.status === "Implementation"
                                    ? "60%"
                                    : "85%",
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-black uppercase tracking-tighter text-white/60">
                        {c.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-10 px-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black">{c.owner}</span>
                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                          Quality Assurance
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-orange-500 group-hover:text-black transition-all">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerComplainCap;
