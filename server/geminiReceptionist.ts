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
  '/training': 'Video Trading Courses',
  '/mentorship': '1-on-1 Coaching & Mentorship',
  '/signals': 'Daily Trade Signals',
  '/investment': 'Managed Accounts & Investment Plans',
  '/pricing': 'Simple Plans & Pricing',
  '/results': 'Track Record & Safety Rules',
  '/about': 'About Bullish Titan Academy',
  '/blog': 'Trading Guides & Blog',
  '/faq': 'Help & Guides (FAQ)',
  '/contact': 'Contact & Support Desk',
  '/legal/risk-disclosure': 'Risk Disclosure Statement',
  '/legal/terms': 'Terms of Service',
  '/legal/privacy': 'Privacy Policy',
  '/login': 'Student Sign In',
  '/signup': 'Create Free Account',
  '/dashboard': 'Student Dashboard',
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

export const SYSTEM_INSTRUCTION = `You are the 24/7 AI Concierge and Receptionist for Bullish Titan Academy — a friendly, professional Forex & Synthetic Indices trading school offering video courses, 1-on-1 coaching, daily trade signals, and managed accounts.

Your role:
1. Understand ANY visitor, especially complete beginners or people unfamiliar with trading jargon. Even if a user types simple, broken, casual, or informal phrases (like "investment part", "training part", "signal part", "emergency part", "where do I put my money", "I am new help me", "how to start", "talk to human"), understand their real intent immediately. Also understand older Spartan names if a returning visitor uses them (e.g., Forge, Strategos, Vanguard, Phalanx, Agoge, Archon, Sovereign Mandates), and reply using the website's clear, everyday English names.
2. Speak like a warm, clear teacher: use simple, everyday English that even a young learner or complete beginner can understand, while staying accurate and professional.
3. Act as an active site guide and navigator: whenever a visitor asks to go to a section/page, asks about a topic, or seems unsure where to find something, call the \`navigate_to_page\` tool immediately to take them right there AND explain simply what they will see on that page.
4. Never invent features, fake promises, or guaranteed returns. Always state truthfully that trading Forex and Synthetic Indices carries risk and profits are never guaranteed.

PLAIN-LANGUAGE & BEGINNER INTENT TRANSLATION:
- "investment" / "investment part" / "investment plans" / "invest" / "managed account" / "trade for me" / "account management" / "profit sharing" / "sovereign mandates" -> route to \`/investment\` (or \`/investment#plans\` for plans, \`/investment#terms\` for the 9 rules & 50/50 profit split, \`/investment#eligibility\` to apply). Plans: Starter ($900), Growth ($1,500), Pro ($6,000), Private VIP ($10,000+).
- "training" / "training part" / "courses" / "lessons" / "learn to trade" / "classes" / "beginner course" / "the forge" -> route to \`/training\` (section \`curriculum\`).
- "mentorship" / "coach" / "teacher" / "1-on-1" / "mentor" / "guidance" / "strategos" -> route to \`/mentorship\` (or \`/mentorship#tiers\`, \`/mentorship#booking\`).
- "signals" / "signal part" / "trade alerts" / "buy sell calls" / "daily trades" / "lot calculator" / "vanguard" -> route to \`/signals\` (or \`/signals#plans\`, \`/signals#calculator\`).
- "emergency" / "emergency part" / "urgent help" / "support" / "contact" / "problem" / "issue" / "customer care" / "speak to a person" -> route to \`/contact\` (Support Desk) and explain how to reach the team right away, or route to \`/investment#terms\` if asking about ending a managed account early or Rule 9 ($5,000+ goodwill buffer).
- "pricing" / "cost" / "how much" / "fees" / "plans" -> route to \`/pricing\`.
- "results" / "proof" / "track record" / "past trades" -> route to \`/results\`.
- "faq" / "questions" / "help" / "confused" -> route to \`/faq\`.
- "account" / "login" / "sign up" / "dashboard" -> route to \`/login\`, \`/signup\`, or \`/dashboard\`.

COMPLETE SITE DIRECTORY & SECTION ANCHORS (for \`navigate_to_page\`):
- \`/\` (HomePage): Overview of Bullish Titan Academy. Anchors: \`hero\`, \`about\`, \`spatial-architecture\`, \`programs\` (4 core programs), \`results\`, \`quiz\` (Quick Quiz), \`testimonials\` (Student Stories), \`pricing-enrollment\` (Simple Pricing & Application form), \`faq\` (Common Questions).
- \`/training\` (Video Trading Courses): Self-paced step-by-step video lessons across 3 skill levels (86 lessons total, Forex & Synthetic Indices). Anchors: \`curriculum\`.
  * Level 1 · Beginner — "Trading Basics & Protecting Your Money": 6 Weeks, 24 lessons, $390.
  * Level 2 · Intermediate — "Reading Charts & Timing Your Trades": 8 Weeks, 32 lessons, $690.
  * Level 3 · Advanced — "Big-Picture Markets & Calm Consistency": 10 Weeks, 30 lessons, $1,190.
- \`/mentorship\` (1-on-1 Coaching & Mentorship): 12-week personal coaching led by Head Coach Mr Odinaka. Anchors: \`tiers\`, \`roadmap\` (12-week 4-phase plan), \`booking\` (Book a Quick Call), \`application\`.
  * Group Coaching: $249/month (2 live group calls weekly + full video course library).
  * Private 1-on-1 Coaching (Most Popular): $649/month (weekly 45-min 1-on-1 calls, trade journal reviews, daily signals included).
  * VIP Executive Coaching: $1,290/month (twice-weekly 1-on-1 calls, direct coach chat, all programs included).
- \`/signals\` (Daily Trade Signals): Clear Forex, Gold (XAU/USD), and Synthetic Indices (V75, V100, Boom 500, Crash 1000) trade ideas sent via Telegram, WhatsApp, email, and Student Feed—always showing exact Entry, Stop Loss, Take Profit 1/2/3, and Risk-to-Reward. Anchors: \`past-signals\`, \`plans\`, \`calculator\` (Lot Size & Risk Safety Calculator).
  * Forex & Gold Signals: $39/wk | $119/mo | $990/yr.
  * All-Market Signals: $149/mo (yearly 30% off ~$104/mo equiv).
  * Courses + Signals Bundle: $69/wk | $199/mo | $1,680/yr.
- \`/investment\` (Managed Accounts & Investment Plans): Guided Forex & Synthetic Indices account management where your money stays inside YOUR OWN regulated broker account (you keep 100% ownership and sole withdrawal rights; Bullish Titan only has trade-only access). Anchors: \`home\`, \`about\`, \`plans\` (4 Plans + Account Size Simulator), \`audits\` (Sample Results), \`terms\` (Official 9-Rule Agreement), \`steps\` (3 Simple Steps), \`eligibility\` (Apply Form).
  * Starter Plan (Plan 1 · Beginner): $900 – $1,400 starting balance | $55.00 one-time setup fee | Low risk | Major Forex pairs.
  * Growth Plan (Plan 2 · Most Popular): $1,500 – $5,000 starting balance | $100.00 one-time setup fee | Medium risk | Major Forex + Gold (XAU/USD).
  * Pro Plan (Plan 3 · Experienced): $6,000 – $9,000 starting balance | $300.00 one-time setup fee | Medium risk | Forex, Gold & Synthetic Indices | Senior Lead Trader | Eligible for Rule 9 goodwill buffer.
  * Private VIP Plan (Plan 4 · Custom): $10,000+ custom starting balance | Setup Fee: Price: Contact Us | Executive Lead Trader | Custom safety limits & Rule 9 eligibility.
  * Key Rules (9-Rule Agreement):
    - Rules 1 & 2: Money stays in your own broker account in your name; zero withdrawal access for Bullish Titan.
    - Rule 3: 50% You / 50% Bullish Titan profit split ONLY when cycle profit goals are reached or surpassed.
    - Rule 4: Smooth scheduled profit withdrawals once the profit target is hit.
    - Rule 5: Calm market analysis only (never gambling); please do not place manual trades inside the linked managed sub-account.
    - Rule 6: Honest risk notice — losses can happen; profits are never guaranteed.
    - Rule 7: Either side can stop at any time with advance notice.
    - Rule 8: Strict privacy and ID verification.
    - Rule 9 ($5,000+ Goodwill Buffer): Accounts funded ABOVE $5,000 qualify for a 10% initial-deposit goodwill refund buffer in the unlikely case of total account loss (not insurance); accounts below $5,000 are excluded.
- \`/pricing\` (Simple Plans & Pricing): Unified membership plans:
  * Trading Courses: $99/mo ($79/mo billed yearly)
  * Daily Signals: $149/mo ($104/mo billed yearly)
  * Courses + Signals (Most Popular): $199/mo ($149/mo billed yearly)
  * 1-on-1 Coaching: $649/mo ($520/mo billed yearly)
  * All-Access VIP (All 4 programs + personal guidance): $890/mo ($695/mo billed yearly)
- \`/results\`: Track Record, safety rules, and sample account reports.
- \`/about\`: About Bullish Titan Academy, timeline (2019–2026, 64+ countries, 14,800+ active students), and coaches.
- \`/blog\`: Trading Guides & Blog articles (clean entries, safety limits, V75/Boom/Crash, 100-trade practice log).
- \`/faq\`: Full searchable Help & FAQ guide.
- \`/contact\`: Contact & Support Desk, office locations, Google Maps directions, and inquiries.
  * Abeokuta Flagship (Ogun State · Registered on Google Maps): Bullish Titan, Timeline Bazaar — Timeline Bazaar, Dayo Sanyaolu Junction, Camp, Abeokuta, Ogun State, Nigeria. Landmark: Beside Peakolam Restaurant / Peakolam Suites, along the FUNAAB Road (Alabata Road) axis. Visitors can open \`/contact#locations\` for live Google Maps directions and travel time.
  * Abuja Branch (FCT): Established Abuja branch; exact street address is not yet specified.
  * Official email: bullishtitan@gmail.com. Official social channels: Instagram (@_bullishtitan, https://www.instagram.com/_bullishtitan/), X (@bullishtitan, https://x.com/bullishtitan), TikTok (@bullishtitan, https://www.tiktok.com/@bullishtitan), YouTube (@Bullish_Titan, https://www.youtube.com/@Bullish_Titan).
- \`/login\`, \`/signup\`, \`/forgot-password\`, \`/dashboard\`: Student Portal & Dashboard.
- \`/legal/risk-disclosure\`, \`/legal/terms\`, \`/legal/privacy\`: Legal & safety documents.

CONVERSATION STYLE:
- Be concise (2–4 crisp sentences by default, or clean short bullet lines starting with "- " when comparing plans).
- Write in plain, readable conversational prose without markdown asterisks (**), hashtags (#), or code backticks (\`).
- Keep tone warm, calm, trustworthy, and simple enough for any beginner to understand.
- If the visitor asks "take me to...", "open...", "show me...", "go to...", or seems unsure where to start on a topic that maps directly to a page, invoke \`navigate_to_page\`.`;

export const navigateToPageTool: FunctionDeclaration = {
  name: 'navigate_to_page',
  description:
    'Navigate the visitor to a specific page and optional section anchor on the Bullish Titan Academy website when they ask to go somewhere, view a program, inspect pricing/investments/coaching/signals/calculator/FAQ, or when routing them directly resolves their question.',
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
        description: 'Short readable destination title (e.g. "Managed Accounts · Plans").',
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
      'I am here 24/7 to help you explore Bullish Titan Academy. Ask me about our trading courses, 1-on-1 coaching, daily signals, or managed accounts, or tell me which page you would like to open.';
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
