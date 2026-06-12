import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";

const DocumentViewer = ({ documentPath, documentUrl, onClose }) => {
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const activePath = documentPath || documentUrl;

  // Extract filename from the path
  const filename = activePath ? activePath.split("/").pop() : "Report";

  useEffect(() => {
    let isMounted = true;

    const fetchAndParseExcel = async () => {
      setLoading(true);
      setError(false);
      setErrorMessage("");
      try {
        const response = await fetch(activePath);
        if (!response.ok) throw new Error("Network response was not ok");
        const arrayBuffer = await response.arrayBuffer();

        // Parse the excel file by passing the ArrayBuffer
        const workbook = XLSX.read(arrayBuffer);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to HTML
        const html = XLSX.utils.sheet_to_html(worksheet, { id: "excel-table" });

        if (isMounted) {
          setHtmlContent(html);
        }
      } catch (err) {
        console.error("Failed to load Excel file:", err);
        if (isMounted) {
          setError(true);
          setErrorMessage(err.message || String(err));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!activePath) {
      setError(true);
      setLoading(false);
      return;
    }

    if (activePath.endsWith(".pdf") || activePath.endsWith(".html")) {
      setLoading(false);
      setError(false);
    } else if (activePath.endsWith(".xlsx") || activePath.endsWith(".xls")) {
      fetchAndParseExcel();
    } else {
      setError(true);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [activePath]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onClose]);

  const handleDownload = (e) => {
    e.stopPropagation(); // Prevent modal from closing if someone clicks exactly on download
    const link = document.createElement("a");
    link.href = activePath;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-300"
      onClick={(e) => {
        // Close when clicking on backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex-1"></div>

        <div className="flex items-center gap-3 justify-center flex-1">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/10"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all hover:scale-110 cursor-pointer flex-shrink-0 shadow-lg"
            title="Home"
          >
            <img
              src="/logo.jpg"
              alt="Home"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/10"
            title="Download Report"
          >
            <Download size={18} />
            <span className="text-sm font-medium">Download</span>
          </button>
        </div>
      </div>

      {/* Document Container */}
      <div
        className="flex-1 flex flex-col items-center justify-start overflow-hidden mt-[72px] mb-[64px] px-4 md:px-8 w-full max-w-full mx-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white/10 border border-white/20 shadow-2xl rounded-2xl w-full h-full flex flex-col animate-in zoom-in-95 duration-500 overflow-hidden relative">
          <div className="bg-slate-900 border-b border-white/10 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={24} className="text-green-400" />
              <h2 className="text-lg font-bold text-white tracking-wide truncate max-w-md">
                {filename}
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-0 bg-white shadow-inner relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 font-medium tracking-wide">
                  Loading report data...
                </p>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">
                  Failed to load Report
                </h3>
                <p className="text-slate-600 max-w-md">
                  We couldn't load the file. It might have been moved, or it's
                  not a supported format.
                  <br />
                  <br />
                  <span className="text-red-500 font-bold">
                    Error: {errorMessage || "Unknown error"}
                  </span>
                </p>
                <div className="bg-slate-100 p-3 rounded-lg mt-2 overflow-x-auto w-full max-w-lg">
                  <p className="text-slate-500 text-xs font-mono">
                    {activePath}
                  </p>
                </div>
              </div>
            ) : activePath && (activePath.endsWith(".pdf") || activePath.endsWith(".html")) ? (
              <iframe
                src={activePath.endsWith(".pdf") ? `${activePath}#view=FitH` : activePath}
                title="Document"
                className="w-full h-full border-none"
              />
            ) : (
              <div
                className="w-full h-full overflow-auto text-black excel-table-container p-6"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
        <div className="text-center">
          <p className="text-white/80 text-base font-semibold tracking-wide">
            Report Viewer
          </p>
          <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">
            Press ESC to return back
          </p>
        </div>
      </div>

      {/* 
        Inject some CSS to style the basic HTML table that XLSX outputs nicely
      */}
      <style>{`
        .excel-table-container table {
          border-collapse: collapse;
          width: 100%;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 14px;
        }
        .excel-table-container td, .excel-table-container th {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          min-width: 100px;
          color: #1f2937;
        }
        .excel-table-container tr:first-child td {
          background-color: #f3f4f6;
          font-weight: 600;
          color: #111827;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .excel-table-container tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .excel-table-container tr:hover td {
            background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default DocumentViewer;
