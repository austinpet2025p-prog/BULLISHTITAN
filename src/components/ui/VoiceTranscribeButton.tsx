import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Mic, Square } from 'lucide-react';
import { cn } from '../../lib/utils';

interface VoiceTranscribeButtonProps {
  onTranscript: (text: string) => void;
  onError?: (message: string) => void;
  label?: string;
  compact?: boolean;
  disabled?: boolean;
  className?: string;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Failed to read microphone audio.'));
    reader.readAsDataURL(blob);
  });
}

function pickSupportedAudioMime(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

export const VoiceTranscribeButton: React.FC<VoiceTranscribeButtonProps> = ({
  onTranscript,
  onError,
  label = 'Dictate',
  compact = false,
  disabled = false,
  className,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        try {
          recorderRef.current.stop();
        } catch {
          // Ignore unmount cleanup
        }
      }
      stopStream();
    };
  }, [stopStream]);

  const handleToggle = async () => {
    if (isTranscribing || disabled) return;

    if (isRecording && recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      onError?.('Microphone recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickSupportedAudioMime();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stopStream();
        setIsRecording(false);

        const finalMime = recorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: finalMime });
        chunksRef.current = [];

        if (blob.size < 500) {
          onError?.('Recording was too short. Tap the mic and speak clearly.');
          return;
        }

        setIsTranscribing(true);
        try {
          const audioBase64 = await blobToBase64(blob);
          const res = await fetch('/api/receptionist/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64, mimeType: finalMime }),
          });
          const data = (await res.json()) as { text?: string; error?: string };
          if (!res.ok || !data.text?.trim()) {
            throw new Error(data.error || 'Could not transcribe spoken audio.');
          }
          onTranscript(data.text.trim());
        } catch (err) {
          onError?.(
            err instanceof Error ? err.message : 'Unable to transcribe microphone audio.'
          );
        } finally {
          setIsTranscribing(false);
        }
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      stopStream();
      onError?.('Microphone access was denied or unavailable.');
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleToggle()}
      disabled={disabled || isTranscribing}
      title={isRecording ? 'Stop & transcribe audio' : `${label} via microphone`}
      aria-label={isRecording ? 'Stop & transcribe audio' : `${label} via microphone`}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg border font-mono text-[11px] transition-colors disabled:opacity-50',
        isRecording
          ? 'border-[#EF4444]/70 bg-[#EF4444]/15 text-[#FCA5A5]'
          : 'border-[#C9A24B]/32 bg-[#0D1017] text-[#F0D58A] hover:border-[#F0D58A] hover:bg-[#151A25]',
        compact ? 'h-8 w-8 p-0' : 'px-2.5 py-1.5',
        className
      )}
    >
      {isTranscribing ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {!compact && <span>Transcribing…</span>}
        </>
      ) : isRecording ? (
        <>
          <Square className="h-3 w-3 fill-current" />
          {!compact && <span>Stop</span>}
        </>
      ) : (
        <>
          <Mic className="h-3.5 w-3.5" />
          {!compact && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
