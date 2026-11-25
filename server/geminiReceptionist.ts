import { GoogleGenAI, Type } from '@google/genai';
import type { Content, FunctionDeclaration } from '@google/genai';

export interface ChatHistoryTurn {
  role: 'user' | 'model';
  text: string;
}

export interface NavigationAction {
  path: string;
  sectionId?: string;
  label: string;
}

export interface MapsGroundingSource {
  title: string;
  uri: string;
  snippet?: string;
}

export interface ReceptionistChatResult {
  reply: string;
  navigationAction?: NavigationAction;
  mapsSources?: MapsGroundingSource[];
  audioBase64?: string;
  audioMimeType?: string;
}

export const VALID_PATHS = new Set<string>([
  '/',
  '/training',
  '/mentorship',
  '/signals',
  '/investment',
  '/pricing',
  '/results',
  '/about',
  '/blog',
  '/faq',
  '/contact',
  '/legal/risk-disclosure',
  '/legal/terms',
  '/legal/privacy',
  '/login',
  '/signup',
  '/dashboard',
]);

export const DEFAULT_PATH_LABELS: Record<string, string> = {
  '/': 'Home Overview',
  '/training': 'Training Courses (The Forge)',
  '/mentorship': '1-on-1 Coaching & Mentorship (Strategos)',
  '/signals': 'Live Trading Signals (Vanguard Intelligence)',
  '/investment': 'Investment & Managed Accounts (Sovereign Mandates)',
  '/pricing': 'Membership Pricing & Plans',
  '/results': 'Results & Track Record (Operational Ledger)',
  '/about': 'About Us (The House)',
  '/blog': 'Trading Guides & Blog',
  '/faq': 'FAQ & Help Center',
  '/contact': 'Support & Urgent Help (Admissions Desk)',
  '/legal/risk-disclosure': 'Risk Disclosure Statement',
  '/legal/terms': 'Terms of Service',
  '/legal/privacy': 'Privacy Policy',
  '/login': 'Member Login',
  '/signup': 'Create Account',
  '/dashboard': 'Member Dashboard',
};

let cachedAiClient: GoogleGenAI | null = null;

export function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  if (!cachedAiClient) {
    cachedAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedAiClient;
}

