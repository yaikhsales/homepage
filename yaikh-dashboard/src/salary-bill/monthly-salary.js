import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Users,
  DollarSign,
  TrendingDown,
  Wallet,
  CheckCircle,
  ChevronRight,
  MessageCircle,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar as CalendarIcon,
  AlertCircle,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";

const MonthlySalaryDashboard = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ABA");

  // State for filters matching your screenshot
  const [filters, setFilters] = useState({
    department: "All Departments",
    section: "All Sections",
    status: "All Status",
    search: "",
  });

  // Mock Data matching the new detailed table format
  const [salaryRecords] = useState([
    {
      no: 1,
      name: "Rothanak",
      id: "YMDRIVER",
      section: "-",
      basic: 0,
      days: 0,
      gross: 0,
      advance: 0,
      deduct: 0,
      net: 0,
      status: "PAY",
    },
    {
      no: 2,
      name: "Lawrence Yue",
      id: "000005",
      section: "-",
      basic: 0,
      days: 0,
      gross: 0,
      advance: 0,
      deduct: 0,
      net: 0,
      status: "PAY",
    },
    {
      no: 3,
      name: "Trista",
      id: "000002",
      section: "Head Office",
      basic: 0,
      days: 0,
      gross: 0,
      advance: 0,
      deduct: 0,
      net: 0,
      status: "PAY",
    },
    {
      no: 4,
      name: "micky yu",
      id: "00003",
      section: "Head Office",
      basic: 0,
      days: 0.5,
      gross: 9.38,
      advance: 0,
      deduct: 0.19,
      net: 9.19,
      status: "PAY",
    },
    {
      no: 5,
      name: "Suon Nai",
      id: "YM1430",
      section: "Boiler",
      basic: 0,
      days: 0.5,
      gross: 9.19,
      advance: 0,
      deduct: 0.18,
      net: 9.01,
      status: "WAITING APPROVAL",
    },
  ]);

  const handleBack = () => (onBack ? onBack() : navigate(-1));

  return (
    <div className="fixed inset-0 bg-[#f8fafc] flex flex-col overflow-hidden z-[100] font-sans">
      {/* 1. TOP HEADER ACTION BAR */}
      <div className="bg-white px-8 py-4 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <FileText size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">
                ពិនិត្យប្រាក់បៀវត្សរ៍
              </h1>
              <span className="text-slate-400">/</span>
              <span className="text-slate-500 font-medium">
                Payroll Review: January 2026
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Reviewing and finalizing payroll for the current period
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm font-bold flex items-center gap-2">
            <CheckCircle size={16} /> Payroll Approved
          </button>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <CreditCard size={16} /> Pay All
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100">
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* 2. FOUR STATS CARDS */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard
            title="EMPLOYEES"
            value="95"
            sub="Processed"
            icon={<Users />}
            color="blue"
          />
          <StatCard
            title="GROSS EARNINGS"
            value="$12,774.45"
            sub="Base: $12,520"
            icon={<DollarSign />}
            color="emerald"
          />
          <StatCard
            title="TOTAL DEDUCTIONS"
            value="$12,062.87"
            sub="NSSF, Tax & Absences"
            icon={<TrendingDown />}
            color="rose"
            textColor="text-red-600"
          />
          <StatCard
            title="NET DISBURSEMENT"
            value="$711.58"
            sub="Final to Pay"
            icon={<Wallet />}
            color="indigo"
          />
        </div>

        {/* 3. FILTER BAR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-end gap-4 shadow-sm">
          <div className="flex-1 grid grid-cols-4 gap-4">
            <FilterSelect
              label="Department"
              options={["All Departments", "Production", "HR", "Admin"]}
            />
            <FilterSelect
              label="Section"
              options={["All Sections", "Boiler", "Sewing"]}
            />
            <FilterSelect
              label="Payment Status"
              options={["All Status", "Paid", "Pending"]}
            />
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Search Employee
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Type Name or ID Card #..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <button className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm h-[40px] flex items-center gap-2">
            <Filter size={16} /> Apply
          </button>
        </div>

        {/* 4. DATA TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-black-400 uppercase tracking-wider border-b border-slate-200 ">
              <tr>
                <th className="px-4 py-4 w-12 text-center">ល.រ / NO</th>
                <th className="px-6 py-4">ឈ្មោះបុគ្គលិក / NAME</th>
                <th className="px-4 py-4">អត្តលេខ / ID</th>
                <th className="px-4 py-4">ផ្នែក / SECTION</th>
                <th className="px-4 py-4">ប្រាក់ខែគោល / BASIC</th>
                <th className="px-4 py-4">វត្តមាន / DAYS</th>
                <th className="px-4 py-4">សរុប / GROSS</th>
                <th className="px-4 py-4">បើកមុន / ADVANCE</th>
                <th className="px-4 py-4">ប្រាក់កាត់ / DEDUCT</th>
                <th className="px-4 py-4">បើកជាក់ស្តែង / NET</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
              {salaryRecords.map((item) => (
                <tr
                  key={item.no}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-4 text-center text-slate-400 font-medium">
                    {item.no}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900">{item.name}</span>
                      <span className="text-[10px] text-slate-300">-</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs tracking-tighter">
                    {item.id}
                  </td>
                  <td className="px-4 py-4 text-slate-500 font-medium">
                    {item.section}
                  </td>
                  <td className="px-4 py-4">${item.basic}</td>
                  <td className="px-4 py-4 text-blue-600">{item.days}</td>
                  <td className="px-4 py-4">${item.gross}</td>
                  <td className="px-4 py-4 text-rose-500">${item.advance}</td>
                  <td className="px-4 py-4 text-rose-500">${item.deduct}</td>
                  <td className="px-4 py-4 text-blue-700">${item.net}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className={`px-4 py-1 rounded text-[10px] font-black uppercase ${
                          item.status === "PAY"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "bg-slate-50 text-slate-400 border border-slate-100"
                        }`}
                      >
                        {item.status}
                      </button>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. BULK PAYMENT MODAL (Screenshot 3) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header Overlay */}
            <div className="bg-indigo-600 p-10 flex flex-col items-center justify-center text-white relative">
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Banknote size={32} />
              </div>
              <h2 className="text-2xl font-bold">បើកប្រាក់បៀវត្សរ៍ទាំងអស់</h2>
              <p className="text-indigo-100 text-sm">
                Bulk Payment For All Remaining Staff
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-amber-700">
                <div className="shrink-0 pt-1">
                  <AlertCircle size={18} />
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  This will mark **all approved but unpaid** records for this
                  month as PAID. Please ensure the bank transfers are actually
                  completed before doing this.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-4 gap-3">
                  <PaymentMethod
                    label="ABA"
                    logoUrl="https://www.ababank.com/typo3conf/ext/boxmodel/Resources/Private/Templates/ABA/images/aba-web-top-logo.png"
                    active={paymentMethod === "ABA"}
                    onClick={() => setPaymentMethod("ABA")}
                  />
                  <PaymentMethod
                    label="ACLEDA"
                    logoUrl="https://companieslogo.com/img/orig/ABC.KH-3aa8d94f.png?t=1720244490"
                    active={paymentMethod === "ACLEDA"}
                    onClick={() => setPaymentMethod("ACLEDA")}
                  />
                  <PaymentMethod
                    label="Wing"
                    logoUrl="https://cdn.aptoide.com/imgs/6/1/2/6123ff328eb2a408f5aba54174c142f4_icon.png"
                    active={paymentMethod === "Wing"}
                    onClick={() => setPaymentMethod("Wing")}
                  />
                  <PaymentMethod
                    label="Cash"
                    icon={<Banknote size={32} />}
                    active={paymentMethod === "Cash"}
                    onClick={() => setPaymentMethod("Cash")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Date
                </label>
                <div className="relative">
                  <CalendarIcon
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    defaultValue="02 / 26 / 2026"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-2 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all px-8">
                  Process Bulk Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Bot */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Monthly Payroll Review"
        />
      )}
    </div>
  );
};

