import React, { useState } from 'react';
import { ArrowLeft, Database, Target, Brain, User, Bot, FileText, ArrowRight } from 'lucide-react';

const FactoryWorkflow = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, title: "Fabric & Testing Inspection" },
    { id: 2, title: "Cutting & Bundling" },
    { id: 3, title: "Value Added Sub-Processes" },
    { id: 4, title: "WIP - QC1 Real Time" },
    { id: 5, title: "Washing (Wet Processing)" },
    { id: 6, title: "Finishing & Measurement" },
    { id: 7, title: "Final QA Inspection (QC?)" },
    { id: 8, title: "Packing & Dispatch" }
  ];

  const renderProcessWorkflow = () => (
    <div className="mt-4 bg-[#1e2336] border border-[#2d3348] rounded-lg p-6 flex flex-col items-center justify-center">
      <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-6">Process Workflow</h3>
      <div className="flex items-center gap-2 text-[10px] text-slate-300">
        <div className="px-4 py-2 border border-slate-600 rounded bg-[#252b42]">Supplier</div>
        <div className="h-px w-8 bg-slate-600 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-slate-600"></div></div>
        <div className="px-4 py-2 border border-slate-600 rounded bg-[#252b42] flex flex-col items-center">
            <span>Roll Inspection</span>
            <span className="text-[8px] text-slate-500">(FC_System)</span>
            <span className="text-[8px] text-slate-500">ViewInspection_Inv</span>
        </div>
        <div className="h-px w-8 bg-slate-600 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-slate-600"></div></div>
        <div className="px-4 py-6 border border-slate-600 rounded bg-[#252b42] transform rotate-45 flex items-center justify-center w-16 h-16">
            <div className="-rotate-45 text-center leading-tight">
                <span>4-Point Defect</span>
                <br/><span className="text-[8px] text-slate-500">(FC_System)</span>
            </div>
        </div>
        <div className="h-px w-8 bg-slate-600 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-slate-600"></div></div>
        <div className="flex flex-col gap-2">
            <div className="px-4 py-2 border border-slate-600 rounded bg-[#252b42] flex flex-col items-center">
                <span>Specialized Testing</span>
                <span className="text-[8px] text-slate-500">(FC_System)</span>
            </div>
            <div className="px-4 py-2 border border-slate-600 rounded bg-[#252b42] text-center">Issue</div>
        </div>
        <div className="h-px w-8 bg-slate-600 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-slate-600"></div></div>
        <div className="px-4 py-2 border border-slate-600 rounded bg-[#252b42]">Warehouse</div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col bg-[#0b1120] overflow-hidden font-sans text-slate-200">
      {/* Header Area */}
      <div className="shrink-0 pt-8 pb-4 relative z-10 flex flex-col items-center border-b border-[#1e2336] px-6">
        <button
          onClick={onBack}
          className="absolute left-6 top-8 p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="absolute left-16 top-8 w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold shadow-[0_0_15px_rgba(249,115,22,0.5)]">
              YAI
            </div>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">YQMS Factory Intelligence</h1>
        <p className="text-xs text-slate-400 font-medium mb-8">Executive Overview of End-to-End AI Integration & Database Architecture</p>

        {/* Top Metrics */}
        <div className="flex gap-4 mb-4">
          <div className="bg-[#151a2d] border border-[#2d3348] rounded px-8 py-3 flex flex-col items-center min-w-[140px]">
            <span className="text-2xl font-bold text-white leading-none mb-1">8</span>
            <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">CORE PROCESSES</span>
          </div>
          <div className="bg-[#151a2d] border border-[#2d3348] rounded px-8 py-3 flex flex-col items-center min-w-[140px]">
            <span className="text-2xl font-bold text-white leading-none mb-1">Real-Time</span>
            <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">SYNC SPEED</span>
          </div>
          <div className="bg-[#151a2d] border border-[#2d3348] rounded px-8 py-3 flex flex-col items-center min-w-[140px]">
            <span className="text-2xl font-bold text-white leading-none mb-1">24/7</span>
            <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">AI MONITORING</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden max-w-6xl w-full mx-auto">
        {/* Left Sidebar Steps */}
        <div className="w-72 shrink-0 overflow-y-auto py-8 flex flex-col px-4 relative">
          <div className="absolute left-[31px] top-12 bottom-12 w-px bg-[#2d3348] z-0"></div>
          
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            
            return (
              <div 
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`
                  relative z-10 flex items-center gap-4 py-4 cursor-pointer transition-all duration-200 group
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-300
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] scale-110' 
                    : 'bg-[#1e2336] text-slate-400 border border-[#2d3348] group-hover:bg-[#252b42]'
                  }
                `}>
                  {step.id}
                </div>
                <h3 className={`text-sm font-semibold leading-tight transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {step.title}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Main Content Pane */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="bg-[#151a2d] border border-[#2d3348] rounded-xl p-8 shadow-2xl relative overflow-hidden">
            {/* Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50"></div>
            
            <div className="mb-6 border-b border-[#2d3348] pb-4">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                 <span className="text-slate-500 font-normal">01</span> Fabric & Testing Inspection
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 bg-blue-500/10 inline-flex px-3 py-1 rounded">
                <Database size={14} /> FC_SYSTEM (MSSQL)
              </div>
            </div>

            {/* Business Value Box */}
            <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
              <h3 className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase mb-2 flex items-center gap-2">
                <Target size={14} /> BUSINESS VALUE
              </h3>
              <p className="text-sm text-emerald-100 font-medium leading-relaxed">
                Protects profit margins by catching defective fabric and severe shrinkage issues before they hit the expensive cutting floor.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Executive Summary */}
              <div className="rounded-lg border border-[#2d3348] bg-[#1a2035] p-5">
                <h3 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-2">
                   <FileText size={14} /> EXECUTIVE SUMMARY
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Agent aggregates total rolls and calculates pass rates via VI sub-agent here. ... evaluated using a strict 4-point system in View... Additional specialized testing (Shrinkage, Density, Crocking) is tracked via dedicated SQL views.
                </p>
              </div>

              {/* Data Architecture */}
              <div className="rounded-lg border border-[#2d3348] bg-[#1a2035] p-5">
                <h3 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-2">
                   <Database size={14} /> DATA ARCHITECTURE
                </h3>
                <ul className="text-xs font-mono text-slate-300 space-y-2">
                  <li>FC_System: <span className="text-indigo-400">ViewInspection_Inv</span></li>
                  <li>FC_System: <span className="text-indigo-400">ViewShrinkage_Task</span></li>
                  <li>FC_System: <span className="text-indigo-400">ViewCrocking_Task</span></li>
                </ul>
              </div>
            </div>

            {/* AI Agent Capability Test */}
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-6 mb-6">
              <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-4 flex items-center gap-2">
                 <Brain size={16} /> AI Agent capability test
              </h3>
              
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-start bg-[#1e2336] p-3 rounded-lg border border-[#2d3348]">
                   <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center shrink-0 mt-0.5"><User size={12} className="text-slate-300" /></div>
                   <p className="text-xs text-slate-300 leading-relaxed"><span className="font-bold text-slate-200">User:</span> Show me the 4-point defect breakdown for the latest batch.</p>
                </div>
                
                <div className="flex gap-3 items-start bg-blue-900/20 p-3 rounded-lg border border-blue-500/20 ml-6">
                   <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Bot size={12} className="text-white" /></div>
                   <p className="text-xs text-blue-100 leading-relaxed"><span className="font-bold text-blue-300">Agent:</span> Querying ViewInspection: The top defect was 'Holes' with 15 occurrences scoring 4 points. The overall pass rate is 92%.</p>
                </div>

                <div className="flex gap-3 items-start bg-[#1e2336] p-3 rounded-lg border border-[#2d3348]">
                   <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center shrink-0 mt-0.5"><User size={12} className="text-slate-300" /></div>
                   <p className="text-xs text-slate-300 leading-relaxed"><span className="font-bold text-slate-200">User:</span> What is the supplier performance for 'TexCorp' this month?</p>
                </div>

                <div className="flex gap-3 items-start bg-blue-900/20 p-3 rounded-lg border border-blue-500/20 ml-6">
                   <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Bot size={12} className="text-white" /></div>
                   <p className="text-xs text-blue-100 leading-relaxed"><span className="font-bold text-blue-300">Agent:</span> Based on ViewInspection_Inv, TexCorp supplied 500 rolls. 480 were 'Released'.</p>
                </div>
              </div>
            </div>

            {renderProcessWorkflow()}

          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoryWorkflow;
