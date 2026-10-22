import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { noStore, sameOrigin, viewer } from '@/lib/yqms-standard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const maximum = 8 * 1024 * 1024;
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers: noStore });

function audioType(bytes: Buffer) {
  if (bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return 'audio/webm';
  if (bytes.toString('ascii', 4, 8) === 'ftyp') return 'audio/mp4';
  return null;
}

export async function POST(request: Request) {
  if (!sameOrigin()) return bad('Invalid origin.', 403);
  if (!viewer()) return bad('Sign in to Yai to generate a meeting transcript.', 401);
  if (Number(request.headers.get('content-length') || 0) > maximum + 65536) return bad('Recording must be 8 MB or smaller.', 413);
  let file: FormDataEntryValue | null;
  try { file = (await request.formData()).get('file'); } catch { return bad('Invalid audio upload.'); }
  if (!(file instanceof File) || !file.size || file.size > maximum) return bad('Select a recording up to 8 MB.');
  const bytes = Buffer.from(await file.arrayBuffer());
  const mimeType = audioType(bytes);
  if (!mimeType) return bad('Use a WebM or MP4 audio recording.');
  const apiKey = process.env.GEMINI_API_KEY;
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!apiKey && !project) return bad('Transcription service is unavailable.', 503);
  try {
    const ai = apiKey ? new GoogleGenAI({ apiKey }) : new GoogleGenAI({
      vertexai: true, project, location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    });
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [
        { text: 'Transcribe this garment factory meeting audio verbatim. Preserve the spoken language, including English, Khmer and Mandarin if they occur. Mark speaker changes only when clear. Do not invent words, attendees, decisions or approvals. Return transcript text only.' },
        { inlineData: { mimeType, data: bytes.toString('base64') } },
      ] }],
      config: { temperature: 0, maxOutputTokens: 8192 },
    });
    const transcript = result.text?.trim();
    if (!transcript) return bad('No speech could be transcribed from this recording.', 422);
    return NextResponse.json({ ok: true, transcript }, { headers: noStore });
  } catch {
    return bad('Transcription service is temporarily unavailable. Keep the recording and retry.', 503);
  }
}
