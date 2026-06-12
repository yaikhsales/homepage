import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video } from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";

const MoneyClaim = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const sampleData = [
    {
      no: 41,
      name: "Heng Socheata",
      department: "CSR",
      image: "assets/Yaikh-Uploads/H01_0000820720240504121622.jpeg",
      topic: "water please",
      category: "depart fund",
      amount: "140.79 USD",
      amountColor: "text-red-500",
      headStatus: "Approve",
      gmStatus: "Approve",
      gmDetails: "",
      bigBossStatus: "Pending",
      images: ["Image 1", "Image 2", "Image 3", "Image 4", "Image 5", "Image 6", "Image 7", "Image 8"]
    },
    {
      no: 40,
      name: "Reach Sovath",
      department: "CSR",
      image: "assets/Yaikh-Uploads/H01_0000828120240619102032.jpeg",
      topic: "expense office",
      category: "Workshop",
      amount: "12,042.06 USD",
      amountColor: "text-blue-500",
      headStatus: "Approve",
      gmStatus: "Approve",
      gmDetails: "",
      bigBossStatus: "Pending",
      images: ["Image 1"]
    },
    {
      no: 39,
      name: "Cheata",
      department: "CSR",
      image: "assets/Yaikh-Uploads/H01_00009487_20251224102241.jpeg",
      topic: "test for panel",
      category: "depart fund",
      amount: "0.19 USD",
      amountColor: "text-red-500",
      headStatus: "Approve",
      gmStatus: "Approved",
      gmDetails: "Chea Socheata\n11/17/24",
      bigBossStatus: "Paid",
      images: ["Image 1"]
    },
    {
      no: 38,
      name: "Cheata",
      department: "CSR",
      image: "assets/Yaikh-Uploads/H01_00009488_20251224125815.jpeg",
      topic: "test for panel",
      category: "depart fund",
      amount: "0.19 USD",
      amountColor: "text-red-500",
      headStatus: "Approve",
      gmStatus: "Approved",
      gmDetails: "Chea Socheata\n11/17/24",
      bigBossStatus: "Paid",
      images: ["Image 1"]
    },
    {
      no: 37,
      name: "Cheata",
      department: "CSR",
      image: "assets/Yaikh-Uploads/H01_00009489_20251229101408.jpeg",
      topic: "test for panel",
      category: "depart fund",
      amount: "1.24 USD",
      amountColor: "text-red-500",
      headStatus: "Approve",
      gmStatus: "Approved",
      gmDetails: "Chea Socheata\n11/17/24",
      bigBossStatus: "Paid",
      images: ["Image 1"]
    },
    {
      no: 36,
      name: "Cheata",
      department: "CSR",
      image: "assets/Yaikh-Uploads/H01_00009490_20260106154218.jpeg",
      topic: "office",
      category: "depart fund",
      amount: "14.16 USD",
      amountColor: "text-red-500",
      headStatus: "Approve",
      gmStatus: "Approved",
      gmDetails: "Chea Socheata\n11/17/24",
      bigBossStatus: "Paid",
      images: ["Image 1"]
    },
    {
        no: 35,
        name: "Cheata",
        department: "CSR",
        image: "assets/Yaikh-Uploads/H01_00009491_20251229101255.jpeg",
        topic: "office",
        category: "depart fund",
        amount: "1.52 USD",
        amountColor: "text-red-500",
        headStatus: "Approve",
        gmStatus: "Approved",
        gmDetails: "Chea Socheata\n11/17/24",
        bigBossStatus: "Paid",
        images: ["Image 1"]
    },
    {
        no: 34,
        name: "Heng Socheata",
        department: "Admin",
        image: "assets/Yaikh-Uploads/H01_00009492_20251229101312.jpeg",
        topic: "station update",
        category: "Admin",
        amount: "58.98 USD",
        amountColor: "text-red-500",
        headStatus: "Approved",
        gmStatus: "Approve",
        gmDetails: "",
        bigBossStatus: "Pending",
        images: ["Image 1"]
    },
    {
        no: 33,
        name: "Ngy Lida",
        department: "CSR",
        image: "assets/Yaikh-Uploads/H01_00009493_20251229101327.jpeg",
        topic: "support fund",
        category: "depart fund",
        amount: "15.00 USD",
        amountColor: "text-red-500",
        headStatus: "Approved",
        gmStatus: "Approve",
        gmDetails: "",
        bigBossStatus: "Pending",
        images: ["Image 1"]
    },
    {
        no: 32,
        name: "Ngy Lida",
        department: "CSR",
        image: "assets/Yaikh-Uploads/H01_00009494_20260105105141.jpeg",
        topic: "work fund",
        category: "depart fund",
        amount: "4.50 USD",
        amountColor: "text-red-500",
        headStatus: "Approved",
        gmStatus: "Approve",
        gmDetails: "",
        bigBossStatus: "Pending",
        images: ["Image 1"]
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-100 flex flex-col animate-in fade-in duration-500 z-10 w-full overflow-hidden">
      {/* Top Header - White */}
      <div className="bg-white px-8 py-4 w-full shrink-0 shadow-sm z-20 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 ml-[100px]">Money Claim</h1>
        <button
            onClick={() =>
                setSelectedVideo(
                    "/assets/short-video-training/new-updated-vd/money-claim.mp4"
                )
            }
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300 mr-4"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
      </div>

      {/* Back Button Band */}
      <div className="w-full px-6 py-3 shrink-0 flex items-center">
        <button
          onClick={handleBack}
          className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm tracking-wider"
        >
          BACK
        </button>
      </div>

      <div className="flex-1 w-full overflow-hidden px-8 pb-8">
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 w-full h-full flex flex-col">
          
          {/* Card Header (Button) */}
          <div className="pt-6 pr-6 pb-4 flex justify-end shrink-0">
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition shadow-md">
                + Add Bill Record
            </button>
          </div>

          <div className="flex-1 w-full overflow-auto px-6">
            <table className="w-full border-collapse text-xs">
            <thead className="bg-white border-b-2 border-slate-100 sticky top-0 z-10 text-[10px] uppercase font-bold text-slate-600/80 tracking-widest">
                <tr>
                <th className="py-4 text-center w-12">No</th>
                <th className="py-4 text-center">Name/Department</th>
                <th className="py-4 text-center">Topic</th>
                <th className="py-4 text-center">Category</th>
                <th className="py-4 text-center">Amount</th>
                <th className="py-4 text-center">Head of Dept</th>
                <th className="py-4 text-center">GM</th>
                <th className="py-4 text-center">Big Boss</th>
                <th className="py-4 text-center">Image</th>
                <th className="py-4 text-center w-24">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {sampleData.map((row) => (
                <tr key={row.no} className={`transition-colors ${row.no === 39 ? 'bg-blue-50/50' : 'hover:bg-slate-50 bg-white'}`}>
                    <td className="py-6 px-2 text-center font-bold text-slate-600">{row.no}</td>
                    <td className="py-6 px-2">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                        <img 
                            src={`/${row.image}`} 
                            alt={row.name} 
                            className="w-11 h-12 object-cover" 
                            onError={(e) => { e.target.src = '/logo.jpg'; }} 
                        />
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-slate-700">{row.name}</div>
                            <div className="text-[10px] text-slate-400">{row.department}</div>
                        </div>
                    </div>
                    </td>
                    <td className="py-6 px-2 text-center text-slate-500 font-medium">{row.topic}</td>
                    <td className="py-6 px-2 text-center text-slate-500 font-medium">{row.category}</td>
                    <td className={`py-6 px-2 text-center font-bold ${row.amountColor}`}>{row.amount}</td>
                    
                    <td className="py-6 px-2 text-center">
                        {row.headStatus === "Approve" ? (
                            <button className="bg-blue-500 text-white px-5 py-2 text-[11px] font-bold rounded-md shadow-sm hover:bg-blue-600 transition-all">Approve</button>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-1">
                                <span className="bg-emerald-500 text-white px-3 py-1 text-[11px] font-bold rounded-md shadow-sm tracking-wide">Approved</span>
                            </div>
                        )}
                    </td>
                    
                    <td className="py-6 px-2 text-center">
                        {row.gmStatus === "Approve" ? (
                            <button className="bg-blue-500 text-white px-5 py-2 text-[11px] font-bold rounded-md shadow-sm hover:bg-blue-600 transition-all">Approve</button>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-1.5">
                                <span className="bg-emerald-500 text-white px-3 py-1 text-[11px] font-bold rounded-md shadow-sm tracking-wide">Approved</span>
                                {row.gmDetails && (
                                  <span className="text-[9px] text-slate-400 whitespace-pre-line text-center leading-tight font-medium">{row.gmDetails}</span>
                                )}
                            </div>
                        )}
                    </td>

                    <td className="py-6 px-2 text-center">
                        {row.bigBossStatus === "Pending" ? (
                            <button className="bg-[#e94b4b] text-white px-5 py-2 text-[11px] font-bold rounded-md shadow-sm hover:bg-red-600 transition-all tracking-wide">Pending</button>
                        ) : (
                            <button className="bg-emerald-500 text-white px-6 py-2 text-[11px] font-bold rounded-md shadow-sm hover:bg-emerald-600 transition-all tracking-wide">Paid</button>
                        )}
                    </td>
                    
                    <td className="py-6 px-2">
                        <div className="flex flex-col gap-1.5 items-center max-h-[120px] overflow-y-auto no-scrollbar justify-start">
                            {row.images.map((img, i) => (
                                <button key={i} className="text-[10px] bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded shadow-sm hover:bg-slate-50 hover:text-blue-600 font-semibold w-16">
                                    {img}
                                </button>
                            ))}
                        </div>
                    </td>

                    <td className="py-6 px-2">
                        <div className="flex flex-col gap-1.5 items-center">
                            <button className="bg-[#10b981] text-white text-[10px] font-bold px-0 py-1.5 rounded-md w-[80%] hover:bg-emerald-600 shadow-sm transition-colors tracking-wide">Detail</button>
                            <button className="bg-[#3b82f6] text-white text-[10px] font-bold px-0 py-1.5 rounded-md w-[80%] hover:bg-blue-600 shadow-sm transition-colors tracking-wide">View</button>
                            <button className="bg-[#ef4444] text-white text-[10px] font-bold px-0 py-1.5 rounded-md w-[80%] hover:bg-red-600 shadow-sm transition-colors tracking-wide">PDF</button>
                            <button className="bg-[#f59e0b] text-white text-[10px] font-bold px-0 py-1.5 rounded-md w-[80%] hover:bg-amber-600 shadow-sm transition-colors tracking-wide">Delete</button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
          </div>
      
      {/* Footer/Pagination */}
      <div className="w-full bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0 rounded-b-xl">
          <div className="text-sm text-slate-500 font-medium">
              Showing 1 to 10 of 41 entries
          </div>
          <div className="flex gap-1.5">
              <button className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 font-medium shadow-sm transition-colors">«</button>
              <button className="px-3 py-1 border border-blue-600 bg-blue-600 text-white rounded text-sm font-medium shadow-sm">1</button>
              <button className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 font-medium shadow-sm transition-colors">2</button>
              <button className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 font-medium shadow-sm transition-colors">3</button>
              <button className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 font-medium shadow-sm transition-colors">4</button>
              <button className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 font-medium shadow-sm transition-colors">»</button>
          </div>
      </div>
        </div>
      </div>
      
      {selectedVideo && (
        <VideoViewer
          videoPath={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default MoneyClaim;