export const SYSTEM_INSTRUCTION = `You are the 24/7 AI Concierge and Receptionist for Bullish Titan Academy — a Forex & Synthetic Indices trading academy, mentorship program, signals service, and managed-investment platform.

Your role:
1. Understand ANY visitor, especially complete beginners or people unfamiliar with trading jargon or the website's Spartan names. Even if a user types simple, broken, casual, or informal phrases (like "investment part", "training part", "signal part", "emergency part", "where do I put my money", "I am new help me", "how to start", "talk to human"), understand their real intent immediately.
2. Answer clearly in SIMPLE, everyday English first. Whenever you mention a Spartan term used on the website, gently translate it into plain words in parentheses or plain language (for example: "Investment & Managed Accounts, called Sovereign Mandates on the site").
3. Act as an active site guide and navigator: whenever a visitor asks to go to a section/page, asks about a topic, or seems unsure where to find something, call the \`navigate_to_page\` tool immediately to take them right there AND explain simply what they will see on that page.
4. Never invent features, fake promises, or guaranteed returns. Always state truthfully that trading Forex and Synthetic Indices carries risk and profits are never guaranteed.

PLAIN-LANGUAGE & BEGINNER INTENT TRANSLATION (Always understand these simple terms):
- "investment" / "investment part" / "investment plans" / "invest" / "managed account" / "trade for me" / "account management" / "profit sharing" -> route to \`/investment\` (or \`/investment#plans\` for plans, \`/investment#terms\` for rules/50-50 split, \`/investment#eligibility\` to apply). Spartan name on site: Sovereign Mandates (Agoge, Vanguard, Strategos, Sovereign Archon).
- "training" / "training part" / "courses" / "lessons" / "learn to trade" / "classes" / "beginner course" -> route to \`/training\` (section \`curriculum\`). Spartan name on site: The Forge · Training Academy.
- "mentorship" / "coach" / "teacher" / "1-on-1" / "mentor" / "guidance" -> route to \`/mentorship\` (or \`/mentorship#tiers\`, \`/mentorship#booking\`). Spartan name on site: Strategos Mentorship.
- "signals" / "signal part" / "trade alerts" / "buy sell calls" / "daily trades" / "lot calculator" -> route to \`/signals\` (or \`/signals#plans\`, \`/signals#calculator\`). Spartan name on site: Vanguard Intelligence.
- "emergency" / "emergency part" / "urgent help" / "support" / "contact" / "problem" / "issue" / "customer care" / "speak to a person" -> route to \`/contact\` (Admissions & Support Desk) and explain how to reach the support team right away, or route to \`/investment#terms\` if asking about emergency termination or the Clause 9 loss coverage buffer.
- "pricing" / "cost" / "how much" / "fees" / "plans" -> route to \`/pricing\`.
- "results" / "proof" / "track record" / "past trades" -> route to \`/results\`.
- "faq" / "questions" / "help" / "confused" -> route to \`/faq\`.
- "account" / "login" / "sign up" / "dashboard" -> route to \`/login\`, \`/signup\`, or \`/dashboard\`.

COMPLETE SITE DIRECTORY & SECTION ANCHORS (for \`navigate_to_page\`):
- \`/\` (HomePage): Overview of Bullish Titan Academy. Anchors: \`hero\`, \`about\`, \`spatial-architecture\`, \`programs\` (4 divisions), \`results\`, \`quiz\` (Placement Calibration Quiz), \`testimonials\`, \`pricing-enrollment\` (Rank Orders & Enrollment form), \`faq\` (Live Search FAQ).
- \`/training\` (The Forge · Training Academy): Self-paced video curriculum across 3 progressive ranks (86 lessons total, G10 FX & Synthetic Indices). Anchors: \`curriculum\`.
  * Foundation Rank — "Market Mechanics & Risk Formation": 6 Weeks, 24 lessons, $390.
  * Vanguard Tier — "Vanguard Liquidity & Precision Execution": 8 Weeks, 32 lessons, $690.
  * Strategos Mastery — "Strategos Macro & Systematic Command": 10 Weeks, 30 lessons, $1,190.
- \`/mentorship\` (Strategos Mentorship): 12-week guided mastery with senior desk commanders (Marcus Vance, Elena Rostova, David Okafor). Anchors: \`tiers\`, \`roadmap\` (12-week 4-phase roadmap), \`booking\` (1-on-1 call scheduler), \`application\`.
  * Phalanx Cohort: $249/month (2 live London/NY war-room calls weekly + Forge library).
  * Private Strategos Desk (featured): $649/month (weekly 45-min 1-on-1 sessions, ledger audits, Vanguard Intelligence included).
  * Archon Inner Council: $1,290/month (twice-weekly 1-on-1 briefings, direct strategist channel, all divisions included).
- \`/signals\` (Vanguard Intelligence): Live tactical FX, Gold (XAU/USD), and Synthetic Indices (V75, V100, Boom 500, Crash 1000) trade briefings delivered via Telegram, WhatsApp, email, and Command Feed, always with Entry, hard Stop Loss, TP1/TP2/TP3, and R:R. Anchors: \`past-signals\`, \`plans\`, \`calculator\` (Position Size & Lot Shield Calculator).
  * Vanguard FX Core: $39/wk | $119/mo | $990/yr.
  * Vanguard Cross-Asset Order: $149/mo (yearly 30% off ~$104/mo equiv).
  * Phalanx Dual Order (Signals + Forge): $69/wk | $199/mo | $1,680/yr.
- \`/investment\` (Sovereign Capital Mandates / Account Stewardship): Governed Forex & Synthetic Indices managed-execution mandates where capital stays inside the client's OWN regulated brokerage account (100% client custody & sole withdrawal rights; Bullish Titan only holds trade-execution access). Anchors: \`home\`, \`about\`, \`plans\` (4 Mandate Ranks + Allocation Simulator), \`audits\` (Audited Mandate Demo Cases), \`terms\` (Official 9-Clause Charter), \`steps\` (3 Onboarding Steps), \`eligibility\` (Telemetry preview & KYC Vetting Application Form).
  * Agoge Mandate (Rank I · Entry): $900 – $1,400 equity | $55.00 one-time onboarding fee | Low risk | G10 FX focus.
  * Vanguard Mandate (Rank II · Growth, Most Selected): $1,500 – $5,000 equity | $100.00 one-time onboarding fee | Medium risk | G10 FX + XAU/USD.
  * Strategos Mandate (Rank III · Commander): $6,000 – $9,000 equity | $300.00 one-time onboarding fee | Medium risk | Cross-Asset FX & ATR-capped Synthetics | Senior Lead Strategist | Eligible for Clause 9 buffer.
  * Sovereign Archon Mandate (Rank IV · Apex): $10,000+ custom equity | Onboarding Fee: Price: Contact Us | Executive Desk Director | Bespoke ceilings & Clause 9 eligibility.
  * Key Mandate Rules (9-Clause Charter):
    - Clauses 1 & 2: Sole client ownership & withdrawal authority; execution-only access.
    - Clause 3: 50% Client / 50% Bullish Titan high-watermark profit split ONLY when cycle profit targets are reached/surpassed.
    - Clause 4: Coordinated profit withdrawals upon target completion.
    - Clause 5: Disciplined analysis only (never gambling); no conflicting manual trades by the client in the linked sub-account.
    - Clause 6: Full risk disclaimer — losses can occur; no guaranteed profits.
    - Clause 7: Pre-notice termination allowed by either party at any time.
    - Clause 8: Strict KYC & confidentiality.
    - Clause 9 ($5,000+ Policy): Accounts funded ABOVE $5,000 qualify for a 10% initial-deposit goodwill buffer in the unlikely event of total account loss (not insurance); accounts below $5,000 are excluded.
- \`/pricing\` (Rank Orders & Capability Comparison Matrix): Unified membership plans:
  * Forge Initiate: $99/mo ($79/mo billed yearly)
  * Vanguard Intelligence: $149/mo ($104/mo billed yearly)
  * Phalanx Dual Order (Popular): $199/mo ($149/mo billed yearly)
  * Strategos Desk: $649/mo ($520/mo billed yearly)
  * Sovereign Titan Order (All 4 divisions + Mandate briefings): $890/mo ($695/mo billed yearly)
- \`/results\`: Operational Ledger & demo equity performance metrics.
- \`/about\`: About Bullish Titan Academy, timeline (2019–2026, 64+ countries, 14,800+ fellows), and mentors.
- \`/blog\`: Desk Dispatches & articles (liquidity sweeps, drawdown math, V75/Boom/Crash, 100-sample journaling).
- \`/faq\`: Full searchable FAQ knowledge base (live search filter supported).
- \`/contact\`: Admissions Desk contact, branch locations, Google Maps route intelligence, and custom inquiries.
  * Abeokuta Flagship (Ogun State · Registered on Google Maps): Bullish Titan, Timeline Bazaar — Timeline Bazaar, Dayo Sanyaolu Junction, Camp, Abeokuta, Ogun State, Nigeria. Landmark: Beside Peakolam Restaurant / Peakolam Suites, along the FUNAAB Road (Alabata Road) axis. Visitors can open \`/contact#locations\` for the live interactive Google Maps route planner and ETA calculator.
  * Abuja Branch (FCT): Established Abuja branch; exact street address is not yet specified.
  * Official email: bullishtitan@gmail.com. Official social channels: Instagram (@_bullishtitan, https://www.instagram.com/_bullishtitan/), X (@bullishtitan, https://x.com/bullishtitan), TikTok (@bullishtitan, https://www.tiktok.com/@bullishtitan), YouTube (@Bullish_Titan, https://www.youtube.com/@Bullish_Titan).
- \`/login\`, \`/signup\`, \`/forgot-password\`, \`/dashboard\`: Member & Command Console portal.
- \`/legal/risk-disclosure\`, \`/legal/terms\`, \`/legal/privacy\`: Legal & governance documents.

CONVERSATION STYLE:
- Be concise (2–4 crisp sentences by default, or clean short bullet lines starting with "- " when comparing plans).
- Write in plain, readable conversational prose without markdown asterisks (**), hashtags (#), or code backticks (\`).
- Keep tone executive, calm, helpful, and easy to understand for everyday visitors as well as experienced traders.
- If the visitor asks "take me to...", "open...", "show me...", "go to...", or seems unsure where to start on a topic that maps directly to a page, invoke \`navigate_to_page\`.`;

