import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Save,
    Mic,
    Square,
    Activity,
    Calendar,
    Users,
    Tag,
    Briefcase,
    FileText,
    Hash,
    CalendarPlus,
    Languages
} from 'lucide-react';

const AddMeeting = ({ onCancel, onSave }) => {
    const [isRecording, setIsRecording] = useState(false);
    const isRecordingRef = useRef(false); // Ref to track recording state without triggering re-renders in callbacks
    const [selectedLanguage, setSelectedLanguage] = useState('en-US'); // Default to English
    const [isListening, setIsListening] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [permissionError, setPermissionError] = useState(false);
    const recognitionRef = useRef(null);

    const [formData, setFormData] = useState({
        id: '',
        date: '',
        style: '',
        buyer: '',
        attendees: '',
        notes: ''
    });

    // Initialize Speech Recognition once
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = selectedLanguage;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                let currentInterim = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        currentInterim += transcript;
                    }
                }

                if (finalTranscript) {
                    setFormData(prev => ({
                        ...prev,
                        notes: prev.notes + finalTranscript
                    }));
                }
                setInterimTranscript(currentInterim);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);

                if (event.error === 'not-allowed') {
                    setPermissionError(true);
                } else if (event.error === 'network') {
                    alert('Network error during speech recognition. Please check your connection.');
                }

                setIsRecording(false);
                isRecordingRef.current = false;
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
                // Restart if the user still wants to record (continuous mode sometimes stops)
                if (isRecordingRef.current) {
                    try {
                        recognition.start();
                    } catch (err) {
                        console.error('Failed to restart recognition:', err);
                    }
                }
            };

            recognitionRef.current = recognition;
        } else {
            console.warn('Speech Recognition not supported in this browser');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []); // Only run once on mount

    // Update language when it changes
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = selectedLanguage;

            // If recording, we need to restart to apply the language change
            if (isRecording) {
                recognitionRef.current.stop();
            }
        }
    }, [selectedLanguage]);

    const handleMicClick = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (!isRecording) {
            setPermissionError(false);
            // 1. Instantly show localized "Hello!" so the user knows the button worked
            if (!formData.notes.trim()) {
                const helloText = {
                    'en-US': 'Hello! ',
                    'km-KH': 'សួស្តី! ',
                    'zh-CN': '你好! '
                }[selectedLanguage] || 'Hello! ';

                setFormData(prev => ({ ...prev, notes: helloText }));
            }

            // 2. Start recording state
            setIsRecording(true);
            isRecordingRef.current = true;

            try {
                recognitionRef.current.start();
            } catch (err) {
                console.error('Error starting recognition:', err);
                setIsRecording(false);
                isRecordingRef.current = false;
            }
        } else {
            // Stop recording
            setIsRecording(false);
            isRecordingRef.current = false;
            recognitionRef.current.stop();
        }
    };

    const handleLanguageChange = (lang) => {
        const oldLang = selectedLanguage;
        setSelectedLanguage(lang);

        // If the current notes box only contains a greeting, swap it to the new language
        const greetings = {
            'en-US': 'Hello! ',
            'km-KH': 'សួស្តី! ',
            'zh-CN': '你好! '
        };

        if (formData.notes === greetings[oldLang]) {
            setFormData(prev => ({ ...prev, notes: greetings[lang] }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                {/* Form Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-red-50 rounded-xl text-red-600">
                                <CalendarPlus className="w-6 h-6" />
                            </div>
                            Schedule New Meeting
                        </h2>
                        <p className="ml-12 text-slate-500 text-xs font-bold mt-1">Initialize Pre-Production Strategy & Alignment</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-600 hover:rotate-90 duration-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1">
                    <div className="p-6 space-y-4">
                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Meeting ID */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <Hash className="w-3.5 h-3.5" /> Meeting ID
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                                    placeholder="Enter Meeting ID"
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                />
                            </div>

                            {/* Meeting Date */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <Calendar className="w-3.5 h-3.5" /> Meeting Date
                                </label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            {/* Style / Model */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <Tag className="w-3.5 h-3.5" /> Style / Model
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                                    placeholder="Enter Style / Model"
                                    value={formData.style}
                                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                                />
                            </div>

                            {/* Buyer */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <Briefcase className="w-3.5 h-3.5" /> Buyer
                                </label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                                    value={formData.buyer}
                                    onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                                >
                                    <option value="" disabled>Select Buyer</option>
                                    <option value="Aritzia">Aritzia</option>
                                    <option value="Costco">Costco</option>
                                    <option value="ANF">ANF</option>
                                    <option value="Reitmans">Reitmans</option>
                                </select>
                            </div>

                            {/* Attendees */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <Users className="w-3.5 h-3.5" /> Expected Attendees
                                </label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                                    placeholder="Number of attendees"
                                    value={formData.attendees}
                                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Meeting Minutes / Notes with Voice Feature */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <FileText className="w-3.5 h-3.5" /> Meeting Minutes / Notes
                                </label>
                                <div className="flex items-center gap-3">
                                    {/* Language Selector */}
                                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-full p-1 border border-slate-200">
                                        <button
                                            onClick={() => handleLanguageChange('en-US')}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${selectedLanguage === 'en-US'
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'text-slate-600 hover:bg-slate-200'
                                                }`}
                                            title="English"
                                        >
                                            EN
                                        </button>
                                        <button
                                            onClick={() => handleLanguageChange('km-KH')}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${selectedLanguage === 'km-KH'
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'text-slate-600 hover:bg-slate-200'
                                                }`}
                                            title="Khmer"
                                        >
                                            ខ្មែរ
                                        </button>
                                        <button
                                            onClick={() => handleLanguageChange('zh-CN')}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${selectedLanguage === 'zh-CN'
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'text-slate-600 hover:bg-slate-200'
                                                }`}
                                            title="Chinese"
                                        >
                                            中文
                                        </button>
                                    </div>

                                    {/* Recording Status Badge */}
                                    {isRecording && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full border border-red-100 animate-pulse">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                                                {{
                                                    'en-US': 'Recording...',
                                                    'km-KH': 'កំពុងថត...',
                                                    'zh-CN': '录音中...'
                                                }[selectedLanguage]}
                                            </span>
                                        </div>
                                    )}

                                    {/* Mic Button */}
                                    <button
                                        onClick={handleMicClick}
                                        className={`group relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${isRecording
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-200 scale-110'
                                            : 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105'
                                            }`}
                                        title={isRecording ? "Stop Recording" : "Record Voice Notes"}
                                    >
                                        {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}

                                        {isRecording && (
                                            <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-20"></div>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="relative group">
                                {permissionError && (
                                    <div className="mb-3 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-100 rounded-xl text-red-600">
                                                <Mic className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-red-700 uppercase tracking-tight">Microphone Blocked</p>
                                                <p className="text-[10px] text-red-500 font-bold leading-tight mt-0.5">Please click the padlock icon in your browser search bar and set Microphone to "Allow".</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setPermissionError(false)}
                                            className="p-1.5 hover:bg-red-100 rounded-full transition-all text-red-400"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <textarea
                                    className={`w-full px-6 py-5 bg-gray-50 border rounded-xl shadow-sm focus:ring-2 focus:outline-none transition-all font-medium placeholder:text-slate-300 min-h-[180px] resize-none ${isRecording
                                        ? 'border-blue-300 focus:ring-blue-500/20 focus:border-blue-400'
                                        : 'border-gray-300 focus:ring-blue-500/20 focus:border-blue-500'}`}
                                    placeholder={isRecording
                                        ? {
                                            'en-US': 'Listening to meeting notes...',
                                            'km-KH': 'កំពុងស្តាប់កំណត់ត្រាការប្រជុំ...',
                                            'zh-CN': '正在倾听会议记录...'
                                        }[selectedLanguage]
                                        : {
                                            'en-US': 'Enter meeting highlights or record voice minutes...',
                                            'km-KH': 'បញ្ចូលកំណត់ត្រាការប្រជុំ ឬថតសំឡេង...',
                                            'zh-CN': '输入会议重点或录制语音分钟...'
                                        }[selectedLanguage]}
                                    value={formData.notes + interimTranscript}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>

                                {/* Visual waveform effect when recording */}
                                {isRecording && (
                                    <div className="absolute bottom-8 right-8 flex items-end gap-1.5 h-10">
                                        {[0.4, 0.7, 0.5, 0.9, 0.3, 0.6, 0.8, 0.4, 0.6].map((v, i) => (
                                            <div key={i} className="w-1.5 bg-red-400 rounded-full" style={{ height: `${v * 100}%`, animation: `pulse 0.5s ease-in-out ${i * 0.1}s infinite alternate` }}></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {isRecording && (
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] text-center mt-3 flex items-center justify-center gap-2">
                                    <Activity className="w-3.5 h-3.5" />
                                    {{
                                        'en-US': 'High-fidelity voice recognition active',
                                        'km-KH': 'ការទទួលស្គាល់សំឡេងកម្រិតខ្ពស់កំពុងដំណើរការ',
                                        'zh-CN': '高保真语音识别已开启'
                                    }[selectedLanguage]}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Footer */}
                <div className="flex items-center justify-end gap-4 p-6 bg-slate-50/50 border-t border-slate-100">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
                    >
                        Discard
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all flex items-center shadow-xl shadow-red-200 active:scale-95"
                    >
                        <Save className="w-5 h-5 text-white/90" /> Confirm Schedule
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    from { height: 20%; }
                    to { height: 100%; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

export default AddMeeting;
