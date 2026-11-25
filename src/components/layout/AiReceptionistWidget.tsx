import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Compass,
  ExternalLink,
  Headset,
  Loader2,
  MapPin,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  RotateCcw,
  Send,
  Square,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NavigationAction {
  path: string;
  sectionId?: string;
  label: string;
}

interface MapsGroundingSource {
  title: string;
  uri: string;
  snippet?: string;
}

interface ReceptionistMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  viaVoice?: boolean;
  navigationAction?: NavigationAction;
  mapsSources?: MapsGroundingSource[];
  audioBase64?: string;
  audioMimeType?: string;
}

const STARTER_PROMPTS = [
  'Take me to the investment plans',
  'I am a beginner — where do I start training?',
  'How do I get to your Abeokuta branch at Timeline Bazaar?',
  'Explain the 50/50 profit split in simple terms',
];

const INITIAL_GREETING: ReceptionistMessage = {
  id: 'welcome-msg',
  role: 'model',
  text: 'Welcome to Bullish Titan Academy. I am your 24/7 AI Receptionist. Type a message, dictate with the microphone, or tap "Live Call" to hold a real-time spoken conversation — I can answer questions, check our Abeokuta & Abuja branches on Google Maps, and take you directly to any page.',
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Failed to read recorded audio.'));
    reader.readAsDataURL(blob);
  });
}

function downsampleTo16kPcmBase64(input: Float32Array, sourceRate: number): string {
  const targetRate = 16000;
  let samples = input;
  if (sourceRate !== targetRate && sourceRate > targetRate) {
    const ratio = sourceRate / targetRate;
    const newLength = Math.max(1, Math.floor(input.length / ratio));
    const resampled = new Float32Array(newLength);
    for (let i = 0; i < newLength; i += 1) {
      const srcIdx = i * ratio;
      const idx0 = Math.floor(srcIdx);
      const idx1 = Math.min(input.length - 1, idx0 + 1);
      const frac = srcIdx - idx0;
      resampled[i] = input[idx0] * (1 - frac) + input[idx1] * frac;
    }
    samples = resampled;
  }

  const pcmBuffer = new ArrayBuffer(samples.length * 2);
  const view = new DataView(pcmBuffer);
  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }

  const bytes = new Uint8Array(pcmBuffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64Pcm24kToFloat32(base64Data: string): Float32Array {
  const binary = window.atob(base64Data);
  const byteLength = binary.length;
  const sampleCount = Math.floor(byteLength / 2);
  const bytes = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const view = new DataView(bytes.buffer);
  const out = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i += 1) {
    out[i] = view.getInt16(i * 2, true) / 32768;
  }
  return out;
}

