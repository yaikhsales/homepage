import React, { useState } from 'react';
import { ArrowLeft, Globe, Briefcase, FileText, UserCheck, Search, DollarSign, Truck, Archive, Bot, Network, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

const SOPMap = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 0, number: "🌐", title: "Master Overview Map", icon: Globe },
    { id: 1, number: "1", title: "Pre-Purchase Stock Check", icon: Archive },
    { id: 2, number: "2", title: "Item Request Creation", icon: FileText },
    { id: 3, number: "3", title: "Department Head Pre-Approval", icon: UserCheck },
    { id: 4, number: "4", title: "Purchaser Sourcing & Review", icon: Search },
    { id: 5, number: "5", title: "Executive Approval & Pay", icon: DollarSign },
    { id: 7, number: "7", title: "Logistics & Catalog Update", icon: Truck },
    { id: 10, number: "10", title: "Stock Control Rules", icon: Briefcase },
    { id: 'ai', number: "🤖", title: "AI Web Search Optimization", icon: Bot }
  ];

  const renderFlowchartPlaceholder = () => (
    <div className="flex-1 w-full h-full min-h-[500px] border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Decorative flowchart-like elements to mimic the screenshot */}
      <div className="relative z-10 flex items-center gap-4 text-xs font-medium text-gray-500 scale-75 md:scale-100">
        <div className="px-4 py-2 bg-white border-2 border-blue-200 rounded-md shadow-sm">Start Process</div>
        <div className="h-0.5 w-8 bg-blue-300"></div>
        <div className="px-4 py-4 bg-white border-2 border-yellow-300 rounded-md shadow-sm rotate-45 transform origin-center">
            <div className="-rotate-45">Decision</div>
        </div>
        <div className="h-0.5 w-8 bg-blue-300"></div>
        <div className="px-4 py-2 bg-white border-2 border-purple-200 rounded-md shadow-sm flex gap-2">
            <span>Flow A</span>
            <div className="h-full w-0.5 bg-gray-200 mx-2"></div>
            <span>Flow B</span>
        </div>
        <div className="h-0.5 w-8 bg-blue-300"></div>
        <div className="px-4 py-4 bg-white border-2 border-yellow-300 rounded-md shadow-sm rotate-45 transform origin-center">
            <div className="-rotate-45">Approval</div>
        </div>
        <div className="h-0.5 w-8 bg-blue-300"></div>
        <div className="px-4 py-2 bg-white border-2 border-green-200 rounded-md shadow-sm">End Process</div>
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <button className="p-2 bg-white rounded shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600"><ZoomIn size={18} /></button>
        <button className="p-2 bg-white rounded shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600"><ZoomOut size={18} /></button>
        <button className="p-2 bg-white rounded shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600"><Maximize size={18} /></button>
        <div className="text-[10px] text-gray-400 font-bold mt-1 text-center cursor-pointer hover:text-gray-600">RESET</div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col bg-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="h-20 bg-white border-b flex items-center px-6 shrink-0 relative z-10 shadow-sm">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              YAI
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">YAI Standard Operating Procedure</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium ml-8">Click on any Step on the left to view its detailed Sub-Process Flow on the right.</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-[#e8eef3] shrink-0 overflow-y-auto py-6 flex flex-col gap-1 px-4 shadow-inner border-r border-gray-200">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            
            // Generate colored circle classes
            let circleClass = "bg-slate-500";
            if (isActive && step.id === 0) circleClass = "bg-slate-900";
            else if (step.id === 1) circleClass = "bg-slate-600";
            else if (step.id === 2) circleClass = "bg-blue-500";
            else if (step.id === 3) circleClass = "bg-yellow-500";
            else if (step.id === 4) circleClass = "bg-orange-500";
            else if (step.id === 5) circleClass = "bg-emerald-600";
            else if (step.id === 7) circleClass = "bg-teal-500";
            else if (step.id === 10) circleClass = "bg-rose-500";
            else if (step.id === 'ai') circleClass = "bg-purple-500";

            return (
              <div 
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`
                  flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${isActive 
                    ? 'bg-white shadow-md border-l-4 border-slate-800 scale-[1.02]' 
                    : 'hover:bg-black/5 border-l-4 border-transparent'
                  }
                `}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm ${circleClass}`}>
                  {step.id === 0 ? <Globe size={16} /> : step.id === 'ai' ? <Bot size={16} /> : step.number}
                </div>
                <div className="flex flex-col justify-center min-h-[32px]">
                  <h3 className={`text-sm font-bold leading-tight ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                    {step.title}
                  </h3>
                  {isActive && step.id === 0 && (
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">View the entire connected ecosystem.</p>
                  )}
                  {isActive && step.id !== 0 && (
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">Click to view sub-process</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Pane */}
        <div className="flex-1 bg-white m-4 rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden">
          {/* Main Pane Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
             <Network className="text-slate-400" size={24} />
             <h2 className="text-lg font-black text-slate-800 tracking-tight">
               {activeStep === 0 ? 'Master Ecosystem Overview' : steps.find(s => s.id === activeStep)?.title}
             </h2>
          </div>
          
          {/* Main Pane Body */}
          <div className="flex-1 p-6 overflow-hidden flex flex-col">
             {renderFlowchartPlaceholder()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOPMap;
