import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Video, FileText } from 'lucide-react';
import ShippingFormModal from './ShippingFormModal';
import VideoViewer from '../components/VideoViewer';
import DocumentViewer from '../components/DocumentViewer';

const ShippingRequest = ({ onBack }) => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const CE_VIDEO_PATH = "/assets/short-video-training/ce.mp4";
  const CE_REPORT_PATH = "/assets/report-training/ce-shipping-request-audit.html";

  const requests = [
    {
      code: '255',
      gmStatus: 'Approved',
      gmUser: 'CHUI TATMINGSUNNY',
      gmDate: '2026-04-08 07:34:16',
      accStatus: 'Pending',
      requestedBy: 'UY SARIN',
      avatar: 'https://ym.yaikh.com/storage/profiles/66a364656d77aaa47d0a92a6/hoRySkN00IOaLwBCochzKmK3NVefo85uTVdCCoNi.jpg',
      payFor: '1. Forwarder Handling Charge',
      amount: '4,018.14 USD',
      total: '4,018.14 USD',
      date: '04-07-2026',
    },
    {
      code: '255-b', // Duplicate code from image
      gmStatus: 'Approved',
      gmUser: 'CHUI TATMINGSUNNY',
      gmDate: '2026-04-08 07:34:17',
      accStatus: 'Pending',
      requestedBy: 'UY SARIN',
      avatar: 'https://ym.yaikh.com/storage/profiles/66a364656d77aaa47d0a92a6/hoRySkN00IOaLwBCochzKmK3NVefo85uTVdCCoNi.jpg',
      payFor: '1. Forwarder Handling Charge',
      amount: '678.06 USD',
      total: '678.06 USD',
      date: '04-07-2026',
    },
    {
      code: '254',
      gmStatus: 'Approved',
      gmUser: 'CHUI TATMINGSUNNY',
      gmDate: '2026-04-07 08:22:47',
      accStatus: 'Approved',
      accUser: 'Ry Likeang',
      accDate: '2026-04-08 10:24:16',
      requestedBy: 'UY SARIN',
      avatar: 'https://ym.yaikh.com/storage/profiles/66a364656d77aaa47d0a92a6/hoRySkN00IOaLwBCochzKmK3NVefo85uTVdCCoNi.jpg',
      payFor: '1. Forwarder Handling Charge',
      amount: '1,929.45 USD',
      total: '1,929.45 USD',
      date: '04-06-2026',
    },
    {
      code: '253',
      gmStatus: 'Approved',
      gmUser: 'CHUI TATMINGSUNNY',
      gmDate: '2026-04-06 09:12:00',
      accStatus: 'Pending',
      requestedBy: 'UY SARIN',
      avatar: 'https://ym.yaikh.com/storage/profiles/66a364656d77aaa47d0a92a6/hoRySkN00IOaLwBCochzKmK3NVefo85uTVdCCoNi.jpg',
      payFor: '1. Port Authority Fees',
      amount: '350.00 USD',
      total: '350.00 USD',
      date: '04-05-2026',
    },
    {
      code: '252',
      gmStatus: 'Pending',
      accStatus: 'Pending',
      requestedBy: 'UY SARIN',
      avatar: 'https://ym.yaikh.com/storage/profiles/66a364656d77aaa47d0a92a6/hoRySkN00IOaLwBCochzKmK3NVefo85uTVdCCoNi.jpg',
      payFor: '1. Trucking and Local Transport',
      amount: '890.50 USD',
      total: '890.50 USD',
      date: '04-05-2026',
    },
    {
      code: '251',
      gmStatus: 'Approved',
      gmUser: 'CHUI TATMINGSUNNY',
      gmDate: '2026-04-04 14:05:33',
      accStatus: 'Approved',
      accUser: 'Ry Likeang',
      accDate: '2026-04-04 15:30:10',
      requestedBy: 'UY SARIN',
      avatar: 'https://ym.yaikh.com/storage/profiles/66a364656d77aaa47d0a92a6/hoRySkN00IOaLwBCochzKmK3NVefo85uTVdCCoNi.jpg',
      payFor: '1. Customs Clearance Fee',
      amount: '1,450.00 USD',
      total: '1,450.00 USD',
      date: '04-03-2026',
    },
    {
      code: '250',
      gmStatus: 'Approved',
      gmUser: 'CHUI TATMINGSUNNY',
      gmDate: '2026-04-02 11:22:15',
      accStatus: 'Pending',
      requestedBy: 'UY SARIN',
      avatar: 'https://ym.yaikh.com/storage/profiles/66a364656d77aaa47d0a92a6/hoRySkN00IOaLwBCochzKmK3NVefo85uTVdCCoNi.jpg',
      payFor: '1. Cargo Insurance',
      amount: '225.00 USD',
      total: '225.00 USD',
      date: '04-01-2026',
    },
    {
      code: '249',
      gmStatus: 'Approved',
      gmUser: 'CHUI TATMINGSUNNY',
      gmDate: '2026-03-31 08:45:00',
      accStatus: 'Approved',
      accUser: 'Ry Likeang',
      accDate: '2026-03-31 09:12:44',
      requestedBy: 'UY SARIN',
      avatar: 'https://ym.yaikh.com/storage/profiles/66a364656d77aaa47d0a92a6/hoRySkN00IOaLwBCochzKmK3NVefo85uTVdCCoNi.jpg',
      payFor: '1. Ocean Freight Charges',
      amount: '6,780.00 USD',
      total: '6,780.00 USD',
      date: '03-30-2026',
    }
  ];

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f3f4] overflow-hidden w-full absolute inset-0 z-50">
      
      {/* Top Header - White */}
      <div className="bg-white px-8 py-6 w-full shrink-0 flex items-center justify-between border-b shadow-sm z-30">
        <h1 className="text-2xl font-black text-[#1e3a8a] ml-[100px] border-b-[3px] border-[#1e3a8a] pb-1">Shipping Request</h1>
        <div className="flex items-center gap-2">
            <button
                onClick={() => setSelectedVideo(CE_VIDEO_PATH)}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
                title="Video Training"
            >
                <Video size={20} className="text-blue-600" />
            </button>
            <button
                onClick={() => setSelectedDocument(CE_REPORT_PATH)}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300 mr-4"
                title="Report Training"
            >
                <FileText size={20} className="text-blue-600" />
            </button>
        </div>
      </div>

      <div className="w-full px-6 py-4 shrink-0">
        <button
          onClick={handleBack}
          className="bg-white border border-slate-200 text-slate-700 px-5 py-2 rounded shadow-sm text-xs font-black uppercase hover:bg-slate-50 transition-colors"
        >
          BACK
        </button>
      </div>

      <div className="flex-1 w-full overflow-auto px-6 pb-8">
        <div className="bg-white rounded p-8 border border-slate-100 border-dashed min-h-[80vh] shadow-sm flex flex-col">
          
          <div className="flex justify-end mb-6 shrink-0">
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-[#2563eb] text-white px-8 py-2.5 rounded-md font-bold text-sm tracking-wide shadow-sm hover:bg-blue-700 transition"
            >
                Add Request
            </button>
          </div>

          <div className="w-full overflow-x-auto flex-1">
            <table className="w-full text-center border-collapse text-xs whitespace-nowrap">
                <thead className="bg-[#e5e7eb] border-b-2 border-white">
                    <tr>
                    <th className="py-4 px-2 uppercase font-black text-slate-800">CODE</th>
                    <th className="py-4 px-2 uppercase font-black text-slate-800">REJECT</th>
                    <th className="py-4 px-2 uppercase font-black text-slate-800">GM</th>
                    <th className="py-4 px-2 uppercase font-black text-slate-800">ACC</th>
                    <th className="py-4 px-2 uppercase font-black text-slate-800">REQUESTOR</th>
                    <th className="py-4 px-2 uppercase font-black text-slate-800">NOT</th>
                    <th className="py-4 px-2 uppercase font-black text-slate-800">AMOUNT</th>
                    <th className="py-4 px-2 uppercase font-black text-slate-800">TOTAL</th>
                    <th className="py-4 px-2 uppercase font-black text-slate-800">DATE</th>
                    <th className="py-4 px-2 uppercase font-black text-slate-800">FILE</th>
                    <th className="py-4 px-2 uppercase font-black text-slate-800">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((row, index) => (
                    <tr key={row.code} className={`border-b-4 border-white ${index % 2 === 0 ? 'bg-[#f3f4f6]' : 'bg-white'}`}>
                        <td className="py-6 px-4 font-bold text-slate-700">{row.code}</td>
                        <td className="py-6 px-4">
                            <button className="bg-[#64748b] text-white px-5 py-2 rounded-md font-semibold text-[11px]">Reject</button>
                        </td>
                        <td className="py-6 px-4">
                            <div className="flex flex-col items-center gap-1">
                                {row.gmStatus === 'Approved' ? (
                                    <>
                                        <span className="bg-[#dcfce7] text-[#22c55e] px-4 py-1.5 rounded-full font-bold text-[11px]">
                                            Approved
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-medium uppercase mt-1 leading-tight text-center whitespace-nowrap">{row.gmUser}<br/>{row.gmDate}</span>
                                    </>
                                ) : (
                                    <span className="bg-[#fee2e2] text-[#ef4444] px-5 py-2 rounded-full font-bold text-[11px]">
                                        Pending
                                    </span>
                                )}
                            </div>
                        </td>
                        <td className="py-6 px-4">
                            <div className="flex flex-col items-center gap-1">
                                {row.accStatus === 'Approved' ? (
                                    <>
                                        <span className="bg-[#dcfce7] text-[#22c55e] px-4 py-1.5 rounded-full font-bold text-[11px]">
                                            Approved
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-medium mt-1 leading-tight text-center whitespace-nowrap">{row.accUser}<br/>{row.accDate}</span>
                                    </>
                                ) : (
                                    <span className="bg-[#fee2e2] text-[#ef4444] px-5 py-2 rounded-full font-bold text-[11px]">
                                        Pending
                                    </span>
                                )}
                            </div>
                        </td>
                        <td className="py-6 px-4">
                            <div className="flex flex-col items-center gap-1.5">
                                <img src={row.avatar} alt="Avatar" className="w-12 h-12 rounded bg-slate-200 object-cover" />
                                <span className="font-bold text-[11px] text-slate-900">{row.requestedBy}</span>
                            </div>
                        </td>
                        <td className="py-6 px-4 font-bold text-slate-600 text-left min-w-[200px]">
                            {row.payFor}
                        </td>
                        <td className="py-6 px-4 font-bold text-slate-800">
                            {row.amount}
                        </td>
                        <td className="py-6 px-4 font-bold text-slate-800">
                            {row.total}
                        </td>
                        <td className="py-6 px-4 font-bold text-slate-800">
                            {row.date}
                        </td>
                        <td className="py-6 px-4">
                            <button className="bg-[#dc2626] text-white px-4 py-2 rounded-md font-bold text-[11px]">PDF</button>
                        </td>
                        <td className="py-6 px-4">
                            <div className="flex flex-col gap-1.5 items-center justify-center">
                                <button className="bg-[#22c55e] text-white px-5 py-1.5 rounded text-[11px] font-bold w-20 shadow-sm transition hover:scale-105">Detail</button>
                                <button className="bg-[#3b82f6] text-white px-5 py-1.5 rounded text-[11px] font-bold w-20 shadow-sm transition hover:scale-105">View</button>
                                <button className="bg-[#ef4444] text-white px-5 py-1.5 rounded text-[11px] font-bold w-20 shadow-sm transition hover:scale-105">PDF</button>
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 px-4 shrink-0 text-xs font-bold text-slate-500">
            <div>
              Showing 1 to 10 of 261 results
            </div>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors"><ChevronLeft size={16}/></button>
              <button className="px-3 py-1.5 border border-blue-600 bg-blue-600 rounded text-white font-black shadow-sm">1</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">2</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">3</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">4</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">5</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">6</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">7</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">8</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">9</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">10</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">...</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">26</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors">27</button>
              <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 transition-colors"><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && <ShippingFormModal onClose={() => setShowAddModal(false)} />}

      {selectedVideo && (
        <VideoViewer
          videoPath={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {selectedDocument && (
        <DocumentViewer
          documentPath={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default ShippingRequest;