// Helper Components
// const StatCard = ({ title, value, sub, icon, color }) => {
//   const colors = {
//     blue: "bg-blue-50 text-blue-600 shadow-blue-100",
//     emerald: "bg-emerald-50 text-emerald-600 shadow-emerald-100",
//     rose: "bg-rose-50 text-rose-600 shadow-rose-100",
//     indigo: "bg-indigo-50 text-indigo-600 shadow-indigo-100",
//   };
//   return (
//     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
//       <div className="relative z-10">
//         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
//           {title}
//         </p>
//         <h3 className="text-2xl font-black text-slate-800 leading-none mb-2">
//           {value}
//         </h3>
//         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
//           {sub}
//         </p>
//       </div>
//       <div
//         className={`absolute top-6 right-6 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors[color]}`}
//       >
//         {icon}
//       </div>
//     </div>
//   );
// };

// Add textColor prop with a default value of "text-slate-800"
const StatCard = ({
  title,
  value,
  sub,
  icon,
  color,
  textColor = "text-slate-800",
}) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 shadow-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 shadow-emerald-100",
    rose: "bg-rose-50 text-rose-600 shadow-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 shadow-indigo-100",
  };
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {title}
        </p>
        {/* Replace text-slate-800 with the dynamic textColor variable */}
        <h3 className={`text-2xl font-black ${textColor} leading-none mb-2`}>
          {value}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          {sub}
        </p>
      </div>
      <div
        className={`absolute top-6 right-6 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors[color]}`}
      >
        {icon}
      </div>
    </div>
  );
};

const FilterSelect = ({ label, options }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase">
      {label}
    </label>
    <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const PaymentMethod = ({ label, logoUrl, active, onClick, icon }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer h-32 ${
      active
        ? "border-indigo-600 bg-indigo-50 shadow-sm"
        : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50"
    }`}
  >
    <div className="w-16 h-16 mb-3 flex items-center justify-center overflow-hidden">
      {label === "Cash" ? (
        <div className={active ? "text-indigo-600" : "text-slate-400"}>
          {icon}
        </div>
      ) : (
        <img
          src={logoUrl}
          alt={label}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      )}
    </div>
    <span
      className={`text-xs font-black uppercase tracking-wider ${
        active ? "text-indigo-600" : "text-slate-500"
      }`}
    >
      {label}
    </span>
  </div>
);

const FileText = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default MonthlySalaryDashboard;