function renderFormattedText(text: string): React.ReactNode {
  const cleaned = text.replace(/`([^`]+)`/g, '$1');
  const parts = cleaned.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[#F0D58A]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
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

export const AiReceptionistWidget: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ReceptionistMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [voiceRepliesEnabled, setVoiceRepliesEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState('');

  // Gemini Live API (gemini-3.8-live) real-time voice conversation state
  const [liveStatus, setLiveStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [liveMuted, setLiveMuted] = useState(false);

  const listEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const cancelRecordingRef = useRef(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Live API Refs (avoid stale closures inside WebSocket / audio callbacks)
  const liveWsRef = useRef<WebSocket | null>(null);
  const liveMicStreamRef = useRef<MediaStream | null>(null);
  const liveInputCtxRef = useRef<AudioContext | null>(null);
  const liveProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const liveOutputCtxRef = useRef<AudioContext | null>(null);
  const liveNextStartTimeRef = useRef<number>(0);
  const liveActiveSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const liveMutedRef = useRef<boolean>(false);
  const liveUserBubbleIdRef = useRef<string | null>(null);
  const liveModelBubbleIdRef = useRef<string | null>(null);
  const liveUserTextRef = useRef<string>('');
  const liveModelTextRef = useRef<string>('');

  useEffect(() => {
    liveMutedRef.current = liveMuted;
  }, [liveMuted]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [messages, isLoading, isTranscribing, isOpen, liveStatus, reducedMotion]);

  useEffect(() => {
    if (!isRecording) {
      setRecordingSeconds(0);
      return;
    }
    const timer = window.setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  const stopAudioPlayback = useCallback(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current = null;
    }
    setPlayingMessageId(null);
  }, []);

  const stopMicStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  const clearLivePlaybackQueue = useCallback(() => {
    liveActiveSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {
        // Ignore already stopped buffer source
      }
    });
    liveActiveSourcesRef.current = [];
    liveNextStartTimeRef.current = 0;
  }, []);

  const stopLiveCall = useCallback(() => {
    clearLivePlaybackQueue();

    if (liveProcessorRef.current) {
      liveProcessorRef.current.onaudioprocess = null;
      try {
        liveProcessorRef.current.disconnect();
      } catch {
        // Ignore disconnect error
      }
      liveProcessorRef.current = null;
    }

    if (liveMicStreamRef.current) {
      liveMicStreamRef.current.getTracks().forEach((t) => t.stop());
      liveMicStreamRef.current = null;
    }

    if (liveInputCtxRef.current) {
      void liveInputCtxRef.current.close().catch(() => {});
      liveInputCtxRef.current = null;
    }

    if (liveOutputCtxRef.current) {
      void liveOutputCtxRef.current.close().catch(() => {});
      liveOutputCtxRef.current = null;
    }

    if (liveWsRef.current) {
      try {
        liveWsRef.current.close();
      } catch {
        // Ignore close error
      }
      liveWsRef.current = null;
    }

    liveUserBubbleIdRef.current = null;
    liveModelBubbleIdRef.current = null;
    liveUserTextRef.current = '';
    liveModelTextRef.current = '';
    setLiveMuted(false);
    setLiveStatus('idle');
  }, [clearLivePlaybackQueue]);

  useEffect(() => {
    return () => {
      stopAudioPlayback();
      stopMicStream();
      stopLiveCall();
    };
  }, [stopAudioPlayback, stopMicStream, stopLiveCall]);

  const executeSiteNavigation = useCallback(
    (action: NavigationAction) => {
      const targetUrl = action.sectionId
        ? `${action.path}#${action.sectionId}`
        : action.path;
      navigate(targetUrl);

      if (action.sectionId) {
        const id = action.sectionId;
        let attempts = 0;
        const tryScroll = () => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
            return;
          }
          attempts += 1;
          if (attempts < 14) {
            window.setTimeout(tryScroll, 140);
          }
        };
        window.setTimeout(tryScroll, 90);
      }
    },
    [navigate, reducedMotion]
  );

  const playLivePcm24kChunk = useCallback((base64Audio: string) => {
    const ctx = liveOutputCtxRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    const floatSamples = base64Pcm24kToFloat32(base64Audio);
    if (floatSamples.length === 0) return;

    const buffer = ctx.createBuffer(1, floatSamples.length, 24000);
    buffer.getChannelData(0).set(floatSamples);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    const startTime = Math.max(now + 0.02, liveNextStartTimeRef.current);
    source.start(startTime);
    liveNextStartTimeRef.current = startTime + buffer.duration;

    liveActiveSourcesRef.current.push(source);
    source.onended = () => {
      liveActiveSourcesRef.current = liveActiveSourcesRef.current.filter((s) => s !== source);
    };
  }, []);

  const startLiveCall = async () => {
    if (liveStatus !== 'idle') {
      stopLiveCall();
      return;
    }

    setErrorBanner('');
    stopAudioPlayback();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorBanner('Live microphone streaming is not supported in this browser.');
      return;
    }

    setLiveStatus('connecting');
    setLiveMuted(false);
    liveUserBubbleIdRef.current = null;
    liveModelBubbleIdRef.current = null;
    liveUserTextRef.current = '';
    liveModelTextRef.current = '';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      liveMicStreamRef.current = stream;

      const inputAudioCtx = new AudioContext({ sampleRate: 16000 });
      const outputAudioCtx = new AudioContext({ sampleRate: 24000 });
      liveInputCtxRef.current = inputAudioCtx;
      liveOutputCtxRef.current = outputAudioCtx;
      liveNextStartTimeRef.current = 0;

      const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${wsProto}//${window.location.host}/api/live-voice`);
      liveWsRef.current = ws;

      ws.onopen = () => {
        const source = inputAudioCtx.createMediaStreamSource(stream);
        const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
        liveProcessorRef.current = processor;

        processor.onaudioprocess = (event) => {
          if (liveMutedRef.current || ws.readyState !== WebSocket.OPEN) return;
          const channelData = event.inputBuffer.getChannelData(0);
          const base64Pcm = downsampleTo16kPcmBase64(channelData, inputAudioCtx.sampleRate);
          ws.send(JSON.stringify({ audio: base64Pcm }));
        };

        source.connect(processor);
        processor.connect(inputAudioCtx.destination);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as {
            ready?: boolean;
            audio?: string;
            inputTranscript?: string;
            outputTranscript?: string;
            interrupted?: boolean;
            turnComplete?: boolean;
            navigationAction?: NavigationAction;
            error?: string;
          };

          if (msg.ready) {
            setLiveStatus('connected');
            return;
          }

          if (msg.error) {
            setErrorBanner(msg.error);
            stopLiveCall();
            return;
          }

          if (msg.interrupted) {
            clearLivePlaybackQueue();
          }

          if (msg.audio) {
            playLivePcm24kChunk(msg.audio);
          }

          if (msg.inputTranscript) {
            liveModelBubbleIdRef.current = null;
            liveModelTextRef.current = '';
            liveUserTextRef.current = liveUserTextRef.current
              ? `${liveUserTextRef.current} ${msg.inputTranscript}`.replace(/\s+/g, ' ').trim()
              : msg.inputTranscript.trim();

            const targetId = liveUserBubbleIdRef.current || `live-u-${Date.now()}`;
            liveUserBubbleIdRef.current = targetId;
            const snapshot = liveUserTextRef.current;

            setMessages((prev) => {
              const exists = prev.some((m) => m.id === targetId);
              if (exists) {
                return prev.map((m) => (m.id === targetId ? { ...m, text: snapshot } : m));
              }
              return [
                ...prev,
                { id: targetId, role: 'user', text: snapshot, viaVoice: true },
              ];
            });
          }

          if (msg.outputTranscript) {
            liveUserBubbleIdRef.current = null;
            liveUserTextRef.current = '';
            liveModelTextRef.current = liveModelTextRef.current
              ? `${liveModelTextRef.current}${msg.outputTranscript}`
              : msg.outputTranscript;

            const targetId = liveModelBubbleIdRef.current || `live-m-${Date.now()}`;
            liveModelBubbleIdRef.current = targetId;
            const snapshot = liveModelTextRef.current.trim();

            setMessages((prev) => {
              const exists = prev.some((m) => m.id === targetId);
              if (exists) {
                return prev.map((m) => (m.id === targetId ? { ...m, text: snapshot } : m));
              }
              return [...prev, { id: targetId, role: 'model', text: snapshot }];
            });
          }

          if (msg.navigationAction) {
            executeSiteNavigation(msg.navigationAction);
            const targetId = liveModelBubbleIdRef.current;
            if (targetId) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === targetId ? { ...m, navigationAction: msg.navigationAction } : m
                )
              );
            }
          }

          if (msg.turnComplete) {
            liveModelBubbleIdRef.current = null;
            liveModelTextRef.current = '';
          }
        } catch {
          // Ignore malformed live message
        }
      };

      ws.onerror = () => {
        setErrorBanner('Live voice connection interrupted. Please try again.');
        stopLiveCall();
      };

      ws.onclose = () => {
        stopLiveCall();
      };
    } catch {
      setErrorBanner(
        'Microphone access is required for Live Voice conversations. Please allow mic permission.'
      );
      stopLiveCall();
    }
  };

  const playAudioData = useCallback(
    async (messageId: string, base64Data: string, mimeType = 'audio/wav') => {
      stopAudioPlayback();
      try {
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i += 1) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioPlayerRef.current = audio;
        setPlayingMessageId(messageId);

        audio.onended = () => {
          URL.revokeObjectURL(url);
          setPlayingMessageId((curr) => (curr === messageId ? null : curr));
          if (audioPlayerRef.current === audio) {
            audioPlayerRef.current = null;
          }
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          setPlayingMessageId(null);
        };

        await audio.play();
      } catch {
        setPlayingMessageId(null);
      }
    },
    [stopAudioPlayback]
  );

  const handleToggleSpeakMessage = async (msg: ReceptionistMessage) => {
    if (playingMessageId === msg.id) {
      stopAudioPlayback();
      return;
    }

    if (msg.audioBase64) {
      await playAudioData(msg.id, msg.audioBase64, msg.audioMimeType);
      return;
    }

    setTtsLoadingId(msg.id);
    setErrorBanner('');
    try {
      const res = await fetch('/api/receptionist/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.text }),
      });
      const data = (await res.json()) as {
        audioBase64?: string;
        mimeType?: string;
        error?: string;
      };
      if (!res.ok || !data.audioBase64) {
        throw new Error(data.error || 'Voice playback is unavailable right now.');
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? { ...m, audioBase64: data.audioBase64, audioMimeType: data.mimeType || 'audio/wav' }
            : m
        )
      );
      await playAudioData(msg.id, data.audioBase64, data.mimeType || 'audio/wav');
    } catch (err) {
      setErrorBanner(
        err instanceof Error ? err.message : 'Unable to generate spoken audio right now.'
      );
    } finally {
      setTtsLoadingId(null);
    }
  };

  const sendMessage = useCallback(
    async (rawText: string, options?: { viaVoice?: boolean; forceSpeak?: boolean }) => {
      const text = rawText.trim();
      if (!text || isLoading) return;

      // If a Live Voice session is active, forward typed text directly into the live session too!
      if (liveStatus === 'connected' && liveWsRef.current?.readyState === WebSocket.OPEN) {
        const userMsg: ReceptionistMessage = {
          id: `u-${Date.now()}`,
          role: 'user',
          text,
          viaVoice: options?.viaVoice,
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        liveWsRef.current.send(JSON.stringify({ text }));
        return;
      }

      setErrorBanner('');
      stopAudioPlayback();

      const userMsg: ReceptionistMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        text,
        viaVoice: options?.viaVoice,
      };

      const historySnapshot = messages
        .filter((m) => m.id !== INITIAL_GREETING.id)
        .slice(-10)
        .map((m) => ({ role: m.role, text: m.text }));

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      const shouldSpeak = options?.forceSpeak ?? voiceRepliesEnabled;

      try {
        const res = await fetch('/api/receptionist/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: historySnapshot,
            currentPath: `${location.pathname}${location.hash}`,
            speakReply: shouldSpeak,
          }),
        });

        const data = (await res.json()) as {
          reply?: string;
          navigationAction?: NavigationAction;
          mapsSources?: MapsGroundingSource[];
          audioBase64?: string;
          audioMimeType?: string;
          error?: string;
        };

        if (!res.ok || !data.reply) {
          throw new Error(data.error || 'Unable to reach the AI Receptionist right now.');
        }

        const assistantId = `m-${Date.now()}`;
        const assistantMsg: ReceptionistMessage = {
          id: assistantId,
          role: 'model',
          text: data.reply,
          navigationAction: data.navigationAction,
          mapsSources: data.mapsSources,
          audioBase64: data.audioBase64,
          audioMimeType: data.audioMimeType,
        };

        setMessages((prev) => [...prev, assistantMsg]);

        if (data.navigationAction) {
          executeSiteNavigation(data.navigationAction);
        }

        if (shouldSpeak && data.audioBase64) {
          await playAudioData(assistantId, data.audioBase64, data.audioMimeType || 'audio/wav');
        }
      } catch (err) {
        setErrorBanner(
          err instanceof Error
            ? err.message
            : 'Connection error while contacting the 24/7 Receptionist.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      executeSiteNavigation,
      isLoading,
      liveStatus,
      location.hash,
      location.pathname,
      messages,
      playAudioData,
      stopAudioPlayback,
      voiceRepliesEnabled,
    ]
  );

  useEffect(() => {
    const onExternalPrompt = (event: Event) => {
      const custom = event as CustomEvent<{ query?: string }>;
      setIsOpen(true);
      const queryText = custom.detail?.query?.trim();
      if (queryText) {
        void sendMessage(queryText);
      } else {
        window.setTimeout(() => inputRef.current?.focus(), 180);
      }
    };
    window.addEventListener('bt:ask-receptionist', onExternalPrompt);
    return () => window.removeEventListener('bt:ask-receptionist', onExternalPrompt);
  }, [sendMessage]);

  const startRecording = async () => {
    setErrorBanner('');
    stopAudioPlayback();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorBanner('Microphone recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mimeType = pickSupportedAudioMime();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recordedChunksRef.current = [];
      cancelRecordingRef.current = false;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stopMicStream();
        setIsRecording(false);

        if (cancelRecordingRef.current) {
          recordedChunksRef.current = [];
          return;
        }

        const finalMime = recorder.mimeType || mimeType || 'audio/webm';
        const audioBlob = new Blob(recordedChunksRef.current, { type: finalMime });
        recordedChunksRef.current = [];

        if (audioBlob.size < 600) {
          setErrorBanner('Recording was too short. Tap the mic and speak clearly.');
          return;
        }

        setIsTranscribing(true);
        try {
          const audioBase64 = await blobToBase64(audioBlob);
          const res = await fetch('/api/receptionist/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64, mimeType: finalMime }),
          });
          const data = (await res.json()) as { text?: string; error?: string };
          if (!res.ok || !data.text) {
            throw new Error(data.error || 'Could not transcribe voice recording.');
          }
          setIsTranscribing(false);
          await sendMessage(data.text, { viaVoice: true, forceSpeak: true });
        } catch (err) {
          setIsTranscribing(false);
          setErrorBanner(
            err instanceof Error ? err.message : 'Unable to process your voice message.'
          );
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      stopMicStream();
      setErrorBanner(
        'Microphone permission was denied or unavailable. Allow microphone access or type below.'
      );
    }
  };

  const stopAndSendRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      cancelRecordingRef.current = false;
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      cancelRecordingRef.current = true;
      mediaRecorderRef.current.stop();
    } else {
      stopMicStream();
      setIsRecording(false);
    }
  };

  const handleReset = () => {
    stopAudioPlayback();
    stopLiveCall();
    setMessages([INITIAL_GREETING]);
    setErrorBanner('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="receptionist-panel"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.36, 1] }}
            aria-label="Bullish Titan 24/7 AI Receptionist"
            className="mb-3 flex h-[min(580px,calc(100vh-6.5rem))] w-[calc(100vw-2rem)] sm:w-[420px] flex-col overflow-hidden rounded-2xl glass-surface-solid hairline-gold-bright shadow-[0_24px_64px_rgba(0,0,0,0.88)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-[#C9A24B]/24 bg-[#07080B]/95 px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#C9A24B]/45 bg-[#12161F] text-[#F0D58A]">
                  <Headset className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="truncate font-display text-sm font-bold text-[#EDE6D6]">
                      24/7 AI Receptionist
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#34D399]/35 bg-[#34D399]/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#34D399]">
                      Live
                    </span>
                  </div>
                  <p className="truncate font-mono text-[10px] uppercase tracking-wider text-[#9A968C]">
                    Live Voice · Transcribe · Maps
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => void startLiveCall()}
                  title={
                    liveStatus === 'idle'
                      ? 'Start real-time voice conversation'
                      : 'End real-time voice call'
                  }
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors',
                    liveStatus === 'connected'
                      ? 'border-[#EF4444]/60 bg-[#EF4444]/15 text-[#FCA5A5]'
                      : liveStatus === 'connecting'
                        ? 'border-[#F0D58A]/60 bg-[#C9A24B]/15 text-[#F0D58A]'
                        : 'border-[#34D399]/45 bg-[#10B981]/12 text-[#34D399] hover:bg-[#10B981]/22'
                  )}
                >
                  {liveStatus === 'connecting' ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Connecting</span>
                    </>
                  ) : liveStatus === 'connected' ? (
                    <>
                      <PhoneOff className="h-3 w-3" />
                      <span>End Call</span>
                    </>
                  ) : (
                    <>
                      <PhoneCall className="h-3 w-3" />
                      <span>Live Call</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const next = !voiceRepliesEnabled;
                    setVoiceRepliesEnabled(next);
                    if (!next) stopAudioPlayback();
                  }}
                  title={voiceRepliesEnabled ? 'Mute spoken replies' : 'Enable spoken replies'}
                  aria-label={voiceRepliesEnabled ? 'Mute spoken replies' : 'Enable spoken replies'}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
                    voiceRepliesEnabled
                      ? 'border-[#C9A24B]/40 bg-[#C9A24B]/12 text-[#F0D58A]'
                      : 'border-[#C9A24B]/20 bg-[#0B0C10] text-[#9A968C] hover:text-[#EDE6D6]'
                  )}
                >
                  {voiceRepliesEnabled ? (
                    <Volume2 className="h-3.5 w-3.5" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C9A24B]/20 bg-[#0B0C10] text-[#9A968C] hover:border-[#C9A24B]/45 hover:text-[#F0D58A] transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close receptionist"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C9A24B]/20 bg-[#0B0C10] text-[#9A968C] hover:border-[#F0D58A]/50 hover:text-[#EDE6D6] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Active Real-Time Gemini Live Call Banner */}
            {liveStatus !== 'idle' && (
              <div className="flex items-center justify-between gap-2 border-b border-[#34D399]/30 bg-[#071611] px-4 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      'h-2.5 w-2.5 shrink-0 rounded-full',
                      liveStatus === 'connected'
                        ? 'bg-[#34D399] animate-pulse'
                        : 'bg-[#F0D58A] animate-ping'
                    )}
                  />
                  <span className="truncate font-mono text-[11px] text-[#EDE6D6]">
                    {liveStatus === 'connecting'
                      ? 'Opening real-time audio channel…'
                      : liveMuted
                        ? 'Live Voice Call · Microphone Muted'
                        : 'Live Voice Call Active · Speak Naturally'}
                  </span>
                </div>
                {liveStatus === 'connected' && (
                  <button
                    type="button"
                    onClick={() => setLiveMuted((m) => !m)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-[10px] uppercase',
                      liveMuted
                        ? 'border-[#EF4444]/40 bg-[#EF4444]/15 text-[#FCA5A5]'
                        : 'border-[#34D399]/35 bg-[#10B981]/15 text-[#34D399]'
                    )}
                  >
                    {liveMuted ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                    {liveMuted ? 'Unmute' : 'Mute'}
                  </button>
                )}
              </div>
            )}

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-[#050608]/95">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const isPlaying = playingMessageId === msg.id;
                const isLoadingTts = ttsLoadingId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={cn('flex flex-col gap-1.5', isUser ? 'items-end' : 'items-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap',
                        isUser
                          ? 'bg-gold-gradient text-[#000000] font-medium shadow-sm'
                          : 'border border-[#C9A24B]/22 bg-[#0D1017] text-[#EDE6D6]'
                      )}
                    >
                      {msg.viaVoice && isUser && (
                        <span className="mb-1 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#000000]/75">
                          <Mic className="h-2.5 w-2.5" /> Voice Input
                        </span>
                      )}
                      <div>{isUser ? msg.text : renderFormattedText(msg.text)}</div>

                      {msg.mapsSources && msg.mapsSources.length > 0 && (
                        <div className="mt-2.5 space-y-1 border-t border-[#C9A24B]/20 pt-2">
                          <p className="font-mono text-[9px] uppercase tracking-wider text-[#34D399]">
                            Verified Google Maps References
                          </p>
                          <div className="flex flex-col gap-1">
                            {msg.mapsSources.map((src) => (
                              <a
                                key={src.uri}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-2 rounded-md border border-[#34D399]/30 bg-[#081310] px-2.5 py-1.5 text-[11px] text-[#A7F3D0] hover:border-[#34D399] transition-colors"
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  <MapPin className="h-3 w-3 shrink-0 text-[#34D399]" />
                                  <span className="truncate">{src.title}</span>
                                </span>
                                <ExternalLink className="h-3 w-3 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {msg.navigationAction && (
                        <button
                          type="button"
                          onClick={() => executeSiteNavigation(msg.navigationAction!)}
                          className="mt-2.5 flex w-full items-center justify-between gap-2 rounded-lg border border-[#C9A24B]/40 bg-[#080A0F] px-3 py-2 text-left transition-colors hover:border-[#F0D58A] hover:bg-[#121622]"
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <Compass className="h-3.5 w-3.5 shrink-0 text-[#F0D58A]" />
                            <span className="truncate font-mono text-[10px] uppercase tracking-wider text-[#F0D58A]">
                              {msg.navigationAction.label}
                            </span>
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#F0D58A]" />
                        </button>
                      )}
                    </div>

                    {!isUser && liveStatus === 'idle' && (
                      <button
                        type="button"
                        onClick={() => void handleToggleSpeakMessage(msg)}
                        disabled={isLoadingTts}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#C9A24B]/20 bg-[#0B0C10] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#9A968C] hover:border-[#C9A24B]/45 hover:text-[#F0D58A] transition-colors disabled:opacity-50"
                      >
                        {isLoadingTts ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin text-[#F0D58A]" />
                            Preparing Audio
                          </>
                        ) : isPlaying ? (
                          <>
                            <Square className="h-2.5 w-2.5 fill-[#F0D58A] text-[#F0D58A]" />
                            Stop Voice
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3 text-[#C9A24B]" />
                            Listen
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Quick Starter Prompts on first open */}
              {messages.length <= 1 && !isLoading && !isTranscribing && liveStatus === 'idle' && (
                <div className="pt-1 space-y-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#9A968C]">
                    Quick Requests &amp; Navigation
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="flex items-center justify-between gap-2 rounded-lg border border-[#C9A24B]/20 bg-[#0B0D12] px-3 py-2 text-left text-xs text-[#EDE6D6]/90 hover:border-[#F0D58A]/55 hover:text-[#F0D58A] transition-colors"
                      >
                        <span>{prompt}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#C9A24B]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(isLoading || isTranscribing) && (
                <div className="flex items-start">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[#C9A24B]/22 bg-[#0D1017] px-3.5 py-2.5 text-xs text-[#9A968C]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#F0D58A]" />
                    <span>
                      {isTranscribing
                        ? 'Transcribing your voice…'
                        : 'Preparing answer & checking navigation…'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={listEndRef} />
            </div>

            {/* Error Banner */}
            {errorBanner && (
              <div
                role="alert"
                className="border-t border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-2 text-[11px] text-[#FCA5A5] flex items-center justify-between gap-2"
              >
                <span>{errorBanner}</span>
                <button
                  type="button"
                  onClick={() => setErrorBanner('')}
                  className="shrink-0 text-[#FCA5A5] hover:text-white"
                  aria-label="Dismiss message"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Recording Bar OR Input Form */}
            <div className="border-t border-[#C9A24B]/24 bg-[#08090D] p-3">
              {isRecording ? (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-[#F0D58A]/50 bg-[#14120B] px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-[#EF4444] animate-pulse" />
                    <span className="font-mono text-xs text-[#F0D58A] tabular-nums">
                      Recording ({recordingSeconds}s)… speak now
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={cancelRecording}
                      className="rounded-lg border border-[#C9A24B]/25 px-2.5 py-1.5 text-[11px] text-[#9A968C] hover:text-[#EDE6D6]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={stopAndSendRecording}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-3 py-1.5 text-[11px] font-semibold text-[#000000]"
                    >
                      <Square className="h-3 w-3 fill-[#000000]" />
                      Transcribe &amp; Send
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void startRecording()}
                    disabled={isLoading || isTranscribing || liveStatus !== 'idle'}
                    title="Record & transcribe microphone voice message"
                    aria-label="Record & transcribe microphone voice message"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9A24B]/35 bg-[#10131A] text-[#F0D58A] hover:border-[#F0D58A] hover:bg-[#191E29] transition-colors disabled:opacity-40"
                  >
                    <Mic className="h-4 w-4" />
                  </button>

                  <label htmlFor="ai-receptionist-input" className="sr-only">
                    Ask the 24/7 AI Receptionist a question or request a page
                  </label>
                  <input
                    id="ai-receptionist-input"
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading || isTranscribing}
                    placeholder={
                      liveStatus === 'connected'
                        ? 'Speak naturally or send text to Live session…'
                        : "Ask or say 'Take me to investment'…"
                    }
                    className="h-10 flex-1 min-w-0 rounded-xl border border-[#C9A24B]/26 bg-[#111319] px-3.5 text-xs sm:text-sm text-[#EDE6D6] placeholder:text-[#9A968C]/65 focus:border-[#F0D58A] focus:outline-none disabled:opacity-60"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading || isTranscribing}
                    aria-label="Send message"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-[#000000] transition-opacity hover:opacity-95 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Concierge Launcher */}
      <button
        type="button"
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (next) {
            window.setTimeout(() => inputRef.current?.focus(), 180);
          }
        }}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Minimize 24/7 AI Receptionist' : 'Open 24/7 AI Receptionist'}
        className={cn(
          'group flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-[0_14px_38px_rgba(0,0,0,0.85)] transition-all duration-200',
          isOpen
            ? 'border-[#C9A24B]/45 bg-[#0D1017] text-[#F0D58A]'
            : 'border-[#F0D58A]/65 bg-gold-gradient text-[#000000] hover:brightness-105'
        )}
      >
        {isOpen ? (
          <>
            <X className="h-4 w-4 shrink-0" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">
              Close Receptionist
            </span>
          </>
        ) : (
          <>
            <Headset className="h-4 w-4 shrink-0" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              24/7 AI Concierge
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-[#000000]/18 px-1.5 py-0.5 font-mono text-[10px] font-semibold">
              <Mic className="h-2.5 w-2.5" /> Live Voice
            </span>
          </>
        )}
      </button>
    </div>
  );
};