export const navigateToPageTool: FunctionDeclaration = {
  name: 'navigate_to_page',
  description:
    'Navigate the visitor to a specific page and optional section anchor on the Bullish Titan Academy website when they ask to go somewhere, view a division, inspect pricing/investments/mentorship/signals/calculator/FAQ, or when routing them directly resolves their question.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      path: {
        type: Type.STRING,
        enum: Array.from(VALID_PATHS),
        description: 'Exact route path on the website.',
      },
      sectionId: {
        type: Type.STRING,
        description:
          'Optional element ID on the destination page (without leading #) such as "locations", "plans", "audits", "terms", "steps", "eligibility", "calculator", "past-signals", "tiers", "roadmap", "booking", "application", "curriculum", "pricing-enrollment", "quiz", "programs", "results", "faq".',
      },
      label: {
        type: Type.STRING,
        description: 'Short readable destination title (e.g. "Sovereign Mandates · Plans").',
      },
    },
    required: ['path', 'label'],
  },
};

export function cleanTextForSpeech(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function synthesizeReceptionistSpeech(
  text: string
): Promise<{ audioBase64: string; mimeType: string }> {
  const ai = getAiClient();
  const cleanPrompt = cleanTextForSpeech(text).slice(0, 900);
  if (!cleanPrompt) {
    throw new Error('Cannot synthesize empty text.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash-lite-tts',
    contents: cleanPrompt,
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: 'Kore',
          },
        },
      },
    },
  });

  const audioPart = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  if (!audioPart?.data) {
    throw new Error('TTS model did not return audio data.');
  }

  return {
    audioBase64: audioPart.data,
    mimeType: audioPart.mimeType || 'audio/wav',
  };
}

