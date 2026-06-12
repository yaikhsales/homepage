import React from 'react';
export const FormalHumidityReport = React.forwardRef(({ report }, ref) => {
    if (!report) return null;

    return (
        <div ref={ref} className="formal-report-container bg-white p-10 font-sans text-slate-900 border-[1.5px] border-black w-[1120px]">
            {/* Document Title */}
            <div className="text-center mb-8">
                <h2 className="text-[22px] font-bold uppercase border-b-[2px] border-black pb-1 inline-block">Humidity inspection record</h2>
            </div>

            {/* Metadata Header */}
            <div className="grid grid-cols-2 gap-x-20 mb-8 px-4">
                <div className="space-y-1.5 text-left">
                    <div className="text-xs flex gap-2">
                        <span className="font-bold min-w-[150px]">Buyer style#:</span>
                        <span className="border-b border-dotted border-slate-400 flex-1">{report.buyerStyle}</span>
                    </div>
                    <div className="text-xs flex gap-2">
                        <span className="font-bold min-w-[150px]">Factory style no:</span>
                        <span className="border-b border-dotted border-slate-400 flex-1">{report.id}</span>
                    </div>
                    <div className="text-xs flex gap-2">
                        <span className="font-bold min-w-[150px]">Fabrication:</span>
                        <span className="border-b border-dotted border-slate-400 flex-1">{report.fabrication}</span>
                    </div>
                    <div className="text-xs flex gap-2">
                        <span className="font-bold min-w-[150px]">Aquaboy spec (Body):</span>
                        <span className="border-b border-dotted border-slate-400 flex-1">{report.spec}</span>
                    </div>
                </div>
                <div className="space-y-1.5 text-left">
                    <div className="text-xs flex gap-2">
                        <span className="font-bold min-w-[100px]">Customer:</span>
                        <span className="border-b border-dotted border-slate-400 flex-1 text-right">{report.customer}</span>
                    </div>
                    <div className="text-xs flex gap-2">
                        <span className="font-bold min-w-[100px]">Type:</span>
                        <span className="border-b border-dotted border-slate-400 flex-1 text-right">Inline</span>
                    </div>
                    <div className="text-xs flex gap-2">
                        <span className="font-bold min-w-[100px]">Date:</span>
                        <span className="border-b border-dotted border-slate-400 flex-1 text-right">{report.date}</span>
                    </div>
                    <div className="text-xs flex gap-2">
                        <span className="font-bold min-w-[100px]">Color:</span>
                        <span className="border-b border-dotted border-slate-400 flex-1 text-right uppercase">{report.color}</span>
                    </div>
                </div>
            </div>

            {/* Inspection Data Table */}
            <div className="border-[1.5px] border-black mb-10">
                <table className="w-full border-collapse text-[10px]">
                    <thead>
                        <tr className="border-b-[1.5px] border-black bg-slate-50 font-bold">
                            <th className="border-r border-black p-3 text-center w-20">CHECK</th>
                            <th className="border-r border-black p-3 text-center w-28">DATE</th>
                            <th className="border-r border-black p-3 text-center w-36">CUSTOMER</th>
                            <th className="border-r border-black p-3 text-center w-48">FABRICATION</th>
                            <th className="border-r border-black p-3 text-center w-36">COLOR</th>
                            <th className="border-r border-black p-3 text-center w-28">BEFORE DRY ROOM</th>
                            <th className="border-r border-black p-3 text-center w-24">AFTER DRY ROOM</th>
                            <th className="border-r border-black p-1 text-center bg-slate-100">
                                <div className="py-1 uppercase">Top Section</div>
                                <div className="border-t border-black py-1 text-[8px]">BODY</div>
                            </th>
                            <th className="border-r border-black p-1 text-center bg-slate-100">
                                <div className="py-1 uppercase">Middle Section</div>
                                <div className="border-t border-black py-1 text-[8px]">BODY</div>
                            </th>
                            <th className="border-r border-black p-1 text-center bg-slate-100">
                                <div className="py-1 uppercase">Bottom Section</div>
                                <div className="border-t border-black py-1 text-[8px]">BODY</div>
                            </th>
                            <th className="p-3 text-center bg-slate-50 uppercase">Total Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-black bg-emerald-50/10 font-bold text-[11px]">
                            <td colSpan="10" className="border-r border-black p-1.5 px-4 text-emerald-600 uppercase tracking-widest text-left">Item 1</td>
                            <td className="p-1 px-4 text-right uppercase text-[9px] text-[#00C853] font-black">Item Result: Pass</td>
                        </tr>
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-4 text-center font-bold">Check 1</td>
                            <td className="border-r border-black p-4 text-center">{report.date}</td>
                            <td className="border-r border-black p-4 text-center">{report.customer}</td>
                            <td className="border-r border-black p-4 text-center leading-relaxed font-medium text-[9px]">{report.fabrication}</td>
                            <td className="border-r border-black p-4 text-center uppercase font-bold text-slate-700">{report.color}</td>
                            <td className="border-r border-black p-4 text-center">{report.beforeDry}</td>
                            <td className="border-r border-black p-4 text-center text-slate-300 italic">-</td>
                            <td className="border-r border-black p-2 text-center bg-emerald-50/5">
                                <div className="flex flex-col py-1">
                                    <span className="text-sm font-black text-slate-900">{report.sections.top.body}</span>
                                    <span className="text-[9px] text-[#00C853] font-black leading-none mt-0.5 uppercase tracking-tighter">Pass</span>
                                </div>
                            </td>
                            <td className="border-r border-black p-2 text-center bg-emerald-50/5">
                                <div className="flex flex-col py-1">
                                    <span className="text-sm font-black text-slate-900">{report.sections.middle.body}</span>
                                    <span className="text-[9px] text-[#00C853] font-black leading-none mt-0.5 uppercase tracking-tighter">Pass</span>
                                </div>
                            </td>
                            <td className="border-r border-black p-2 text-center bg-emerald-50/5">
                                <div className="flex flex-col py-1">
                                    <span className="text-sm font-black text-slate-900">{report.sections.bottom.body}</span>
                                    <span className="text-[9px] text-[#00C853] font-black leading-none mt-0.5 uppercase tracking-tighter">Pass</span>
                                </div>
                            </td>
                            <td className="p-4 text-center text-[#00C853] font-black text-xs uppercase underline underline-offset-2">Pass</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Remarks and Photos Section */}
            <div className="grid grid-cols-[1.5fr_1fr] gap-6 px-2">
                <div className="border-[1.5px] border-black p-4 min-h-[350px] flex flex-col text-left">
                    <h3 className="text-sm font-black uppercase mb-4 pb-2 border-b-[1.5px] border-black inline-block w-fit">Remark / Comments</h3>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">No additional remarks recorded for this inspection.</p>
                </div>
                <div className="border-[1.5px] border-black p-4 min-h-[350px] flex flex-col items-center">
                    <h3 className="text-sm font-black uppercase mb-6 pb-2 border-b-[1.5px] border-black inline-block w-fit tracking-tighter self-start">Inspection Proof Photos</h3>
                    <div className="flex flex-wrap gap-4 items-center flex-1 justify-around">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className="w-[120px] h-[160px] bg-white overflow-hidden rounded-md border border-black shadow-sm">
                                    <img
                                        src="https://images.unsplash.com/photo-1558444458-54451f215091?q=80&w=2670&auto=format&fit=crop"
                                        alt="Proof"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-[8px] text-slate-400 font-bold italic tracking-tight">100000350{7 + i}.jpg</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Capture Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .formal-report-container {
                    display: block !important;
                    visibility: visible !important;
                }
                @page {
                    size: landscape;
                    margin: 0;
                }
            `}} />
        </div>
    );
});
