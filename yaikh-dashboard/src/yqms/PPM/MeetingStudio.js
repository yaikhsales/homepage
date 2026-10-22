import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, CircleStop, FileAudio, Languages, Mic, Save, Users, Volume2 } from 'lucide-react';
import { DEMO_MEETINGS, MEETING_TYPES } from './meeting-demo-transcripts';
import './meeting-studio.css';

const LANGUAGE = {
  en: { label: 'English', speech: 'en-US' },
  km: { label: 'ខ្មែរ', speech: 'km-KH' },
  zh: { label: '中文', speech: 'zh-CN' },
};
const blankTranscript = () => ({ en: '', km: '', zh: '' });
const dateToday = () => new Date().toLocaleDateString('en-CA');
const meetingId = () => `MTG-${Date.now().toString(36).toUpperCase()}`;
const minutes = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
const noteChunks = value => value.match(/[\s\S]{1,1800}/g) || [];
const audioExtension = blob => /\.(mp4|m4a)$/i.test(blob?.name || '') || blob?.type.includes('mp4') || blob?.type.includes('m4a') ? 'mp4' : 'webm';

export default function MeetingStudio({ onRecord, records = [] }) {
  const [type, setType] = useState('pre-production');
  const [view, setView] = useState('schedule');
  const [form, setForm] = useState({ id: meetingId(), date: dateToday(), time: '09:00', order: '', style: '', buyer: '', attendees: '', agenda: '', meetingLink: '' });
  const [selectedId, setSelectedId] = useState(DEMO_MEETINGS[0].id);
  const [language, setLanguage] = useState('en');
  const [transcripts, setTranscripts] = useState(blankTranscript);
  const [recording, setRecording] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const transcriptRef = useRef(blankTranscript());
  const languageRef = useRef('en');
  const audioUrlRef = useRef('');

  const savedMeetings = useMemo(() => records.filter(record => record.payload?.meetingType)
    .map(record => ({
      id: record.payload.meetingId || record.payload.id || record.id,
      recordId: record.id,
      type: record.payload.meetingType,
      date: record.payload.date,
      time: record.payload.time,
      order: record.order,
      style: record.style,
      buyer: record.buyer,
      attendees: record.payload.attendees,
      meetingLink: record.payload.meetingLink,
      title: record.payload.agenda || `${record.payload.meetingType} meeting`,
      status: record.status,
      summary: record.payload.summary || 'Meeting record saved to the quality report.',
      transcripts: record.payload.transcripts || blankTranscript(),
      audio: record.payload.evidenceFiles?.find(file => file.type?.startsWith('audio/')),
      demo: false,
    })), [records]);
  const allMeetings = useMemo(() => [...savedMeetings, ...DEMO_MEETINGS.map(item => ({ ...item, demo: true }))], [savedMeetings]);
  const currentMeetings = allMeetings.filter(item => item.type === type);
  const selectedMeeting = allMeetings.find(item => item.id === selectedId) || currentMeetings[0];
  const updateForm = (field, value) => setForm(current => ({ ...current, [field]: value }));
  const updateTranscript = (code, value) => {
    transcriptRef.current = { ...transcriptRef.current, [code]: value };
    setTranscripts(transcriptRef.current);
  };

  useEffect(() => { languageRef.current = language; }, [language]);
  useEffect(() => {
    return () => {
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      recognitionRef.current?.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      clearInterval(timerRef.current);
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  function chooseType(next) {
    if (recording) return;
    setType(next);
    setScheduled(false);
    setSelectedId((allMeetings.find(item => item.type === next) || {}).id || '');
    setView('schedule');
    setError('');
    setMessage('');
  }

  async function schedule(event) {
    event.preventDefault();
    setError('');
    if (!form.order.trim() || !form.style.trim() || !form.buyer.trim() || !form.date || !form.time) {
      setError('Enter order, style, buyer, date and time to schedule this meeting.');
      return;
    }
    if (form.meetingLink.trim()) {
      try { if (new URL(form.meetingLink).protocol !== 'https:') throw new Error(); }
      catch { setError('Use a valid HTTPS link for the remote meeting.'); return; }
    }
    setBusy('schedule');
    try {
      const saved = await onRecord({ ...form, meetingType: type, meetingId: form.id, mo: form.order, checked: 0, rejected: 0, status: 'SCHEDULED', transcripts: blankTranscript(), source: 'Meeting schedule' });
      setMessage(`${saved.id} scheduled. Open the recording room when attendees are ready.`);
      setScheduled(true);
      setView('room');
    } catch (cause) {
      setError(cause.message || 'Meeting could not be scheduled.');
    } finally { setBusy(''); }
  }

  function startSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessage('Audio recording is active. Use Generate transcript after stopping; live captions are unavailable in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = LANGUAGE[languageRef.current].speech;
    recognition.onresult = event => {
      const spoken = Array.from(event.results).slice(event.resultIndex)
        .filter(result => result.isFinal).map(result => result[0].transcript.trim()).filter(Boolean).join(' ');
      if (spoken) {
        const code = languageRef.current;
        updateTranscript(code, [transcriptRef.current[code], spoken].filter(Boolean).join(' '));
      }
    };
    recognition.onerror = event => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') setMessage('Live captions stopped. The audio recording continues; generate the transcript after stopping.');
    };
    recognitionRef.current = recognition;
    try { recognition.start(); } catch { setMessage('Live captions are unavailable. Audio recording continues.'); }
  }

  async function startRecording() {
    setError('');
    setMessage('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('This browser cannot record audio. Use a current browser with microphone access.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = '';
      setAudioUrl('');
      setAudioBlob(null);
      setSeconds(0);
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(typeName => MediaRecorder.isTypeSupported(typeName));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (blob.size) {
          const url = URL.createObjectURL(blob);
          audioUrlRef.current = url;
          setAudioBlob(blob);
          setAudioUrl(url);
          setMessage('Recording ready. Review the captions or generate a transcript from the audio.');
        }
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };
      recorderRef.current = recorder;
      recorder.start(1000);
      setRecording(true);
      timerRef.current = setInterval(() => setSeconds(value => value + 1), 1000);
      startSpeech();
    } catch (cause) {
      streamRef.current?.getTracks().forEach(track => track.stop());
      setError(cause?.name === 'NotAllowedError' ? 'Microphone permission was denied. Allow the microphone for this site to record.' : 'The microphone could not start.');
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    streamRef.current?.getTracks().forEach(track => track.stop());
    clearInterval(timerRef.current);
    setRecording(false);
  }

  function loadRecording(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { setError('Use a WebM or MP4 recording up to 8 MB.'); return; }
    if (!/\.(webm|mp4|m4a)$/i.test(file.name)) { setError('Use a WebM, MP4 or M4A recording.'); return; }
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    const url = URL.createObjectURL(file);
    audioUrlRef.current = url;
    setAudioBlob(file);
    setAudioUrl(url);
    setError('');
    setMessage('Recording loaded. Generate and review its transcript before saving.');
  }

  async function generateTranscript() {
    if (!audioBlob) return;
    setBusy('transcribe');
    setError('');
    try {
      const extension = audioExtension(audioBlob);
      const file = new File([audioBlob], `${form.id}.${extension}`, { type: audioBlob.type });
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/yqms/meeting-transcript', { method: 'POST', body, credentials: 'same-origin' });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Transcription failed.');
      updateTranscript(result.language || language, result.transcript);
      setMessage('Audio transcript generated. Review it before saving the meeting.');
    } catch (cause) { setError(cause.message || 'Transcription is unavailable. You can edit the live captions manually.'); }
    finally { setBusy(''); }
  }

  async function generateLanguages() {
    const source = transcriptRef.current[language] || Object.values(transcriptRef.current).find(Boolean);
    if (!source) { setError('Record or enter a transcript first.'); return; }
    setBusy('translate');
    setError('');
    try {
      const translated = { ...transcriptRef.current };
      for (const code of ['en', 'km', 'zh']) {
        if (translated[code]) continue;
        const translatedParts = [];
        for (const chunk of noteChunks(source)) {
          const response = await fetch('/api/yqms/translate-notes', {
            method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: code, notes: [chunk] }),
          });
          const result = await response.json();
          if (!response.ok || !result.ok) throw new Error(result.error || 'Translation failed.');
          translatedParts.push(result.translations[0]);
        }
        translated[code] = translatedParts.join(' ');
      }
      transcriptRef.current = translated;
      setTranscripts(translated);
      setMessage('English, Khmer and Chinese transcript views are ready for review.');
    } catch (cause) { setError(cause.message || 'Translation is unavailable. The original transcript remains editable.'); }
    finally { setBusy(''); }
  }

  async function saveMinutes() {
    const content = Object.values(transcriptRef.current).find(value => value.trim());
    if (!content) { setError('Record or enter a transcript before saving minutes.'); return; }
    setBusy('save');
    setError('');
    try {
      let evidenceFiles = [];
      if (audioBlob) {
        if (audioBlob.size > 8 * 1024 * 1024) throw new Error('Recording exceeds 8 MB. Download it, then make a shorter segment before saving.');
        const body = new FormData();
        const extension = audioExtension(audioBlob);
        body.append('file', new File([audioBlob], `${form.id}.${extension}`, { type: audioBlob.type }));
        body.append('category', 'Meeting audio');
        const response = await fetch('/api/yqms/module-evidence?module=pre-production-meeting', { method: 'POST', body, credentials: 'same-origin' });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || 'Recording could not be uploaded.');
        evidenceFiles = [result.file];
      }
      const saved = await onRecord({ ...form, meetingType: type, meetingId: form.id, mo: form.order, checked: 1, rejected: 0,
        status: 'PENDING REVIEW', transcripts: transcriptRef.current, notes: content, summary: content.slice(0, 280),
        evidenceFiles, durationSeconds: seconds, source: 'Recorded meeting minutes' });
      setMessage(`${saved.id} saved to Dashboard and Report. The original transcript remains available for review.`);
      setSelectedId(form.id);
      setView('history');
    } catch (cause) { setError(cause.message || 'Meeting minutes could not be saved. Keep the recording on this device and retry.'); }
    finally { setBusy(''); }
  }

  function useExample(item) {
    if (recording) return;
    setType(item.type);
    setScheduled(false);
    setForm({ id: meetingId(), date: dateToday(), time: '09:00', order: item.order, style: item.style, buyer: item.buyer, attendees: item.attendees, agenda: item.title, meetingLink: '' });
    setView('schedule');
    setMessage('Order details copied from the demo example. This creates a new meeting, not an approval.');
  }

  return <div className="qms-meeting-studio">
    <header className="qms-meeting-head">
      <div><span className="qms-meeting-kicker">YQMS · MEETING STUDIO</span><h2>Schedule, record and transcribe</h2><p>Three quality meetings feed the same Dashboard, Report, Modify and DR workflow.</p></div>
      <span className="qms-meeting-demo">Public demo · examples are illustrative</span>
    </header>
    <nav className="qms-meeting-types" aria-label="Meeting type">
      {MEETING_TYPES.map(item => <button type="button" key={item.id} className={type === item.id ? 'active' : ''} aria-pressed={type === item.id} disabled={recording} onClick={() => chooseType(item.id)}>{item.label}</button>)}
    </nav>
    <p className="qms-meeting-purpose">{MEETING_TYPES.find(item => item.id === type)?.purpose}</p>
    <div className="qms-meeting-steps" aria-label="Meeting workflow">
      {[['schedule', '1 · Schedule', CalendarDays], ['room', '2 · Record', Mic], ['history', '3 · Transcripts', FileAudio]].map(([id, label, Icon]) =>
        <button type="button" key={id} className={view === id ? 'active' : ''} aria-pressed={view === id} disabled={recording || (id === 'room' && !scheduled)} onClick={() => setView(id)}><Icon size={17} />{label}</button>)}
    </div>
    {error && <p className="qms-meeting-error" role="alert">{error}</p>}
    {message && <p className="qms-meeting-message" role="status">{message}</p>}

    {view === 'schedule' && <form className="qms-meeting-panel" onSubmit={schedule}>
      <h3>Schedule {MEETING_TYPES.find(item => item.id === type)?.label} meeting</h3>
      <div className="qms-meeting-grid">
        <label>Meeting ID<input value={form.id} onChange={event => updateForm('id', event.target.value)} /></label>
        <label>Date<input type="date" value={form.date} onChange={event => updateForm('date', event.target.value)} /></label>
        <label>Time<input type="time" value={form.time} onChange={event => updateForm('time', event.target.value)} /></label>
        <label>Order / MO<input value={form.order} onChange={event => updateForm('order', event.target.value)} placeholder="Order number" /></label>
        <label>Style<input value={form.style} onChange={event => updateForm('style', event.target.value)} placeholder="Style number" /></label>
        <label>Buyer<input value={form.buyer} onChange={event => updateForm('buyer', event.target.value)} placeholder="Buyer" /></label>
      </div>
      <label className="qms-meeting-wide"><Users size={15} /> Attendees / roles<input value={form.attendees} onChange={event => updateForm('attendees', event.target.value)} placeholder="QA, production, technical, merchandising…" /></label>
      <label className="qms-meeting-wide">Teams / Zoom meeting link (optional)<input type="url" value={form.meetingLink} onChange={event => updateForm('meetingLink', event.target.value)} placeholder="https://…" /></label>
      <label className="qms-meeting-wide">Agenda<textarea rows={2} value={form.agenda} onChange={event => updateForm('agenda', event.target.value)} placeholder="Topics and controlled references for this meeting" /></label>
      <div className="qms-meeting-actions"><button type="submit" className="primary" disabled={!!busy}><CalendarDays size={17} />{busy === 'schedule' ? 'Saving…' : 'Save schedule and open room'}</button></div>
    </form>}

    {view === 'room' && <section className="qms-meeting-panel">
      <div className="qms-meeting-room-top"><div><span className="qms-meeting-kicker">AUDIO MEETING ROOM</span><h3>{form.agenda || MEETING_TYPES.find(item => item.id === type)?.label}</h3><p>{form.id} · {form.order || 'Order not entered'} · {form.style || 'Style not entered'}</p></div><span className={recording ? 'qms-rec live' : 'qms-rec'}>{recording ? `● REC ${minutes(seconds)}` : 'Ready to record'}</span></div>
      <p className="qms-meeting-room-note">This pad captures the microphone on this device. Tell attendees before recording. It does not transmit a live call to remote participants.</p>
      {form.meetingLink.startsWith('https://') && <p><a href={form.meetingLink} target="_blank" rel="noopener noreferrer">Join remote meeting ↗</a></p>}
      <p className="qms-meeting-people"><Users size={17} />{form.attendees || 'Add attendees in Schedule'}</p>
      <div className="qms-meeting-controls">
        <button type="button" className={recording ? 'stop' : 'primary'} onClick={recording ? stopRecording : startRecording} disabled={!!busy}>{recording ? <CircleStop size={18} /> : <Mic size={18} />}{recording ? 'Stop recording' : 'Start recording'}</button>
        <label>Spoken language<select value={language} disabled={recording} onChange={event => setLanguage(event.target.value)}>{Object.entries(LANGUAGE).map(([code, item]) => <option key={code} value={code}>{item.label}</option>)}</select></label>
        <label>Or import a Teams / Zoom recording<input type="file" accept="audio/webm,audio/mp4,.webm,.mp4,.m4a" disabled={recording} onChange={loadRecording} /></label>
      </div>
      {audioUrl && <div className="qms-meeting-playback"><Volume2 size={18} /><audio controls src={audioUrl}>Audio playback is unavailable.</audio><a href={audioUrl} download={`${form.id}.${audioExtension(audioBlob)}`}>Download recording</a></div>}
      <div className="qms-meeting-transcript-head"><h4><Languages size={18} /> Transcript</h4><div><button type="button" onClick={generateTranscript} disabled={!audioBlob || !!busy}>{busy === 'transcribe' ? 'Transcribing…' : 'Generate from audio'}</button><button type="button" onClick={generateLanguages} disabled={!!busy}>{busy === 'translate' ? 'Translating…' : 'Generate EN · ខ្មែរ · 中文'}</button></div></div>
      <div className="qms-meeting-language-tabs">{Object.entries(LANGUAGE).map(([code, item]) => <button type="button" key={code} aria-pressed={language === code} className={language === code ? 'active' : ''} disabled={recording} onClick={() => setLanguage(code)}>{item.label}{transcripts[code] ? ' ✓' : ''}</button>)}</div>
      <textarea className="qms-meeting-transcript" value={transcripts[language]} onChange={event => updateTranscript(language, event.target.value)} placeholder={recording ? 'Listening for speech…' : 'Record, generate from audio, or enter meeting words here.'} rows={8} />
      <p className="qms-meeting-room-note">AI transcript and translations require Yai sign-in and the transcription service. Check names, decisions and technical terms against the recording before saving.</p>
      <div className="qms-meeting-actions"><button type="button" className="primary" onClick={saveMinutes} disabled={recording || !!busy}><Save size={17} />{busy === 'save' ? 'Saving…' : 'Save transcript to report'}</button></div>
    </section>}

    {view === 'history' && <section className="qms-meeting-panel">
      <h3>Previous {MEETING_TYPES.find(item => item.id === type)?.label} meetings</h3>
      <div className="qms-meeting-history">
        <div className="qms-meeting-list">{currentMeetings.map(item => <button type="button" key={item.recordId || item.id} className={selectedMeeting?.id === item.id ? 'active' : ''} onClick={() => setSelectedId(item.id)}><strong>{item.title}</strong><span>{item.date} · {item.order} · {item.style}</span><small>{item.demo ? 'Illustrative transcript' : item.status}</small></button>)}</div>
        {selectedMeeting && <article className="qms-meeting-record"><div className="qms-meeting-record-top"><div><span className="qms-meeting-kicker">{selectedMeeting.demo ? 'DEMO EXAMPLE' : 'SAVED MEETING'}</span><h4>{selectedMeeting.title}</h4><p>{selectedMeeting.id} · {selectedMeeting.date} · {selectedMeeting.time}</p></div><span className="qms-rec">{selectedMeeting.status}</span></div><p>{selectedMeeting.summary}</p><p className="qms-meeting-people"><Users size={16} />{selectedMeeting.attendees}</p>{selectedMeeting.meetingLink?.startsWith('https://') && <a href={selectedMeeting.meetingLink} target="_blank" rel="noopener noreferrer">Join remote meeting ↗</a>}{selectedMeeting.audio && <audio controls src={selectedMeeting.audio.url} />}{Object.entries(LANGUAGE).map(([code, item]) => <div className="qms-meeting-history-transcript" key={code}><strong>{item.label}</strong><p>{selectedMeeting.transcripts?.[code] || 'No transcript in this language yet.'}</p></div>)}{selectedMeeting.demo && <button type="button" onClick={() => useExample(selectedMeeting)}>Use this order for a new meeting</button>}</article>}
      </div>
    </section>}
  </div>;
}
