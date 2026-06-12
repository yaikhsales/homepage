import React, { useState, useRef } from "react";
import {
  Upload,
  Sparkles,
  Send,
  CheckCircle2,
  Bot,
  Youtube,
  Facebook,
  Linkedin,
  Video,
  Globe,
  ArrowLeft,
  Loader2,
  Music,
} from "lucide-react";

export default function AutoPost({ onBack }) {
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [descriptions, setDescriptions] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postStatus, setPostStatus] = useState({});
  const [scheduleTime, setScheduleTime] = useState("");
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const generateDescriptions = () => {
    if (!topic) return;
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setDescriptions({
        tiktok: `🔥 ${topic} is here! Check this out! #trending #viral #fyp`,
        youtube: `Title: The Ultimate Guide to ${topic}\n\nIn this video, we dive deep into ${topic}. Don't forget to like and subscribe! #shorts`,
        facebook: `Have you ever wondered about ${topic}? Watch our latest video to find out more! 👇`,
        linkedin: `Excited to share our latest insights on ${topic}. A huge milestone for the team. #innovation #business`,
        google: `New update! We just published a video about ${topic}. Come visit us or learn more on our website.`,
      });
      setIsGenerating(false);
    }, 2000);
  };

  const startPosting = async () => {
    if (!file || !descriptions) return;
    setIsPosting(true);
    
    // Set all statuses to "posting"
    const initialStatus = {};
    platforms.forEach(p => initialStatus[p.id] = "posting");
    setPostStatus(initialStatus);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("descriptions", JSON.stringify(descriptions));
    if (scheduleTime) {
      formData.append("scheduleTime", new Date(scheduleTime).toISOString());
    }

    try {
      const response = await fetch("http://localhost:5000/api/post", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Set all to success
        const successStatus = {};
        platforms.forEach(p => successStatus[p.id] = "success");
        setPostStatus(successStatus);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      alert("Failed to connect to the Auto-Poster backend. Is the server running?");
    } finally {
      setIsPosting(false);
    }
  };

  const platforms = [
    { id: "tiktok", name: "TikTok", icon: <Music className="w-5 h-5" />, color: "bg-black text-white" },
    { id: "youtube", name: "YouTube", icon: <Youtube className="w-5 h-5" />, color: "bg-red-600 text-white" },
    { id: "facebook", name: "Facebook", icon: <Facebook className="w-5 h-5" />, color: "bg-blue-600 text-white" },
    { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, color: "bg-blue-700 text-white" },
    { id: "google", name: "Google Profile", icon: <Globe className="w-5 h-5" />, color: "bg-green-600 text-white" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-2">
              <Bot className="w-8 h-8 text-purple-400" />
              AI Auto-Poster
            </h1>
            <p className="text-indigo-200 text-sm mt-1">
              Upload once, generate copy, and distribute everywhere instantly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input & AI Generation */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                file
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-indigo-400/30 hover:border-indigo-400/60 bg-white/5"
              } backdrop-blur-sm`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                    <Video className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-lg">{file.name}</h3>
                  <p className="text-sm text-indigo-200">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to post
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-red-400 hover:text-red-300 mt-2"
                  >
                    Remove Video
                  </button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center gap-4 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Drag & Drop Video</h3>
                    <p className="text-sm text-indigo-300">
                      or click to browse your computer
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Topic Input */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <label className="block text-sm font-medium text-indigo-200 mb-2">
                What is this video about?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., A quick tutorial on how to use the new dashboard features..."
                className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 text-white placeholder-indigo-400/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all h-28"
              />
              <button
                onClick={generateDescriptions}
                disabled={!topic || isGenerating}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Descriptions
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Descriptions & Posting */}
          <div className="space-y-6">
            {descriptions ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    Ready to Post
                  </h2>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-3">
                      <input 
                        type="datetime-local" 
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-indigo-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                        title="Leave empty to post immediately"
                      />
                      <button
                        onClick={startPosting}
                        disabled={isPosting || !file}
                        className="bg-green-500 hover:bg-green-400 text-white font-semibold py-2 px-6 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isPosting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                        {scheduleTime ? "Schedule Post" : "Post Now"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Platform Previews */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {platforms.map((p) => (
                    <div
                      key={p.id}
                      className="bg-black/40 border border-white/10 rounded-xl p-4 relative overflow-hidden group"
                    >
                      {/* Status Overlay */}
                      {postStatus[p.id] && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
                          {postStatus[p.id] === "posting" ? (
                            <div className="flex items-center gap-2 text-blue-400 font-semibold">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Uploading to {p.name}...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-green-400 font-semibold">
                              <CheckCircle2 className="w-6 h-6" />
                              Successfully Posted!
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.color}`}
                        >
                          {p.icon}
                        </div>
                        <span className="font-semibold">{p.name}</span>
                      </div>
                      <textarea
                        defaultValue={descriptions[p.id]}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-indigo-100 focus:outline-none focus:border-purple-500 h-24"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-indigo-300">
                <Bot className="w-16 h-16 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Awaiting Instructions</h3>
                <p className="text-sm max-w-sm">
                  Upload a video and enter a topic to generate platform-specific descriptions using Gemini AI.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
