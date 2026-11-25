import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  handleReceptionistChat,
  queryMapsGrounding,
  synthesizeReceptionistSpeech,
  transcribeUserVoice,
} from './server/geminiReceptionist.ts';
import type { ChatHistoryTurn } from './server/geminiReceptionist.ts';
import { attachLiveVoiceWebSocket } from './server/geminiLiveBridge.ts';

function getErrorStatus(err: unknown): { status: number; message: string } {
  if (err && typeof err === 'object') {
    const record = err as Record<string, unknown>;
    let status =
      typeof record.status === 'number'
        ? record.status
        : typeof record.statusCode === 'number'
          ? record.statusCode
          : 500;
    let msg =
      typeof record.message === 'string' && record.message.trim()
        ? record.message.trim()
        : 'An unexpected error occurred on the receptionist server.';

    if (msg.startsWith('{')) {
      try {
        const parsed = JSON.parse(msg) as { error?: { code?: number; message?: string } };
        if (parsed?.error?.message) {
          msg = parsed.error.message;
        }
        if (typeof parsed?.error?.code === 'number') {
          status = parsed.error.code;
        }
      } catch {
        // leave original msg
      }
    }

    return {
      status: status >= 400 && status < 600 ? status : 500,
      message: msg,
    };
  }
  return { status: 500, message: 'An unexpected error occurred on the receptionist server.' };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    const mapsKey = (
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      ''
    ).trim();
    res.json({
      ok: true,
      service: 'bullish-titan-receptionist',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY?.trim()),
      hasMapsKey: Boolean(mapsKey),
    });
  });

  app.get('/api/maps/config', (_req, res) => {
    const apiKey = (
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      ''
    ).trim();
    res.json({ apiKey });
  });

  app.post('/api/receptionist/chat', async (req, res) => {
    try {
      const body = req.body as {
        message?: unknown;
        history?: unknown;
        currentPath?: unknown;
        speakReply?: unknown;
        latLng?: unknown;
      };

      if (typeof body?.message !== 'string' || !body.message.trim()) {
        return res.status(400).json({ error: 'A non-empty message string is required.' });
      }

      const history: ChatHistoryTurn[] = Array.isArray(body.history)
        ? body.history
            .filter(
              (item): item is ChatHistoryTurn =>
                Boolean(item) &&
                typeof item === 'object' &&
                ((item as ChatHistoryTurn).role === 'user' ||
                  (item as ChatHistoryTurn).role === 'model') &&
                typeof (item as ChatHistoryTurn).text === 'string'
            )
            .slice(-12)
        : [];

      const rawLatLng = body.latLng as { latitude?: unknown; longitude?: unknown } | undefined;
      const latLng =
        rawLatLng &&
        typeof rawLatLng.latitude === 'number' &&
        typeof rawLatLng.longitude === 'number'
          ? { latitude: rawLatLng.latitude, longitude: rawLatLng.longitude }
          : undefined;

      const result = await handleReceptionistChat({
        message: body.message,
        history,
        currentPath: typeof body.currentPath === 'string' ? body.currentPath : undefined,
        speakReply: Boolean(body.speakReply),
        latLng,
      });

      return res.json(result);
    } catch (err) {
      const { status, message } = getErrorStatus(err);
      return res.status(status).json({ error: message });
    }
  });

  app.post('/api/maps/grounding', async (req, res) => {
    try {
      const body = req.body as {
        query?: unknown;
        branch?: unknown;
        latLng?: unknown;
      };
      if (typeof body?.query !== 'string' || !body.query.trim()) {
        return res.status(400).json({ error: 'A location or Maps grounding query is required.' });
      }

      const rawLatLng = body.latLng as { latitude?: unknown; longitude?: unknown } | undefined;
      const latLng =
        rawLatLng &&
        typeof rawLatLng.latitude === 'number' &&
        typeof rawLatLng.longitude === 'number'
          ? { latitude: rawLatLng.latitude, longitude: rawLatLng.longitude }
          : undefined;

      const branch = body.branch === 'abuja' ? 'abuja' : 'abeokuta';
      const result = await queryMapsGrounding({
        query: body.query,
        branch,
        latLng,
      });

      return res.json(result);
    } catch (err) {
      const { status, message } = getErrorStatus(err);
      return res.status(status).json({ error: message });
    }
  });

  app.post('/api/receptionist/transcribe', async (req, res) => {
    try {
      const body = req.body as { audioBase64?: unknown; mimeType?: unknown };
      if (typeof body?.audioBase64 !== 'string' || !body.audioBase64) {
        return res.status(400).json({ error: 'audioBase64 is required.' });
      }
      const mimeType =
        typeof body.mimeType === 'string' && body.mimeType.trim()
          ? body.mimeType.trim()
          : 'audio/webm';

      const text = await transcribeUserVoice(body.audioBase64, mimeType);
      return res.json({ text });
    } catch (err) {
      const { status, message } = getErrorStatus(err);
      return res.status(status).json({ error: message });
    }
  });

  app.post('/api/receptionist/tts', async (req, res) => {
    try {
      const body = req.body as { text?: unknown };
      if (typeof body?.text !== 'string' || !body.text.trim()) {
        return res.status(400).json({ error: 'text is required for speech synthesis.' });
      }

      const tts = await synthesizeReceptionistSpeech(body.text);
      return res.json(tts);
    } catch (err) {
      const { status, message } = getErrorStatus(err);
      return res.status(status).json({ error: message });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(import.meta.dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  // Container nginx reserves process.env.PORT (8080) and proxies to port 3000.
  const PORT = Number(process.env.DEFAULT_APP_PORT) || 3000;
  const httpServer = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bullish Titan server listening on http://0.0.0.0:${PORT}`);
  });
  attachLiveVoiceWebSocket(httpServer);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