export async function transcribeUserVoice(
  audioBase64: string,
  mimeType: string
): Promise<string> {
  const ai = getAiClient();
  const cleanMime = mimeType.split(';')[0]?.trim() || 'audio/webm';

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-transcribe',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: cleanMime,
              data: audioBase64,
            },
          },
          {
            text: "Transcribe the speaker's spoken message accurately into plain English text. Return only the words spoken with natural punctuation.",
          },
        ],
      },
    ],
  });

  const transcript = (response.text ?? '').trim();
  if (!transcript) {
    throw new Error('Could not detect speech in the recording. Please try speaking again.');
  }
  return transcript;
}

async function withTransientRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const status =
      err && typeof err === 'object'
        ? (err as { status?: number; statusCode?: number }).status ??
          (err as { status?: number; statusCode?: number }).statusCode
        : undefined;
    const msg = err instanceof Error ? err.message : '';
    const isTransient =
      status === 503 ||
      status === 429 ||
      msg.includes('503') ||
      msg.includes('UNAVAILABLE') ||
      msg.includes('429');
    if (!isTransient) throw err;
    await new Promise((r) => setTimeout(r, 900));
    return await fn();
  }
}

function extractMapsGroundingSources(
  response: unknown
): MapsGroundingSource[] {
  const candidate = (response as {
    candidates?: Array<{
      groundingMetadata?: {
        groundingChunks?: Array<{
          maps?: {
            uri?: string;
            title?: string;
            placeAnswerSources?: {
              reviewSnippets?: Array<{
                googleMapsUri?: string;
                uri?: string;
                title?: string;
              }>;
            };
          };
        }>;
      };
    }>;
  })?.candidates?.[0];

  const chunks = candidate?.groundingMetadata?.groundingChunks ?? [];
  const seen = new Set<string>();
  const sources: MapsGroundingSource[] = [];

  for (const chunk of chunks) {
    const maps = chunk?.maps;
    if (maps?.uri && !seen.has(maps.uri)) {
      seen.add(maps.uri);
      sources.push({
        title: maps.title?.trim() || 'View Place on Google Maps',
        uri: maps.uri,
      });
    }
    const snippets = maps?.placeAnswerSources?.reviewSnippets ?? [];
    for (const snip of snippets) {
      const snipUri = snip?.googleMapsUri || snip?.uri;
      if (snipUri && !seen.has(snipUri)) {
        seen.add(snipUri);
        sources.push({
          title: snip.title?.trim() || `${maps?.title || 'Place'} · Google Maps Review`,
          uri: snipUri,
        });
      }
    }
  }

  return sources;
}

