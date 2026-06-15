import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, Loader2 } from 'lucide-react';

/* CaptureField — shared photo/receipt capture for request forms.
 *
 * On mobile, capture="environment" opens the rear camera directly; on
 * desktop it falls back to the file picker (which on most browsers also
 * surfaces the system camera, e.g. macOS Photos / Windows Camera).
 *
 * Photos are stored as base64 data URLs in component state and shipped
 * to the API inside the request body. That's fine for testing /
 * petty-cash receipts — keep an eye on Mongo's 16 MB document limit if
 * we ever cap attachments above ~10 high-res images.
 *
 * Props:
 *   value     — array of attachment objects { name, type, size, dataUrl, uploadedAt }
 *   onChange  — (newValue) => void
 *   maxCount  — default 6
 *   accentClass — Tailwind text/bg colors for the action button (so each module's
 *                 modal can theme the button consistently with its palette)
 */
const CaptureField = ({
    value = [],
    onChange,
    maxCount = 6,
    accentClass = 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700',
    label = 'Photos / receipts',
    helpText = 'Snap the receipt or attach from your gallery',
}) => {
    const cameraInputRef = useRef(null);
    const galleryInputRef = useRef(null);
    const [reading, setReading] = useState(false);

    const handleFiles = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const slots = Math.max(0, maxCount - value.length);
        const toAdd = files.slice(0, slots);

        setReading(true);
        try {
            const readers = toAdd.map(
                (f) =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () =>
                            resolve({
                                name: f.name,
                                type: f.type,
                                size: f.size,
                                dataUrl: reader.result,
                                uploadedAt: new Date().toISOString(),
                            });
                        reader.onerror = reject;
                        reader.readAsDataURL(f);
                    })
            );
            const newOnes = await Promise.all(readers);
            onChange([...value, ...newOnes]);
        } catch (err) {
            console.error('Capture read failed', err);
        } finally {
            setReading(false);
            if (cameraInputRef.current) cameraInputRef.current.value = '';
            if (galleryInputRef.current) galleryInputRef.current.value = '';
        }
    };

    const remove = (idx) => onChange(value.filter((_, i) => i !== idx));

    const atCap = value.length >= maxCount;

    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFiles}
                className="hidden"
            />
            <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="hidden"
            />

            {/* Thumbnails */}
            {value.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                    {value.map((a, i) => (
                        <div
                            key={i}
                            className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group"
                            title={`${a.name} (${Math.round(a.size / 1024)} KB)`}
                        >
                            <img
                                src={a.dataUrl}
                                alt={a.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                aria-label="Remove photo"
                                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-colors"
                            >
                                <X size={12} />
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] px-1 py-0.5 truncate">
                                {Math.round(a.size / 1024)} KB
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Capture buttons */}
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={atCap || reading}
                    className={`flex items-center gap-2 px-3 py-2 text-white rounded-lg text-sm font-medium transition-all ${atCap || reading ? 'bg-gray-300 cursor-not-allowed' : accentClass}`}
                >
                    {reading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera size={16} />}
                    Take photo
                </button>
                <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={atCap || reading}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${atCap || reading ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    <ImageIcon size={16} /> From gallery
                </button>
                <span className="text-xs text-gray-500 self-center">
                    {value.length}/{maxCount} attached
                </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">{helpText}</p>
        </div>
    );
};

export default CaptureField;
