import type { Server } from 'http';
import { Modality } from '@google/genai';
import type { LiveServerMessage } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';
import {
  DEFAULT_PATH_LABELS,
  SYSTEM_INSTRUCTION,
  VALID_PATHS,
  getAiClient,
  navigateToPageTool,
} from './geminiReceptionist.ts';
import type { NavigationAction } from './geminiReceptionist.ts';

function safeSend(ws: WebSocket, payload: Record<string, unknown>) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

export function attachLiveVoiceWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    const pathname = request.url ? request.url.split('?')[0] : '';
    if (pathname !== '/api/live-voice') {
      return;
    }

    wss.handleUpgrade(request, socket, head, (clientWs) => {
      wss.emit('connection', clientWs, request);
    });
  });

  wss.on('connection', async (clientWs) => {
    let liveSession: Awaited<ReturnType<ReturnType<typeof getAiClient>['live']['connect']>> | null =
      null;
    let closedByClient = false;

    try {
      const ai = getAiClient();

      liveSession = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Kore',
              },
            },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          tools: [{ functionDeclarations: [navigateToPageTool] }],
          systemInstruction: `${SYSTEM_INSTRUCTION}

LIVE VOICE CALL INSTRUCTIONS:
- Keep spoken answers natural, warm, concise (1 to 3 sentences), and easy for beginners to follow without reading long lists.
- Never read out markdown symbols, asterisks, or URLs.
- When a visitor asks to visit a page or section, invoke \`navigate_to_page\` immediately while confirming out loud.`,
        },
        callbacks: {
          onopen: () => {
            safeSend(clientWs, { ready: true });
          },
          onmessage: (message: LiveServerMessage) => {
            const content = message.serverContent;

            if (content?.inputTranscription?.text) {
              safeSend(clientWs, {
                inputTranscript: content.inputTranscription.text,
              });
            }

            if (content?.outputTranscription?.text) {
              safeSend(clientWs, {
                outputTranscript: content.outputTranscription.text,
              });
            }

            for (const part of content?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                safeSend(clientWs, { audio: part.inlineData.data });
              }
            }

            if (content?.interrupted) {
              safeSend(clientWs, { interrupted: true });
            }

            if (content?.turnComplete) {
              safeSend(clientWs, { turnComplete: true });
            }

            for (const call of message.toolCall?.functionCalls ?? []) {
              if (call.name === 'navigate_to_page') {
                const args = (call.args ?? {}) as Record<string, unknown>;
                const rawPath = typeof args.path === 'string' ? args.path.trim() : '/';
                const safePath = VALID_PATHS.has(rawPath) ? rawPath : '/';
                const rawSection =
                  typeof args.sectionId === 'string'
                    ? args.sectionId.replace(/^#/, '').trim()
                    : undefined;
                const safeSection =
                  rawSection && /^[a-zA-Z0-9_-]+$/.test(rawSection) ? rawSection : undefined;
                const rawLabel =
                  typeof args.label === 'string' && args.label.trim()
                    ? args.label.trim()
                    : DEFAULT_PATH_LABELS[safePath] ?? 'Destination';

                const navigationAction: NavigationAction = {
                  path: safePath,
                  sectionId: safeSection,
                  label: rawLabel,
                };

                safeSend(clientWs, { navigationAction });

                if (liveSession) {
                  liveSession.sendToolResponse({
                    functionResponses: [
                      {
                        id: call.id,
                        name: call.name,
                        response: {
                          navigated: true,
                          path: safePath,
                          sectionId: safeSection ?? null,
                          label: rawLabel,
                        },
                      },
                    ],
                  });
                }
              }
            }
          },
          onerror: (err: unknown) => {
            const msg =
              err instanceof Error
                ? err.message
                : 'Live voice session encountered a connection error.';
            safeSend(clientWs, { error: msg });
          },
          onclose: () => {
            if (!closedByClient && clientWs.readyState === WebSocket.OPEN) {
              clientWs.close();
            }
          },
        },
      });

      if (closedByClient && liveSession) {
        liveSession.close();
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to start real-time Gemini Live voice session.';
      safeSend(clientWs, { error: msg });
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.close();
      }
      return;
    }

    clientWs.on('message', (rawData) => {
      if (!liveSession) return;
      try {
        const parsed = JSON.parse(rawData.toString()) as {
          audio?: string;
          text?: string;
        };
        if (typeof parsed.audio === 'string' && parsed.audio) {
          liveSession.sendRealtimeInput({
            audio: {
              data: parsed.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (typeof parsed.text === 'string' && parsed.text.trim()) {
          liveSession.sendRealtimeInput({
            text: parsed.text.trim(),
          });
        }
      } catch {
        // Ignore malformed frame
      }
    });

    clientWs.on('close', () => {
      closedByClient = true;
      if (liveSession) {
        try {
          liveSession.close();
        } catch {
          // Ignore close errors
        }
        liveSession = null;
      }
    });
  });
}