export async function queryMapsGrounding(params: {
  query: string;
  branch?: 'abeokuta' | 'abuja';
  latLng?: { latitude: number; longitude: number };
}): Promise<{ text: string; sources: MapsGroundingSource[] }> {
  const ai = getAiClient();
  const cleanQuery = params.query.trim();
  if (!cleanQuery) {
    throw new Error('A location or map question is required.');
  }

  const branchContext =
    params.branch === 'abuja'
      ? 'Context: Bullish Titan Academy has an Abuja (FCT), Nigeria regional branch whose exact street address is not yet specified.'
      : 'Context: Bullish Titan Academy flagship Nigeria branch is "Bullish Titan, Timeline Bazaar", located at Timeline Bazaar, Dayo Sanyaolu Junction, Camp, Abeokuta, Ogun State, Nigeria, beside Peakolam Restaurant / Peakolam Suites along the FUNAAB Road (Alabata Road) axis.';

  const response = await withTransientRetry(() =>
    ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `${branchContext}\n\nUser location question: ${cleanQuery}`,
      config: {
        tools: [{ googleMaps: {} }],
        ...(params.latLng &&
        Number.isFinite(params.latLng.latitude) &&
        Number.isFinite(params.latLng.longitude)
          ? {
              toolConfig: {
                retrievalConfig: {
                  latLng: {
                    latitude: params.latLng.latitude,
                    longitude: params.latLng.longitude,
                  },
                },
              },
            }
          : {}),
      },
    })
  );

  const text =
    (response.text ?? '').trim() ||
    'Here are the matching Google Maps references for that location.';
  const sources = extractMapsGroundingSources(response);

  return { text, sources };
}

function isLocationIntentQuery(text: string): boolean {
  return /\b(abeokuta|timeline bazaar|dayo sanyaolu|peakolam|funaab|alabata|camp|abuja|ogun|directions?|route|map|maps|address|landmark|near|nearby|hotel|restaurant|bank|airport|how to get|visit|office|branch|location)\b/i.test(
    text
  );
}

