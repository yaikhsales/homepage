import React from "react";
import { Modal, Button } from "./ModuleModal";

const ReportModal = ({
  isOpen,
  onClose,
  title,
  data,
  columns,
  colorClass,
  highlightClass,
}) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} title={title}>
      <div className="overflow-x-auto mb-6 bg-slate-900/40 rounded-2xl border border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/60 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`p-4 ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`p-4 ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}`}
                  >
                    {col.render ? (
                      col.render(row[col.accessor], row)
                    ) : (
                      <span className="text-sm font-medium text-slate-300">
                        {row[col.accessor]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center gap-4">
        <Button
          onClick={() => window.print()}
          className={`bg-${colorClass || "blue"}-600 hover:bg-${colorClass || "blue"}-500 text-white font-bold px-8 py-2.5 rounded-xl shadow-lg transition-all`}
        >
          Print / Export PDF
        </Button>
        <Button
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold px-8 py-2.5 rounded-xl transition-all"
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ReportModal;
