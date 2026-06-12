import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for Khmer Text-to-Speech (TTS)
 * Provides functionality to read text aloud with a focus on finding Khmer voices
 */
export const useKhmerTTS = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [khmerVoice, setKhmerVoice] = useState(null);

    // Initialize voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            
            // Try to find a Khmer voice (km-KH or km)
            const kmVoice = availableVoices.find(voice => 
                voice.lang === 'km-KH' || 
                voice.lang === 'km' || 
                voice.name.toLowerCase().includes('khmer')
            );
            
            if (kmVoice) {
                setKhmerVoice(kmVoice);
            }
        };

        // Load voices initially
        loadVoices();

        // Chrome loads voices asynchronously, so we need to listen for the event
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = null;
            }
            window.speechSynthesis.cancel(); // Stop speaking if component unmounts
        };
    }, []);

    const speak = useCallback((text, onComplete) => {
        if (!window.speechSynthesis) {
            console.error("Speech synthesis not supported in this browser.");
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Remove markdown and code blocks for cleaner speech reading
        let cleanText = text
            .replace(/```[\\s\\S]*?```/g, ' code block ')
            .replace(/\\[IMAGE_DATA:.*?\\]/g, ' image attachment ')
            .replace(/\\*\\*/g, '')
            .replace(/\\*/g, '')
            .replace(/#/g, '')
            .replace(/\\[|\\]/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // If we found a Khmer voice, use it. Otherwise, browser uses default.
        if (khmerVoice) {
            utterance.voice = khmerVoice;
            utterance.lang = 'km-KH';
        } else {
            // Fallback: Just set the lang and hope the OS has a default mapping
            utterance.lang = 'km-KH';
        }

        // Adjust rate and pitch for more natural sound
        utterance.rate = 0.95; // Slightly slower for clarity
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            if (onComplete) onComplete();
        };
        utterance.onerror = (e) => {
            console.error("Speech synthesis error:", e);
            setIsSpeaking(false);
            if (onComplete) onComplete();
        };

        window.speechSynthesis.speak(utterance);
    }, [khmerVoice]);

    const stop = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { speak, stop, isSpeaking, hasKhmerVoice: !!khmerVoice };
};
