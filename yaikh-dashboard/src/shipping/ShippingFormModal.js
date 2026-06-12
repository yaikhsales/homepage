import React, { useState } from 'react';
import { X, Plus, Minus, Upload, FileText } from 'lucide-react';

const ShippingFormModal = ({ onClose }) => {
  const [items, setItems] = useState([{ id: 1, ref: '', amount: '', currency: 'USD', detail: '' }]);
  const [agreed, setAgreed] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now(), ref: '', amount: '', currency: 'USD', detail: '' }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const refOptions = [
    "MOP (Ministry of Commerce)",
    "MOI (Ministry of Industry)",
    "General Supporting",
    "MOL (Ministry of Labour)",
    "Custom",
    "City Hall",
    "MOE (Ministry of Environment)",
    "Immigration Police",
    "EDAC",
    "Terminal Gate Fee and Unloading",
    "Unloading Team",
    "Loading Team",
    "General Supply",
    "Forwarder Handling Charge",
    "Extra Labor Charge"
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-black text-blue-900 tracking-tight">
            Shipping Transaction
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider px-1">Name</label>
              <input 
                type="text" 
                value="Sin Khon" 
                readOnly 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider px-1">Department</label>
              <input 
                type="text" 
                value="Shipping_Department" 
                readOnly 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 outline-none"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider px-1">Date</label>
              <div className="relative">
                <input 
                    type="date" 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Shipping Items Section */}
          <div className="space-y-3">
             <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest pl-1 border-l-4 border-blue-600">Shipping Items</h3>
             <div className="space-y-3 border border-gray-100 p-4 rounded-xl bg-slate-50/50">
                {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-start animate-in slide-in-from-top-2 duration-200">
                        <div className="col-span-5 space-y-1">
                            <label className="text-[9px] font-black uppercase text-gray-400">Ref</label>
                            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Ref</option>
                                {refOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="col-span-3 space-y-1">
                            <label className="text-[9px] font-black uppercase text-gray-400">Amount</label>
                            <input 
                                type="number" 
                                placeholder="0.00"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <label className="text-[9px] font-black uppercase text-gray-400">Currency</label>
                            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="USD">USD</option>
                                <option value="KHR">KHR</option>
                                <option value="RMB">RMB</option>
                            </select>
                        </div>
                        <div className="col-span-2 flex items-end pt-5 gap-1.5 justify-center">
                            <button 
                                onClick={addItem}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg transition-all active:scale-90"
                            >
                                <Plus size={16} />
                            </button>
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-all active:scale-90 disabled:opacity-30"
                                disabled={items.length === 1}
                            >
                                <Minus size={16} />
                            </button>
                        </div>
                        <div className="col-span-12 space-y-1">
                            <label className="text-[9px] font-black uppercase text-gray-400">Detail</label>
                            <textarea 
                                placeholder="Enter detail description..."
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none"
                            />
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* Upload File */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider px-1">Upload File</label>
            <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-slate-800 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                    <Upload size={14} />
                    Choose Files
                    <input type="file" className="hidden" />
                </label>
                <span className="text-xs text-gray-400 font-medium">No file chosen</span>
            </div>
          </div>

          {/* Declaration Section matching Image 2 */}
          <div className="space-y-4 pt-4">
             <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-[11px] leading-relaxed text-red-600 font-bold italic">
                <p>1. I hereby declare and confirm that the above transaction(s) as documented in the previous voucher was (were) effected between my goodself and the relevant party(s) concerned in good faith without any supporting invoice(s) or receipt(s).</p>
                <p className="mt-2 text-red-700">2. I understand if the management of the company discovers I have not acted honestly in the course of the above transaction(s), I shall face the necessary disciplinary action(s) as determined by the company.</p>
             </div>
             
             <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-xs font-black text-gray-700 group-hover:text-blue-700 transition-colors">Term of Agreement</span>
             </label>
             {!agreed && <p className="text-[9px] text-red-600 font-black italic mt-1 px-1">Select the term of agreement before submit</p>}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t flex justify-end bg-slate-50">
            <button 
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-8 py-2.5 rounded-lg font-black text-xs transition-all active:scale-95 shadow-md flex items-center gap-2"
                disabled={!agreed}
            >
                Submit
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingFormModal;