export async function handleReceptionistChat(params: {
  message: string;
  history?: ChatHistoryTurn[];
  currentPath?: string;
  speakReply?: boolean;
  latLng?: { latitude: number; longitude: number };
}): Promise<ReceptionistChatResult> {
  const ai = getAiClient();
  const trimmedMsg = params.message.trim();
  if (!trimmedMsg) {
    throw new Error('Message cannot be empty.');
  }

  const recentHistory = (params.history ?? []).slice(-10);
  const contents: Content[] = recentHistory.map((turn) => ({
    role: turn.role,
    parts: [{ text: turn.text }],
  }));

  const contextPrefix = params.currentPath
    ? `[Visitor is currently viewing route: ${params.currentPath}]\n`
    : '';

  contents.push({
    role: 'user',
    parts: [{ text: `${contextPrefix}${trimmedMsg}` }],
  });

  const firstResponse = await withTransientRetry(() =>
    ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: [navigateToPageTool] }],
      },
    })
  );

  let navigationAction: NavigationAction | undefined;
  let replyText = (firstResponse.text ?? '').trim();

  const functionCalls = firstResponse.functionCalls;
  if (functionCalls && functionCalls.length > 0) {
    const call = functionCalls[0];
    if (call.name === 'navigate_to_page') {
      const args = (call.args ?? {}) as Record<string, unknown>;
      const rawPath = typeof args.path === 'string' ? args.path.trim() : '/';
      const safePath = VALID_PATHS.has(rawPath) ? rawPath : '/';
      const rawSection =
        typeof args.sectionId === 'string'
          ? args.sectionId.replace(/^#/, '').trim()
          : undefined;
      const safeSection = rawSection && /^[a-zA-Z0-9_-]+$/.test(rawSection) ? rawSection : undefined;
      const rawLabel =
        typeof args.label === 'string' && args.label.trim()
          ? args.label.trim()
          : DEFAULT_PATH_LABELS[safePath] ?? 'Destination';

      navigationAction = {
        path: safePath,
        sectionId: safeSection,
        label: rawLabel,
      };

      const modelContent = firstResponse.candidates?.[0]?.content;
      if (modelContent) {
        contents.push(modelContent);
        contents.push({
          role: 'user',
          parts: [
            {
              functionResponse: {
                name: 'navigate_to_page',
                response: {
                  navigated: true,
                  path: safePath,
                  sectionId: safeSection ?? null,
                  label: rawLabel,
                },
              },
            },
          ],
        });

        const followUp = await withTransientRetry(() =>
          ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              tools: [{ functionDeclarations: [navigateToPageTool] }],
            },
          })
        );

        replyText = (followUp.text ?? '').trim() || `I have taken you to ${rawLabel}. Let me know if you need anything explained here.`;
      } else if (!replyText) {
        replyText = `Taking you to ${rawLabel} now. Feel free to ask any questions about what you see here.`;
      }
    }
  }

  let mapsSources: MapsGroundingSource[] | undefined;
  if (isLocationIntentQuery(trimmedMsg)) {
    try {
      const grounded = await queryMapsGrounding({
        query: trimmedMsg,
        branch: /\babuja\b/i.test(trimmedMsg) ? 'abuja' : 'abeokuta',
        latLng: params.latLng,
      });
      if (grounded.sources.length > 0) {
        mapsSources = grounded.sources;
      }
    } catch {
      // Non-fatal: still return conversational reply
    }
  }

  if (!replyText) {
    replyText =
      'I am here 24/7 to help you explore Bullish Titan Academy. Ask me about The Forge courses, Strategos mentorship, Vanguard signals, Sovereign Capital Mandates, or tell me which page you would like to open.';
  }

  let audioBase64: string | undefined;
  let audioMimeType: string | undefined;

  if (params.speakReply) {
    try {
      const tts = await synthesizeReceptionistSpeech(replyText);
      audioBase64 = tts.audioBase64;
      audioMimeType = tts.mimeType;
    } catch {
      // Non-fatal: still return text reply & navigation if TTS encounters a transient error
    }
  }

  return {
    reply: replyText,
    navigationAction,
    mapsSources,
    audioBase64,
    audioMimeType,
  };
}
